import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthServices from "../Services/AuthServices";
import { Button, Container } from "react-bootstrap";
import ProductAdminPanel from "../Components/adminPanel/ProductAdminPanel";
import PromocodeAdminPanel from "../Components/adminPanel/PromocodeAdminPanel";
import CategoriesAdminPanel from "../Components/adminPanel/CategoriesAdminPanel";
import InfoMagAdminPanel from "../Components/adminPanel/InfoMagAdminPanel";

const AdminPanelPage = () => {
    const navigate = useNavigate();
    const [blockToDisplay, setBlockToDisplay] = useState("product");

    return <>
        {/* Version Desktop */}
        <div className="d-none d-lg-flex flex-grow-1 w-100" style={{ minHeight: 0 }}>
            <div style={{borderRight: "1px solid #E6E6E6"}} className="d-flex flex-column gap-3 col-2 flex-grow-1 p-3">
                <h2>Bonjour {AuthServices.getUser().first_name} !</h2>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("product")} variant={ blockToDisplay == "product" ? "primary" : "outline-primary"}>Produits</Button>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("category")} variant={ blockToDisplay == "category" ? "primary" : "outline-primary"}>Catégories</Button>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("promocode")} variant={ blockToDisplay == "promocode" ? "primary" : "outline-primary"}>Code Promo</Button>
                <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("infomag")} variant={ blockToDisplay == "infomag" ? "primary" : "outline-primary"}>Messages Topbar</Button>
            </div>
            <div className="col-10 flex-grow-1 p-3">
                {blockToDisplay === "product" ? (
                    <ProductAdminPanel />
                ) : blockToDisplay === "category" ? (
                    <CategoriesAdminPanel />
                ) : blockToDisplay === "promocode" ? (
                    <PromocodeAdminPanel />
                ) : blockToDisplay === "infomag" ? (
                    <InfoMagAdminPanel />
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
                    <option value="product">Produits</option>
                    <option value="category">Catégories</option>
                    <option value="promocode">Code Promo</option>
                    <option value="infomag">Messages Topbar</option>
                </select>
            </Container>
            
            {/* Contenu principal mobile */}
            <Container className="flex-grow-1 pb-4">
                {blockToDisplay === "product" ? (
                    <ProductAdminPanel />
                ) : blockToDisplay === "category" ? (
                    <CategoriesAdminPanel />
                ) : blockToDisplay === "promocode" ? (
                    <PromocodeAdminPanel />
                ) : blockToDisplay === "infomag" ? (
                    <InfoMagAdminPanel />
                ) : (null)}
            </Container>
        </div>
    </>;
}
 
export default AdminPanelPage;