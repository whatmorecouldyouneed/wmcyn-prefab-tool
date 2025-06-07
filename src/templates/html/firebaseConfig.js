// This config will be injected by the CLI
document.addEventListener('DOMContentLoaded', () => {
  if (!window.FIREBASE_CONFIG) return;
  // @ts-ignore
  firebase.initializeApp(window.FIREBASE_CONFIG);
  window.db = firebase.firestore();
}); 