sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, formatter, types, models, Filter, FO) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Tables.TableDetail", {
		types: types,

		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("TableDetail").attachMatched(this._attachTableDetailMatched.bind(this));
		},

		_attachTableDetailMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Tables(RestaurantId=${args.RestaurantId},RestaurantTableId=${args.RestaurantTableId})`,
				parameters: {
					expand: "Orders"
				},
				model: "restaurants"
			});
		},

		onClose: function() {
			this.onNavBack();
		},

		onEditTable: function(evt) {
			var tableCtx = evt.getSource().getBindingContext("restaurants");
			this.openTableDialog(tableCtx);
		},

		onDeleteTable: function(evt) {
			var tableCtx = evt.getSource().getBindingContext("restaurants");
			var restaurantId = tableCtx.getProperty("RestaurantId");
			var tableId = tableCtx.getProperty("RestaurantTableId");
			this.getModel("restaurants").remove(tableCtx.getPath(), {
				success: function() {
					this.showMessageToast("TableDialog_TableDeleted", [tableId]);
					this.getModel("restaurants").refresh();
					this.getRouter().navTo("Tables", {
						RestaurantId: restaurantId
					}, true);
				}.bind(this)
			});
		},

		onSelectStatusTab: function(evt) {
			var selectedKey = evt.getParameter("selectedKey");
			var filters = [];
			if (selectedKey !== "active") {
				filters.push(new Filter("Status.StatusId", FO.EQ, Number(selectedKey)));
			}
			this.byId("tableOrderList").getBinding("items").filter(filters);
		},

		onAddOrder: function(evt) {
			var restaurantTable = evt.getSource().getBindingContext("restaurants").getObject();
			this.openOrderDialog({
				RestaurantId: restaurantTable.RestaurantId,
				RestaurantTableId: restaurantTable.RestaurantTableId
			});
		},

		onPressCloseTable: function(evt) {
			var restaurantTable = evt.getSource().getBindingContext("restaurants").getObject();
			models.closeTable(restaurantTable.RestaurantId, restaurantTable.RestaurantTableId)
				.then(() => {
					this.showMessageToast("TableDetail_TableClosed", [restaurantTable.RestaurantTableId]);
					this.getModel("restaurants").refresh();
				});
		}

	});
});