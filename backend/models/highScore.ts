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
            console.error('Error initializing HightScore table:', err);
            return {};
        }
    },   
  };
  
  export default HighScoreModel;