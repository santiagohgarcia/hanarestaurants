sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"restaurants/ui5/model/models",
	"restaurants/ui5/controller/Restaurant/RestaurantDialog",
	"restaurants/ui5/controller/Menu/Category/CategoryDialog",
	"restaurants/ui5/controller/Menu/Product/ProductDialog",
	"restaurants/ui5/controller/MessageDialog"
], function(UIComponent, Device, models, RestaurantDialog, CategoryDialog, ProductDialog, MessageDialog) {
	"use strict";

	return UIComponent.extend("restaurants.ui5.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			//Set core models
			sap.ui.getCore().setModel(this.getModel("i18n"), "i18n");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set the frontend view model
			this.setModel(models.createViewModel(), "view");

			// set message model
			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "messages");

			//init firebase
			this.initFirebase();

			// set the restaurants model
			var restaurantModel = models.createRestaurantsModel();
			this.setModel(restaurantModel);
			sap.ui.getCore().setModel(restaurantModel);

			//CREATE COMMON DIALOGS
			this._restaurantDialog = new RestaurantDialog(this.getRootControl());
			this._categoryDialog = new CategoryDialog(this.getRootControl());
			this._productDialog = new ProductDialog(this.getRootControl());
			this._messageDialog = new MessageDialog(this.getRootControl());

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

		getContentDensityClass: function() {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		exit: function() {
			this._restaurantDialog.destroy();
			delete this._restaurantDialog;
		},

		openRestaurantDialog: function(ctx) {
			return this._restaurantDialog.open(ctx);
		},

		openCategoryDialog: function(ctx) {
			return this._categoryDialog.open(ctx);
		},

		openProductDialog: function(ctx) {
			return this._productDialog.open(ctx);
		},

		openMessageDialog: function(response) {
			return this._messageDialog.open(response);
		}
	});
});