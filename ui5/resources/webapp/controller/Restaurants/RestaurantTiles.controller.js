sap.ui.define([
	"restaurants/ui5/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurants.RestaurantTiles", {

		onPressRestaurant: function(evt) {
			var restaurant = evt.getSource().getBindingContext("restaurants").getObject();
			this.getRouter().navTo("Tables", {
				RestaurantId: restaurant.RestaurantId
			});
		},

		onAddRestaurant: function() {
			this.openRestaurantDialog();
		}
		
	});
});