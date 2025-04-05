import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdatePassword() {
    const { register, handleSubmit, watch } = useForm();
    const { username } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const onSubmit = (data) => {
        setError(""); // Reset error before request
        setMessage(""); // Reset message before request

        axios.put(`https://luxury-x.vercel.app/user/updatePassword/${username}`, {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
            setMessage(res.data.message); // Set success message
            setTimeout(() => navigate("/"), 5000); // Redirect after 5s
        })
        .catch((err) => {
            setError(err.response?.data?.error || "Something went wrong.");
        });
    };

    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");

    const validatePasswords = () => {
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            setError("Passwords do not match!");
        } else {
            setError("");
        }
    };

    return (
        <div className="update-password-container">
            <h2 className="update-password-title">Update Password</h2>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message} Redirecting...</p>}

            <form className="update-password-form" onSubmit={handleSubmit(onSubmit)}>
                <label>Old Password:</label>
                <input type="password" className="input-field" {...register("oldPassword", { required: true })} placeholder="Enter old password" />

                <label>New Password:</label>
                <input type="password" className="input-field" {...register("newPassword", { required: true })} placeholder="Enter new password" onChange={validatePasswords} />

                <label>Confirm New Password:</label>
                <input type="password" className="input-field" {...register("confirmPassword", { required: true })} placeholder="Confirm new password" onChange={validatePasswords} />

                <button className="update-button" type="submit" disabled={!!error}>
                    Update Password
                </button>
            </form>
        </div>
    );
}

export default UpdatePassword;
