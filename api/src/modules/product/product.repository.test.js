import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductRepository } from './product.repository.js';

test('product repository getAll executes join query and returns rows', async () => {
    const rows = [{ id: 1, name: 'Capuccino', category_name: 'Bebidas' }];
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows };
        }
    };

    const repository = createProductRepository(db);

    const result = await repository.getAll();

    assert.deepEqual(result, rows);
    assert.match(calls[0][0], /FROM app\.products p/i);
    assert.match(calls[0][0], /INNER JOIN app\.categories c/i);
    assert.match(calls[0][0], /ORDER BY p\.id/i);
    assert.equal(calls[0][1], undefined);
});

test('product repository getById sends id as parameter', async () => {
    const row = { id: 2, name: 'Latte', category_name: 'Bebidas' };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [row] };
        }
    };

    const repository = createProductRepository(db);

    const result = await repository.getById(2);

    assert.deepEqual(result, row);
    assert.match(calls[0][0], /WHERE p\.id = \$1/i);
    assert.deepEqual(calls[0][1], [2]);
});

test('product repository create returns inserted row', async () => {
    const inserted = { id: 3, name: 'Mocaccino' };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [inserted] };
        }
    };

    const repository = createProductRepository(db);

    const result = await repository.create({
        name: 'Mocaccino',
        price: 9500,
        cost: 3600,
        available: true,
        category_id: 1
    });

    assert.deepEqual(result, inserted);
    assert.match(calls[0][0], /INSERT INTO app\.products/i);
    assert.match(calls[0][0], /RETURNING id, name, price, cost, available/i);
    assert.deepEqual(calls[0][1], ['Mocaccino', 9500, 3600, true, 1]);
});

test('product repository update returns updated row', async () => {
    const updated = { id: 4, name: 'Flat White' };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [updated] };
        }
    };

    const repository = createProductRepository(db);

    const result = await repository.update(4, {
        name: 'Flat White',
        price: 10200,
        cost: 4000,
        available: false,
        category_id: 2
    });

    assert.deepEqual(result, updated);
    assert.match(calls[0][0], /UPDATE app\.products/i);
    assert.match(calls[0][0], /updated_at = NOW\(\)/i);
    assert.deepEqual(calls[0][1], [4, 'Flat White', 10200, 4000, false, 2]);
});

test('product repository delete executes delete query with id', async () => {
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [] };
        }
    };

    const repository = createProductRepository(db);

    await repository.delete(10);

    assert.match(calls[0][0], /DELETE FROM app\.products/i);
    assert.deepEqual(calls[0][1], [10]);
});
