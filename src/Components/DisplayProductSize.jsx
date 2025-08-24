import { useEffect, useState } from "react";
import ProductServices from "../Services/ProductServices";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const DisplayProductSize = ({ productId, onSizeSelect }) => {
    const [productSizes, setProductSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeType, setSizeType] = useState("");

    const fetchProductSizes = async () => {
        try {
            const response = await ProductServices.getProductSizeByProductId(productId);
            const data = response.data;
            setSizeType(data[0]?.type || "undefined");

            const sortedSizes = data.sort((a, b) => a.size - b.size);
            setProductSizes(sortedSizes);

            const defaultSize = sortedSizes.find(s => s.default_selected === 1);
            if (defaultSize) {
                setSelectedSize(defaultSize.size);
                onSizeSelect?.(defaultSize.size, defaultSize.type, defaultSize.id_product_size);
            }
        } catch (error) {
            console.error("Error fetching product sizes:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductSizes();
        }
    }, [productId]);

    const handleClick = (size) => {
        const selected = productSizes.find(p => p.size === size);
        if (selected) {
            setSelectedSize(size);
            onSizeSelect?.(selected.size, selected.type, selected.id_product_size);
        }
    };

    if (sizeType === "unit") return null;

    return (
        <div className="d-flex justify-content-start w-100">
            <ButtonGroup className="w-100 product-size-buttons">
                {productSizes.map((format, index) => (
                    <Button
                        style={{ width: 'auto',}}
                        key={index}
                        variant={selectedSize === format.size ? 'primary' : 'outline-primary'}
                        onClick={() => handleClick(format.size)}
                        className="product-size-button"
                    >
                        {format.type === "weight" && format.size >= 1000
                            ? `${(format.size / 1000)} kg`
                            : format.type === "weight" ? `${format.size} g` : null}
                        {format.type === "volume" && format.size >= 1000
                            ? `${(format.size / 1000)} L`
                            : format.type === "volume" ? `${format.size} mL` : null}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
};

export default DisplayProductSize;
