import { useForm } from 'react-hook-form';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterUser() {
    const [loading, setLoading] = useState(false);
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [errorResponse, setErrorResponse] = useState('');
    const [usernameFlag, setUsernameFlag] = useState(false);

    const navigate = useNavigate();

    const onSubmit = (data, event) => {
        event.preventDefault();
        setLoading(true);

        axios.post('https://luxury-x.vercel.app/user/signup', {
            username: data.username,
            name: data.name,
            password: data.password,
            phone: data.phone,
            email: data.email,
            userType: 'user',
        })
        .then(res => {
            console.log(res);
            setLoading(false);
            reset();
            navigate('/login');
        })
        .catch(err => {
            setLoading(false);
            setErrorResponse(err.response?.data?.error || err.message);
        });
    };

    const handleUsernameChange = async (e) => {
        const username = e.target.value;
        if (!username.trim()) {
            setUsernameFlag(false);
            return;
        }

        try {
            const res = await axios.post('https://luxury-x.vercel.app/checkUsername', { username });
            setUsernameFlag(res.data.exists);
        } catch (err) {
            console.error("Username check failed:", err);
            setUsernameFlag(true);
        }
    };

    return (
        <div className="register-page">
            {/* Header with Clickable LuxuryX Text */}
            <header className="brand">
                <h1 className="luxuryx-title" onClick={() => navigate('/')}>LuxuryX</h1>
            </header>

            <div className="register-container">
                <h2 className="regsiter-title">Create an Account</h2>
                <p className="register-subtitle">Join LuxuryX and unlock exclusive collections</p>

                <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username Field */}
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            {...register('username', {
                                required: 'Username is required',
                                pattern: {
                                    value: /^(?!\d)[a-zA-Z0-9_]+$/,
                                    message: 'Cannot start with a number, only letters/numbers/underscores'
                                }
                            })}
                            type="text"
                            placeholder="Enter username"
                            onChange={handleUsernameChange}
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                        {usernameFlag && <p className="error-message">Username already exists</p>}
                    </div>

                    {/* Full Name Field */}
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            {...register('name', { required: 'Full Name is required' })}
                            type="text"
                            placeholder="Enter your name"
                        />
                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Enter a valid email address'
                                }
                            })}
                            type="email"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Minimum 8 characters required'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Must contain uppercase, lowercase, number, and special character'
                                }
                            })}
                            type="password"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    {/* Phone Field */}
                    <div className="input-group">
                        <label>Phone</label>
                        <input
                            {...register('phone', {
                                required: 'Phone number is required',
                                minLength: { value: 10, message: 'Must be at least 10 digits' },
                                maxLength: { value: 15, message: 'Must not exceed 15 digits' }
                            })}
                            type="tel"
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                    </div>

                    {/* Error Message */}
                    {errorResponse && <p className="error-message">{errorResponse}</p>}

                    {/* Submit Button */}
                    <button type="submit" className="register-button">{loading ? "Signing Up..." : "Sign Up"}</button>

                    {/* Login Redirect */}
                    <p className="login-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </form>

                {/* Trusted Brands Section (Same as Login Page) */}
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

export default RegisterUser;
