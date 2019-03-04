sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"customer/customer/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("customer.customer.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: async function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the restaurants model
			var restaurantModel = models.createRestaurantsModel();
			this.setModel(restaurantModel);
			sap.ui.getCore().setModel(restaurantModel);

			// set the customer model
			this.setModel(models.createRestaurantsModel(), "customer");

			// enable routing
			this.getRouter().initialize();

			//init firebase
			this.initFirebase();
			//wait for authentication
			this.attachAuthStateChange();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//Set core models
			sap.ui.getCore().setModel(this.getModel("i18n"), "i18n");

		},

		initFirebase: function() {
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
		},

		attachAuthStateChange: function() {
			firebase.auth().onAuthStateChanged((user) => {
				if (!user) {
					this.getRouter().getTargets().display("login");
					this.getRouter().stop();
				} else {
					//user logged in
					this.getModel("customer").create("/Customers", {
						CustomerId: user.uid,
						Name: user.displayName,
						ImageUrl: user.photoURL
					}).then(customer => {
						this.getRootControl().bindElement(`customer>/Customers('${customer.CustomerId}')`);
						this.getRouter().initialize();
					});
				}
			});
		}
	});
});