import { Container } from "react-bootstrap";

const TermsOfSalePage = () => {
    return <>
        <Container>
            <h1 className="text-center my-4">Conditions génerales de ventes</h1>
            <div className="d-flex flex-column gap-3">
                <p><strong>Dernière mise à jour :</strong> 23/05/2025</p>

                <h2>1. Informations sur l’entreprise</h2>
                <p>
                    Le site <strong>Anne So Vrac</strong> est édité par une entreprise de vente de produits en vrac et éco-responsables, proposant un service de réservation en ligne de produits à retirer en boutique (click & collect).<br />
                    Les coordonnées complètes seront précisées ultérieurement.
                </p>

                <h2>2. Objet</h2>
                <p>
                    Les présentes Conditions Générales de Vente définissent les modalités de réservation de produits via le site <strong>anne-so-vrac.fr</strong>, ainsi que les conditions de retrait et les engagements respectifs du client et du vendeur.
                </p>

                <h2>3. Réservation et retrait</h2>
                <p>
                    Les réservations s’effectuent via le site, sans paiement en ligne. Le client choisit un créneau de retrait en boutique.<br />
                    Toute réservation est considérée comme ferme après validation par code SMS.<br />
                    Les produits sont réservés pendant une durée de 48 heures maximum à partir du créneau sélectionné.
                </p>

                <h2>4. Non-retrait des commandes</h2>
                <p>
                    En cas de non-retrait dans le délai imparti, la commande pourra être annulée sans préavis.<br />
                    L’entreprise se réserve le droit de refuser les commandes futures d’un client n’ayant pas honoré une ou plusieurs réservations.
                </p>

                <h2>5. Produits</h2>
                <p>
                    Les produits proposés sont issus du catalogue visible sur le site au moment de la réservation.<br />
                    Ils sont disponibles dans la limite des stocks et des spécificités de chaque produit (poids, contenant, etc.).
                </p>

                <h2>6. Responsabilité</h2>
                <p>
                    L’entreprise ne saurait être tenue responsable des erreurs de réservation liées à une mauvaise saisie par le client ou à un usage frauduleux du service.
                </p>

                <h2>7. Loi applicable</h2>
                <p>
                    Les présentes CGV sont régies par le droit français.
                </p>
            </div>

        </Container>
    </>;
}

export default TermsOfSalePage;