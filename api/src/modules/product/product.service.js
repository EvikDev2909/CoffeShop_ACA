import productRepository from './product.repository.js';

export function createProductService(repository = productRepository) {
    const service = {
        getAllProducts: async () => {
            return await repository.getAll();
        },

        getProductById: async (id) => {
            validateId(id);

            const product = await repository.getById(id);
            if (!product) {
                const error = new Error('Producto no encontrado');
                error.status = 404;
                throw error;
            }

            return product;
        },

        createProduct: async (productData) => {
            const normalizedData = normalizeProductData(productData);
            return await repository.create(normalizedData);
        },

        updateProduct: async (id, productData) => {
            validateId(id);
            await service.getProductById(id);

            const normalizedData = normalizeProductData(productData);
            return await repository.update(id, normalizedData);
        },

        deleteProduct: async (id) => {
            validateId(id);
            await service.getProductById(id);
            return await repository.delete(id);
        }
    };

    return service;
}

function normalizeProductData(productData = {}) {
    const { name, price, cost, available = true, category_id } = productData;

    validateName(name);
    validateAmount(price, 'El precio es requerido y debe ser mayor o igual a 0');
    validateAmount(cost, 'El costo es requerido y debe ser mayor o igual a 0');
    validateCategoryId(category_id);
    validateAvailable(available);

    return {
        name: name.trim(),
        price: Number(price),
        cost: Number(cost),
        available,
        category_id: Number(category_id)
    };
}

function validateId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        const error = new Error('El id del producto no es válido');
        error.status = 400;
        throw error;
    }
}

function validateName(name) {
    if (!name || !name.trim()) {
        const error = new Error('El nombre es requerido');
        error.status = 400;
        throw error;
    }
}

function validateAmount(value, message) {
    if (value === undefined || value === null || Number.isNaN(Number(value)) || Number(value) < 0) {
        const error = new Error(message);
        error.status = 400;
        throw error;
    }
}

function validateCategoryId(categoryId) {
    if (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0) {
        const error = new Error('La categoría es requerida');
        error.status = 400;
        throw error;
    }
}

function validateAvailable(available) {
    if (typeof available !== 'boolean') {
        const error = new Error('El campo available debe ser booleano');
        error.status = 400;
        throw error;
    }
}

const productService = createProductService();

export default productService;
