import categoriesRepository from "./categories.repository.js";

export function createCategoriesService(repository = categoriesRepository) {
    const service = {
        getAll: async () => {
            return await repository.getAll();
        },

        getById: async (id) => {
            const category = await repository.getById(id);
            if (!category) {
                const error = new Error('Categoría no encontrada');
                error.status = 404;
                throw error;
            }
            return category;
        },

        create: async (categoryData) => {
            const { name, active } = categoryData;
            validateName(name);
            return await repository.create(name, active);
        },

        update: async (id, categoryData) => {
            const { name, active } = categoryData;
            await service.getById(id);
            validateName(name);
            return await repository.update(id, name, active);
        },

        delete: async (id) => {
            await service.getById(id);
            return await repository.delete(id);
        }
    };

    return service;
}

function validateName(name) {
    if (!name || !name.trim()) {
        const error = new Error('El nombre es requerido');
        error.status = 400;
        throw error;
    }
}

const categoriesService = createCategoriesService();

export default categoriesService;
