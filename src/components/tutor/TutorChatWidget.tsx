import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { searchKb, type KbIndex } from '@/lib/tutorKb';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const helpAnswer = (textRaw: string) => {
  const text = textRaw.toLowerCase();

  if (text.includes('enroll') || text.includes('enrol')) {
    return "To enroll: go to Courses, open a course, then click Enroll. If the course is paid you'll be taken to the payment page. After payment, your status may show as Pending until approved.";
  }

  if (text.includes('payment') || text.includes('pay')) {
    return "Payments are handled from the course Enroll flow. If you paid but the course still shows Pending/Locked, refresh the page and check your Dashboard. If it persists, tell me the course name and what you see.";
  }

  if (text.includes('dashboard')) {
    return "Your Dashboard shows your enrolled courses, progress, and activity. Use it to continue learning where you left off.";
  }

  if (text.includes('certificate')) {
    return "Certificates are available after you complete the course requirements. Open your course, finish the lessons, then go to the certificate section.";
  }

  return null;
};

const TutorChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: 'assistant',
      content:
        "Hi, I’m your Beta Skills tutor. Ask me anything about using the app or about your courses."
    }
  ]);

  const [kb, setKb] = useState<KbIndex | null>(null);
  const [kbError, setKbError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setKbError(null);
        const res = await fetch('/course-kb.json', { cache: 'no-cache' });
        if (!res.ok) {
          throw new Error(`Knowledge base not found (HTTP ${res.status})`);
        }
        const data = (await res.json()) as KbIndex;
        if (!data?.docs?.length) {
          throw new Error('Knowledge base is empty');
        }
        setKb(data);
      } catch (e) {
        setKb(null);
        setKbError(e instanceof Error ? e.message : String(e));
      }
    };

    load();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const pageHint = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/course/')) return 'course';
    if (p.startsWith('/courses')) return 'courses';
    if (p.startsWith('/dashboard')) return 'dashboard';
    if (p.startsWith('/admin')) return 'admin';
    return 'app';
  }, [location.pathname]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    if (sending) return;
    setSending(true);

    setInput('');
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: text }]);

    try {
      const quick = helpAnswer(text);
      if (quick) {
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: quick }]);
        return;
      }

      if (text.toLowerCase().includes('go to courses')) {
        navigate('/courses');
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: 'assistant', content: 'Opening Courses for you.' }
        ]);
        return;
      }

      if (!kb) {
        const msg = kbError
          ? `I can still help with app navigation, but my course knowledge base is not available right now: ${kbError}.`
          : 'I can still help with app navigation, but my course knowledge base is still loading.';
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: msg }]);
        return;
      }

      const hits = searchKb(kb, text, 4);
      if (!hits.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'assistant',
            content:
              `I couldn’t find that in the course documents. Try asking with the course name and a keyword. (You are currently on: ${pageHint}.)`
          }
        ]);
        return;
      }

      const response =
        `Here’s what I found in the course documents:\n\n` +
        hits
          .map(
            (h, i) =>
              `${i + 1}) ${h.doc.title}\n${h.snippet}`
          )
          .join('\n\n');

      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', content: response }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'assistant',
          content: `Sorry — I ran into an error while answering that: ${msg}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 shadow-xl ring-1 ring-black/10 text-white flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open Tutor"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[380px] max-w-[92vw] p-0 overflow-hidden"
        >
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Beta Skills Tutor</div>
                    <div className="text-xs text-gray-500">Ask about the app or courses</div>
                  </div>
                </div>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm ring-1 ${
                        m.role === 'user'
                          ? 'bg-gray-900 text-white ring-black/10'
                          : 'bg-white text-gray-900 ring-gray-200'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t bg-white p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type your question..."
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={send}
                  disabled={sending}
                  className="rounded-xl bg-gray-900 hover:bg-black"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {kbError && (
                <div className="mt-2 text-[11px] text-gray-500">
                  Course knowledge base unavailable: {kbError}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>,
    document.body
  );
};

export default TutorChatWidget;
