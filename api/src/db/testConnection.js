import pool from './pool.js';

export async function TestConnecion(){
    const result = await pool.query('SELECT NOW()');
    console.log(`DB Connected: ${result.rows[0]}`);
}