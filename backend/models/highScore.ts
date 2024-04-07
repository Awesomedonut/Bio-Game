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
             CREATE TABLE highscores(
                    id SERIAL PRIMARY KEY,
                    player_id SERIAL,
                    level INTEGER DEFAULT 1,
                    score INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (player_id) REFERENCES player(id)
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

    getHighscoresByLevel: async function(level: number) {
        try {
            const query = `
                SELECT hs.level, hs.score, u.username
                FROM highscores hs
                    INNER JOIN player p on hs.player_id = p.id
                    INNER JOIN users u on p.user_id = u.id
                WHERE level = $1;
            `
            return (await pool.query(query, [level])).rows;
        } catch (error) {
            console.log(error);
            console.error(`Error fetching highscores for level ${level}`);
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

    getHighscoreById: async function(playerId: number) {
        try {
            const query = 'SELECT * FROM highscores WHERE player_id = $1';
            return (await pool.query(query, [playerId])).rows;
        } catch (error) {
            console.error('Error fetching highscore by id:', error);
            throw new Error('Failed to fetch highscore by id');
        }
    },

    updateHighscore: async function(playerId: number, level: number, newScore: number) {
        try {
          const query = 'UPDATE highscores SET score = $1 WHERE player_id = $2 AND level = $3';
          return await pool.query(query, [newScore, playerId, level]);
        } catch (error) {
          console.error('Error updating highscore:', error);
          throw new Error('Failed to update highscore');
        }
    },

    deleteHighscore: async function(playerId: number, level: number) {
        try {
            const query = 'DELETE FROM highscores WHERE player_id = $1 AND level = $2';
            return await pool.query(query, [playerId, level]);
        } catch (error) {
          console.error('Error deleting highscore:', error);
          throw new Error('Failed to delete highscore');
        }
    }

  };
  
  export default HighScoreModel;