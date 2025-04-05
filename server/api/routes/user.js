const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/user');
const checkAuth = require('../middleware/check-auth');
const { default: axios } = require('axios');
require('dotenv').config();
const JWT_Secret = 'this_is_dummy_secret';

async function sendResetEmail(email, link) {
    const url = 'https://api.brevo.com/v3/smtp/email';

    const emailData = {
        sender: {
            name: "LuxuryX",
            email: "nasifhossain040@gmail.com"
        },
        to: [
            {
                email: email
            }
        ],
        subject: "Password Reset Request",
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {
                    font-family: "Arial", sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: #111;
                    padding: 20px;
                    text-align: center;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                }
                .email-body {
                    padding: 30px;
                    text-align: center;
                }
                .email-body h2 {
                    color: #333;
                }
                .email-body p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .btn {
                    display: inline-block;
                    padding: 12px 24px;
                    margin-top: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    text-decoration: none;
                    color: white;
                    background: linear-gradient(135deg, #FFD700, #FFAA00);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .btn:hover {
                    background: linear-gradient(135deg, #FFAA00, #FFD700);
                    box-shadow: 0px 4px 10px rgba(255, 215, 0, 0.4);
                }
                .footer {
                    background: #111;
                    padding: 15px;
                    text-align: center;
                    color: #999;
                    font-size: 14px;
                }
                .footer a {
                    color: #FFD700;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>

        <div class="email-container">
            <!-- Header -->
            <div class="header">
                LuxuryX – Secure Your Account
            </div>sta

            <!-- Body -->
            <div class="email-body">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password. Click the button below to set a new password.</p>
                <a href="${link}" class="btn">Reset Password</a>
                <p>If you did not request this, you can safely ignore this email.</p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 LuxuryX. All rights reserved.</p>
                <p><a href="https://cartapp.com/contact">Contact Support</a></p>
            </div>
        </div>

        </body>
        </html>
        `
    };

    const apiKey = process.env.apiKey;

    try {
        await axios.post(url, emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            }
        });
        console.log("Mail Sent Successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}



router.get('/', checkAuth, (req, res, next) => {
    User.find().then(result => {
        res.status(200).json({
            "users": result
        })
        console.log(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: "error in fetching"
        })

    })
})

router.post('/signup', async (req, res) => {
    try {
        // Check if username or email exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exist' });
        }
        const checkEmail = await User.findOne({ email: req.body.email });

        if (checkEmail) {
            return res.status(400).json({ error: 'Email id already exist' });
        }

        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hashedPassword,
            phone: req.body.phone,
            email: req.body.email,
            name: req.body.name,
            userType: req.body.userType,
        });

        const result = await user.save();
        res.status(201).json({ message: 'User created successfully', result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in user registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ error: 'User not registered' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Enter Correct Password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { username: user.username, userType: user.userType, email: user.email },
            'this_is_dummy_secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({ username: user.username, email: user.email, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/forgotPassword', async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const user1 = await User.findOne({ username: username });

        const user2 = await User.findOne({ email: username });
        const user = user1 || user2;
        if (!user) {
            return res.status(404).json({ error: "Username does not exist." });
        }

        const secret = JWT_Secret + user.password;
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "10m" });
        const link = `https://noluxuryx.netlify.app/reset-password/${user._id}/${token}`;
        console.log(link);
        const email = user.email.trim();
        console.log(email);
        await sendResetEmail(email, link);
        let fedEmail = '';
        var flag = false;
        for (let index = 0; index < email.length; index++) {
            if (email[index + 1] == `@` || email[index + 2] == `@` || email[index + 3] == `@`) flag = true;
            if (flag) {
                fedEmail += email[index];
            } else {
                fedEmail += '*';
            }

        }

        return res.status(200).json({
            message: "Password reset instructions sent.",
            email: fedEmail
        });

    } catch (error) {
        console.error("Error in forgotPassword route:", error);
        res.status(500).json({ error: "Internal server error." });
    }


})

router.get('/reset-password/:id/:token', async (req, res, next) => {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(500).json({
            error: "Invalid request"
        })
    }
    const secret = JWT_Secret + user.password;
    try {
        const verify = jwt.verify(token, secret);
        res.status(200).json({
            message: 'verified'
        })
        console.log('User verified');

    } catch (error) {
        return res.status(500).json({
            error: 'Failed token verification'
        })
    }

})

router.put('/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const secret = JWT_Secret + user.password;
        try {
            jwt.verify(token, secret);
        } catch (error) {
            console.error("JWT Verification Failed:", error);
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true } // Returns updated user
        );

        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update password." });
        }

        return res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Password Reset Error:", error);
        return res.status(500).json({ error: "Failed to update password." });
    }
});

router.get('/:username', checkAuth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ error: "Username does not exist" });
        }
        console.log(user);
        res.status(200).json({
            details: {
                username: user.username,
                phone: user.phone,
                email: user.email,
                name: user.name,
                userType: user.userType
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ error: "Username doesn't exist" });
        }

        // Check password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect Password" });
        }

        const emailCheck =await User.findOne({email:req.body.email});
        if(emailCheck && emailCheck.username!=user.username){
            return res.status(404).json({
                error:'Email Already Registered'
            })
        }
        const phoneCheck =await User.findOne({phone:req.body.phone});
        if(phoneCheck && phoneCheck.username!=user.username){
            return res.status(404).json({
                error:'Phone Already Registered'
            })
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ error: "Error updating user" });
        }

        return res.status(200).json({ message: "Account details updated successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error in updating" });
    }
});

router.put('/updatePassword/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            res.status(404).json({
                error: 'User Not Found'
            })
        }
        const oldPassword = req.body.oldPassword;

        if (!oldPassword) {
            return res.status(400).json({ error: "Password is required." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect Password" });
        }


        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        const updateUser =await User.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        if(!updateUser){
            return res.status(500).json({
                error:'Error in Updating Password'
            })
        }
        console.log(updateUser);
       return res.status(200).json({
            message:'Password Updated Successfully'
        })

    } catch (error) {
        console.log(errror);
        res.status(500).json({
            error:'Internal server Error'
        })
    }
})



module.exports = router;
