import express from 'express';
import router from './routes.js'
import globalErrorHandler from './middlewares/globalErrorHandler.js';

const app = express();

app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('CoffeShop API');
});

// Middleware global de errores - DEBE ir después de todas las rutas
app.use(globalErrorHandler);

export default app;