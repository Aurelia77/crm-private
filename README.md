Projet fait par : Aurélia HEYMANN en 2 mois, pour une amie auto-entrepreneuse.

Outils utilisés : Next JS + MUI + GIT

Description du projet :

=> Application de gestion de contacts :
-Liste de contacts triable avec recherche.
-Double clic sur le logo => ouverture de la vue d'un contact.
-Les données sont modifiables dans le tableau et dans la vue d'un contact.
-Ajout d'un contact (avec ou sans recherche INSEE)
-Calendrier avec les dates de relance => modifiables.
-Admin avec gestion des catégories et des fichiers qui pourront être associés aux contacts.

Voir onglet AIDE !

(pas de tests car difficultés à cause du contexte de MUI)


Message pour Mike (idem au mail du 03/01/2024) :

Après avoir revu le cours (React Mastory) 2 fois, avoir fait un projet en équipe qui n'a pas abouti et passé 2 mois sur un projet perso, je suis prête à te le présenter.

C'est donc une appli pour gérer ses contacts professionnels.
J'ai terminé et lorsqu'il n'y a que quelques contacts ça fonctionne (explication dans le READ ME et onglet AIDE de l'appli).

Mais je l'ai fait pour une amie qui a 200 contacts, et quand je les intègre, ça rame énormément ! (à partir de 25 contacts environ...)

J'ai recherché comment optimiser les performances, sur DevTool Profiler.
Puis j'ai vu qu'on pouvait virtualiser les tableaux, en faisant charger seulement les composants visibles.

Mais ce n'est pas fluide et les contacts se rechargent lors du scroll même s'ils ont déjà été chargés !
Aussi lors du moindre changement sur un contact, toute la liste se recharge (ce qui est normal mais je ne sais pas comment mémoïser chaque ligne de contact pour ne pas que toutes se rechargent quand seulement une est modifiée).

Là ça fait 2 semaines que je suis dessus car je voulais vraiment que ce soit utilisable par mon amie mais j'abandonne. Je te le présente en espérant que tu pourras m'aider sur ce problème de ralentissement...


Comme j'ai pris l'option mentoring je pense que tu vas me donner beaucoup de conseils et j'ai hâte d'avoir ton avis. J'en ai besoin pour avoir plus confiance en moi et enfin me lancer. Je te remercie d'avance ! 🙂

Aussi, j'ai essayé de faire des tests mais avec le contexte MUI je n'ai pas réussi. Peut-être as tu un conseil...
Je vais en faire pour mes autres projets faits sans MUI.

Tu verras que les 3 derniers onglets sont en rouge car ce sont des tests de virtualisation avec react-windows et react-virtualized.

Je t'explique tout ici :

Les listes de contacts sont toutes mémoïsées + enlevées de Tabs (qui fait un rerender à chaque fois) => donc pas de rerender quand on va sur un autre onglet et revient sur le même.

PROBLEME: C'EST TRES LONG !!! Au chargement + quand on fait une modification sur un contact dans le tableau => tous les contacts se rerender. Pourtant j'ai mémoïsé les ContactRow.

Solution 1 : ONGLET 1 : Tableau normal mais très long dès qu'il y a plus de 20 contacts !

Pour tester avec plus de contacts aller dans ADMIN puis :
1-AJOUTER CATEGORIES   => la page va se recharger et 19 catégories tests s'ajoutent
2-AJOUTER CONTACTS TEST (x7)  => la page va se recharger et 7 contacts d'ajoutent 

Tests de moyens pour optimiser les performances : Utilisation de la virtualisation (chargement de la liste visible et non toute entière.
      => mieux mais je n'arrive pas à utiliser Memo pour les ContactRow 
      => donc les contacts déjà vus se rechargent à chaque fois qu'on revient dessus (apparemment car FixedSizeList est rerender à chaque défilement car la props style change).
      
Solution 2 : ONGLET 7 : Utilisation de FixedSizeList de react-window mais je n'arrive pas à gérer avec le header (que les cellules du header soient de la même taille que le body) et de toute façon je vois que toutes les lignes se rerender à chaque scroll ! => Pas d'optimisation de perf.
Aussi je n'arrive pas à gérer l'architecture du tableau car j'ai toujours une erreur :  <tr> cannot appear as a child of <div>.. (FixedSizeList est une div qui doit contenir les lignes : ContactRow, qui sont des <tr>) ==> {/* Je mets donc le composant en commentaire pour ne pas générer d'erreur */}

Solution 3 : ONGLET 8 : Test avec VirtualTable qui utilise FixedSizeList (react-window) => Mieux mais pas fluide

Solution 4 : ONGLET 9 : Ici pas d'utilisation du composant ContactRow => On gère le tableau par ligne et non colonne => utilisation de 'react-virtualized'
Long car je dois tout refaire différemment et le tri ne fonctionne plus... Et je ne sais pas comment mettre et pouvoir modifier plusieurs info dans la même cellule (comme mail, téléphone...)
Je n'ai pas terminé car je me demande si c'est la peine car chaque modification sur un contact crée une attente et on a un render à chaque scroll.

Solution 5 : ONGLET 10 : Idem 4 mais sans mémoîser les cellules (car j'ai l'impression que ce n'est pas utile...?)


Améliorations ?
-Sauvegarder dans la BDD lors du onBlur au lieu du onChange pour pas que ça le fasse à chaque lettre... Mais le onBlur ne marche pas quand on quitte l'appli (donc le dernier changement ne sera pas sauvegardé)
-Modif dans Calendrier => on revient toujours à la vue + le mois par défaut. Je n'ai pas réussi à le corriger...

NewContactSearchForm => je peux améliorer, je fais appel à 2 API (INSEE + logo et mail), on dirait que les données sont cherchées 2 fois. Je l'ai fait tout au début... Mais je vais revoir tout ça.

Je te remercie beaucoup pour ton aide et je te dis à bientôt, et très belle année à toi ! 😃

Aurélia
