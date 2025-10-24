-- Добавление email и настроек к таблице игроков
ALTER TABLE players ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE players ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE players ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Создание уникального индекса для email
CREATE UNIQUE INDEX IF NOT EXISTS idx_players_email ON players(email);

-- Создание таблицы сессий для аутентификации
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_player_id ON sessions(player_id);