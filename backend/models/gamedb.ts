import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import { error } from 'console';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
});

export const gamemodel = {
    updateDB: async () => {
        await pool.query("ALTER TABLE users ADD supporter BOOLEAN DEFAULT FALSE;");
    },
    init: async () => {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    supporter BOOLEAN DEFAULT FALSE,
                    experience INTEGER DEFAULT 0,
                    points INTEGER DEFAULT 0,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('User table has been initialized');
        } catch (err) {
            console.error('Error initializing user table:', err);
        }
    },
    getAllUsers: async () => {
        try {
            const result: QueryResult = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (err) {
            console.error('Error fetching users:', err);
            return [];
        }
    },
    addUser: async (username: string, email: string, password: string) => {
        try {
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                console.error('Error adding user: Email already exists');
                return undefined;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(`
                INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [username, email, hashedPassword]);
    
            const userId = result.rows[0].id;
            console.log('User added successfully with ID:', userId);
            return userId;
        } catch (err) {
            console.error('Error adding user:', err);
            return undefined;
        }
    },
    getUser: async function getUser(username: string, password: string) {
        try {
          const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
          
          if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            const valid = await bcrypt.compare(password, storedPassword);
            
            if (valid) {
              console.log("Successful password match for user:", user.username);
              return user;
            } else {
              console.log("Incorrect Password for user:", user.username);
              return null;
            }
          } else {
            console.log("User not found:", username);
            return null;
          }
        } catch (err) {
          console.error('Error in getUser:', err);
          throw err; 
        }
    },
    upgradeUserToSupporter: async function upgradeUserToSupporter(user_id: number) {
        try {
            await pool.query("UPDATE users SET supporter = TRUE WHERE id = $1", [user_id]);
            return 1;
        } catch (e) {
            return 0;
        }
    }
};
