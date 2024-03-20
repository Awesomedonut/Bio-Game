import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

const enemyModel = {
  init: async () => {
      try {
          await pool.query(`
              CREATE TABLE IF NOT EXISTS enemy (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) UNIQUE NOT NULL,
                  damage INTEGER DEFAULT 1,
                  hp INTEGER DEFAULT 1,
                  movement_speed INTEGER DEFAULT 1,
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );
          `);
          console.log('Enemy table has been initialized');
          return 1
      } catch (err) {
          console.error('Error initializing enemy table:', err);
          return {};
      }
  },
  updateTable: async () => {
    try {
      // await pool.query("ALTER TABLE enemy ADD currency_drop INTEGER DEFAULT 1");
      // await pool.query("ALTER TABLE enemy RENAME COLUMN movementSpeed TO movement_speed;");
    } catch (err) {
      return {}
    }
  },
  getAllEnemies: async () => {
      try {
          const result: QueryResult = await pool.query('SELECT * FROM enemy;');
          return result.rows;
      } catch (err) {
          console.error('Error fetching enemies:', err);
          return [];
      }
  },
  getEnemyById: async function(id: number) {
      try {
          const result = await pool.query("SELECT * FROM enemy WHERE id = $1;", [id]);
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            console.log("Enemy not found");
            return {};
          }
        } catch (err) {
          console.log(err);
          return {};
      }
  },
  getEnemyByName: async function(name: String) {
    try {
      console.log(name);
      const result = await pool.query("SELECT * FROM enemy WHERE name = $1;", [name]);
      if (result.rows.length > 0) {
        console.log(result.rows);
        return result.rows[0];
      } else {
        console.log("Enemy not found");
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  createEnemy: async function(name: string, damage: number, hp: number, movement_speed: number, currency_drop: number) {
    try {
      const result = await pool.query(
        "INSERT INTO enemy(name, damage, hp, movement_speed, currency_drop) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
        [name, damage, hp, movement_speed, currency_drop]
      );

      const { id } = result.rows[0];

      if (id) {
        const createdEnemy = await pool.query("SELECT * FROM enemy WHERE id = $1", [id]);
        return createdEnemy.rows[0];
      } else {
        return {}
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  deleteEnemy: async function(id: number) {
    try {
      await pool.query("DELETE FROM enemy WHERE id = $1;", [id]);
      return 1;
    } catch (err) {
      console.log(err);
      return {};
    }
  }
};

export default enemyModel;