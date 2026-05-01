import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductService } from './product.service.js';

test('product service returns all products from repository', async () => {
    const products = [{ id: 1, name: 'Capuccino' }];
    const repository = {
        getAll: async () => products
    };

    const service = createProductService(repository);

    const result = await service.getAllProducts();

    assert.deepEqual(result, products);
});

test('product service validates product id before searching', async () => {
    const repository = {
        getById: async () => ({ id: 1 })
    };

    const service = createProductService(repository);

    await assert.rejects(() => service.getProductById('abc'), (error) => {
        assert.equal(error.message, 'El id del producto no es válido');
        assert.equal(error.status, 400);
        return true;
    });
});

test('product service throws 404 when product does not exist', async () => {
    const repository = {
        getById: async () => undefined
    };

    const service = createProductService(repository);

    await assert.rejects(() => service.getProductById(77), (error) => {
        assert.equal(error.message, 'Producto no encontrado');
        assert.equal(error.status, 404);
        return true;
    });
});

test('product service creates product with normalized payload', async () => {
    let capturedPayload = null;
    const repository = {
        create: async (payload) => {
            capturedPayload = payload;
            return { id: 1, ...payload };
        }
    };

    const service = createProductService(repository);

    const result = await service.createProduct({
        name: '  Capuccino  ',
        price: '8500',
        cost: '3200',
        available: true,
        category_id: '1'
    });

    assert.deepEqual(capturedPayload, {
        name: 'Capuccino',
        price: 8500,
        cost: 3200,
        available: true,
        category_id: 1
    });
    assert.equal(result.id, 1);
});

test('product service validates boolean available field', async () => {
    const repository = {
        create: async () => {
            throw new Error('No debería ejecutarse');
        }
    };

    const service = createProductService(repository);

    await assert.rejects(() => service.createProduct({
        name: 'Mocaccino',
        price: 9000,
        cost: 3500,
        available: 'si',
        category_id: 1
    }), (error) => {
        assert.equal(error.message, 'El campo available debe ser booleano');
        assert.equal(error.status, 400);
        return true;
    });
});

test('product service updates product after verifying existence', async () => {
    const calls = [];
    const repository = {
        getById: async (id) => {
            calls.push(['getById', id]);
            return { id: Number(id), name: 'Anterior' };
        },
        update: async (id, payload) => {
            calls.push(['update', id, payload]);
            return { id: Number(id), ...payload };
        }
    };

    const service = createProductService(repository);

    const result = await service.updateProduct(4, {
        name: 'Latte',
        price: 7800,
        cost: 2900,
        available: false,
        category_id: 2
    });

    assert.deepEqual(calls, [
        ['getById', 4],
        ['update', 4, {
            name: 'Latte',
            price: 7800,
            cost: 2900,
            available: false,
            category_id: 2
        }]
    ]);
    assert.equal(result.name, 'Latte');
});

test('product service deletes product after verifying existence', async () => {
    const calls = [];
    const repository = {
        getById: async (id) => {
            calls.push(['getById', id]);
            return { id: Number(id), name: 'Filtrado' };
        },
        delete: async (id) => {
            calls.push(['delete', id]);
        }
    };

    const service = createProductService(repository);

    await service.deleteProduct(5);

    assert.deepEqual(calls, [
        ['getById', 5],
        ['delete', 5]
    ]);
});
