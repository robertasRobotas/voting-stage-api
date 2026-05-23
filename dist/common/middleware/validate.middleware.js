import { ValidationError } from '../errors/index.js';
export function validate(schema, source = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const details = result.error.flatten();
            return next(new ValidationError('Validation failed', details));
        }
        req[source] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map