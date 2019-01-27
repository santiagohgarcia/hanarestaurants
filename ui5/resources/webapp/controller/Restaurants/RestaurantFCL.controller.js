sap.ui.define([
	"restaurants/ui5/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurants.RestaurantFCL", {

		onInit: function() {
			this.getRouter().getRoute("Orders").attachMatched(this._attachOrdersMatched.bind(this));
			this.getRouter().getRoute("Tables").attachMatched(this._attachTablesMatched.bind(this));
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
			this.getRouter().getRoute("TableDetail").attachMatched(this._attachTableDetailMatched.bind(this));
			this.getRouter().getRoute("PendingOrderItems").attachMatched(this._attachPendingOrderItems.bind(this));
		},

		_setSelectedIconTab: function(key) {
			this.byId("iconTabHeader").setSelectedKey(key);
		},

		_attachOrdersMatched: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.OneColumn);
			this.byId("fcl").toBeginColumnPage(this.byId("orderGrid").getId(), "fade");
			this._setSelectedIconTab("orders");
			this._bindRestaurant(evt);
		},

		_attachTablesMatched: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.OneColumn);
			this.byId("fcl").toBeginColumnPage(this.byId("tableGrid").getId(), "fade");
			this._setSelectedIconTab("tables");
			this._bindRestaurant(evt);
		},

		_attachPendingOrderItems: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.OneColumn);
			this.byId("fcl").toBeginColumnPage(this.byId("pendingOrderItems").getId(), "fade");
			this._setSelectedIconTab("pendingItems");
			this._bindRestaurant(evt);
		},

		_attachMenuMatched: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.OneColumn);
			this.byId("fcl").toBeginColumnPage(this.byId("menu").getId(), "fade");
			this._setSelectedIconTab("menu");
			this._bindRestaurant(evt);
		},

		_attachTableDetailMatched: function(evt) {
			this.getModel("view").setProperty("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
			this.byId("fcl").toMidColumnPage(this.byId("tableDetail").getId(), "fade");
			this.byId("fcl").toBeginColumnPage(this.byId("tableGrid").getId(), "fade");
			this._setSelectedIconTab("tables");
			this._bindRestaurant(evt);
		},

		_bindRestaurant: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${args.RestaurantId})`,
				model: "restaurants"
			});
		},

		onPressHome: function() {
			this.getRouter().navTo("RestaurantTiles");
		},

		onSelectTab: function(evt) {
			var selectedKey = evt.getParameter("key");
			var restaurant = this.getView().getBindingContext("restaurants").getObject();
			switch (selectedKey) {
				case "tables":
					this.getRouter().navTo("Tables", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
				case "menu":
					this.getRouter().navTo("Menu", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
				case "pendingItems":
					this.getRouter().navTo("PendingOrderItems", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
				case "orders":
					this.getRouter().navTo("Orders", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
			}
		}

	});
});