import { Container } from "react-bootstrap";

const PrivacyPolicyPage = () => {
    return (
        <Container>
            <h1 className="text-center my-4">Politique de Confidentialité</h1>
            <div className="d-flex flex-column gap-3">
                <p><strong>Dernière mise à jour :</strong> 23/05/2025</p>

                <h2>1. Données collectées</h2>
                <p>
                    Lors de l’utilisation du site, les données suivantes peuvent être collectées :
                </p>
                <ul>
                    <li>Nom, prénom</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse e-mail</li>
                    <li>Historique de réservation</li>
                </ul>

                <h2>2. Finalité de la collecte</h2>
                <p>
                    Les données sont collectées pour :
                </p>
                <ul>
                    <li>Assurer la gestion des réservations</li>
                    <li>Confirmer les commandes par SMS ou e-mail</li>
                    <li>Répondre aux demandes via le formulaire de contact</li>
                </ul>

                <h2>3. Stockage et sécurité</h2>
                <p>
                    Les données sont stockées de manière sécurisée et ne sont accessibles qu’aux personnes autorisées au sein de l’entreprise.
                </p>

                <h2>4. Durée de conservation</h2>
                <p>
                    Les données sont conservées pendant une durée maximale de 3 ans après la dernière interaction avec le client.
                </p>

                <h2>5. Droits du client</h2>
                <p>
                    Conformément à la loi Informatique et Libertés et au RGPD, le client peut à tout moment :
                </p>
                <ul>
                    <li>accéder à ses données,</li>
                    <li>demander leur rectification ou leur suppression,</li>
                    <li>s’opposer à leur traitement.</li>
                </ul>
                <p>
                    Pour exercer ce droit, une demande peut être envoyée à : <a href="mailto:contact@annesovrac.fr">contact@annesovrac.fr</a>
                </p>
            </div>

        </Container>
    );
}

export default PrivacyPolicyPage;