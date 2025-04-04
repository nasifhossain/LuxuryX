import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./style.css";  // Importing the CSS file

function MyAccount() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm(); // Form handling

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [redirectMessage, setRedirectMessage] = useState(""); // New state for redirection message

    const onSubmit = (data) => {
        setError("");
        setMessage("");
        setRedirectMessage("");

        axios.put(`http://localhost:3000/user/${username}`, {
            email: data.email,
            phone: data.phone,
            name: data.name,
            password: data.password, // Send password for verification
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((res) => {
            setMessage("Account updated successfully!");
            console.log(res);

            // Set redirection message
            setRedirectMessage("Redirecting to homepage in 5 seconds...");

            // Redirect to homepage after 5 seconds
            setTimeout(() => {
                navigate("/");
            }, 5000);
        })
        .catch((err) => {
            setError(err.response?.data?.error || "Something went wrong");
            console.log(err);
        });
    };

    useEffect(() => {
        if (username !== localStorage.getItem("username")) {
            navigate("/login");
            return;
        }

        // Fetch user details
        axios.get(`http://localhost:3000/user/${username}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            const userData = res.data.details;
            // Prefill form fields with fetched data
            Object.keys(userData).forEach((key) => setValue(key, userData[key]));
        })
        .catch((err) => {
            setError(err.response?.data?.error || "Something went wrong");
            console.log(err);
        });

    }, [username, navigate, setValue]);

    if (username !== localStorage.getItem("username")) {
        return null; // Prevents flickering before navigation
    }

    return (
        <div className="account-container">
            <h1 className="account-title">My Account</h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            {redirectMessage && <p className="redirect-message">{redirectMessage}</p>} {/* Redirection message */}
            
            <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
                <label>Name:</label>
                <input className="input-field" {...register("name")} placeholder="Name" required />

                <label>Username:</label>
                <input className="input-field" {...register("username")} placeholder="Username" disabled />

                <label>Email:</label>
                <input className="input-field" {...register("email")} placeholder="Email" required />

                <label>Phone:</label>
                <input className="input-field" {...register("phone")} placeholder="Phone" required />

                <label>Password (Required for Update):</label>
                <input className="input-field" type="password" {...register("password")} placeholder="Enter Password" required />

                <label>User Type:</label>
                <input className="input-field" {...register("userType")} placeholder="User Type" disabled />

                <button className="update-button" type="submit">Update Account</button>
            </form>

            {/* New Update Password Button */}
            <button 
                className="update-password-button" 
                onClick={() => navigate(`/updatePassword/${username}`)}
            >
                Update Password
            </button>
        </div>
    );
}

export default MyAccount;
