import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategoriesController } from './categories.controller.js';
import { createMockResponse, createNextSpy } from '../../test-utils/httpMocks.js';

test('categories controller responds with all categories', async () => {
    const categories = [{ id: 1, name: 'Bebidas', active: true }];
    const service = {
        getAll: async () => categories
    };

    const controller = createCategoriesController(service);
    const res = createMockResponse();
    const next = createNextSpy();

    await controller.getAll({}, res, next);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, categories);
    assert.equal(next.calls.length, 0);
});

test('categories controller sends category by id', async () => {
    const category = { id: 2, name: 'Postres', active: true };
    const service = {
        getById: async (id) => ({ ...category, id: Number(id) })
    };

    const controller = createCategoriesController(service);
    const res = createMockResponse();

    await controller.getById({ params: { id: '2' } }, res, createNextSpy());

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, category);
});

test('categories controller returns creation message', async () => {
    let capturedBody = null;
    const service = {
        create: async (body) => {
            capturedBody = body;
        }
    };

    const controller = createCategoriesController(service);
    const res = createMockResponse();

    await controller.create({ body: { name: 'Helados', active: true } }, res, createNextSpy());

    assert.deepEqual(capturedBody, { name: 'Helados', active: true });
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, { message: 'Categoría creada con éxito' });
});

test('categories controller returns update message', async () => {
    let capturedArgs = null;
    const service = {
        update: async (id, body) => {
            capturedArgs = [id, body];
        }
    };

    const controller = createCategoriesController(service);
    const res = createMockResponse();

    await controller.update({ params: { id: '7' }, body: { name: 'Tortas', active: false } }, res, createNextSpy());

    assert.deepEqual(capturedArgs, ['7', { name: 'Tortas', active: false }]);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: 'Categoría actualizada con éxito' });
});

test('categories controller forwards async errors to next', async () => {
    const expectedError = new Error('Fallo controlado');
    const service = {
        delete: async () => {
            throw expectedError;
        }
    };

    const controller = createCategoriesController(service);
    const res = createMockResponse();
    const next = createNextSpy();

    await controller.delete({ params: { id: '3' } }, res, next);

    assert.equal(next.calls.length, 1);
    assert.equal(next.calls[0], expectedError);
});
