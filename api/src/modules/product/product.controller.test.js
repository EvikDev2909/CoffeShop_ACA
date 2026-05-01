import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductController } from './product.controller.js';
import { createMockResponse, createNextSpy } from '../../test-utils/httpMocks.js';

test('product controller responds with all products', async () => {
    const products = [{ id: 1, name: 'Capuccino' }];
    const service = {
        getAllProducts: async () => products
    };

    const controller = createProductController(service);
    const res = createMockResponse();
    const next = createNextSpy();

    await controller.getAllProducts({}, res, next);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, products);
    assert.equal(next.calls.length, 0);
});

test('product controller sends product by id', async () => {
    const product = { id: 3, name: 'Latte', category_name: 'Bebidas' };
    const service = {
        getProductById: async (id) => ({ ...product, id: Number(id) })
    };

    const controller = createProductController(service);
    const res = createMockResponse();

    await controller.getProductById({ params: { id: '3' } }, res, createNextSpy());

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, product);
});

test('product controller returns created product message', async () => {
    let capturedBody = null;
    const created = { id: 8, name: 'Americano' };
    const service = {
        createProduct: async (body) => {
            capturedBody = body;
            return created;
        }
    };

    const controller = createProductController(service);
    const res = createMockResponse();

    await controller.createProduct({
        body: { name: 'Americano', price: 5000, cost: 2000, available: true, category_id: 1 }
    }, res, createNextSpy());

    assert.deepEqual(capturedBody, { name: 'Americano', price: 5000, cost: 2000, available: true, category_id: 1 });
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
        message: 'Producto creado con éxito',
        product: created
    });
});

test('product controller returns updated product message', async () => {
    let capturedArgs = null;
    const updated = { id: 9, name: 'Espresso Doble' };
    const service = {
        updateProduct: async (id, body) => {
            capturedArgs = [id, body];
            return updated;
        }
    };

    const controller = createProductController(service);
    const res = createMockResponse();

    await controller.updateProduct({
        params: { id: '9' },
        body: { name: 'Espresso Doble', price: 7000, cost: 2500, available: true, category_id: 1 }
    }, res, createNextSpy());

    assert.deepEqual(capturedArgs, ['9', { name: 'Espresso Doble', price: 7000, cost: 2500, available: true, category_id: 1 }]);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
        message: 'Producto actualizado con éxito',
        product: updated
    });
});

test('product controller forwards async errors to next', async () => {
    const expectedError = new Error('Fallo controlado');
    const service = {
        deleteProduct: async () => {
            throw expectedError;
        }
    };

    const controller = createProductController(service);
    const res = createMockResponse();
    const next = createNextSpy();

    await controller.deleteProduct({ params: { id: '4' } }, res, next);

    assert.equal(next.calls.length, 1);
    assert.equal(next.calls[0], expectedError);
});
