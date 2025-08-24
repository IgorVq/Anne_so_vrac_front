import { Container } from "react-bootstrap";

const TermsOfUsePage = () => {
    return (
        <Container>
            <h1 className="text-center my-4">Conditions d'utilisation</h1>
            <div className="d-flex flex-column gap-3">
                <p><strong>Dernière mise à jour :</strong> 23/05/2025</p>

                <h2>1. Objet</h2>
                <p>
                    Les présentes CGU régissent l’accès et l’utilisation du site <strong>anne-so-vrac.fr</strong>, par tout utilisateur souhaitant consulter les produits ou effectuer une réservation.
                </p>

                <h2>2. Accès au site</h2>
                <p>
                    Le site est accessible gratuitement à tout utilisateur disposant d’un accès Internet.<br />
                    L’entreprise se réserve le droit d’interrompre temporairement ou définitivement l’accès au site pour maintenance ou mise à jour.
                </p>

                <h2>3. Compte client</h2>
                <p>
                    Certaines fonctionnalités (réservation) nécessitent la création d’un compte client avec un numéro de téléphone valide.<br />
                    Le client est responsable de la confidentialité de ses informations de connexion.
                </p>

                <h2>4. Comportement des utilisateurs</h2>
                <p>
                    Tout usage abusif ou frauduleux du site pourra entraîner la suspension du compte utilisateur sans préavis.
                </p>

                <h2>5. Propriété intellectuelle</h2>
                <p>
                    Le contenu du site est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction ou usage non autorisé est interdit.
                </p>

                <h2>6. Données personnelles</h2>
                <p>
                    Les données collectées (nom, téléphone, e-mail) sont utilisées uniquement pour assurer la réservation et la communication avec le client.
                </p>
            </div>

        </Container>
    );
}

export default TermsOfUsePage;
