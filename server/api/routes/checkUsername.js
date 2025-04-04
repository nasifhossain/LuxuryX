const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.post('/', async (req, res, next) => {
    try {
        const { username } = req.body; // Extract username properly

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const result = await User.findOne({ username });

        if (result) {
            return res.status(200).json({ exists: true }); // 200 status for existing user
        }

        return res.status(200).json({ exists: false }); // Username is available
    } catch (error) {
        console.error('Error checking username:', error);
        return res.status(500).json({ error: 'Username checking failed' });
    }
});

module.exports = router;
