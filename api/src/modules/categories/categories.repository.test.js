import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategoriesRepository } from './categories.repository.js';

test('categories repository getAll executes select query and returns rows', async () => {
    const rows = [{ id: 1, name: 'Bebidas', active: true }];
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows };
        }
    };

    const repository = createCategoriesRepository(db);

    const result = await repository.getAll();

    assert.deepEqual(result, rows);
    assert.match(calls[0][0], /SELECT id, name, active FROM app\.categories/i);
    assert.equal(calls[0][1], undefined);
});

test('categories repository getById sends id as parameter', async () => {
    const row = { id: 9, name: 'Temporada', active: true };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [row] };
        }
    };

    const repository = createCategoriesRepository(db);

    const result = await repository.getById(9);

    assert.deepEqual(result, row);
    assert.match(calls[0][0], /WHERE id = \$1/i);
    assert.deepEqual(calls[0][1], [9]);
});

test('categories repository create returns inserted row', async () => {
    const inserted = { id: 3, name: 'Panaderia', active: false };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [inserted] };
        }
    };

    const repository = createCategoriesRepository(db);

    const result = await repository.create('Panaderia', false);

    assert.deepEqual(result, inserted);
    assert.match(calls[0][0], /INSERT INTO app\.categories/i);
    assert.match(calls[0][0], /RETURNING id, name, active/i);
    assert.deepEqual(calls[0][1], ['Panaderia', false]);
});

test('categories repository update returns updated row', async () => {
    const updated = { id: 4, name: 'Snacks', active: true };
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [updated] };
        }
    };

    const repository = createCategoriesRepository(db);

    const result = await repository.update(4, 'Snacks', true);

    assert.deepEqual(result, updated);
    assert.match(calls[0][0], /UPDATE app\.categories/i);
    assert.match(calls[0][0], /RETURNING id, name, active/i);
    assert.deepEqual(calls[0][1], [4, 'Snacks', true]);
});

test('categories repository delete executes delete query with id', async () => {
    const calls = [];
    const db = {
        query: async (sql, params) => {
            calls.push([sql, params]);
            return { rows: [] };
        }
    };

    const repository = createCategoriesRepository(db);

    await repository.delete(5);

    assert.match(calls[0][0], /DELETE FROM app\.categories/i);
    assert.deepEqual(calls[0][1], [5]);
});
