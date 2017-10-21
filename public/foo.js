firebase.initializeApp({
  apiKey: 'AIzaSyA2iCPPGb7_Bb3oAUTXsnOfbUeszyIdyYI',
	authDomain: "foolproof-bookmarks.firebaseapp.com",
	projectId: "foolproof-bookmarks"
});

// Initialize Cloud Firestore through Firebase
// var db = firebase.firestore();

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("user signed in!", user);
  } else {
    firebase.auth().signInWithPopup(provider);
  }
});

