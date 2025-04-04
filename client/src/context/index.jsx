import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import Axios

export const ShopingCartContext = createContext(null);

function ShopingCartProvider({ children }) {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);  // Local cart items state
    const [indexItems, setIndexItems] = useState([]);  // State to hold index references of cart items

    async function addToCart(data, goToCart = true) {
        const token = localStorage.getItem("token");

        if (token&& token.length) {
            // Add item to the cart in the backend
            axios.post(
                "https://luxury-x-git-main-nasifs-projects-9e4adf21.vercel.app/cart",
                {
                    username: localStorage.getItem("username").toString(),
                    idx: data.id,
                    title: data.title,
                    thumbnail: data.thumbnail,
                    price: data.price,
                    quantity:1
                },
                {
                    headers: { authorization: `Bearer ${token}` },  // Include token in headers
                }
            )
                .then((res) => {
                    console.log("Cart updated:", res.data);
                    // Update the indexItems state after the backend response
                    //setIndexItems(res.data.cart.items);  // Updated indexItems
                    console.log(indexItems);

                })
                .catch((err) => {
                    console.error("Error updating cart:", err.response?.data || err.message);
                });
        } else {
            // Handle local cart state when no token (user not logged in)
            let cpyExistingCart = localStorage.getItem("cart")? JSON.parse( localStorage.getItem("cart")):[];
           
            const idx = cpyExistingCart.findIndex((cartItem) => cartItem.idx === data.id);

            if (idx === -1) {
                cpyExistingCart.push({
                    idx: data.id,
                    title: data.title,
                    thumbnail: data.thumbnail,
                    price: data.price,
                    quantity: 1
                });
            } else {
                cpyExistingCart[idx].quantity++;
            }

            setCartItems(cpyExistingCart);  // Update the local cart state
            localStorage.setItem("cart", JSON.stringify(cpyExistingCart)); // ✅ Use the latest copy

        }

        if (goToCart) navigate("/cart");  // Navigate only if goToCart is true
    }

    // useEffect to fetch product details for items in indexItems
    // useEffect(() => {
    //     if (indexItems.length <= 0) {
    //         axios.get("https://luxury-x-git-main-nasifs-projects-9e4adf21.vercel.app/cart", {
    //             params: {username:localStorage.getItem("username")}
    //         }, {
    //             headers: { authorisation: `Bearer ${localStorage.getItem('token')}` }
    //         }).then(res => {
    //             setIndexItems(res.data.cart.items);
    //             console.log(indexItems);
    //             if(indexItems.length==0) return;
    //         }).catch(err => {
    //             console.log(err);

    //         })
    //     }
    //     if (indexItems.length >= 0) {
    //         // Fetch product data for each item in indexItems
    //         const fetchData = async () => {
    //             const updatedCartItems = await Promise.all(
    //                 indexItems.map(async (item) => {
    //                     try {
    //                         const response = await axios.get(`https://dummyjson.com/products/${item.idx}`);
    //                         return { ...response.data, quantity: item.quantity };  // Return product data with quantity
    //                     } catch (error) {
    //                         console.error("Error fetching product:", error);
    //                         return item;  // If fetch fails, return the item as is
    //                     }
    //                 })
    //             );

    //             // Update the cartItems with the fetched product data
    //             setCartItems(updatedCartItems);
    //         };

    //         fetchData();
    //     } // Call fetchData to get the updated products

    // }, []);  // Dependency on indexItems to fetch when it changes

    // Delete item from cart
    async function deleteItem(idx) {
        const username = localStorage.getItem("username");

        if (!username) {
            // User not logged in — delete from localStorage cart
            const cartData = localStorage.getItem("cart");
            let localCart = cartData ? JSON.parse(cartData) : [];

            const newCart = localCart.filter((item) => item.idx !== idx);

            setIndexItems(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));

            return;
        }
        try {
            // Make a request to delete the item from the cart
            const response = await axios.delete(`https://luxury-x-git-main-nasifs-projects-9e4adf21.vercel.app/cart/${idx}`, {
                params: { username },  // Pass username as query parameter
            });

            console.log("Item deleted:", response.data);

            // Update the cart after deletion
            setIndexItems((prevIndexItems) => prevIndexItems.filter(item => item.idx !== idx));
        } catch (err) {
            console.error("Error deleting item:", err.response?.data || err.message);
        }
    }

    async function updateCart(nummy, id) {

        axios.put(`https://luxury-x-git-main-nasifs-projects-9e4adf21.vercel.app/cart/${id}`, {
            username: localStorage.getItem('username'),
            quantity: nummy
        }).then(res => {
            console.log(res);

        }).catch(err => {
            console.log(err);

        })

    }



    return (
        <ShopingCartContext.Provider value={{ addToCart, indexItems, setIndexItems, deleteItem, updateCart, cartItems }}>
            {children}
        </ShopingCartContext.Provider>
    );
}

export default ShopingCartProvider;
