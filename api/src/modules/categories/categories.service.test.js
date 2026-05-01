import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategoriesService } from './categories.service.js';

test('categories service returns all categories from repository', async () => {
    const categories = [{ id: 1, name: 'Bebidas', active: true }];
    const repository = {
        getAll: async () => categories
    };

    const service = createCategoriesService(repository);

    const result = await service.getAll();

    assert.deepEqual(result, categories);
});

test('categories service returns category by id', async () => {
    const category = { id: 2, name: 'Postres', active: true };
    const repository = {
        getAll: async () => [],
        getById: async (id) => ({ ...category, id: Number(id) })
    };

    const service = createCategoriesService(repository);

    const result = await service.getById('2');

    assert.deepEqual(result, category);
});

test('categories service throws 404 when category does not exist', async () => {
    const repository = {
        getAll: async () => [],
        getById: async () => undefined
    };

    const service = createCategoriesService(repository);

    await assert.rejects(() => service.getById(99), (error) => {
        assert.equal(error.message, 'Categoría no encontrada');
        assert.equal(error.status, 404);
        return true;
    });
});

test('categories service validates name on create', async () => {
    const repository = {
        create: async () => {
            throw new Error('No debería ejecutarse');
        }
    };

    const service = createCategoriesService(repository);

    await assert.rejects(() => service.create({ name: '   ' }), (error) => {
        assert.equal(error.message, 'El nombre es requerido');
        assert.equal(error.status, 400);
        return true;
    });
});

test('categories service creates category with repository', async () => {
    let capturedArgs = null;
    const createdCategory = { id: 3, name: 'Panaderia', active: false };
    const repository = {
        create: async (name, active) => {
            capturedArgs = [name, active];
            return createdCategory;
        }
    };

    const service = createCategoriesService(repository);

    const result = await service.create({ name: 'Panaderia', active: false });

    assert.deepEqual(capturedArgs, ['Panaderia', false]);
    assert.deepEqual(result, createdCategory);
});

test('categories service updates category after checking existence', async () => {
    const calls = [];
    const updatedCategory = { id: 4, name: 'Sandwiches', active: true };
    const repository = {
        getById: async (id) => {
            calls.push(['getById', id]);
            return { id: Number(id), name: 'Anterior', active: true };
        },
        update: async (id, name, active) => {
            calls.push(['update', id, name, active]);
            return updatedCategory;
        }
    };

    const service = createCategoriesService(repository);

    const result = await service.update(4, { name: 'Sandwiches', active: true });

    assert.deepEqual(calls, [
        ['getById', 4],
        ['update', 4, 'Sandwiches', true]
    ]);
    assert.deepEqual(result, updatedCategory);
});

test('categories service deletes category after checking existence', async () => {
    const calls = [];
    const repository = {
        getById: async (id) => {
            calls.push(['getById', id]);
            return { id: Number(id), name: 'Temporal', active: true };
        },
        delete: async (id) => {
            calls.push(['delete', id]);
        }
    };

    const service = createCategoriesService(repository);

    await service.delete(6);

    assert.deepEqual(calls, [
        ['getById', 6],
        ['delete', 6]
    ]);
});
