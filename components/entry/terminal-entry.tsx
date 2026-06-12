"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { TERMINAL_SCRIPT, ANIMATION } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TerminalEntryProps {
  onEnter: () => void;
}

interface TerminalLine {
  type: "prompt" | "response" | "action";
  text: string;
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
}

export function TerminalEntry({ onEnter }: TerminalEntryProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scriptDone, setScriptDone] = useState(false);
  const reducedMotion = useReducedMotion();
  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (charTimerRef.current) clearTimeout(charTimerRef.current);
    if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const typeNextChar = useCallback(
    (lineIdx: number, charIdx: number) => {
      const scriptLine = TERMINAL_SCRIPT[lineIdx];
      if (!scriptLine) return;

      if (charIdx >= scriptLine.text.length) {
        setLines((prev) =>
          prev.map((l, i) =>
            i === lineIdx ? { ...l, isTyping: false, isComplete: true } : l
          )
        );

        if (scriptLine.type === "action") {
          setScriptDone(true);
          return;
        }

        const nextIdx = lineIdx + 1;
        if (nextIdx < TERMINAL_SCRIPT.length) {
          const nextScript = TERMINAL_SCRIPT[nextIdx];
          const delay = nextScript.type === "prompt" ? ANIMATION.typing.promptDelay : ANIMATION.typing.lineDelay;
          lineTimerRef.current = setTimeout(() => {
            setLines((prev) => [
              ...prev,
              {
                type: nextScript.type,
                text: nextScript.text,
                displayText: "",
                isTyping: true,
                isComplete: false,
              },
            ]);
            setCurrentLineIndex(nextIdx);
            typeNextChar(nextIdx, 0);
          }, delay);
        }
        return;
      }

      const delay =
        scriptLine.type === "prompt"
          ? ANIMATION.typing.charDelay * 0.8
          : ANIMATION.typing.charDelay + Math.random() * 20;

      charTimerRef.current = setTimeout(() => {
        setLines((prev) =>
          prev.map((l, i) =>
            i === lineIdx
              ? { ...l, displayText: scriptLine.text.slice(0, charIdx + 1) }
              : l
          )
        );
        typeNextChar(lineIdx, charIdx + 1);
      }, delay);
    },
    []
  );

  useEffect(() => {
    if (reducedMotion) {
      setLines(
        TERMINAL_SCRIPT.map((s) => ({
          type: s.type,
          text: s.text,
          displayText: s.text,
          isTyping: false,
          isComplete: true,
        }))
      );
      setScriptDone(true);
      return;
    }

    const firstScript = TERMINAL_SCRIPT[0];
    lineTimerRef.current = setTimeout(() => {
      setLines([
        {
          type: firstScript.type,
          text: firstScript.text,
          displayText: "",
          isTyping: true,
          isComplete: false,
        },
      ]);
      typeNextChar(0, 0);
    }, 800);
  }, [reducedMotion, typeNextChar]);

  const handleEnter = useCallback(() => {
    if (isTransitioning) return;
    cleanup();
    setIsTransitioning(true);
    setTimeout(onEnter, reducedMotion ? 100 : 800);
  }, [isTransitioning, onEnter, reducedMotion, cleanup]);

  useEffect(() => {
    if (!scriptDone) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scriptDone, handleEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#05070A" }}
      animate={{
        opacity: isTransitioning ? 0 : 1,
      }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-2xl px-6">
        <div className="font-mono text-sm space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex flex-col">
              {line.type === "prompt" ? (
                <div className="flex items-start gap-2">
                  <span className="text-primary/50 select-none shrink-0">
                    &gt;
                  </span>
                  <span className="text-muted-foreground whitespace-pre-wrap">
                    {line.displayText}
                    {line.isTyping && i === currentLineIndex && (
                      <span
                        className={`inline-block w-[2px] h-[1em] bg-primary/60 ml-[1px] align-middle ${
                          showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </span>
                </div>
              ) : line.type === "response" ? (
                <div className="pl-5">
                  <span className="text-foreground whitespace-pre-wrap">
                    {line.displayText}
                    {line.isTyping && i === currentLineIndex && (
                      <span
                        className={`inline-block w-[2px] h-[1em] bg-foreground/60 ml-[1px] align-middle ${
                          showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </span>
                </div>
              ) : (
                <button
                  onClick={line.isComplete ? handleEnter : undefined}
                  className={`flex items-start gap-2 mt-4 ${line.isComplete ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                >
                  <span className="text-primary/50 select-none shrink-0">
                    &gt;
                  </span>
                  <span className="text-primary whitespace-pre-wrap">
                    {line.displayText}
                    {line.isTyping && i === currentLineIndex && (
                      <span
                        className={`inline-block w-[2px] h-[1em] bg-primary ml-[1px] align-middle ${
                          showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                  </span>
                </button>
              )}
            </div>
          ))}

          {scriptDone && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={handleEnter}
                className="sr-only"
                aria-label="Enter site"
              >
                Enter
              </button>
            </motion.div>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleEnter}
          className="fixed top-6 right-6 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
        >
          skip
        </motion.button>
      </div>
    </motion.div>
  );
}
