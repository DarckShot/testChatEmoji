import React, { useState } from 'react';
import { User } from '../../types/User';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Пожалуйста, введите имя пользователя');
      return;
    }

    onLogin({
      id: Date.now().toString(),
      name: username.trim(),
    });
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.title}>Войти</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите свое имя (ник)"
            className={styles.input}
            autoFocus
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Присоединится
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
