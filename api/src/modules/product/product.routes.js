import { Router } from "express";
import productController from "./product.controller.js";
const productRouter = Router();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.post('/', productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);

export default productRouter;