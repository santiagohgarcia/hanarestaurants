importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize Firebase
var config = {
	messagingSenderId: "660137965979"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

	if (payload.data.Status === "READY") {
		var notificationTitle = `Order #(${payload.data.RestaurantOrderId}) ready!`;
		var notificationOptions = {
			body: `You can pick your order now! Enjoy!`,
			icon: `customer/resources/webapp/img/ready.png`
		};
	} else if(payload.data.Status === "PENDING") {
		var notificationTitle = `Order #(${payload.data.RestaurantOrderId}) created!`;
		var notificationOptions = {
			body: `Check your notifications to know when the order is ready!`,
			icon: `customer/resources/webapp/img/pending.png`
		};
	}

	return self.registration.showNotification(notificationTitle,
		notificationOptions);
});