// a middleware to check if the user is an admin
// for now, we will just allow access
// TODO: replace with a proper admin check
export const isAdmin = (req, res, next) => {
    next();
};