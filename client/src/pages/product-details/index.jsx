import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../short/useFetch";
import "./style.css";
import { ShopingCartContext } from "../../context";

function ProductDetails() {
    const { id } = useParams();
    const { data, loading, error } = useFetch(`https://dummyjson.com/products/${id}`);
    const [selectedImage, setSelectedImage] = useState(null);
    const [randomIDs, setRandomIDs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    const {addToCart} = useContext(ShopingCartContext);

    useEffect(() => {
        function getRandomNumbers(count, min, max, exclude) {
            const numbers = new Set();
            while (numbers.size < count) {
                let rand = Math.floor(Math.random() * (max - min + 1)) + min;
                if (rand !== exclude) numbers.add(rand);
            }
            return [...numbers];
        }

        const generatedIDs = getRandomNumbers(4, 1, 30, parseInt(id)); // Get 4 random products excluding current
        setRandomIDs(generatedIDs);
    }, [id]);

    useEffect(() => {
        async function fetchRecommendations() {
            if (randomIDs.length === 4) {
                const promises = randomIDs.map((rid) =>
                    fetch(`https://dummyjson.com/products/${rid}`).then((res) => res.json())
                );
                const results = await Promise.all(promises);
                setRecommendations(results);
            }
        }

        fetchRecommendations();
    }, [randomIDs]);

    if (loading) return <h3 className="loading">Loading Product...</h3>;
    if (error) return <h3 className="error">Error: {error}</h3>;

    function handleClick(productId) {
        navigate(`/product-details/${productId}`);
    }
    
    

    return (
        <>  
            <button className="back" onClick={()=> navigate(-1)}></button>
            <div className="productDetails">
                {/* Left Side: Image Gallery */}
                <div className="imageGallery">
                    <img
                        src={selectedImage || data?.images?.[0]}
                        alt={data?.title}
                        className="mainImage"
                    />
                    <div className="thumbnailContainer">
                        {data?.images?.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={data?.title}
                                className={`thumbnail ${selectedImage === image ? "active" : ""}`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Information */}
                <div className="productInfo">
                    <h3>{data?.title}</h3>
                    <p className="price">Price: ${data?.price}</p>
                    <button onClick={()=>addToCart(data)}>Add to Cart</button>

                    <div className="productSpecs">
                        <h4>Details</h4>
                        <ul>
                            {data?.warrantyInformation && <li><strong>Warranty:</strong> {data?.warrantyInformation}</li>}
                            {data?.dimensions && (
                                <>
                                    <li><strong>Width:</strong> {data?.dimensions?.width}</li>
                                    <li><strong>Height:</strong> {data?.dimensions?.height}</li>
                                    <li><strong>Depth:</strong> {data?.dimensions?.depth}</li>
                                </>
                            )}
                            {data?.weight && <li><strong>Weight:</strong> {data?.weight}</li>}
                        </ul>
                    </div>

                    {data?.returnPolicy && <p className="returnPolicy">{data?.returnPolicy}</p>}
                </div>
            </div>

            {/* 🔥 Recommendations Section BEFORE Reviews */}
            <div className="recommendation">
                <h3>Recommended Products</h3>
                <div className="recommendation-container">
                    {recommendations.length > 0 ? (
                        recommendations.map((product) => (
                            <div key={product.id} onClick={() => handleClick(product.id)} className="recommendation-card">
                                <img src={product.thumbnail} alt={product.title} />
                                <p>{product.title}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading recommendations...</p>
                    )}
                </div>
            </div>

            {/* 📝 Reviews Section */}
            <div className="reviewsSection">
                <h2>Customer Reviews</h2>
                {data?.reviews?.length ? (
                    data.reviews.map((review, index) => (
                        <div key={index} className="reviewCard">
                            <h3 className="reviewerName">{review.reviewerName}</h3>
                            <p className="rating">⭐ {review.rating}/5</p>
                            <p className="comment">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="noReviews">No reviews yet.</p>
                )}
            </div>
        </>
    );
}

export default ProductDetails;
