"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamemodel = void 0;
const pg_1 = require("pg");
const bcrypt_1 = __importDefault(require("bcrypt"));
// dbname=postgres user=postgres hostaddr=35.192.184.13
// const pool = new Pool({
//     user: 'postgres',
//     host: '35.192.184.13',
//     database: 'postgres',
//     password: "7%>ybO+>p}~>uZ='",
//     port: 5432,
// });
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432
});
exports.gamemodel = {
    init: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    level INTEGER DEFAULT 1,
                    experience INTEGER DEFAULT 0,
                    points INTEGER DEFAULT 0,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('User table has been initialized');
        }
        catch (err) {
            console.error('Error initializing user table:', err);
        }
    }),
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT * FROM users');
            return result.rows;
        }
        catch (err) {
            console.error('Error fetching users:', err);
            return [];
        }
    }),
    addUser: (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingUser = yield pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                console.error('Error adding user: Email already exists');
                return undefined;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const result = yield pool.query(`
                INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [username, email, hashedPassword]);
            const userId = result.rows[0].id;
            console.log('User added successfully with ID:', userId);
            return userId;
        }
        catch (err) {
            console.error('Error adding user:', err);
            return undefined;
        }
    }),
};
