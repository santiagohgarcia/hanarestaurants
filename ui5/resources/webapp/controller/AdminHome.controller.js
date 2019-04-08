sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types"
], function(BaseController, formatter, types) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.AdminHome", {
		formatter: formatter,
		types: types,
		
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
		}

	});
});