import { Container } from "react-bootstrap";

const LegalNoticePage = () => {
    return <>
        <Container>
            <h1 className="text-center my-4">Mentions Légales</h1>
            <div className="d-flex flex-column gap-3">
                <p><strong>Dernière mise à jour :</strong> [JJ/MM/AAAA]</p>

                <h2>1. Éditeur du site</h2>
                <p>
                    Le site <strong>annesovrac.fr</strong> est édité par :<br />
                    Raison sociale : <strong>[Nom de l’entreprise ou nom du particulier]</strong><br />
                    Statut juridique : <strong>[Auto-entrepreneur / SAS / SARL / etc.]</strong><br />
                    Adresse : <strong>[Adresse complète de l’entreprise]</strong><br />
                    Téléphone : <strong>[Numéro de téléphone]</strong><br />
                    E-mail : <a href="mailto:[adresse@email.fr]">[adresse@email.fr]</a><br />
                    Numéro SIRET : <strong>[Numéro SIRET]</strong><br />
                    Directeur de la publication : <strong>[Nom du responsable]</strong>
                </p>

                <h2>2. Hébergeur</h2>
                <p>
                    Le site est hébergé par :<br />
                    Nom : <strong>[Nom de l’hébergeur]</strong><br />
                    Adresse : <strong>[Adresse de l’hébergeur]</strong><br />
                    Site : <a href="[https://site-hebergeur.fr]">[https://site-hebergeur.fr]</a><br />
                    Téléphone : <strong>[Numéro de l’hébergeur]</strong>
                </p>

                <h2>3. Propriété intellectuelle</h2>
                <p>
                    L’ensemble des éléments présents sur le site (textes, images, logos, vidéos, etc.) sont la propriété exclusive de <strong>[Nom de l’entreprise ou de l’auteur]</strong>, sauf mention contraire, et sont protégés par le droit d’auteur et la législation applicable.
                </p>

                <h2>4. Responsabilité</h2>
                <p>
                    L’éditeur s’efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour.
                </p>

                <h2>5. Données personnelles</h2>
                <p>
                    Pour plus d’informations sur la gestion des données personnelles, veuillez consulter notre <a href="/privacy-policy.html">Politique de Confidentialité</a>.
                </p>

                <h2>6. Cookies</h2>
                <p>
                    Ce site utilise des cookies. Pour en savoir plus ou modifier vos préférences, consultez notre <a href="/cookie-policy.html">Politique de Cookies</a>.
                </p>

                <h2>7. Droit applicable</h2>
                <p>
                    Le site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
            </div>
        </Container>

    </>;
}

export default LegalNoticePage;