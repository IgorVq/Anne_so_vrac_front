import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FaPlus, FaMinus, FaLeaf, FaFlask, FaExclamationTriangle } from "react-icons/fa";

const ProductInfoDropdown = ({ productInfo }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  // Helper pour savoir si une section a du contenu non vide
  const isNotEmpty = (str) => str && str.trim().length > 0;

  const sections = [
    {
      id: "composition",
      title: "Composition",
      icon: <FaFlask className="text-success me-2" />,
      content: productInfo?.composition
    },
    {
      id: "additive",
      title: "Additifs naturels & conservateurs",
      icon: <FaLeaf className="text-success me-2" />,
      content: productInfo?.additive
    },
    {
      id: "allergen",
      title: "Allergènes",
      icon: <FaExclamationTriangle className="text-warning me-2" />,
      content: productInfo?.allergen
    }
  ];

  // Filtrer les sections qui ont du contenu à afficher
  const validSections = sections.filter(section => isNotEmpty(section.content));

  // Si aucune section valide, ne rien afficher
  if (validSections.length === 0) {
    return null;
  }

  return (
    <div className="border-top">
      {validSections.map(section => (
        <div key={section.id} className="border-bottom">
          <div
            className="d-flex justify-content-between align-items-center py-2 px-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggle(section.id)}
          >
            <div className="d-flex align-items-center fw-semibold">
              {section.icon}
              {section.title}
            </div>
            <div className="text-muted">
              {openId === section.id ? <FaMinus /> : <FaPlus />}
            </div>
          </div>
          <Collapse in={openId === section.id}>
            <div className="px-4 pb-3 text-secondary small">
              {section.content}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default ProductInfoDropdown;
