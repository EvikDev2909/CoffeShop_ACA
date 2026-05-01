import pool from '../../db/pool.js';

export function createCategoriesRepository(db = pool) {
    return {
        getAll: async () => {
            const query = `
                SELECT id, name, active FROM app.categories
            `;

            const result = await db.query(query);
            return result.rows;
        },

        getById: async (id) => {
            const query = `
                SELECT id, name, active FROM app.categories WHERE id = $1;
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        },

        create: async (name, active = true) => {
            const query = `
                INSERT INTO app.categories (name, active)
                VALUES ($1, $2)
                RETURNING id, name, active;
            `;

            const result = await db.query(query, [name, active]);
            return result.rows[0];
        },

        update: async (id, name, active = true) => {
            const query = `
                UPDATE app.categories
                SET name = $2, active = $3
                WHERE id = $1
                RETURNING id, name, active;
            `;

            const result = await db.query(query, [id, name, active]);
            return result.rows[0];
        },

        delete: async (id) => {
            const query = `
                DELETE FROM app.categories WHERE id = $1;
            `;

            await db.query(query, [id]);
        }
    };
}

const categoriesRepository = createCategoriesRepository();

export default categoriesRepository;
