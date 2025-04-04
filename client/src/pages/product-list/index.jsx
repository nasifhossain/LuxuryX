import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { ShopingCartContext } from "../../context";
import Navbar from "../../navbar";

function ProductList() {
    const navigate = useNavigate();
    const { addToCart } = useContext(ShopingCartContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("https://dummyjson.com/products", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item, false);
        setCartMessage(`${item.title} added to cart!`);

        setTimeout(() => {
            setCartMessage(null);
        }, 2000);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) return <h3 className="loading">Loading Products...</h3>;
    if (error) return <h3 className="error">Error: {error}</h3>;

    return (
        <div>
            <Navbar />
            <div className="head">
                <h1 className="title" id="title">Product List</h1>
            </div>

            {cartMessage && <div className="cart-message">{cartMessage}</div>}

            <div className="productContainer">
                {data?.products?.length > 0 ? (
                    data.products.map((item) => (
                        <div key={item.id} className="productCard">
                            <img
                                onClick={() => navigate(`/product-details/${item.id}`)}
                                src={item.thumbnail}
                                alt={item.title}
                            />
                            <label className="productTitle">{item.title}</label>
                            <label>${item.price}</label>
                            <button onClick={() => handleAddToCart(item)}>Add To Cart</button>
                        </div>
                    ))
                ) : (
                    <p className="noProducts">No products available</p>
                )}
            </div>
        </div>
    );
}

export default ProductList;
