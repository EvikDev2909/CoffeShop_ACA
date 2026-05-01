import { Pool } from 'pg';
import env from '../config/env.js'

const pool = new Pool({
    connectionString: env.DB_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export default pool;