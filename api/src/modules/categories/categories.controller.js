import categoriesService from "./categories.service.js";
import catchAsync from "../../utils/catchAsync.js";

export function createCategoriesController(service = categoriesService) {
    return {
        getAll: catchAsync(async (req, res) => {
            const categories = await service.getAll();
            res.status(200).json(categories);
        }),

        getById: catchAsync(async (req, res) => {
            const { id } = req.params;
            const category = await service.getById(id);
            res.status(200).json(category);
        }),

        create: catchAsync(async (req, res) => {
            await service.create(req.body);
            res.status(201).json({ message: 'Categoría creada con éxito' });
        }),

        update: catchAsync(async (req, res) => {
            const { id } = req.params;
            await service.update(id, req.body);
            res.status(200).json({ message: 'Categoría actualizada con éxito' });
        }),

        delete: catchAsync(async (req, res) => {
            const { id } = req.params;
            await service.delete(id);
            res.status(200).json({ message: 'Categoría eliminada con éxito' });
        })
    };
}

const categoriesController = createCategoriesController();

export default categoriesController;
