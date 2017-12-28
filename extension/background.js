var db = firebase.firestore();

chrome.browserAction.onClicked.addListener((tab) => {
  db.collection("keeps").add({
    url: tab.url,
    title: tab.title,
    keptAt: firebase.firestore.FieldValue.serverTimestamp()
  });
});
