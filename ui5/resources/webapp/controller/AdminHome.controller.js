sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter"
], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurants.RestaurantTiles", {
		formatter: formatter,
		onPressRestaurant: function(evt) {
			var restaurant = evt.getSource().getBindingContext().getObject();
			this.getRouter().navTo("Menu", {
				RestaurantId: restaurant.RestaurantId
			});
		},

		onPressStaff: function() {
			this.getRouter().navTo("Staff");
		},

		onAddRestaurant: function() {
			this.openRestaurantDialog();
		}

	});
});