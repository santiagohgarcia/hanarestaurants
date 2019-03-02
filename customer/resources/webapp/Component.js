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
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//Set core models
			sap.ui.getCore().setModel(this.getModel("i18n"), "i18n");

			// set the restaurants model
			var restaurantModel = models.createRestaurantsModel();
			this.setModel(restaurantModel);
			sap.ui.getCore().setModel(restaurantModel);
		}
	});
});