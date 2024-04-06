import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

const HighScoreModel = {
    init: async () => {
        try {
            await pool.query(`
             CREATE TABLE IF NOT EXISTS highscores(
                    id SERIAL PRIMARY KEY,
                    player_id INTEGER REFERENCES player(id),
                    level INTEGER NOT NULL,
                    score INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `);
            console.log('High Score table has been initialized');
            return 1
        } catch (err) {
            console.error('Error initializing High Score table:', err);
            return {};
        }
    },   
    
    getAllHighscores: async function() {
        try {
            const query = 'SELECT * FROM highscores';
            return await pool.query(query);
        } catch (error) {
            console.error('Error fetching highscores:', error);
            throw new Error('Failed to fetch highscores');
        }
    },

    addHighscore: async function(playerId: number, level: number, score: number) {
        try {
            const query = 'INSERT INTO highscores (player_id, level, score) VALUES ($1, $2, $3)';
            return await pool.query(query, [playerId, level, score]);
        } catch (error) {
            console.error('Error fetching highscores:', error);
            throw new Error('Failed to fetch highscores');
        }
    },

  };
  
  export default HighScoreModel;