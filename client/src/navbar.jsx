import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const loginStatus = localStorage.getItem("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 right-0  w-full  bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-md px-2">
      <div className="flex flex-row justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-400">LuxuryX</div>

        {/* Hamburger Icon */}
        <button
          className="text-yellow-400 text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-yellow-400 font-semibold">
          <Link to="/product-list" className="hover:text-yellow-300">
            Products
          </Link>
          <Link to="/about" className="hover:text-yellow-300">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-300">
            Contact
          </Link>
        </nav>

        {/* Auth & Cart */}
        <div className="hidden md:flex items-center gap-4">
          {loginStatus ? (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="text-yellow-400 border border-yellow-400 px-3 py-1 rounded hover:bg-yellow-400 hover:text-black transition">
                {loginStatus} ▼
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-neutral-800 border border-yellow-400 rounded shadow-lg flex flex-col">
                  <Link
                    to={`/myAccount/${loginStatus}`}
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-black"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-black"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-red-600 hover:text-white text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-yellow-400 border border-yellow-400 px-3 py-1 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="text-yellow-400 border border-yellow-400 p-2 rounded hover:bg-yellow-400 hover:text-black transition"
          >
            <FaShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="flex flex-col md:hidden px-6 pb-4 gap-4 text-yellow-400 font-semibold bg-[rgba(20,20,20,0.95)] backdrop-blur-md">
          <Link
            to="/product-list"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            Contact
          </Link>

          {loginStatus ? (
            <div className="flex flex-col gap-1">
              <Link
                to={`/myAccount/${loginStatus}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-300"
              >
                My Account
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-300"
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="hover:text-red-500 text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-300"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/cart");
            }}
            className="text-yellow-400 border border-yellow-400 p-2 rounded hover:bg-yellow-400 hover:text-black transition w-max"
          >
            <FaShoppingCart size={20} />
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
