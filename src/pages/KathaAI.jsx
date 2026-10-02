import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Send } from "lucide-react";
import { streamChat, getDishes } from "@/lib/api";

const QUICK_PROMPTS = [
  "What is kithul?",
  "Why is Ceylon tea important to Sri Lanka?",
  "Which dishes contain coconut?",
  "What should I try if I like seafood?",
  "Tell me more about Galle.",
  "What is the history behind the Lamprais?",
];

const KathaAI = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ayubowan — welcome. I am Kathā, keeper of the café's stories. Ask me about any dish, ingredient, or region of the island, and I will tell you its story.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [dishes, setDishes] = useState([]);
  const sessionRef = useRef(localStorage.getItem("katha-session") || undefined);
  const bottomRef = useRef(null);
  const transcriptRef = useRef(null);
  const still = useReducedMotion();

  useEffect(() => {
    getDishes().then(setDishes).catch(() => {});
  }, []);

  // Only follow the stream if the reader is already at the bottom. Scrolling
  // back up to re-read an answer and having it dragged back down again is
  // worse than missing a few streamed tokens.
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    try {
      const sid = await streamChat(sessionRef.current, message, (delta) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + delta };
          return copy;
        });
      });
      if (sid) {
        sessionRef.current = sid;
        localStorage.setItem("katha-session", sid);
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Forgive me — my storybook is momentarily closed. Please ask again in a moment.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  const linkedDishes = (content) =>
    dishes.filter((d) => content.toLowerCase().includes(d.name.toLowerCase())).slice(0, 3);

  const renderContent = (text) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      ),
    );

  return (
    <div data-testid="katha-ai-page">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <span className="field">Kathā AI</span>
            <span className="field">Keeper of the stories</span>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 py-12 lg:grid-cols-12">
            <h1 className="display text-[2.75rem] leading-[1] sm:text-5xl lg:col-span-7">
              Ask the keeper of stories.
            </h1>
            <p className="copy max-w-[42ch] self-end text-[0.9375rem] text-ink-soft lg:col-span-5">
              Every answer is grounded in our own menu, regions and ingredients — nothing
              invented, everything tasted.
            </p>
          </div>
        </div>
      </header>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[64rem] gutter">
          <div className="border border-rule" data-testid="katha-ai-chat-window">
            {/* transcript: a ledger of what was said, so it reads as entries */}
            <div
              ref={transcriptRef}
              className="scroll-contain h-[70svh] max-h-[30rem] min-h-[22rem] space-y-5 overflow-y-auto px-5 py-6 sm:px-8"
              data-testid="katha-ai-messages"
              /* A streamed answer arrives word by word. Without a live region a
                 screen reader hears nothing until the whole reply is done;
                 role="log" announces each entry once it settles. */
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="Conversation with Kathā"
              tabIndex={0}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={still ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-[auto_1fr] gap-x-4"
                  data-testid={`chat-message-${i}`}
                >
                  <span className={`field tnum pt-1 ${m.role === "user" ? "text-ink-soft" : "brass-text"}`}>
                    {m.role === "user" ? "You" : "Kathā"}
                  </span>

                  <div className="min-w-0 border-t border-rule pt-1">
                    {m.content ? (
                      <p className="copy text-sm text-ink sm:text-[0.9375rem]">
                        {renderContent(m.content)}
                      </p>
                    ) : (
                      busy &&
                      i === messages.length - 1 && (
                        <span className="inline-flex gap-1 py-1" role="status">
                          <span className="sr-only">Kathā is answering…</span>
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              aria-hidden="true"
                              className="h-1 w-1 bg-brass"
                              animate={still ? undefined : { opacity: [0.2, 1, 0.2] }}
                              transition={
                                still
                                  ? undefined
                                  : { repeat: Infinity, duration: 1, delay: d * 0.2 }
                              }
                            />
                          ))}
                        </span>
                      )
                    )}

                    {m.role === "assistant" && linkedDishes(m.content).length > 0 && (
                      <div className="mt-4">
                        <p className="field mb-2">Mentioned</p>
                        <ul>
                          {linkedDishes(m.content).map((d) => (
                            <li key={d.slug}>
                              <Link
                                to={`/dish/${d.slug}`}
                                data-testid={`chat-dish-link-${d.slug}`}
                                className="group flex items-baseline gap-3 border-b border-rule py-1.5 last:border-b-0"
                              >
                                <span className="field tnum w-7 shrink-0">{d.lot}</span>
                                <span className="flex-1 truncate text-sm text-ink group-hover:brass-text">
                                  {d.name}
                                </span>
                                <ArrowUpRight size={13} className="text-ink-soft" aria-hidden="true" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* composer */}
            <div className="border-t border-rule px-5 pb-5 pt-5 sm:px-8">
              <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1" data-testid="katha-ai-quick-prompts">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    disabled={busy}
                    data-testid={`quick-prompt-${p.slice(0, 20).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                    className="wipe min-h-11 py-1 text-left text-xs leading-relaxed text-ink-soft hover:text-ink disabled:opacity-40"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-3"
              >
                <label htmlFor="katha-input" className="sr-only">
                  Ask about a dish, ingredient or region
                </label>
                <input
                  id="katha-input"
                  name="message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  enterKeyHint="send"
                  autoComplete="off"
                  maxLength={400}
                  placeholder="Ask about a dish, ingredient or region…"
                  aria-describedby="katha-input-hint"
                  data-testid="katha-ai-chat-input"
                  className="min-h-11 min-w-0 flex-1 border-b border-rule bg-transparent px-0 py-3 text-[0.9375rem] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  data-testid="katha-ai-send-button"
                  className="grid h-11 w-11 shrink-0 place-items-center border border-ink bg-ink text-paper transition-colors hover:border-brass hover:bg-brass active:bg-brass disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
              <p id="katha-input-hint" className="mt-2 text-xs text-ink-soft">
                Answers come only from the Kathā Ceylon menu, its four chapters and their
                ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KathaAI;