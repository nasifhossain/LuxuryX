import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

function ResetPassword() {
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const { id, token } = useParams();
    const navigate = useNavigate();
    
    const { 
        register, 
        handleSubmit, 
        watch, 
        setValue, 
        formState: { errors } 
    } = useForm({ mode: "onChange" });

    const password = watch("password", ""); 
    const confirmPassword = watch("confirmPassword", ""); 

    useEffect(() => {
        axios.get(`https://luxury-x.vercel.app/user/reset-password/${id}/${token}`)
            .then(res => {
                console.log(res.data.message);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage('❌ Invalid or Expired Link');
            });
    }, [id, token]);

    useEffect(() => {
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            setPasswordMatchError("⚠️ Passwords do not match");
        } else {
            setPasswordMatchError("");
        }
    }, [password, confirmPassword]);

    const onSubmit = async (data) => {
        if (passwordMatchError) return; 

        axios.put(`https://luxury-x.vercel.app/user/reset-password/${id}/${token}`,{
            password: data.password
        }).then(res => {
            alert("✅ Password Reset Successful!");
            navigate("/login"); 
        }).catch(err => {
            setErrorMessage("❌ Failed to reset password. Please try again.");
        });
    };

    if (errorMessage === '❌ Invalid or Expired Link') {
        return (
            <div className="error-page">
                <h1>404 - Error</h1>
                <p className="error-text">{errorMessage}</p>
                <a href="/login" className="back-link">Go to Login Page</a>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Reset Your Password</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <div className="input-group">
                    <label>New Password</label>
                    <input 
                        type="password"
                        {...register('password', {
                            required: '⚠️ Password is required',
                            minLength: { value: 8, message: '⚠️ Minimum 8 characters required' }
                        })}
                        onChange={(e) => setValue("password", e.target.value)} 
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input 
                        type="password"
                        {...register('confirmPassword', { 
                            required: '⚠️ Confirm Password is required', 
                            minLength: { value: 8, message: '⚠️ Minimum 8 characters required' }
                        })} 
                        onChange={(e) => setValue("confirmPassword", e.target.value)}
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                </div>

                <button type="submit" className="reset-password-btn" disabled={!!passwordMatchError}>Submit</button>
            </form>
        </div>
    );
}

export default ResetPassword;
