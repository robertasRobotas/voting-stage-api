import { sendSuccess } from '../../common/utils/response.util.js';
export function me(req, res, next) {
    try {
        const u = req.user;
        sendSuccess(res, {
            id: u.userId,
            email: u.email,
            displayName: u.displayName,
            photoUrl: u.photoUrl,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map