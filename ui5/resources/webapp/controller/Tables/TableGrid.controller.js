sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types"
], function(BaseController, formatter, types) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Tables.TableGrid", {

		formatter: formatter,
		types: types,

		onInit: function() {
			this.getRouter().getRoute("Tables").attachMatched(this._attachTablesMatched.bind(this));
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
			this.getRouter().getRoute("TableDetail").attachMatched(this._attachRestaurantMatched.bind(this));
			this.getRouter().getRoute("PendingOrders").attachMatched(this._attachRestaurantMatched.bind(this));
		},

		_attachTablesMatched: function(evt) {
			this.byId("tablesObjectPage").setSelectedSection(this.byId("tablesSection"));
			this._attachRestaurantMatched(evt);
		},

		_attachMenuMatched: function(evt) {
			this.byId("tablesObjectPage").setSelectedSection(this.byId("menuSection"));
			this._attachRestaurantMatched(evt);
		},

		_attachRestaurantMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${args.RestaurantId})`,
				model: "restaurants"
			});
		},

		getCustomerName: function(ctx) {
			return ctx.getProperty("Customer/Name");
		},

		onAddTable: function() {
			var restaurantCtx = this.getView().getBindingContext("restaurants");
			this.openTableDialog({
				RestaurantId: restaurantCtx.getProperty("RestaurantId")
			});
		},

		onPressTable: function(evt) {
			var table = evt.getSource().getBindingContext("restaurants").getObject();
			this.getRouter().navTo("TableDetail", {
				RestaurantId: table.RestaurantId,
				RestaurantTableId: table.RestaurantTableId
			});
		},

		onAddOrder: function(evt) {
			var restaurantTable = evt.getSource().getBindingContext("restaurants").getObject();
			this.openOrderDialog({
				RestaurantId: restaurantTable.RestaurantId,
				RestaurantTableId: restaurantTable.RestaurantTableId
			});
		},

		onTabChange: function(evt) {
			var restaurant = evt.getSource().getBindingContext("restaurants").getObject();
			var sectionId = evt.getParameter("section").getId();
			switch (sectionId) {
				case this.byId("menuSection").getId():
					this.getRouter().navTo("Menu", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
				case this.byId("tablesSection").getId():
					this.getRouter().navTo("Tables", {
						RestaurantId: restaurant.RestaurantId
					});
					break;
			}
		}

	});
});