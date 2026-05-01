import pool from '../../db/pool.js';

export function createProductRepository(db = pool) {
    return {
        getAll: async () => {
            const query = `
                SELECT
                    p.id,
                    p.name,
                    p.price,
                    p.cost,
                    p.available,
                    p.created_at,
                    p.updated_at,
                    p.category_id,
                    c.name AS category_name
                FROM app.products p
                INNER JOIN app.categories c ON c.id = p.category_id
                ORDER BY p.id;
            `;

            const result = await db.query(query);
            return result.rows;
        },

        getById: async (id) => {
            const query = `
                SELECT
                    p.id,
                    p.name,
                    p.price,
                    p.cost,
                    p.available,
                    p.created_at,
                    p.updated_at,
                    p.category_id,
                    c.name AS category_name
                FROM app.products p
                INNER JOIN app.categories c ON c.id = p.category_id
                WHERE p.id = $1;
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        },

        create: async ({ name, price, cost, available, category_id }) => {
            const query = `
                INSERT INTO app.products (name, price, cost, available, category_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, price, cost, available, created_at, updated_at, category_id;
            `;

            const result = await db.query(query, [name, price, cost, available, category_id]);
            return result.rows[0];
        },

        update: async (id, { name, price, cost, available, category_id }) => {
            const query = `
                UPDATE app.products
                SET
                    name = $2,
                    price = $3,
                    cost = $4,
                    available = $5,
                    category_id = $6,
                    updated_at = NOW()
                WHERE id = $1
                RETURNING id, name, price, cost, available, created_at, updated_at, category_id;
            `;

            const result = await db.query(query, [id, name, price, cost, available, category_id]);
            return result.rows[0];
        },

        delete: async (id) => {
            const query = `
                DELETE FROM app.products
                WHERE id = $1;
            `;

            await db.query(query, [id]);
        }
    };
}

const productRepository = createProductRepository();

export default productRepository;
