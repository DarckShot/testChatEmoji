import React from 'react';
import { User } from '../../types/User';
import { Message } from '../../types/Message.ts';
import MessageItem from '../Message/Message';
import styles from './Chat.module.css';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  onQuote: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, onQuote }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUserMessage = (message: Message, currentUser: User | null) => {
    if (!currentUser) return false;
    return message.user.name === currentUser.name;
  };

  return (
    <div className={styles.messagesContainer}>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={isCurrentUserMessage(message, currentUser)}
          onQuote={onQuote}
          time={formatTime(message.timestamp)}
        />
      ))}
    </div>
  );
};

export default MessageList;
