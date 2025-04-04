const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Check if authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        // Extract the token
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token
        const verifiedUser = jwt.verify(token,'this_is_dummy_secret');

        console.log("Token Verified:", verifiedUser);

        // If user is admin, proceed
       next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
