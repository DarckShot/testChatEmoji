import { User } from './User';

export interface Message {
  id: string;
  text: string;
  user: User;
  timestamp: number;
  media?: string;
  quote?: Quote;
  reactions?: Reaction[];
}

export interface Quote {
  id: string;
  text: string;
  user: User;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}
