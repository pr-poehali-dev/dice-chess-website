-- Создание таблицы игроков
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    rating INTEGER DEFAULT 1000,
    total_games INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    tokens INTEGER DEFAULT 350,
    best_win_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    tokens_won INTEGER DEFAULT 0,
    tokens_lost INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы игр
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER REFERENCES players(id),
    player2_id INTEGER REFERENCES players(id),
    winner_id INTEGER REFERENCES players(id),
    bet_amount INTEGER NOT NULL,
    time_control VARCHAR(10) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'waiting'
);

-- Создание таблицы достижений
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    requirement_type VARCHAR(50),
    requirement_value INTEGER
);

-- Создание таблицы прогресса достижений игроков
CREATE TABLE IF NOT EXISTS player_achievements (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id),
    achievement_id INTEGER REFERENCES achievements(id),
    progress INTEGER DEFAULT 0,
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    UNIQUE(player_id, achievement_id)
);

-- Вставка стандартных достижений
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value) VALUES
('Первая победа', 'Выиграйте свою первую игру', 'Trophy', 'wins', 1),
('Победная серия', 'Выиграйте 5 игр подряд', 'Flame', 'win_streak', 5),
('Мастер блица', 'Выиграйте 50 блиц-партий', 'Zap', 'blitz_wins', 50),
('Миллионер', 'Накопите 10000 жетонов', 'Coins', 'tokens', 10000),
('Легенда', 'Достигните рейтинга 2500', 'Star', 'rating', 2500),
('Марафонец', 'Сыграйте 500 игр', 'Target', 'total_games', 500);

-- Создание индексов для оптимизации
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_player1 ON games(player1_id);
CREATE INDEX idx_games_player2 ON games(player2_id);