import { useState } from "react";
import AuthServices from "../Services/AuthServices";
import { Button, Container } from "react-bootstrap";
import TodoOrderPanel from "../Components/orderPanel/TodoOrderPanel";
import PickedupOrderPanel from "../Components/orderPanel/PickedupOrderPanel";
import ToPickupOrderPanel from "../Components/orderPanel/ToPickupOrderPanel";

const OrderPanelPage = () => {
    const [blockToDisplay, setBlockToDisplay] = useState("todo");

    return <>
        {/* Version Desktop */}
        <div className="d-none d-lg-flex flex-grow-1 w-100" style={{ minHeight: 0 }}>
            <div style={{borderRight: "1px solid #E6E6E6"}} className="d-flex flex-column gap-3 col-3 flex-grow-1 p-3">
                <h2>Bonjour {AuthServices.getUser().first_name} !</h2>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("todo")} variant={ blockToDisplay == "todo" ? "primary" : "outline-primary"}>Todo</Button>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("toPickUp")} variant={ blockToDisplay == "toPickUp" ? "primary" : "outline-primary"}>À récupérer</Button>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("pickedUp")} variant={ blockToDisplay == "pickedUp" ? "primary" : "outline-primary"}>Récupéré</Button>
            </div>
            <div className="col-9 flex-grow-1 p-3">
                {blockToDisplay === "todo" ? (
                    <TodoOrderPanel />
                ) : blockToDisplay === "toPickUp" ? (
                    <ToPickupOrderPanel />
                ) : blockToDisplay === "pickedUp" ? (
                    <PickedupOrderPanel />
                ) : (null)}
            </div>
        </div>

        {/* Version Mobile */}
        <div className="d-flex d-lg-none flex-column flex-grow-1 w-100">
            <Container className="py-3">
                <h2 className="mb-3">Bonjour {AuthServices.getUser().first_name} !</h2>
                
                {/* Select pour la navigation mobile */}
                <select 
                    className="form-select mb-3"
                    value={blockToDisplay}
                    onChange={(e) => setBlockToDisplay(e.target.value)}
                >
                    <option value="todo">Todo</option>
                    <option value="toPickUp">À récupérer</option>
                    <option value="pickedUp">Récupéré</option>
                </select>
            </Container>
            
            {/* Contenu principal mobile */}
            <Container className="flex-grow-1 pb-4">
                {blockToDisplay === "todo" ? (
                    <TodoOrderPanel />
                ) : blockToDisplay === "toPickUp" ? (
                    <ToPickupOrderPanel />
                ) : blockToDisplay === "pickedUp" ? (
                    <PickedupOrderPanel />
                ) : (null)}
            </Container>
        </div>
    </>;
}

export default OrderPanelPage;