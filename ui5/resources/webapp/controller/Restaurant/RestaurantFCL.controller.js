sap.ui.define([
	"restaurants/ui5/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurant.RestaurantFCL", {

		onInit: function() {
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
		},

		_setSelectedIconTab: function(key) {
			this.byId("iconTabHeader").setSelectedKey(key);
		},

		_attachMenuMatched: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.OneColumn);
			this.byId("fcl").toBeginColumnPage(this.byId("menu").getId(), "fade");
			this._setSelectedIconTab("menu");
			this._bindRestaurant(evt);
		},

		_bindRestaurant: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${args.RestaurantId})`
			});
		},

		onSelectTab: function(evt) {
			var selectedKey = evt.getParameter("key");
			var restaurant = this.getView().getBindingContext().getObject();
			switch (selectedKey) {
				case "menu":
					this.getRouter().navTo("Menu", {
						RestaurantId: restaurant.RestaurantId
					});
					break;

			}
		},

		onEditRestaurant: function() {
			this.openRestaurantDialog(this.getView().getBindingContext());
		}

	});
});