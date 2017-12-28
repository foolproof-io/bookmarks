window.onload = function() {
  var config = {
    apiKey: "AIzaSyA2iCPPGb7_Bb3oAUTXsnOfbUeszyIdyYI",
    authDomain: "foolproof-bookmarks.firebaseapp.com",
    databaseURL: "https://foolproof-bookmarks.firebaseio.com",
    projectId: "foolproof-bookmarks",
    storageBucket: "foolproof-bookmarks.appspot.com",
    messagingSenderId: "518485674389"
  };
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      populateKeeps();
    } else {
      firebase.auth().signInWithPopup(provider);
    }
  });

  var keepList = document.getElementById("keepList");
  var keepElements = [];
  function populateKeeps() {
    firebase.firestore()
      .collection("keeps")
      .where("keptBy", "==", firebase.auth().currentUser.uid)
      .orderBy("keptAt", "desc")
      .onSnapshot(query => {
        query.docChanges.forEach(dc => {
          if (dc.type == "added") {
            var keep = dc.doc.data();

            var keepItem = document.createElement("a");
            keepItem.href = keep.url;
            keepItem.text = keep.title;
            keepItem.title = keep.keptAt;

            var listElement = document.createElement("li");
            listElement.append(keepItem);

            insertAt(keepElements, listElement, dc.newIndex);
            keepList.insertBefore(listElement, keepElements[dc.newIndex + 1]);
          }
        });
      }, err => {
        console.error(err);
        while (keepList.lastChild) {
          keepList.removeChild(keepList.lastChild);
        }
      });
  }
}

function insertAt(xs, x, idx) {
  if (xs[idx]) {
    for (var i = xs.length; i > idx; i--) {
      xs[i] = xs[i-1];
    }
  }
  xs[idx] = x;
}
