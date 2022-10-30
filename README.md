#### TP1 & TP2

Le répertoire users contient l'ensemble de la partie Spring Boot.

Nous avons réalisé l'ensemble des endpoints demandées avec la négociation de contenus et la gestion des erreurs. Nous avons également réalisé un script de déploiement dans notre VM.

Nous avons généré une documentation de notre API disponible [sur la VM](http://192.168.75.46:8080/users/swagger-ui/index.html#/) à l'aide d'annotations OpenAPI. Le fichier [users-api.yaml](users-api.yaml) contient la documentation OpenApi de notre API.

Nous avons également réalisé des tests Junit testant l'ensemble des requetes de notre API. Il est également possible de tester notre API via Le fichier [collectionPostman.json](collectionPostman.json) contenant une collection Postman.

Enfin, nous avons également mis en place le CORS.

L'adresse IP de notre API déployée sur la VM est la suivante : [192.168.75.46:8080/users](http://192.168.75.46:8080/users)

#### TP3 & TP4

Côté serveur :  
- /api pour la partie publique

- /admin pour la partie confidentielle

- /static pour les contenus statiques (dossier public directement accessible sur la route /static.)

Développement d'une api pour gérer les ressources : [http://192.168.75.46:3376/api/resources](http://192.168.75.46:3376/api/resources) (avec l'ensemble des requêtes demandées)
voici le lien de la collection postman : [collectionPostmanApiResources.json](collectionPostmanApiResources.json)

Ainsi qu'une autre api pour l'administration : [http://192.168.75.46:3376/admin](http://192.168.75.46:3376/admin)
voici le lien de la collection postman : [collectionPostmanAdmin.json](collectionPostmanAdmin.json)

Enfin, l'interface d'administration est disponible à l'url suivante : [http://192.168.75.46:3376](http://192.168.75.46:3376)

Configuration du serveur nginx en HTTPS.

Configuration du serveur nginx en reverse proxy. Déploiement de la partie serveur de notre projet sur une route /game.

Fonctionnement du client d'administration opérationnel.

Réalisation de webpack, mais ne fonctionne pas correctement. Deploiement fonctionnel via Express sur la VM.

Test : L'API pour gérer les ressources et l'API pour l'administration ont été tester avec Jasmine et Supertest.
Les tests se trouvent dans les fichiers resources.spec.js et admin.spec.js à l'emplacement ./api/test/ .
Pour lancer les tests il suffit de lancer la commande ```npm test```dans le dossier /api.

Ophélie a intégré le groupe le 4 avril. 

### TP5 
Toutes les fonctionnalités suivante ont été réalisées : 

- Sur la carte, faites apparaître les limites de la ZRR (autour du Nautibus) et remplacez le marker par l'icone du joueur. Stockez l'ensemble de ces données (limite de la ZRR, coordonnées et URL de l'icone du joueur dans un objet JSON constant).

- Utilisez l'API Web storage pour mémoriser ces informations, ainsi que le token renvoyé par le serveur Spring.

- Faites comme si les coordonnées du joueur étaient variables, et renvoyez-les au serveur Express toutes les 5 secondes.

- Récupérez la réponse du serveur avec éventuellement, la position d'un coffre et le TTL du joueur. Affichez ce coffre sur la carte et le TTL quelque part sur l'écran.

- Lorsque le TTL est expiré ou lorsque le joueur a rejoint un coffre (à moins de 2m), faites en sorte que l'affichage affiche un nouveau composant textuel par-dessus la carte, avec les informations correspondantes.

Nous avons une page pour le Jeu, qui où l'on retrouve la carte, le TTL et la distance au coffre le plus proche.
De plus nous avons une page Profil, où l'on peut mettre à jour la photo du joueur.

### TP6 
Nous avons implémenté le store et nous avons modifier notre application en fonction de ce store.

Nous avons réalisé toutes les fonctions demandés.

### TP7 
Le vibreur ne fonctionne pas sur IOS et nous avons tout les trois des IPhone nous n'avons donc pas pu tester cette fonctionnalité, mais elle devrait fonctionner sur Android.

Nous avons réalisé toutes les fonctions demandés.

### TP8 
Nous avons un manifest qui est généré et proprement défini. 
L'installation du PWA fonctionne en localhost. 

Notre application fonctionne en HTTPS mais les certificats ne sont pas valide, même après l'ajout du certifcat racine, ainsi l'installation du PWA ne fonctionne pas sur notre VM.




