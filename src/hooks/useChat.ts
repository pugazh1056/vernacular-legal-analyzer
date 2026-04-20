"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/components/legal/types";
import { incrementQuestionsAsked } from "@/lib/dashboard-stats";

export function useChat(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([]);
    setChatInput("");
    setChatError(null);
  }, [sessionId]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const sendChat = useCallback(async () => {
    const q = chatInput.trim();
    if (!sessionId || !q || chatLoading) return;
    setChatError(null);
    setChatInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           session_id: sessionId, 
           message: q,
           history: messages.map(m => ({ role: m.role, content: m.text }))
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChatError(data.detail || "Could not get an answer.");
        setMessages((m) => m.slice(0, -1));
        setChatInput(q);
        queueMicrotask(() => inputRef.current?.focus());
        return;
      }
      
      const answer = data.reply;
      if (!answer) {
        setChatError("Empty answer.");
        setMessages((m) => m.slice(0, -1));
        setChatInput(q);
        queueMicrotask(() => inputRef.current?.focus());
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
      incrementQuestionsAsked();
    } catch {
      setChatError("Network error.");
      setMessages((m) => m.slice(0, -1));
      setChatInput(q);
      queueMicrotask(() => inputRef.current?.focus());
    } finally {
      setChatLoading(false);
    }
  }, [sessionId, chatInput, chatLoading, messages, API_BASE]);

  return {
    messages,
    chatInput,
    setChatInput,
    chatLoading,
    chatError,
    sendChat,
    inputRef,
  };
}
