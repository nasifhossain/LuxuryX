const express = require('express');
const Cart = require('../model/cart');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

// Add item to cart
router.post("/", checkAuth, async (req, res, next) => {
    try {
        const { idx,title,thumbnail,price,quantity } = req.body;
        const username = req.body.username; // Extracted from JWT

        if (!username || !idx) {
            return res.status(400).json({ message: "Username and idx are required." });
        }

        let cart = await Cart.findOne({ username });

        if (cart) {
            let itemIndex = cart.items.findIndex(item => item.idx == idx);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity; // Increase the quantity of the item
            } else {
                cart.items.push({ idx, quantity: quantity,title,thumbnail,price }); // Add new item to cart
            }

            await cart.save(); // Save the cart after modification
        } else {
            cart = new Cart({ username, items: [{ idx, quantity: 1, title, thumbnail, price }] });

            await cart.save();
        }

        return res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get cart items
router.get('/', async (req, res, next) => {
    try {
        const username = req.query.username; // Extract the username from the query params

        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        // Find the cart associated with the provided username
        const result = await Cart.findOne({ username });

        if (!result) {
            return res.status(404).json({ message: "Cart not found for user" });
        }

        // Return the cart items if found
        res.status(200).json({ cart: result });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Error in fetching cart" });
    }
});

// Remove item from cart
router.delete('/:idx', async (req, res, next) => {
    const { idx } = req.params; // Item index to remove
    const username = req.query.username; // Username to associate with the cart

    if (!username || !idx) {
        return res.status(400).json({ message: "Username and idx are required." });
    }

    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ username });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user" });
        }

        // Find the index of the item to remove
        const itemIndex = cart.items.findIndex(item => item.idx == idx);

        if (itemIndex > -1) {
            // Remove the item from the cart
            cart.items.splice(itemIndex, 1);
            await cart.save(); // Save the updated cart
            return res.status(200).json({ message: "Item removed", cart });
        } else {
            return res.status(404).json({ message: "Item not found in cart" });
        }

    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update item quantity in cart
router.put('/:idx', async (req, res) => {
    try {
        const { username, quantity } = req.body;
        const { idx } = req.params;

        if (!username || !idx || quantity === undefined) {
            return res.status(400).json({ message: "Username, idx, and quantity are required." });
        }

        const cart = await Cart.findOne({ username });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        const itemIndex = cart.items.findIndex((item) => item.idx == idx);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;

            // If quantity reaches 0, remove the item
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }

            await cart.save();
            return res.status(200).json({ message: "Item quantity updated", cart });
        } else {
            return res.status(404).json({ message: "Item not found in cart." });
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
