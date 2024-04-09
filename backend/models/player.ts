import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

const playerModel = {
  init: async () => {
      try {
          await pool.query(`
              CREATE TABLE IF NOT EXISTS player(
                  id SERIAL UNIQUE,
                  user_id SERIAL,
                  damage INTEGER DEFAULT 1,
                  hp INTEGER DEFAULT 1,
                  movement_speed INTEGER DEFAULT 1,
                  projectile_number INTEGER DEFAULT 1,
                  projectile_speed INTEGER DEFAULT 2,
                  currency INTEGER DEFAULT 0,
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (id, user_id),
                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
              );
          `);
          console.log('Player table has been initialized');
          return 1
      } catch (err) {
          console.error('Error initializing player table:', err);
          return {};
      }
  },
  getPlayerById: async function(id: number) {
    try {
      const result = await pool.query("SELECT * FROM player WHERE id = $1;", [id]);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        console.log(`Player with id ${id} not found`);
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
  }
  },
  getPlayerByUserId: async function(id: number) {
      try {
          const result = await pool.query("SELECT * FROM player WHERE user_id = $1;", [id]);
          if (result.rows.length > 0) {
            console.log(result.rows);
            return result.rows[0];
          } else {
            console.log(`Player linked with user id ${id} not found`);
            return null;
          }
        } catch (err) {
          console.log(err);
          return {};
      }
  },
  createPlayer: async function(user_id: number) {
    try {
      const result = await pool.query(
        "INSERT INTO player(user_id) VALUES ($1) RETURNING id;", [user_id]
      );

      const { id } = result.rows[0];

      if (id) {
        const selectRes = await pool.query("SELECT * FROM player WHERE id = ($1);", [id]);
        return selectRes.rows[0];
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  createSupporterPlayer: async function(user_id: number) {
    try {
      const SUPPORTER_CURRENCY_BONUS = 1000;
      const result = await pool.query(
        "INSERT INTO player(user_id, currency) VALUES ($1, $2) RETURNING id;", [user_id, SUPPORTER_CURRENCY_BONUS]
      );

      const { id } = result.rows[0];

      if (id) {
        const selectRes = await pool.query("SELECT * FROM player WHERE id = ($1);", [id]);
        return selectRes.rows[0];
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  deletePlayer: async function(id: number) {
    try {
      await pool.query("DELETE FROM player WHERE id = $1;", [id]);
      return 1;
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  updatePlayer: async function(id: number, damage: number, movement_speed: number , projectile_number: number, projectile_speed: number, currency: number) {
    const updateQuery = "\
      UPDATE player \
      SET \
        damage = $1, \
        movement_speed = $2, \
        projectile_number = $3, \
        projectile_speed = $4, \
        currency = $5 \
      WHERE id = ($6);\
    ";
    try {
      await pool.query(updateQuery, [damage, movement_speed, projectile_number, projectile_speed, currency, id]);
      return 1;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};

export default playerModel;