import { useCallback, useEffect } from 'react';
import { Message } from '../types/Message.ts';
import { User } from '../types/User.ts';
import { Room } from '../types/Room.ts';
import useLocalStorage from './useLocalStorage';

const useChat = (currentUser: User | null, currentRoom: string | null) => {
  const [allMessages, setAllMessages] = useLocalStorage<Record<string, Message[]>>(
    'chat_app_messages',
    {},
  );
  const [rooms, setRooms] = useLocalStorage<Room[]>('chat_app_rooms', []);

  // Инициализация дефолтной комнаты
  useEffect(() => {
    if (rooms.length === 0) {
      setRooms([
        {
          id: 'general',
          name: 'general',
          createdBy: 'system',
          createdAt: Date.now(),
          lastActivity: Date.now(),
        },
      ]);
      setAllMessages((prev) => ({
        ...prev,
        general: [],
      }));
    }
  }, [rooms, setRooms, setAllMessages]);

  const messages = currentRoom ? allMessages[currentRoom] || [] : [];

  const sendMessage = useCallback(
    (text: string, media?: string, quote?: Message) => {
      if (!currentUser || !currentRoom) return;

      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        user: currentUser,
        timestamp: Date.now(),
        media,
        quote: quote
          ? {
              id: quote.id,
              text: quote.text,
              user: quote.user,
            }
          : undefined,
      };

      setAllMessages((prev) => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), newMessage],
      }));

      // Обновляем активность комнаты
      setRooms((prev) =>
        prev.map((room) =>
          room.name === currentRoom
            ? {
                ...room,
                lastActivity: Date.now(),
                previewMessage: {
                  text: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
                  user: currentUser,
                  timestamp: Date.now(),
                },
              }
            : room,
        ),
      );
    },
    [currentUser, currentRoom, setAllMessages, setRooms],
  );

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUser || !currentRoom) return;

      setAllMessages((prev) => {
        const roomMessages = prev[currentRoom] || [];
        const updatedMessages = roomMessages.map((msg) => {
          if (msg.id !== messageId) return msg;

          const existingReactionIndex =
            msg.reactions?.findIndex((r: { emoji: string }) => r.emoji === emoji) ?? -1;

          if (existingReactionIndex >= 0) {
            const updatedReactions = [...msg.reactions!];
            const userIndex = updatedReactions[existingReactionIndex].userIds.indexOf(
              currentUser.id,
            );

            if (userIndex >= 0) {
              updatedReactions[existingReactionIndex].userIds.splice(userIndex, 1);
              if (updatedReactions[existingReactionIndex].userIds.length === 0) {
                updatedReactions.splice(existingReactionIndex, 1);
              }
            } else {
              updatedReactions[existingReactionIndex].userIds.push(currentUser.id);
            }

            return { ...msg, reactions: updatedReactions };
          }

          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, userIds: [currentUser.id] }],
          };
        });

        return {
          ...prev,
          [currentRoom]: updatedMessages,
        };
      });
    },
    [currentUser, currentRoom, setAllMessages],
  );

  const createRoom = useCallback(
    (roomName: string) => {
      if (!currentUser) return null;

      const newRoom: Room = {
        id: Date.now().toString(),
        name: roomName.toLowerCase(),
        createdBy: currentUser.id,
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };

      setRooms((prev) => [...prev, newRoom]);
      setAllMessages((prev) => ({ ...prev, [roomName.toLowerCase()]: [] }));

      return newRoom;
    },
    [currentUser, setRooms, setAllMessages],
  );

  return {
    messages,
    rooms,
    sendMessage,
    addReaction,
    createRoom,
  };
};

export default useChat;
