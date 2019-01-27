sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/utils/Validator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"restaurants/ui5/model/models",
	"restaurants/ui5/model/types",
	"sap/ui/model/json/JSONModel"
], function(BaseDialog, BaseController, Validator, Filter, FO, models, types, JSONModel) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Orders.OrderDialog", {

		types: types,
		models: models,
		getDialogId: function() {
			return "orderDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Orders.OrderDialog";
		},

		getNewContext: function(ctx) {
			this._dialog.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
			if (ctx.RestaurantId || ctx.RestaurantTableId) {
				//this.filterCategories(ctx.RestaurantId);

				models.getNewOrderId(ctx.RestaurantId, ctx.RestaurantTableId) //TODO: change this for AWAIT!!
					.then(response => {
						ctx.RestaurantOrderId = response.RestaurantOrderId;
						ctx.Items = [];
						ctx = this._dialog.getModel("restaurants").createEntry("/Orders", {
							properties: ctx
						});
						this._dialog.setBindingContext(ctx, "restaurants");
					});
			} else {
				return ctx;
			}
		},

		getFieldGroup: function() {
			return "tableFields";
		},

		success: function() {
			var order = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("OrderDialog_OrderSaved", [order.getProperty("RestaurantOrderId")]);
			BaseDialog.prototype.success.apply(this);
		},

		onSearchProducts: function(evt) {
			var query = evt.getParameter("newValue");
			this._view.byId("productsTable").getBinding("items").filter(query ? new Filter({
				path: "Description",
				operator: FO.Contains,
				value1: query,
				caseSensitive: false
			}) : []);
		},

		onPressProduct: function(evt) {
			var restaurantsModel = this._dialog.getModel("restaurants");
			var orderCtx = this._dialog.getBindingContext("restaurants");
			var order = orderCtx.getObject();
			var product = evt.getSource().getBindingContext("restaurants").getObject();
			var producExists = order.Items
				.map(i => this._dialog.getModel("restaurants").getObject("/" + i))
				.map(i => i.Product).indexOf(product.ProductId) >= 0;
			if (!producExists) {
				var orderItemCtx = restaurantsModel.createEntry("/OrderItems", {
					properties: {
						RestaurantId: order.RestaurantId,
						RestaurantTableId: order.RestaurantTableId,
						RestaurantOrderId: order.RestaurantOrderId,
						Product: product.ProductId,
						ProductDescription: product.Description,
						Quantity: 1,
						UnitPrice: product.Price
					},
					context: orderCtx
				});
				order.Items.push(orderItemCtx.getPath().substring(1));
				restaurantsModel.setProperty("Items", order.Items, orderCtx);
				this.sumOrderTotal();
			}
		},

		onDeleteOrderItem: function(evt) {
			var restaurantsModel = this._dialog.getModel("restaurants");
			var orderCtx = this._dialog.getBindingContext("restaurants");
			var orderItemCtx = evt.getParameter("listItem").getBindingContext("restaurants");
			var order = orderCtx.getObject();
			order.Items = order.Items.filter(orderItemPath => orderItemPath !== orderItemCtx.getPath().substring(1));
			restaurantsModel.setProperty("Items", order.Items, orderCtx);
			restaurantsModel.deleteCreatedEntry(orderItemCtx);
			this.sumOrderTotal();
		},

		getCategoryDescr: function(ctx) {
			return ctx.getProperty("Category/Description");
		},

		onChangeQuantity: function() {
			this.sumOrderTotal();
		},

		sumOrderTotal: function() {
			var sum = this._dialog.getBindingContext("restaurants").getProperty("Items")
				.map(i => this._dialog.getModel("restaurants").getObject("/" + i))
				.map(i => i.Quantity * i.UnitPrice)
				.reduce(((a, b) => a + b), 0);
			this._dialog.getModel("orderJSON").setProperty("/Total", sum);
		}

		/*	filterCategories: function(restaurantId, parentCategoryId) {
				var categoriesBinding = this._view.byId("categoriesGrid").getBinding("items");
				if (categoriesBinding) {
					var filters = [];
					filters.push(new Filter("RestaurantId", FO.EQ, restaurantId));
					filters.push(new Filter("ParentCategory.CategoryId", FO.EQ, parentCategoryId || 0));
					categoriesBinding.filter(filters);
				}
			}*/

	});

});