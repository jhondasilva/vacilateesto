import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, Sparkles, Trash2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "lab_host_chat_v1";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const SUGGESTIONS = [
  "¿De qué temas habla más Jhon vs Juan?",
  "Dame 5 momentos donde Jhon hable de Salomón Rondón.",
  "Compara cuánto habla cada uno por episodio (top 5).",
  "¿Qué muletillas usa más Juan?",
];

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const LabHostChat = () => {
  const [initial] = useState<UIMessage[]>(() => loadInitial());
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useRef(
    new DefaultChatTransport({
      api: `${SUPABASE_URL}/functions/v1/lab-host-chat`,
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
    }),
  ).current;

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "lab-host-chat",
    messages: initial,
    transport,
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Keep textarea focused
  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
  };

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-[70vh] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5" />
          IA con acceso a transcripciones de Jhon y Juan
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs h-7">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Limpiar
          </Button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/30 p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold mb-1">Hazle preguntas a la data</p>
              <p className="text-sm text-muted-foreground max-w-md">
                La IA puede buscar frases textuales, comparar a Jhon y Juan, y traer estadísticas de
                los episodios diarizados.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs p-3 rounded-lg border border-border hover:border-foreground/40 hover:bg-muted/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pensando…
          </div>
        )}

        {error && (
          <Card className="p-3 border-destructive/40 bg-destructive/10 text-destructive text-xs">
            {error.message}
          </Card>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex gap-2 items-end"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Pregúntale algo sobre lo que han dicho Jhon y Juan…"
          rows={2}
          className="resize-none"
          disabled={isLoading}
          autoFocus
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="h-auto py-3">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
};

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .filter(Boolean)
    .join("\n\n");

  const toolParts = message.parts.filter((p) =>
    p.type.startsWith("tool-"),
  ) as Array<any>;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] ${
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5"
            : "text-foreground"
        }`}
      >
        {!isUser && toolParts.length > 0 && (
          <div className="space-y-1 mb-2">
            {toolParts.map((tp, i) => (
              <details
                key={i}
                className="text-[11px] rounded-md border border-border bg-muted/40 px-2 py-1"
              >
                <summary className="cursor-pointer flex items-center gap-1.5 text-muted-foreground font-mono">
                  <Wrench className="w-3 h-3" />
                  {tp.type.replace("tool-", "")}
                  <span className="opacity-60">· {tp.state}</span>
                </summary>
                {tp.input && (
                  <pre className="mt-1.5 text-[10px] overflow-auto max-h-40 bg-background/60 p-2 rounded">
                    {JSON.stringify(tp.input, null, 2)}
                  </pre>
                )}
                {tp.output && (
                  <pre className="mt-1.5 text-[10px] overflow-auto max-h-60 bg-background/60 p-2 rounded">
                    {JSON.stringify(tp.output, null, 2)}
                  </pre>
                )}
              </details>
            ))}
          </div>
        )}
        {text && (
          <div
            className={
              isUser
                ? "text-sm whitespace-pre-wrap"
                : "prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-headings:font-display"
            }
          >
            {isUser ? text : <ReactMarkdown>{text}</ReactMarkdown>}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabHostChat;