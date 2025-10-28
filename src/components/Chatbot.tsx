import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';
import { cannedReply } from '../utils/chat';

type Msg = { id: string; from: 'bot' | 'user'; text: string };

const PRESET_MESSAGES = [
  { id: 'm1', text: '¿Cómo puedo subir una foto?' },
  { id: 'm2', text: 'Ver colecciones destacadas' },
  { id: 'm3', text: 'Contacto de prensa' },
];

const CHAT_STORAGE_KEY = 'asfalto_chat';

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        const normalized: Msg[] = [];
        for (const m of parsed) {
          const last = normalized[normalized.length - 1];
          if (last && last.from === m.from && last.text === m.text) continue;
          normalized.push(m);
        }
        return normalized.length ? normalized : [{ id: 'b1', from: 'bot', text: 'Hola — soy el asistente de Asfalto. ¿En qué te puedo ayudar?' }];
      }
    } catch (e) {}
    return [{ id: 'b1', from: 'bot', text: 'Hola — soy el asistente de Asfalto. ¿En qué te puedo ayudar?' }];
  });
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevScrollRef = useRef<number>(0);

  // autoscroll: si el usuario está cerca del fondo, desplazamos hacia abajo al llegar mensajes;
  // si el usuario está leyendo arriba, no forzamos scroll.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const isNearBottom = () => el.scrollHeight - (el.scrollTop + el.clientHeight) < 120;
    if (open) {
      // al abrir, bajar al fondo y enfocar
      try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); } catch (e) { el.scrollTop = el.scrollHeight; }
      prevScrollRef.current = el.scrollTop;
      return;
    }
    if (isNearBottom()) {
      try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); } catch (e) { el.scrollTop = el.scrollHeight; }
      prevScrollRef.current = el.scrollTop;
    }
  }, [messages, open]);


  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);


  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const addMessage = (msg: Msg) => {
    setMessages(prev => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.from === msg.from && last.text === msg.text) return prev;
      }
   
      const capped = prev.length > 200 ? prev.slice(prev.length - 199) : prev;
      return [...capped, msg];
    });
  };

  // scroll helpers expuestos localmente
  const scrollToBottom = () => {
    const el = listRef.current; if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); } catch (e) { el.scrollTop = el.scrollHeight; }
  };
  const scrollToTop = () => {
    const el = listRef.current; if (!el) return;
    try { el.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { el.scrollTop = 0; }
  };

  // enviar mensaje: si es preset usamos la respuesta automática; si es mensaje libre mostramos placeholder
  const sendUser = (text: string, isPreset = false) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const msg: Msg = { id: `u${Date.now()}`, from: 'user', text: trimmed };
    addMessage(msg);
    setInput('');

    if (isPreset) {
      // comportamiento antiguo para presets: respuesta breve generada
      setTimeout(() => {
        const reply = cannedReply(trimmed);
        const botMsg: Msg = { id: `b${Date.now()}`, from: 'bot', text: reply };
        addMessage(botMsg);
      }, 600);
      return;
    }

    // para mensajes libres mostramos placeholder indicando que soporte responderá
    setTimeout(() => {
      const botMsg: Msg = {
        id: `b${Date.now()}`,
        from: 'bot',
        text: 'Buena pregunta — espera a que Asfalto Fashion (soporte) te responda. Mientras tanto puedes revisar las colecciones o usar las opciones rápidas.'
      };
      addMessage(botMsg);
    }, 400);
  };

  

  return (
    <>
      
      <div className={`chatbot-root ${open ? 'chatbot-open' : ''}`}>
        <div className="chatbot-btn-wrap chatbot-mini-wrap">
          <button
            type="button"
            className="chatbot-mini"
            aria-label={open ? 'Cerrar chat' : 'Abrir ayuda rápida'}
            aria-describedby="chat-label-mini"
            onClick={() => {
              setOpen(o => !o);
            }}
          >
            <span className="mini-icon" aria-hidden="true">
      
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="#081C15" />
              </svg>
            </span>
          </button>
          <span className="chat-label" id="chat-label-mini">Ayuda rápida</span>
        </div>

        
            <div className="chatbot-modal" role="dialog" aria-label="Asistente Asfalto" aria-hidden={!open}>
              <div className="chatbot-card">
                <header className="chatbot-header">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <strong>Asfalto Chat</strong>
                    {/* controles para subir/bajar el scroll */}
                    <div className="chat-scroll-controls" aria-hidden={!open}>
                      <button type="button" className="chat-scroll-btn" title="Subir (arriba)" onClick={scrollToTop}>▲</button>
                      <button type="button" className="chat-scroll-btn" title="Bajar (abajo)" onClick={scrollToBottom}>▼</button>
                    </div>
                  </div>
                  <button type="button" className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
                </header>

            <div className="chatbot-body" ref={listRef}>
              {messages.map(m => (
                <div key={m.id} className={`chat-line ${m.from === 'bot' ? 'bot' : 'user'}`}>
                  <div className="chat-bubble">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="chatbot-presets">
              {PRESET_MESSAGES.map(p => (
                // presets usan respuestas automáticas antiguas
                <button key={p.id} className="preset-btn" onClick={() => sendUser(p.text, true)}>{p.text}</button>
              ))}
            </div>

            <form className="chatbot-footer" onSubmit={(e) => { e.preventDefault(); sendUser(input); }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe tu mensaje" aria-label="Mensaje" />
              <button type="submit" className="send-btn">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
