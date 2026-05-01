const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.status || 500;
    err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Server error ocurred',
    });
};

export default globalErrorHandler;
