import { useContext, useEffect, useState } from "react";
import { ShopingCartContext } from "../../context";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
    const navigate = useNavigate();
    const { indexItems, setIndexItems, deleteItem, updateCart, cartItems } = useContext(ShopingCartContext);
    const [loginMessage, setLoginMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            setLoading(true);
            axios
                .get("http://localhost:3000/cart", {
                    params: { username },
                })
                .then((result) => {
                    setLoading(false);
                    setIndexItems(result.data.cart.items);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {

            const carty = localStorage.getItem("cart");
            if (carty) {
                const cartDetials = JSON.parse(carty);
                setIndexItems(cartDetials);
            }
        }
    }, []);

    const totalPrice = indexItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const increaseQuantity = async (id) => {
        try {
            const newItems = indexItems.map((item) =>
                item.idx === id ? { ...item, quantity: item.quantity + 1 } : item
            );

            setIndexItems(newItems);
            localStorage.setItem("cart", JSON.stringify(newItems));

            if (localStorage.getItem('username')) await updateCart(1, id);
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };


    const decreaseQuantity = async (id) => {
        try {
            const newItems = indexItems
                .map((item) =>
                    item.idx === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0);

            setIndexItems(newItems);
            localStorage.setItem("cart", JSON.stringify(newItems));

            if (localStorage.getItem('username')) await updateCart(-1, id);
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };


    const handleCheckout = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoginMessage("You need to log in before proceeding to checkout.");
        } else {
            console.log("Proceeding to checkout...");
        }
    };

    if (loading) {
        return <h2 className="loading-text">Loading Cart...</h2>;
    }

    return (
        <div className="cart-container">
            <header className="cart-header">
                <h2>🛒 Your Shopping Cart</h2>
            </header>

            {indexItems.length === 0 ? (
                <div className="empty-cart-container">
                    <p className="empty-cart">Your cart is empty.</p>
                    <button className="continue-shopping-btn" onClick={() => navigate("/product-list")}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {indexItems.map((item) => (
                            <div key={item.idx} className="cart-item">
                                <img
                                    onClick={() => navigate(`/product-details/${item.idx}`)}
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="cart-img"
                                />
                                <div className="cart-item-details">
                                    <strong>{item.title}</strong>
                                    <p>${item.price.toFixed(2)}</p>
                                    <button onClick={() => deleteItem(item.idx)}>Remove</button>
                                </div>
                                <div className="cart-quantity">
                                    <button onClick={() => decreaseQuantity(item.idx)}>-</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={() => increaseQuantity(item.idx)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Cart Summary</h3>
                        {indexItems.map((item) => (
                            <p key={item.idx} className="summary-item">
                                <span className="summary-title">{item.title}</span>
                                <span className="summary-price">${item.price.toFixed(2)} x {item.quantity}</span>
                            </p>
                        ))}
                        <hr />
                        <h3 className="total-amount">Total: ${totalPrice.toFixed(2)}</h3>
                        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                        <button className="continue-shopping-btn" onClick={() => navigate("/product-list")}>
                            Continue Shopping
                        </button>
                        {loginMessage && (
                            <p className="login-warning">
                                {loginMessage} <a href="/login">Login here</a>
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
