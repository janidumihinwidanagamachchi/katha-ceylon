import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The chapter media: a silent looping clip with a photograph underneath it.
 *
 * The photograph is not decoration here, it is the fallback. Four separate
 * things can go wrong with an autoplaying video and each one has to land on a
 * still image rather than an empty black frame:
 *
 * - the visitor asked for reduced motion  → no <video> is rendered at all
 * - the browser refuses to autoplay        → iOS Low Power Mode, data saver
 * - the clip 404s or cannot decode        → onError falls back
 * - the source is missing entirely         → no <video> is rendered at all
 *
 * So the photograph and the clip are separate props. Passing the .mp4 as the
 * still image — which is what an earlier version of this did — gives a
 * reduced-motion visitor a broken image, since the video is never rendered.
 *
 * When a loop *is* going to play, the still underneath is swapped for the
 * lightweight poster (about 25KB) instead of the full-resolution photograph,
 * because the video is about to cover it. Reduced-motion visitors keep the
 * photograph, since they are the ones who will actually be looking at it.
 */
const ChapterPlate = ({
  image,
  videoSrc,
  poster,
  alt,
  ratio = "aspect-[9/16]",
  eager = false,
  className = "",
}) => {
  const still = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [playable, setPlayable] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef(null);
  const videoRef = useRef(null);

  const hasLoop = Boolean(videoSrc && poster);
  const useLoop = hasLoop && !still && !failed;

  // Only fetch the clip once the chapter is close to being scrolled to.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "300px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play when visible, pause when not. A 30fps decode running behind the page
  // is a real battery cost on a phone.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!inView) {
      video.pause();
      return;
    }
    const attempt = video.play();
    if (attempt?.catch) attempt.catch(() => setFailed(true));
  }, [inView, useLoop, playable]);

  // Stop decoding while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (inView) {
        const attempt = video.play();
        if (attempt?.catch) attempt.catch(() => setFailed(true));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [inView]);

  return (
    <div ref={hostRef} className={`plate ${ratio} ${className}`} data-testid="chapter-plate">
      <img
        src={useLoop ? poster : image.src}
        srcSet={useLoop ? undefined : image.srcSet}
        sizes={useLoop ? undefined : image.sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
      {useLoop && inView && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          data-testid="chapter-loop"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-linear ${
            playable ? "opacity-100" : "opacity-0"
          }`}
          onCanPlay={() => setPlayable(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default ChapterPlate;