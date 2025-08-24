import { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const ImageUploader = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_URL_API;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Aucun fichier sélectionné.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await axios.post(`${apiUrl}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Image envoyée avec succès !");
            onUploadSuccess?.(res.data.path); // Optionnel : notifie le parent
        } catch (err) {
            setMessage("Erreur lors de l'envoi de l'image.");
            console.error(err);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center" style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="preview" style={{ width: "200px", marginTop: 10 }} />}
            <Button onClick={handleUpload} style={{ marginTop: 10 }}>
                Envoyer
            </Button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ImageUploader;
