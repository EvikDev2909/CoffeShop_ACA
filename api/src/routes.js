import { Router } from "express";
import productRouter from "./modules/product/product.routes.js"
import categoriesRouter from "./modules/categories/categories.routes.js";


const router = Router();

router.use('/product', productRouter);
router.use('/categories', categoriesRouter);

export default router;
