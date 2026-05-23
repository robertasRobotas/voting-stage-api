export function sendSuccess(res, data, message, statusCode = 200) {
    const response = {
        success: true,
        data,
        ...(message && { message }),
    };
    res.status(statusCode).json(response);
}
export function sendCreated(res, data, message) {
    sendSuccess(res, data, message, 201);
}
export function sendError(res, code, message, statusCode = 500, details) {
    const response = {
        success: false,
        error: { code, message, ...(details !== undefined && { details }) },
    };
    res.status(statusCode).json(response);
}
//# sourceMappingURL=response.util.js.map