ALTER TABLE t_p26016213_dice_chess_website.games 
ADD COLUMN IF NOT EXISTS game_mode VARCHAR(10) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(10),
ADD COLUMN IF NOT EXISTS player1_rating_change INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS player2_rating_change INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS move_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS game_data TEXT;

CREATE TABLE IF NOT EXISTS t_p26016213_dice_chess_website.purchases (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES t_p26016213_dice_chess_website.players(id),
    amount INTEGER NOT NULL,
    tokens INTEGER NOT NULL,
    payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_purchases_player_id ON t_p26016213_dice_chess_website.purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_games_player1 ON t_p26016213_dice_chess_website.games(player1_id);
CREATE INDEX IF NOT EXISTS idx_games_player2 ON t_p26016213_dice_chess_website.games(player2_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON t_p26016213_dice_chess_website.games(status);