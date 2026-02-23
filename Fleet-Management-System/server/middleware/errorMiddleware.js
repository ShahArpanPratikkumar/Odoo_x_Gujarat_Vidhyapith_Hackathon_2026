const notFound = (req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
};

const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || err.status || 500;

    
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'A record with this value already exists.',
            fields: err.fields,
        });
    }

    
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error.',
            errors: err.errors.map(e => e.message),
        });
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = { notFound, errorHandler };
