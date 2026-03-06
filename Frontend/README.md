# NATEIVA LEARN

## Description

NATEIVA LEARN est une plateforme d’apprentissage en ligne multi‑rôles (apprenant, tuteur, propriétaire de centre).  
Toutes les fonctionnalités sont actuellement implémentées **exclusivement côté frontend** via des stores Zustand et du stockage `localStorage`.  
Il n’y a aucun backend pour l'instant dans le repository : l’authentification, les organisations (centres), les cours, les réservations, le chat, les notifications et les quiz sont entièrement mockés dans le code client.

---

## 🏗 Architecture du projet

### Frontend

Racine pertinente :  
`Frontend/`

Entrée et bootstrap :

- `src/main.jsx` : monte l’application dans le DOM, installe `BrowserRouter` et initialise l’i18n (`./i18n`).
- `src/App.jsx` : encapsule `AppRouter`.

Organisation des dossiers principaux :

- `src/app/`
  - `router/AppRouter.jsx` : définition des routes globales (auth + routes de rôle).
  - `router/ProtectedRoute.jsx` : garde d’authentification/autorisation par rôle.
  - `layouts/AppLayout.jsx` : layout principal protégé (sidebar + topbar + contenu avec animation).
  - `layouts/AppSidebar.jsx` : sidebar verticale avec menu dépendant du rôle, actions (settings + logout) et badge de messages non lus.
  - `layouts/AppTopbar.jsx` : topbar avec `NotificationDropdown` et avatar profil.
  - `store/` : stores Zustand globaux (auth, organisations, cours, chat, notifications, quiz).

- `src/auth/`
  - `layouts/AuthLayout.jsx` : layout pour les pages publiques (login, signup).
  - `pages/Login.jsx` : page de connexion.
  - `pages/SignupMultiStep.jsx` : inscription multi‑étapes, avec sous‑components de steps pour learner / tutor / center_owner.

- `src/roles/`
  - `learner/`
    - `learner.routes.jsx` : routes protégées pour le rôle apprenant.
    - `learner.menu.js` : définition du menu sidebar pour learner.
    - `pages/` : pages learner (dashboard, cours, réservation, centre, quiz, chat, agenda, vidéo, settings, profil).
  - `tutor/`
    - `tutor.routes.jsx` : routes protégées pour le rôle tuteur (et partiellement center_owner).
    - `tutor.menu.js` : menu sidebar pour tuteur.
    - `pages/` : pages tuteur (dashboard, profil, disponibilités, réservations, agenda, centre, chat, vidéo, settings).
  - `center_owner/`
    - `center_owner.routes.jsx` : routes protégées pour le rôle propriétaire de centre.
    - `center_owner.menu.js` : menu sidebar pour center_owner.
    - `pages/` : pages center_owner (dashboard, gestion tuteurs, gestion apprenants, chat, agenda du centre, visioconférence UI, settings, profil).
    - `components/` : composants de gestion (listes & cartes de tuteurs/apprenants).

- `src/shared/`
  - `components/` : composants réutilisables (cartes, modals, quiz, booking, chat, notifications, etc.).
  - `hooks/` : hooks personnalisés (centres, booking, subscription, unread, organisation active, etc.).
  - `ui/` : composants d’interface génériques (`Button`, `Input`, `ProfileField`, `BookingStatusBadge`, `StarRating`, etc.).
  - `utils/roles.js` : constantes de rôles (`ROLES`).

- `src/i18n/`
  - `index.js` : configuration i18next.
  - `locales/fr.json`, `locales/en.json` : fichiers de traduction.

- `src/data/`
  - `centers.js` : données mock de centres (nom, ville, matières, classes, tarifs, stats, etc.).


## 🔐 Authentification

L’authentification est gérée entièrement côté frontend via `useAuthStore` (Zustand) et `localStorage`.

### Store d’authentification (`src/app/store/auth.store.jsx`)

Fonctionnalités réellement implémentées :

- **Stockage et persistance**
  - `user` : utilisateur connecté, initialisé depuis `localStorage.currentUser`.
  - Liste des comptes mockés stockée dans `localStorage.users`.

- **`register(data)`**
  - Normalise l’email pour éviter les doublons.
  - Vérifie l’unicité de l’email.
  - Crée un nouvel utilisateur `userToSave` (avec `organizationIds` et `activeOrganizationId` éventuels).
  - Met à jour `localStorage.users` et `localStorage.currentUser`.
  - Met à jour `user` dans le store.

- **`login({ email, password })`**
  - Parcourt `localStorage.users` pour un match email normalisé + password.
  - Retourne un objet `{ error }` si échec, `{ success: true }` si réussite, et met à jour `user` + `localStorage.currentUser`.

- **`logout()`**
  - Supprime `currentUser` du `localStorage`.
  - Met `user` à `null`.

- **`updateProfile(updates)`**
  - Met à jour l’objet `user` courant et synchronise la liste `users` dans `localStorage`.
  - Utilisé par les pages de profil learner, tutor, center_owner.

- **`setActiveOrganizationId(organizationId)`**
  - Pour le center_owner, met à jour l’organisation active dans `user` + `localStorage.currentUser`.

### Pages Login & Signup

- **Login (`src/auth/pages/Login.jsx`)**
  - Formulaire contrôlé (email + mot de passe).
  - Appelle `useAuthStore().login`.
  - En cas de succès, lit `currentUser.role` et redirige vers :
    - `/learner/dashboard` pour le rôle learner,
    - `/tutor/dashboard` pour le rôle tutor,
    - `/center_owner/dashboard` pour le rôle center_owner.
  - Utilise `react-toastify` pour les messages de succès/erreur.

- **Signup multi‑étapes (`src/auth/pages/SignupMultiStep.jsx`)**
  - Gère un flux d’inscription multi‑étapes avec validation par étape.
  - Étapes communes (tous rôles) :
    - Infos personnelles (nom, email),
    - Ville + téléphone,
    - Mot de passe + confirmation,
    - Sélection du rôle (`learner`, `tutor`, `center_owner`).
  - Étapes spécifiques learner / tutor / center_owner réellement présentes et naviguées (sélection niveau, matières, centre, etc.), mais la persistance de ces infos métier reste en grande partie au niveau du state d’inscription.
  - Soumission :
    - Pour learner et tutor : appelle `register(data)` puis redirige en fonction du rôle.
    - Pour center_owner : appelle `useOrganizationsStore.createOrganization` pour créer une organisation, enrichit `data` avec `organizationIds` + `activeOrganizationId`, puis appelle `register` et redirige vers `/center_owner/dashboard`.

### Protections de routes

- **`ProtectedRoute` (`src/app/router/ProtectedRoute.jsx`)**
  - Utilise un hook `useAuth` (wrapper autour `useAuthStore`) pour déterminer si l’utilisateur est authentifié.
  - Si non authentifié → redirection vers `/` (login).
  - Si l’utilisateur n’a pas un rôle contenu dans `allowedRoles` → redirection vers `/signup`.
  - Sinon, rend les enfants (routes protégées).

---

## 📊 Dashboards existants

### LearnerDashboard

Fichier : `src/roles/learner/pages/LearnerDashboard.jsx`

- Affiche un bandeau d’accueil animé (Framer Motion) avec un message de bienvenue et des messages d’info.
- Affiche plusieurs cartes de statistiques de haut niveau (courses, sessions vidéo, événements, messages) avec des valeurs **mockées**.

### TutorDashboard

Fichier : `src/roles/tutor/pages/TutorDashboard.jsx`

- Structure similaire à `LearnerDashboard`, adaptée au rôle tuteur.
- Cartes de statistiques sur les cours donnés, sessions de visioconférence, avis, messages (valeurs mockées).

### CenterOwnerOverview

Fichier : `src/roles/center_owner/pages/CenterOwnerOverview.jsx`

- Utilise le hook `useActiveOrganization()` pour récupérer l’organisation active (centre).
- Si aucune organisation active n’est trouvée, affiche un message expliquant l’absence de centre.
- Affiche, lorsque disponible, des statistiques sur le centre : nombre de tuteurs, d’apprenants, de cours, revenus (valeurs souvent dérivées du store ou mockées).
- Inclut un bandeau d’information animé.

---

## ⚙️ Fonctionnalités actuellement opérationnelles

### Routing & navigation

- **Racine** (`src/app/router/AppRouter.jsx`) :
  - `/` → `Login` sous `AuthLayout`.
  - `/signup` → `SignupMultiStep` sous `AuthLayout`.
  - `/learner/*` → `LearnerRoutes`.
  - `/tutor/*` → `TutorRoutes`.
  - `/center_owner/*` → `CenterOwnerRoutes`.

- **Routes learner** (`src/roles/learner/learner.routes.jsx`) :
  - Layout : `AppLayout` avec `learnerMenu` / `learnerActions`.
  - Pages existantes :
    - `/learner/dashboard` → `LearnerDashboard`
    - `/learner/courses` → `LearnerCourses`
    - `/learner/booking/:tutorId` → `BookingPage`
    - `/learner/center` → `LearnerCenter`
    - `/learner/quiz` → `LearnerQuiz`
    - `/learner/chat` → `LearnerChat` (ChatLayout)
    - `/learner/calendar` → `LearnerCalendar`
    - `/learner/video` → `LearnerVideo` (UI placeholder)
    - `/learner/settings` → `LearnerSettings`
    - `/learner/profile` → `LearnerProfile`

- **Routes tutor** (`src/roles/tutor/tutor.routes.jsx`) :
  - Layout : `AppLayout` avec `tutorMenu` / `tutorActions`.
  - Pages existantes :
    - `/tutor/dashboard` → `TutorDashboard`
    - `/tutor/profile` → `TutorProfile`
    - `/tutor/availability` → `AvailabilityManager`
    - `/tutor/courses` → `TutorBookings`
    - `/tutor/chat` → `TutorChat` (ChatLayout)
    - `/tutor/center` → `TutorCenter`
    - `/tutor/calendar` → `TutorCalendar`
    - `/tutor/video` → `TutorVideo` (UI placeholder)
    - `/tutor/settings` → `TutorSettings`

- **Routes center_owner** (`src/roles/center_owner/center_owner.routes.jsx`) :
  - Layout : `AppLayout` avec `centerOwnerMenu` / `centerOwnerActions`.
  - Pages existantes :
    - `/center_owner/dashboard` → `CenterOwnerOverview`
    - `/center_owner/tutors` → `CenterOwnerTutorsManagement`
    - `/center_owner/learners` → `CenterOwnerLearnersManagement`
    - `/center_owner/chat` → `CenterOwnerChat` (ChatLayout)
    - `/center_owner/agenda` → `CenterAgendaView`
    - `/center_owner/video` → `VideoCallLayout` (UI simulation uniquement)
    - `/center_owner/settings` → `CenterOwnerSettings`
    - `/center_owner/profile` → `CenterOwnerProfile`
    - `/center_owner/courses` → réutilise la page `TutorBookings` en mode read‑only côté centre_owner.

### Gestion des centres (organisations)

Store : `src/app/store/organizations.store.js`

- Stocke :
  - `organizations` : centres créés par les center_owner.
  - `memberships` : liens user ↔ organisation avec rôle (`owner`, `tutor`, `learner`).
  - `membershipRequests` : demandes de membership en attente (mock, via localStorage).

- Fonctionnalités :
  - `createOrganization(payload)` : utilisé dans le flux d’inscription center_owner (création du centre).
  - `getOrganizationsForUser(userId)` : retourne les organisations où l’utilisateur a un membership.
  - `getMembershipRole(userId, organizationId)` : retourne le rôle d’un user dans une organisation.
  - `getOrganizationById(id)` : récupère une organisation par son id.
  - `requestMembership({ userId, organizationId, role })` : crée une demande de membership `status = "pending"`.
  - `getMembershipRequests(organizationId)` : retourne les demandes en attente pour une organisation.
  - `hasPendingRequest(userId, organizationId)` : permet de savoir si un user a déjà une demande en attente.

Utilisation côté UI :

- **Learner** :
  - Hook `useLearnerCenter()` :
    - Cherche un membership `{ userId, role: "learner" }` dans `memberships`.
    - Retourne `{ hasCenter, center }` (organisation).
  - `LearnerCenter.jsx` :
    - Si `hasCenter` : affiche info du centre + tuteurs du centre.
    - Sinon : liste de centres mock `centersData` avec filtres, clic ouvrant `CenterDetailModal`.

- **Tutor** :
  - `TutorCenter.jsx` :
    - Cherche un membership de rôle `tutor` pour `user.id || user.email`.
    - Récupère l’organisation correspondante.
    - Mappe vers `centersData` pour des infos plus détaillées (image, classes, tarifs).
    - Si pas de centre → liste filtrable de centres mock, clic ouvrant `CenterDetailModal`.

- **Bouton "Rejoindre le centre" (tuteurs)** :
  - `CenterDetailModal.jsx` :
    - Récupère l’utilisateur (`useAuthStore`) et les organisations (`useOrganizationsStore`).
    - Identifie si l’utilisateur est un tuteur (`ROLES.Tutor`).
    - Mappe le centre affiché à une organisation par le nom (`org.name === center.name`).
    - Vérifie :
      - si le tuteur a déjà un centre (`getMembershipRole`),
      - si une demande est déjà en attente (`hasPendingRequest`),
      - si le tuteur est déjà membre de cette organisation.
    - Affiche un bouton **"Rejoindre le centre"** :
      - Appelle `requestMembership` avec `role: "tutor"`.
      - Passe en **"Demande en attente"** et désactive le bouton si une demande existe déjà.

### Réservations & agenda

Store : `src/app/store/courses.store.js`

- Données :
  - `tutors` : tuteurs mockés (matières, langues, tarif, rating, slots de disponibilités).
  - `bookings` : réservations générées par `getMockBookings`.
  - `weeklyAvailability`, `blockedDates` : config de disponibilités tuteur.

- API utilisée dans l’UI :
  - `setBookingsForLearner(learnerId)` / `setBookingsForTutor(tutorId)`
  - `createBooking(payload)` → crée un booking `status = pending`.
  - `confirmBooking(bookingId)` → passe un booking à `confirmed`.
  - `cancelBooking(bookingId)` → passe un booking à `cancelled`.
  - `updateBooking(bookingId, updates)` → utilisé pour replanifier un cours.
  - `completeBooking(bookingId)` → passe un booking à `completed`.
  - `setReviewGiven(bookingId)` → tagge une réservation comme ayant reçu un avis.
  - `setWeeklyAvailability(slots)` → sauvegarde les slots hebdomadaires.
  - `addBlockedDate`, `removeBlockedDate`.
  - `getFilteredTutors(filters)` → filtrage des tuteurs côté learner.

Utilisation côté UI :

- **LearnerCourses.jsx**
  - Onglet "Explorer" :
    - Filtres (langue, matière, prix, note).
    - Appelle `getFilteredTutors` et affiche des `TutorCard`.
    - Le bouton "Réserver un créneau" navigue vers `/learner/booking/:tutorId`.
  - Onglet "Mes leçons" :
    - Charge les bookings via `setBookingsForLearner`.
    - Liste les réservations à venir et l’historique avec `BookingStatusBadge`, annulation (`cancelBooking`), et marquage d’avis (`setReviewGiven`).

- **BookingPage.jsx**
  - Page dédiée au flow de réservation :
    - `TutorBookingInfo` : résumé tuteur.
    - `BookingCalendar` : choix date et créneau, basé sur `availabilitySlots`.
    - `BookingSummary` :
      - Affiche les infos de prix, durée.
      - Utilise `useSubscriptionStatus` (mock) et `useBookingConflict` (vérification de chevauchement dans les bookings).
      - Crée puis confirme une réservation via `createBooking` + `confirmBooking` (paiement simulé).

- **LearnerCalendar.jsx**
  - Recharge les bookings learner.
  - Affiche une vue hebdomadaire (jours de la semaine, sessions).
  - Propose un bouton "Reprogrammer" pour chaque cours à venir :
    - Ouvre `RescheduleModal`.
    - `RescheduleModal` réutilise la logique de sélection de créneau et, à la confirmation, appelle `updateBooking`.

- **TutorBookings.jsx**
  - Charge les bookings pour un tuteur via `setBookingsForTutor`.
  - Liste les `upcoming` / `past` bookings côté enseignant.
  - Bouton "Marquer terminé" → `completeBooking`.
  - Bouton "Créer un quiz" → ouvre `CreateQuizModal` (voir section Quiz).

- **TutorCalendar.jsx**
  - Vue hebdomadaire des réservations à venir côté tuteur.
  - Calcule un revenu estimé en sommant les `price` des bookings à venir.

- **AvailabilityManager.jsx**
  - Utilise `weeklyAvailability` et `setWeeklyAvailability`.
  - Composants :
    - `DayAvailabilityRow` : état par jour (actif/inactif, plages horaires).
    - `TimeRangePicker` : sélection horaire (début/fin).
  - Permet d’ajouter, modifier, supprimer des plages, et de copier les plages d’un jour actif vers les autres jours actifs.

### Quiz (création tuteur → lecture apprenant)

Store : `src/app/store/quiz.store.js`

- `tutorQuizzes` : liste des quiz créés par les tuteurs (en mémoire / localStorage).
- `createAndSendQuiz(quizData)` :
  - Ajoute un quiz `type: "tutor"` avec :
    - `title`, `description`, `questions`, `timeLimit`,
    - `tutorId`, `tutorName`,
    - `recipientLearnerIds` (IDs des apprenants ciblés).
- `getQuizzesForLearner(learnerId)` :
  - Retourne uniquement les quiz dont `recipientLearnerIds` contient `learnerId`.
- `getQuizzesByTutor` et `markQuizCompleted` existent mais sont peu exploités dans les pages actuelles.

Côté tuteur :

- **TutorBookings.jsx** :
  - Construit une liste d’apprenants à partir des bookings (`learnerId`, `learnerName`, `learnerEmail`).
  - Passe cette liste à `CreateQuizModal`.

- **CreateQuizModal.jsx** :
  - Formulaire complet pour créer un quiz :
    - Titre (obligatoire), description, limite de temps (optionnelle).
    - Liste de questions dynamiques (ajout/suppression).
    - Pour chaque question :
      - Liste de réponses dynamiques (min 2),
      - Sélection d’au moins une réponse correcte.
  - Utilise `LearnerSelector` pour sélectionner un ou plusieurs apprenants.
  - Validation stricte (titre, questions, réponses, au moins une bonne réponse par question, au moins un apprenant).
  - Envoie le quiz en appelant `createAndSendQuiz`.

Côté apprenant :

- **LearnerQuiz.jsx** :
  - Construit une liste `quizzes` combinant :
    - `MOCK_QUIZZES` système (`type: "system"`),
    - `getQuizzesForLearner(learnerId)` (quiz de tuteurs).
  - Affiche séparément :
    - "Quiz système (IA)" (mock),
    - "Quiz envoyés par vos tuteurs" (issus du store quiz).
  - Permet de jouer un quiz (`QuizPlayer`) et d’afficher un résultat (`QuizResult`).

### Chat

Store : `src/app/store/chat.store.js`

- Gère des conversations mock avec :
  - `id`, `participant`, `lastMessage`, `unreadCount`, `isOnline`.
  - `messagesByConversationId` (`fromMe`, texte, timestamp).
- Fonctions utilisées :
  - `getMessages(conversationId)` : fournit les messages d’une conversation.
  - `sendMessage(conversationId, text)` : ajoute un message côté "moi" et met à jour `lastMessage`.
  - `markAsRead(conversationId)` : remet `unreadCount` à 0.
  - `getTotalUnread()` : somme des `unreadCount`.
  - `setCurrentUserId(userId)` : configure l’ID "current-user" pour distinguer les messages envoyés.

UI :

- **ChatLayout.jsx** :
  - Colonne gauche : `ConversationList` (liste, last message, badge unread, statut online).
  - Colonne droite : `ChatWindow` (messages + `MessageInput`).
  - Ne sélectionne aucune conversation par défaut (l’utilisateur doit cliquer).
  - Appelle `markAsRead` quand une conversation est sélectionnée.

- **ConversationList.jsx** :
  - Affiche un badge rouge `unreadCount` pour les conversations avec messages non lus.

- **ChatWindow.jsx** :
  - Si aucune conversation sélectionnée : message “Sélectionnez une conversation”.
  - Sinon : liste de `MessageBubble` + input pour envoyer un message.

- **MessageBubble.jsx** :
  - Détermine si un message est envoyé par l’utilisateur (`senderId === "current-user"` ou `userId`) :
    - Messages envoyés : alignés à droite, fond rouge, texte blanc.
    - Messages reçus : alignés à gauche, fond gris.

Pages :

- `LearnerChat.jsx`, `TutorChat.jsx`, `CenterOwnerChat.jsx` → injectent toutes `ChatLayout`.

### Notifications

Store : `src/app/store/notifications.store.js`

- Notifications mock (titre, texte, timestamp, lu/non lu).
- Fonctions :
  - `markAsRead(id)`
  - `markAllAsRead()`
  - `getUnreadCount()`
  - `addNotification(notification)` : ajoute une nouvelle notification non lue.

UI :

- **NotificationDropdown.jsx** :
  - Icône cloche dans la topbar avec badge rouge du nombre de notifications non lues (`getUnreadCount`).
  - Dropdown animée contenant la liste des notifications (`NotificationItem`).
  - Bouton "Tout marquer comme lu" quand il reste des notifications non lues.

### Composants réutilisables & hooks

Composants principaux réellement utilisés :

- Cartes / modals :
  - `CenterCard`, `CenterDetailModal`
  - `TutorCard`, `TutorProfileModal`, `TutorProfileCard`
  - `RescheduleModal`, `ConfirmModal`
- Booking / agenda :
  - `booking/TutorBookingInfo`, `BookingCalendar`, `BookingSummary`, `TimeSlotButton`
- Quiz :
  - `quiz/QuizCard`, `quiz/QuizPlayer`, `quiz/QuizResult`, `quiz/LearnerSelector`, `quiz/CreateQuizModal`
- Chat :
  - `chat/ChatLayout`, `ConversationList`, `ChatWindow`, `MessageBubble`, `MessageInput`
- Notifications :
  - `NotificationDropdown`, `NotificationItem`
- UI :
  - `ui/Button`, `ui/Input`, `ui/ProfileField`, `ui/BookingStatusBadge`, `ui/StarRating`

Hooks personnalisés réellement utilisés :

- `useLearnerCenter` : determine si un apprenant a un centre (`LearnerCenter`).
- `useBookingConflict` : détecte les conflits de réservations (`BookingSummary`, `RescheduleModal`).
- `useSubscriptionStatus` : statut d’abonnement simulé par tuteur (`BookingSummary`).
- `useUnreadCount` : somme des `unreadCount` (badge chat dans `AppSidebar`).
- `useActiveOrganization` : fournit `activeOrganization` pour center_owner (`CenterOwnerOverview`, `CenterOwnerProfile`).
- `useAuth` : fournit `user` et `isAuthenticated` dans `ProtectedRoute`.

---

## 🛠 Stack technique

- **Framework** : React `^19.2.0`
- **Bundler / Dev server** : Vite `^7.2.4` avec `@vitejs/plugin-react`
- **Routing** : React Router DOM `^7.12.0`
- **State management** : Zustand `^5.0.10`
- **Animations** : Framer Motion `^12.26.2`
- **Internationalisation** :
  - `i18next` `^25.7.4`
  - `react-i18next` `^16.5.3`
- **UI / Icônes** :
  - `react-icons` `^5.5.0`
  - Tailwind CSS `"3.4"` (config PostCSS + Autoprefixer)
- **Toasts / notifications UI** :
  - `react-toastify` `^11.0.5`
  - `react-hot-toast` `^2.6.0` (présent, mais l’usage principal observé est `react-toastify`)
- **Qualité / lint** :
  - ESLint `^9.39.1` + `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
  - `globals` pour les environnements de lint

---

## 📁 Structure des dossiers (simplifiée)

```text
Frontend/
  package.json
  vite.config.*
  src/
    main.jsx
    App.jsx
    app/
      router/
        AppRouter.jsx
        ProtectedRoute.jsx
      layouts/
        AppLayout.jsx
        AppSidebar.jsx
        AppTopbar.jsx
      store/
        auth.store.jsx
        organizations.store.js
        courses.store.js
        chat.store.js
        notifications.store.js
        quiz.store.js
    auth/
      layouts/
        AuthLayout.jsx
      pages/
        Login.jsx
        SignupMultiStep.jsx
        ...steps d’inscription (Step0..Step7, StepTutor*, Step4CenterSetup)
    roles/
      learner/
        learner.routes.jsx
        learner.menu.js
        pages/
          LearnerDashboard.jsx
          LearnerCourses.jsx
          BookingPage.jsx
          LearnerCenter.jsx
          LearnerQuiz.jsx
          LearnerChat.jsx
          LearnerCalendar.jsx
          LearnerVideo.jsx
          LearnerSettings.jsx
          LearnerProfile.jsx
      tutor/
        tutor.routes.jsx
        tutor.menu.js
        pages/
          TutorDashboard.jsx
          TutorProfile.jsx
          AvailabilityManager.jsx
          TutorBookings.jsx
          TutorCalendar.jsx
          TutorCenter.jsx
          TutorChat.jsx
          TutorVideo.jsx
          TutorSettings.jsx
      center_owner/
        center_owner.routes.jsx
        center_owner.menu.js
        pages/
          CenterOwnerOverview.jsx
          CenterOwnerTutorsManagement.jsx
          CenterOwnerLearnersManagement.jsx
          CenterOwnerChat.jsx
          CenterAgendaView.jsx
          VideoCallLayout.jsx
          CenterOwnerSettings.jsx
          CenterOwnerProfile.jsx
        components/
          TutorManagementList.jsx
          LearnerManagementList.jsx
          TutorRequestCard.jsx
          LearnerRequestCard.jsx
    shared/
      components/
        CenterCard.jsx
        CenterDetailModal.jsx
        TutorCard.jsx
        TutorProfileModal.jsx
        TutorProfileCard.jsx
        RescheduleModal.jsx
        NotificationDropdown.jsx
        NotificationItem.jsx
        chat/
          ChatLayout.jsx
          ConversationList.jsx
          ChatWindow.jsx
          MessageBubble.jsx
          MessageInput.jsx
        booking/
          TutorBookingInfo.jsx
          BookingCalendar.jsx
          BookingSummary.jsx
          TimeSlotButton.jsx
        quiz/
          QuizCard.jsx
          QuizPlayer.jsx
          QuizResult.jsx
          LearnerSelector.jsx
          CreateQuizModal.jsx
        availability/
          TimeRangePicker.jsx
          DayAvailabilityRow.jsx
      hooks/
        useLearnerCenter.js
        useBookingConflict.js
        useSubscriptionStatus.js
        useUnreadCount.js
        useActiveOrganization.js
        useIsTutor.js
        useIsCenterOwner.js
        usePermissions.js
        useAuth.js
      ui/
        Button.jsx
        Input.jsx
        ProfileField.jsx
        BookingStatusBadge.jsx
        StarRating.jsx
        ...
      utils/
        roles.js
    i18n/
      index.js
      locales/
        fr.json
        en.json
    data/
      centers.js
```

---

## 🚧 Fonctionnalités en cours / partielles

Les éléments suivants sont présents dans le code mais ne sont **pas complètement branchés** ou explicitement marqués comme mock / TODO :

- **Backend / persistance réelle**
  - Aucun backend n’est implémenté.
  - Tous les stores (`auth`, `organizations`, `courses`, `chat`, `notifications`, `quiz`) sont des mocks basés sur `localStorage` ou des données en mémoire.

- **Gestion des memberships côté center_owner**
  - `TutorManagementList.jsx` et `LearnerManagementList.jsx` utilisent leurs propres données mock :
    - Acceptation / refus / retrait de tuteurs et apprenants se fait uniquement dans l’état local du composant.
    - Plusieurs `// TODO: Appel API pour accepter/refuser/retirer`.
    - Aucune intégration directe avec `useOrganizationsStore.membershipRequests` ou les `memberships`.

- **Flux abonnement dans les réservations**
  - `BookingSummary.jsx` :
    - Affiche l’état d’abonnement simulé (`useSubscriptionStatus`) et les conflits (`useBookingConflict`).
    - Les actions suggérées (ouvrir l’agenda, annuler un cours existant, s’abonner) ne sont pas encore implémentées (handlers limités à des logs / TODO).

- **Complétion de quiz**
  - `LearnerQuiz.jsx` :
    - Met à jour localement `completed` pour les quiz, mais ne persiste pas ce statut dans `quiz.store` via `markQuizCompleted`.
  - `quiz.store.js` :
    - `getQuizzesByTutor` et `markQuizCompleted` sont définis mais peu/pas exploités dans les pages actuelles.

- **Profil center_owner (section “Mon centre”)**
  - `CenterOwnerProfile.jsx` :
    - Permet d’éditer localement le nom du centre, les matières et langues via `ProfileField` + `SubjectsSection`.
    - Aucune mise à jour directe des objets `organizations` / `activeOrganization` dans `organizations.store` (TODO implicites).

- **Connexion entre membershipRequests et UI center_owner**
  - `organizations.store.js` gère `membershipRequests` (création + lecture).
  - Les composants de gestion tuteurs/apprenants (CenterOwner) n’utilisent pas encore ces données (décalage entre modèle store et UI).

- **Disponibilités tuteur**
  - `AvailabilityManager.jsx` :
    - Sauvegarde correctement les créneaux hebdomadaires via `setWeeklyAvailability`.
    - Message de succès explicitement TODO (pas de feedback utilisateur).

- **Visioconférence**
  - `TutorVideo.jsx`, `LearnerVideo.jsx` :
    - Composants placeholders expliquant que les sessions vidéo apparaîtront ici dans le futur.
  - `VideoCallLayout.jsx` :
    - UI complète pour une visioconférence (vignettes participants, boutons micro/caméra/raccrocher) mais texte explicite :  
      *"Simulation UI uniquement – Pas de connexion réelle"*.
    - Aucun flux WebRTC / WebSocket.

- **Hooks de permissions**
  - `useIsTutor`, `useIsCenterOwner`, `usePermissions` :
    - Définis comme abstraction pour les rôles/permissions.
    - Aucun composant majeur ne les utilise encore (la logique est dupliquée ailleurs pour l’instant).
---