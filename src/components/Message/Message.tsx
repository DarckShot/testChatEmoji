import { Message } from '../../types/Message.ts';
import styles from './Message.module.css';

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
  onQuote: (message: Message) => void;
  time: string;
}

const MessageItem = ({ message, isCurrentUser, onQuote, time }: MessageProps) => {
  return (
    <div
      className={`${styles.messageContainer} ${isCurrentUser ? styles.currentUser : styles.otherUser}`}
    >
      {!isCurrentUser && (
        <div className={styles.userInfo}>
          <span className={styles.username}>{message.user.name}</span>
        </div>
      )}

      {message.quote && (
        <div className={styles.quotedMessage}>
          <span className={styles.quotedUsername}>{message.quote.user.name}: </span>
          {message.quote.text.substring(0, 30)}
          {message.quote.text.length > 30 ? '...' : ''}
        </div>
      )}

      {message.media && (
        <div className={styles.mediaContainer}>
          <img
            src={message.media}
            alt="Media content"
            className={styles.media}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23ccc"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23777" font-family="Arial" font-size="12">Media not available</text></svg>';
            }}
          />
        </div>
      )}

      {message.text && <div className={styles.messageContent}>{message.text}</div>}

      <div className={styles.messageFooter}>
        <span className={styles.time}>{time}</span>
        {!isCurrentUser && (
          <button
            onClick={() => onQuote(message)}
            className={styles.quoteButton}
            title="Переслать (ответить)"
          >
            ↪
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
