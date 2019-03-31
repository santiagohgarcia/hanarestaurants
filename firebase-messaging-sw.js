importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBqfxKgMJMYESECE9FmoxiuMOgBbG-TvXc",
	authDomain: "hana-firebase.firebaseapp.com",
	databaseURL: "https://hana-firebase.firebaseio.com",
	projectId: "hana-firebase",
	storageBucket: "hana-firebase.appspot.com",
	messagingSenderId: "660137965979"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.', 
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});