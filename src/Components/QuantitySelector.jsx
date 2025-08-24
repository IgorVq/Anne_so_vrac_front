import React from "react";
import "./styles/QuantitySelector.css";
import { Button, ButtonGroup, Form } from "react-bootstrap";


const QuantitySelector = ({ quantity, setQuantity, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (quantity > min) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) setQuantity(quantity + 1);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  return (
    <ButtonGroup className="d-flex" style={{ width: "fit-content", height: "50px" }}>
      <Button
        type="button"
        variant="primary"
        onClick={handleDecrement}
      >
        -
      </Button>
      <Form.Control
      id="quantity-input"
        className="d-block text-center"
        style={{ borderRadius: "0", borderTop: "1px solid black", borderBottom: "1px solid black", minWidth: "50px", width: "50px" }}
        type="number"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
      />
      <Button
        type="button"
        variant="primary"
        onClick={handleIncrement}
      >
        +
      </Button>
    </ButtonGroup>
  );
};

export default QuantitySelector;