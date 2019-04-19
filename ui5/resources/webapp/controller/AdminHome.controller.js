sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseController, formatter, types, models) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.AdminHome", {
		formatter: formatter,
		types: types,

		onInit: function() {
			models.getMe().then(me => {
				var a = me;
			});
		},

		onAddRestaurant: function() {
			this.openRestaurantDialog();
		},
		onPressStaff: function() {
			this.getRouter().navTo("Staff");
		},

		onPressManagerView: function(evt) {
			this.getRouter().navTo("ManagerHome", {
				RestaurantId: evt.getSource().getBindingContext().getProperty("RestaurantId")
			});
		},

		onPressMenus: function(evt) {
			this.getRouter().navTo("Menu", {
				RestaurantId: evt.getSource().getBindingContext().getProperty("RestaurantId")
			});
		},

		onEditRestaurant: function(evt) {
			this.openRestaurantDialog(evt.getSource().getBindingContext());
		},

		onPressReporting: function() {
			this.getRouter().navTo("Reporting");
		}

	});
});