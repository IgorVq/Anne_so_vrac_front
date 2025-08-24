import { Container } from "react-bootstrap";

const FaqPage = () => {
    return <>
    <Container>
    <h1 className="text-center my-4">Foire aux questions (FAQ)</h1>
    <div className="d-flex flex-column gap-3">
        <p><strong>Dernière mise à jour :</strong> 17/06/2025</p>

        <h2>1. Comment fonctionne la réservation ?</h2>
        <p>
            Vous réservez vos produits en ligne sur le site <strong>anne-so-vrac.fr</strong>, puis vous sélectionnez un créneau pour venir les retirer en boutique. Aucun paiement n’est effectué en ligne.
        </p>

        <h2>2. Dois-je créer un compte pour réserver ?</h2>
        <p>
            Oui, un compte client est nécessaire pour réserver. Cela permet notamment de recevoir le code de validation par SMS et de suivre vos commandes.
        </p>

        <h2>3. Combien de temps ma réservation est-elle valable ?</h2>
        <p>
            Les produits sont réservés pour une durée maximale de 48 heures à partir du créneau sélectionné. Passé ce délai, la commande pourra être annulée.
        </p>

        <h2>4. Puis-je modifier ou annuler une réservation ?</h2>
        <p>
            Une fois validée, la réservation ne peut pas être modifiée depuis le site. Pour toute demande, veuillez contacter directement la boutique.
        </p>

        <h2>5. Quels types de produits sont disponibles ?</h2>
        <p>
            Nous proposons des produits alimentaires en vrac, des produits d’hygiène, d’entretien, et des contenants réutilisables, tous sélectionnés dans une démarche écoresponsable.
        </p>

        <h2>6. Que se passe-t-il si je ne viens pas chercher ma commande ?</h2>
        <p>
            En cas de non-retrait dans le délai imparti, la commande sera annulée. L’entreprise se réserve le droit de refuser des réservations futures dans ce cas.
        </p>

        <h2>7. Où se situe la boutique ?</h2>
        <p>
            L’adresse exacte de la boutique sera indiquée prochainement sur le site. Restez connectés pour ne pas rater l’ouverture !
        </p>
    </div>
</Container>

    </>;
}
 
export default FaqPage;