import { Router } from "express";
import categoriesController from "./categories.controller.js";

const categoriesRouter = Router();

categoriesRouter.get('/', categoriesController.getAll);
categoriesRouter.get('/:id', categoriesController.getById);
categoriesRouter.post('/', categoriesController.create);
categoriesRouter.put('/:id', categoriesController.update);
categoriesRouter.delete('/:id', categoriesController.delete);

export default categoriesRouter;
