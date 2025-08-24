import { Container } from "react-bootstrap";

const OurValuesPage = () => {

    return <>
        <Container>
            <h1 className="text-center my-4">Nos valeurs</h1>
            <div className="d-flex flex-column gap-3">
                <p><strong>Dernière mise à jour :</strong> 17/06/2025</p>

                <h2>1. Engagement écoresponsable</h2>
                <p>
                    Chez <strong>Anne So Vrac</strong>, nous sommes convaincus que consommer en vrac est un acte fort pour réduire les déchets plastiques et préserver la planète. Nous sélectionnons avec soin des produits respectueux de l’environnement et favorisons les circuits courts.
                </p>

                <h2>2. Qualité et transparence</h2>
                <p>
                    Nous garantissons des produits de qualité, issus de producteurs engagés. La traçabilité et la transparence sont au cœur de notre démarche afin que vous puissiez consommer en toute confiance.
                </p>

                <h2>3. Accessibilité</h2>
                <p>
                    Nous souhaitons rendre le vrac accessible à tous, c’est pourquoi nous proposons des prix justes et un service simple pour réserver et retirer vos produits facilement.
                </p>

                <h2>4. Communauté et partage</h2>
                <p>
                    Anne So Vrac est aussi un lieu d’échange où nos clients, producteurs et collaborateurs partagent leurs expériences et leurs bonnes pratiques pour un mode de vie plus durable.
                </p>
            </div>
        </Container>

    </>;
}

export default OurValuesPage;