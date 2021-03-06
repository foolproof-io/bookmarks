var config = {
  apiKey: "AIzaSyA2iCPPGb7_Bb3oAUTXsnOfbUeszyIdyYI",
  authDomain: "foolproof-bookmarks.firebaseapp.com",
  databaseURL: "https://foolproof-bookmarks.firebaseio.com",
  projectId: "foolproof-bookmarks",
  storageBucket: "foolproof-bookmarks.appspot.com",
  messagingSenderId: "518485674389"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    internUser(user);
  }
});

chrome.browserAction.onClicked.addListener(internKeep);
chrome.runtime.onMessage.addListener(msg => {
  console.log("received message:", msg);
});


function internUser(user) {
  console.log(user);
  firebase.firestore().collection("users").doc(user.uid).set({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  }, {merge:true});
}

function internKeep(tab) {
  if (!firebase.auth().currentUser) {
    return forceAuth();
  }
  return firebase.firestore().collection("keeps").add({
    url: tab.url,
    title: tab.title,
    keptBy: firebase.auth().currentUser.uid,
    keptAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(doc => {
    console.log("just interned " + doc.id);
    return new Promise((resolve, reject) => {
      chrome.tabs.executeScript({ code: "document.body.innerText" }, results => {
        resolve({ keepId: doc.id, text: results[0] });
      });
    });
  }).then(result => {
    return firebase.storage()
      .ref([
        "page-text",
        firebase.auth().currentUser.uid,
        result.keepId
      ].join("/"))
      .putString(result.text);
  });
}

function forceAuth() {
  console.log("starting auth process");
  chrome.identity.getAuthToken({interactive: false}, token => {
    if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (!token) {
      console.error('The OAuth Token was null');
    } else {
      console.log("got a token: ", token);
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      console.log("credential = " + credential);
      firebase.auth().signInWithCredential(credential).catch(error => {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          console.log("credential was invalid, starting over");
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            forceAuth();
          });
        }
      });
    }
  });
}
