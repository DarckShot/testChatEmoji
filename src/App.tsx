import useLocalStorage from './hooks/useLocalStorage.ts';
import { User } from './types/User';
import { Room } from './types/Room';
import AuthForm from './components/AuthForm/AuthForm';
import Chat from './components/Chat/Chat';
import RoomSelector from './components/RoomSelector/RoomSelector';
import './App.css';

const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [currentRoom, setCurrentRoom] = useLocalStorage<string | null>('currentRoom', null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentRoom(null);
    };

    const handleRoomSelect = (room: Room) => {
        setCurrentRoom(room.name);
    };

    const handleLeaveRoom = () => {
        setCurrentRoom(null);
    };

    return (
        <div className="app">
            {!currentUser ? (
                <AuthForm onLogin={handleLogin} />
            ) : !currentRoom ? (
                <RoomSelector user={currentUser} onSelectRoom={handleRoomSelect} onLogout={handleLogout} />
            ) : (
                <Chat
                    user={currentUser}
                    room={currentRoom}
                    onLeaveRoom={handleLeaveRoom}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default App;
