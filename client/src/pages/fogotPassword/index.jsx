import { useForm } from "react-hook-form";
import axios from 'axios';
import { useState } from "react";
import { Link } from "react-router-dom";
import './style.css';

function ForgotPassword() {
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('https://luxury-x.vercel.app/user/forgotPassword', {
                username:data.username
            });

            setErrorMessage('');
            setEmailMessage('Password Reset Link Sent to '+res.data.email);
            console.log(res);
            reset();
        } catch (err) {
            setEmailMessage('');
            setErrorMessage(err.response?.data?.error || "❌ Something went wrong. Please try again.");
        }
    };

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Forgot Your Password?</h2>
                <p className="helper-text">Enter your <b>username or email</b> to receive a password reset link.</p>

                <div className="input-group">
                    <label>Username or Email</label>
                    <input 
                        {...register('username', { required: 'Username or email is required' })}
                        type="text"
                        placeholder="Enter your username or email" 
                        name="username"
                    />
                    {errors.identifier && <p className="error-message">{errors.identifier.message}</p>}
                </div>

                {/* Success Message */}
                {emailMessage && <p className="success-message">{emailMessage}</p>}

                {/* Error Message */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="forgot-password-btn">Send Reset Link</button>

                {/* Links to Login and Register */}
                <div className="auth-links">
                    <p><Link to="/login">Back to Login</Link></p>
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;
