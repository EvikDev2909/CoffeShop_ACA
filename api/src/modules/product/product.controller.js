import productService from './product.service.js';
import catchAsync from '../../utils/catchAsync.js';

export function createProductController(service = productService) {
    return {
        getAllProducts: catchAsync(async (req, res) => {
            const products = await service.getAllProducts();
            res.status(200).json(products);
        }),

        getProductById: catchAsync(async (req, res) => {
            const { id } = req.params;
            const product = await service.getProductById(id);
            res.status(200).json(product);
        }),

        createProduct: catchAsync(async (req, res) => {
            const product = await service.createProduct(req.body);
            res.status(201).json({
                message: 'Producto creado con éxito',
                product
            });
        }),

        updateProduct: catchAsync(async (req, res) => {
            const { id } = req.params;
            const product = await service.updateProduct(id, req.body);
            res.status(200).json({
                message: 'Producto actualizado con éxito',
                product
            });
        }),

        deleteProduct: catchAsync(async (req, res) => {
            const { id } = req.params;
            await service.deleteProduct(id);
            res.status(200).json({ message: 'Producto eliminado con éxito' });
        })
    };
}

const productController = createProductController();

export default productController;
