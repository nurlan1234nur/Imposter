 Design a polished, mobile-first UI/UX redesign for a Mongolian social deduction party game app called “Сэжиг”.

  APP CONCEPT
  “Сэжиг” is a collection of multiplayer hidden-role and deduction games for friends. It includes:

  - Imposter Online
  - Imposter Offline — pass one phone between players
  - Mafia
  - Avalon
  - Secret Hitler
  - Wink Murder
  - Two Rooms and a Boom
  - Bang!
  - Number Guessing
  - Plane Battle

  Do not change the game concepts or core functionality. Focus on navigation, visual hierarchy, usability, consistency,
  and atmosphere.

  VISUAL DIRECTION
  Create a mysterious nighttime social-deduction atmosphere:

  - Premium dark mobile UI
  - Deep navy and near-black backgrounds
  - Purple/indigo as the primary accent
  - Each game can have its own accent color and gradient
  - Subtle moonlight, stars, fog, city silhouettes, and soft glows
  - Modern, clean, slightly cinematic
  - Friendly party-game feeling, not horror
  - High contrast and accessible typography
  - Avoid excessive glassmorphism, clutter, oversized headings, and neon overload
  - Use consistent rounded cards, spacing, icons, buttons, form fields, and bottom sheets

  Design for a 390×844 mobile screen, while ensuring responsive behavior for small phones and desktop web.

  APP BRAND
  Name: “Сэжиг”
  Create a simple app identity using a crescent moon, mask, eye, or fingerprint motif.
  The brand should work as:

  - App icon
  - Lobby header logo
  - Splash screen mark
  - Small favicon

  PRIMARY NAVIGATION
  Use a simple mobile navigation structure:

  1. Home
  2. Join
  3. Settings or More

  Avoid showing every control on the home screen.

  HOME / GAME LOBBY
  The home screen should include:

  - Compact sticky header with “Сэжиг” logo
  - Small Settings/More icon
  - Atmospheric but compact hero area
  - Quick “Join room” section near the top
  - Room-code input with a clear Join button
  - Game catalog below the quick-join section
  - Optional game category filters: All, Online, Offline, Party, Strategy
  - Search only if it improves usability

  Do not place player-name and language controls directly on the home screen. Put them inside Settings/More.

  GAME CATALOG
  Show games as visually rich but compact cards.

  Each card should contain:

  - Game icon or small illustration
  - Game title
  - Player count
  - Estimated duration
  - Difficulty
  - One-line description
  - ONLINE or OFFLINE badge when relevant

  Make Imposter Offline clearly visible as an offline pass-the-phone game.

  Cards should be easy to scan and should not require excessive scrolling. Explore a two-column grid, featured carousel,
  or horizontal category sections.

  GAME DETAIL / CREATE ROOM
  When a user taps a game card, open a dedicated detail screen instead of scrolling to a create-room form.

  Include:

  - Back button
  - Game-specific gradient hero
  - Game icon and title
  - Player count, duration, and difficulty
  - Short description and “How to play”
  - Current player-name summary with a small edit/settings action
  - Large sticky “Create room” button
  - Do not repeat unnecessary inputs

  For Imposter Offline, the main action should be “Start offline game”, and the screen must clearly show an OFFLINE
  badge.

  JOIN ROOM
  Create a compact, elegant join-room experience:

  - Six-character room-code input
  - Clear validation state
  - Compact Join button
  - Recent room or remembered name only if useful
  - Avoid oversized headings and buttons
  - Make this accessible from both Home and the Join navigation item

  SETTINGS / MORE
  Use a bottom sheet or dedicated screen containing:

  - Player display name
  - Language selection: Монгол, English, Қазақша
  - Sound and vibration preferences
  - Theme or reduced-motion option
  - About the app
  - Game rules/help
  - Save button

  OFFLINE IMPOSTER SETUP
  Create an offline setup screen with:

  - Visible OFFLINE badge
  - Clear back button to Home
  - Player-count stepper
  - Imposter-count stepper
  - Player-name fields
  - Special-mode toggles
  - Large Start button
  - Comfortable spacing and keyboard-friendly layout

  ONLINE WAITING ROOM
  Design a waiting room containing:

  - Room code with Copy and Share actions
  - Player list
  - Host indicator
  - Selected game
  - Voice-chat controls
  - Host-only game settings
  - Change-game action
  - Large Start button
  - Leave-room action
  - Connection/reconnecting state

  MAFIA GAME SCREENS
  Design the Mafia experience as a timer-driven game without a human host.

  Include:

  - Setup for Mafia, Doctor, Detective, and optional Yashka counts
  - Day and night duration settings, default 5 minutes each
  - Setting for whether Mafia can skip a kill
  - Default maximum skip count: one per game
  - Day/night phase timer
  - Phase-progress indicator
  - Night-action screen for each secret role
  - Vote to end the night early
  - End phase early when the majority votes
  - Day discussion and elimination voting
  - Dead-player and spectator states
  - Investigation result
  - Doctor-save result
  - Town-win and Mafia-win result screens

  Mafia wins when the number of surviving Mafia-side players equals the number of surviving Town-side players. Yashka
  counts as Mafia-side when enabled.

  COMPONENTS AND DESIGN SYSTEM
  Create a reusable design system with:

  - Color variables
  - Typography styles
  - 4/8-point spacing system
  - Buttons: primary, secondary, ghost, danger, disabled
  - Inputs and room-code fields
  - Game cards
  - Online/offline badges
  - Player chips and avatars
  - Role cards
  - Timer component
  - Voting cards
  - Settings bottom sheet
  - Toasts, errors, loading, empty, and reconnecting states
  - Light motion specifications for transitions and phase changes

  Use Auto Layout, reusable components, variants, variables, and consistent naming.

  DELIVERABLES
  Produce high-fidelity mobile screens for:

  1. Splash screen
  2. Home lobby
  3. Join room
  4. Settings/More bottom sheet
  5. Game catalog with filters
  6. Game detail/create room
  7. Imposter Offline detail
  8. Offline Imposter setup
  9. Online waiting room
  10. Mafia setup
  11. Mafia night phase
  12. Mafia day phase
  13. Voting
  14. Game result
  15. Error/reconnecting state

  Also provide:

  - A small design-system page
  - Main user-flow prototype connections
  - Interaction notes
  - Empty, loading, disabled, error, and success states

  All visible product copy should primarily be in natural Mongolian Cyrillic. Avoid broken encoding or Latin
  transliterations. English may be used only for universal labels such as ONLINE and OFFLINE.