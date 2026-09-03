'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import styles from './SetuAssistant.module.css';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function SetuAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Namaste! I am your ScrapSetu Delhi Assistant. You can ask me about live e-waste rates, booking a doorstep kabadiwala pickup, or CPCB safety guidelines.',
      time: 'Just now',
    },
    {
      id: '2',
      sender: 'assistant',
      text: 'Quick tip: You can book a household pickup or check today’s prevailing Delhi market benchmark in one tap below.',
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Today’s Copper Wire rate in Delhi?',
    'How do I schedule a home pickup?',
    'Is a swollen Li-Ion battery dangerous?',
    'What is the rate for old laptop motherboards?',
  ];

  // Auto-scroll to bottom of chat when new messages appear
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent assistant reply
    setTimeout(() => {
      let reply = 'I understand your inquiry. For specific Delhi industrial cluster rates (Okhla, Mandoli, Shahdara), please check our Live Price Board tab.';
      const lower = text.toLowerCase();

      if (lower.includes('copper') || lower.includes('wire') || lower.includes('taar')) {
        reply = 'In Delhi industrial hubs today, Insulated Copper Wire benchmark is ₹385/kg, and Pure Heavy Copper Scrap trades up to ₹535/kg. Both are fully accepted at DPCC authorized facilities.';
      } else if (lower.includes('pickup') || lower.includes('home') || lower.includes('kabadiwala')) {
        reply = 'You can book a doorstep pickup directly under the "Citizen Pickups" tab! Both household generators and bulk institutions receive verified collection receipts with digital tracking.';
      } else if (lower.includes('battery') || lower.includes('danger') || lower.includes('swollen')) {
        reply = 'CRITICAL SAFETY: Swollen or punctured Li-Ion batteries carry thermal runaway fire risk. Never crush or burn them. Store in a sand bucket and hand over directly to an authorized recycler.';
      } else if (lower.includes('pcb') || lower.includes('motherboard')) {
        reply = 'High-grade telecom & mobile motherboards currently trade around ₹450/kg across verified Delhi recyclers.';
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 550);
  };

  return (
    <div className={styles.floatingContainer}>
      {isOpen ? (
        <div
          className={styles.chatCard}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerTitleGroup}>
              <span className={styles.pulseDot} />
              <div>
                <h4 className={styles.assistantName}>Setu Delhi Assistant</h4>
                <span className={styles.statusText}>Online · E-Waste Support</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages List (Isolated scroll from page/Lenis) */}
          <div
            ref={messagesContainerRef}
            className={styles.messagesList}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.messageBubble} ${
                  m.sender === 'user' ? styles.userBubble : styles.assistantBubble
                }`}
              >
                <div className={styles.bubbleText}>{m.text}</div>
                <span className={styles.bubbleTime}>{m.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className={styles.quickPromptsRow} data-lenis-prevent="true">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.quickPromptBtn}
                onClick={() => handleSend(q)}
              >
                <Sparkles size={11} />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={styles.inputArea}
          >
            <input
              type="text"
              placeholder="Ask Setu about rates, pickups..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.chatInput}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          className={styles.launcherBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open Setu Assistant"
        >
          <MessageSquare size={22} className={styles.launcherIcon} />
        </button>
      )}
    </div>
  );
}
