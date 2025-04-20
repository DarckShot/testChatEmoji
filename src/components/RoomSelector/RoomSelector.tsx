import { useState, useEffect } from 'react';
import { User } from '../../types/User';
import { Room } from '../../types/Room';
import styles from './RoomSelector.module.css';

interface RoomSelectorProps {
  user: User;
  onSelectRoom: (room: Room) => void;
  onLogout: () => void;
}

const RoomSelector = ({ user, onSelectRoom, onLogout }: RoomSelectorProps) => {
  const [roomName, setRoomName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedRooms = localStorage.getItem('chat_rooms');
    if (savedRooms) {
      setAvailableRooms(JSON.parse(savedRooms));
    }
  }, []);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      setError('Пожалуйста, введите название комнаты');
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomName.trim().toLowerCase(),
      createdBy: user.id,
      createdAt: Date.now(),
    };

    const updatedRooms = [...availableRooms, newRoom];
    setAvailableRooms(updatedRooms);
    localStorage.setItem('chat_rooms', JSON.stringify(updatedRooms));
    onSelectRoom(newRoom);
  };

  const handleJoinRoom = (room: Room) => {
    onSelectRoom(room);
  };

  return (
    <div className={styles.roomSelectorContainer}>
      <button onClick={onLogout} className={styles.quitButton}>
        Выйти
      </button>

      <div className={styles.header}>
        <h2>Привет, {user.name}!</h2>
        <p>Выберите чат или создайте новый</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.roomCreation}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setError('');
          }}
          placeholder="Введи имя новой комнаты"
          className={styles.roomInput}
        />
        <button onClick={handleCreateRoom} className={styles.createButton}>
          Создать комнату
        </button>
      </div>

      <div className={styles.roomsList}>
        <h3>Доступные комнаты:</h3>
        {availableRooms.length === 0 ? (
          <p className={styles.noRooms}>Доступных комнат нет</p>
        ) : (
          <div className={styles.roomsContainer}>
            <ul>
              {availableRooms.map((room) => (
                <li key={room.id} className={styles.roomItem}>
                  <span className={styles.roomName}>{room.name}</span>
                  <button onClick={() => handleJoinRoom(room)} className={styles.joinButton}>
                    Войти
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelector;
