import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { User } from '../../types/User';
import { Message } from '../../types/Message';
import useChat from '../../hooks/useChat';
import MessageList from './MessageList';
import styles from './Chat.module.css';

interface ChatProps {
  user: User;
  room: string;
  onLeaveRoom: () => void;
  onLogout: () => void;
}

const Chat = ({ user, room, onLeaveRoom, onLogout }: ChatProps) => {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [quotedMessage, setQuotedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat(user, room);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !quotedMessage) return;

    sendMessage(input, undefined, quotedMessage || undefined);
    setInput('');
    setQuotedMessage(null);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      sendMessage('', event.target?.result as string, quotedMessage || undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleQuote = (message: Message) => {
    setQuotedMessage(message);
    setInput((prev) => `${prev} `);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Комната: {room}</h2>
        <div className={styles.buttonContainer}>
          <button onClick={onLeaveRoom} className={styles.leaveButton}>
            Выйти из комнаты
          </button>
          <button onClick={onLogout} className={styles.quitButton}>
            Выйти
          </button>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        <MessageList messages={messages} currentUser={user} onQuote={handleQuote} />
        <div ref={messagesEndRef} />
      </div>

      {quotedMessage && (
        <div className={styles.quotePreview}>
          Цитирование: {quotedMessage.text.substring(0, 30)}...
          <button onClick={() => setQuotedMessage(null)} className={styles.cancelQuote}>
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <div className={styles.emojiContainer}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={styles.emojiButton}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setInput((prev) => prev + emojiData.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введи сообщение..."
          className={styles.messageInput}
        />

        <label className={styles.fileUploadButton}>
          📎
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className={styles.fileInput}
          />
        </label>

        <button type="submit" className={styles.sendButton}>
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Chat;
