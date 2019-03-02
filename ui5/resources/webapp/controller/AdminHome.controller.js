sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types"
], function(BaseController, formatter,types) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.AdminHome", {
		formatter: formatter,
		types:types,
		/*	onPressRestaurant: function(evt) {
				var restaurant = evt.getSource().getBindingContext().getObject();
				this.getRouter().navTo("Menu", {
					RestaurantId: restaurant.RestaurantId
				});
			},*/

		onAddRestaurant: function() {
			this.openRestaurantDialog();
		},
		onPressStaff: function() {
			this.getRouter().navTo("Staff");
		},

		onPressManagerView: function() {
			this.getRouter().navTo("ManagerHome");
		},

		onPressMenus: function() {
			this.getRouter().navTo("Menus");
		},

		onEditRestaurant: function(evt) {
			this.openRestaurantDialog(evt.getSource().getBindingContext());
		}

	});
});