import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";

function LoginPage() {
    const [errorResponse, setErrorResponse] = useState('');
    const navigate = useNavigate();
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorResponse("");

        try {
            const res = await axios.post('https://luxury-x.vercel.app/user/login', {
                username: data.username,
                password: data.password,
            });

            const { token, username } = res.data;

            // Set token and username in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            // Handle local cart sync
            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

            if (cart.length > 0) {
                await Promise.all(cart.map(item =>
                    axios.post("https://luxury-x.vercel.app/cart", {
                        username,
                        idx: item.idx,
                        title: item.title,
                        thumbnail: item.thumbnail,
                        price: item.price,
                        quantity: item.quantity, // default quantity
                    }, {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    })
                ));

                localStorage.removeItem('cart'); // clear only after syncing
            }

            setLoading(false);
            reset();
            navigate('/product-list');

        } catch (err) {
            console.error("Login Error:", err);
            setLoading(false);
            setErrorResponse(err.response?.data?.error || "Login failed. Please try again.");
        }
    };


    return (
        <div className="login-wrapper">
            {/* Header with Clickable LuxuryX Text */}
            <header className="login-header">
                <h1 className="luxuryx-title" onClick={() => navigate('/')}>LuxuryX</h1>
            </header>

            <div className="login-box">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">Unlock premium collections & exclusive offers</p>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            {...register('username', { required: 'Username is required' })}
                            type="text"
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 4, message: 'Minimum 8 characters required' }
                            })}
                            type="password"
                            placeholder="Enter Password"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="login-btn">{loading ? "Logging in..." : "Login"}</button>

                    {errorResponse && (
                        <p className="error-message">
                            {errorResponse}
                            {errorResponse.toLowerCase().includes('password') && (
                                <Link to="/forgotPassword" className="forgot-password-link"> Forgot Password?</Link>
                            )}
                        </p>
                    )}

                    <p className="signup-link">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </form>

                {/* Trusted Brands Section (Mini Version) */}
                <div className="trusted-brands-login">
                    <h3>Trusted By</h3>
                    <div className="brand-logos">
                        <img src="https://brandeps.com/logo-download/H/H-&-M-logo-01.png" alt="Brand 1" />
                        <img src="https://brandeps.com/logo-download/L/Levis-logo-vector-01.svg" alt="Brand 2" />
                        <img src="https://brandeps.com/logo-download/P/Polo-Ralph-Lauren-logo-vector-01.svg" alt="Brand 3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
