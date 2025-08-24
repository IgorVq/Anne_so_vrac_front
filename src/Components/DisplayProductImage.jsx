import { useEffect, useState } from "react";
import ProductServices from "../Services/ProductServices";
import { Image } from "react-bootstrap";
import './styles/DisplayProductImage.css';

const DisplayProductImage = ({ productId }) => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const apiUrl = import.meta.env.VITE_URL_API;

    const fetchProductImage = async () => {
        try {
            const response = await ProductServices.getImageByProductId(productId);
            setImages(response.data);
            setSelectedImage(response.data[0]);
        } catch (error) {
            console.error("Error fetching product image:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductImage();
        }
    }, [productId]);

    return (
        <div className="product-image-container">
            <div className="thumbnail-column">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${selectedImage?.id_image === img.id_image ? "active" : ""}`}
                        onClick={() => setSelectedImage(img)}
                    >
                        <Image fluid src={apiUrl + img.image_url} alt={`Miniature ${index + 1}`} />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="main-image">
                    <img src={apiUrl + selectedImage.image_url} alt={selectedImage.image_url} />
                </div>
            )}
        </div>
    );
};

export default DisplayProductImage;
