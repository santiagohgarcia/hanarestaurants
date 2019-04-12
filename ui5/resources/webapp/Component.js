sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
], function (UIComponent, Device, models) {
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
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			this.requirePromisified("restaurants/ui5/model/models").then(models => {
				//Set core models
				sap.ui.getCore().setModel(this.getModel("i18n"), "i18n");

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				// set the frontend view model
				this.setModel(models.createViewModel(), "view");

				// set the restaurants model
				var restaurantModel = models.createRestaurantsModel();
				this.setModel(restaurantModel);
				sap.ui.getCore().setModel(restaurantModel);
			});

			// set message model
			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "messages");

			//init firebase
			this.initFirebase();

		},

		initFirebase: function () {
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

		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		exit: function () {
			this._restaurantDialog.destroy();
			delete this._restaurantDialog;
		},

		openRestaurantDialog: async function (ctx) {
			if (!this._restaurantDialog) {
				var RestaurantDialog = await this.requirePromisified("restaurants/ui5/controller/Restaurant/RestaurantDialog");
				this._restaurantDialog = new RestaurantDialog(this.getRootControl());
			}
			return this._restaurantDialog.open(ctx);
		},

		openCategoryDialog: async function (ctx) {
			if (!this._categoryDialog) {
				var CategoryDialog = await this.requirePromisified("restaurants/ui5/controller/Menu/Category/CategoryDialog");
				this._categoryDialog = new CategoryDialog(this.getRootControl());
			}
			return this._categoryDialog.open(ctx);
		},

		openProductDialog: async function (ctx) {
			if (!this._productDialog) {
				var ProductDialog = await this.requirePromisified("restaurants/ui5/controller/Menu/Product/ProductDialog");
				this._productDialog = new ProductDialog(this.getRootControl());
			}
			return this._productDialog.open(ctx);
		},

		openMessageDialog: async function (response) {
			if (!this._messageDialog) {
				var MessageDialog = await this.requirePromisified("restaurants/ui5/controller/MessageDialog");
				this._messageDialog = new MessageDialog(this.getRootControl());
			}
			return this._messageDialog.open(response);
		},

		requirePromisified: async function (dependency) {
			return new Promise((res, rej) => {
				sap.ui.require([dependency], function (component) {
					res(component);
				}, function (response) {
					rej(response);
				});
			});
		}

	});
});