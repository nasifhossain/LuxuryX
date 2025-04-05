import { useState } from "react";
import './navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();
    const loginStatus = localStorage.getItem('username');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-logo">LuxuryX</div>
                <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <Link to="/product-list">Products</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>

            <div className={`auth-buttons ${menuOpen ? 'active' : ''}`}>
                {loginStatus ? (
                    <div
                        className="user-dropdown"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button className="btn user-btn">
                            {loginStatus} ▼
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to={`/myAccount/${loginStatus}`} className="dropdown-item">My Account</Link>
                                <Link to="/orders" className="dropdown-item">My Orders</Link>
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="btn login-btn">Login</Link>
                )}

                <button className="cart-btn" onClick={() => navigate('/cart')}>
                    <FaShoppingCart size={18} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;
