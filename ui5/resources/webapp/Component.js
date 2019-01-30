sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"restaurants/ui5/model/models",
	"restaurants/ui5/controller/Restaurants/RestaurantDialog",
	"restaurants/ui5/controller/Tables/TableDialog",
	"restaurants/ui5/controller/Menu/Category/CategoryDialog",
	"restaurants/ui5/controller/Menu/Product/ProductDialog"
], function(UIComponent, Device, models, RestaurantDialog, TableDialog, CategoryDialog, ProductDialog) {
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

			// set the restaurants model
			var restaurantModel = models.createRestaurantsModel();
			this.setModel(restaurantModel, "restaurants");
			sap.ui.getCore().setModel(restaurantModel, "restaurants");

			//CREATE COMMON DIALOGS
			this._restaurantDialog = new RestaurantDialog(this.getRootControl());
			this._tableDialog = new TableDialog(this.getRootControl());
			this._categoryDialog = new CategoryDialog(this.getRootControl());
			this._productDialog = new ProductDialog(this.getRootControl());
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

		openTableDialog: function(ctx) {
			return this._tableDialog.open(ctx);
		},

		openCategoryDialog: function(ctx) {
			return this._categoryDialog.open(ctx);
		},

		openProductDialog: function(ctx) {
			return this._productDialog.open(ctx);
		}
	});
});