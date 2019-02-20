sap.ui.define([
	"restaurants/ui5/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurants.RestaurantTiles", {

		onPressRestaurant: function(evt) {
			var restaurant = evt.getSource().getBindingContext().getObject();
			this.getRouter().navTo("Menu", {
				RestaurantId: restaurant.RestaurantId
			});
		},

		onAddRestaurant: function() {
			this.openRestaurantDialog();
		}
		
	});
});