document.addEventListener('DOMContentLoaded', function() {
  var config = {
    apiKey: "AIzaSyA2iCPPGb7_Bb3oAUTXsnOfbUeszyIdyYI",
    authDomain: "foolproof-bookmarks.firebaseapp.com",
    databaseURL: "https://foolproof-bookmarks.firebaseio.com",
    projectId: "foolproof-bookmarks",
    storageBucket: "foolproof-bookmarks.appspot.com",
    messagingSenderId: "518485674389"
  };
  firebase.initializeApp(config);
  main();
});


function main() {
  var db = firebase.firestore();

  chrome.browserAction.onClicked.addListener((tab) => {
    db.collection("keeps").add({
      url: tab.url,
      title: tab.title,
      keptAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
}
