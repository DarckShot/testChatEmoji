import { Message } from './Message';

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  lastActivity?: number;
  messagesCount?: number;
  previewMessage?: Pick<Message, 'text' | 'user' | 'timestamp'>;
}

export interface RoomMembers {
  [roomId: string]: string[];
}
