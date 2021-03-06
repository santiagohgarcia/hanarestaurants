sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseController, formatter, types, models) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Menu.Menu", {
		types: types,
		formatter: formatter,
		models: models,

		onInit: function() {
			this.getRouter().getRoute("Menu").attachMatched(this._onMenuMatched.bind(this));
		},

		_onMenuMatched: function(evt) {
			var params = evt.getParameter("arguments");
			this.getView().bindElement(`/Restaurants(RestaurantId=${params.RestaurantId})`);
		},

	/*	onSelectRestaurant: function(evt) {
			var restaurant = evt.getParameter("item").getBindingContext().getObject();
			this.getRouter().navTo("Menu", {
				RestaurantId: restaurant.RestaurantId
			},true);
		},*/

		onSelectCategory: function(evt) {
			var category = evt.getParameter("listItem").getBindingContext().getObject();
			this._bindCategory(category);
		},

		_bindCategory: function(category) {
			this.byId("category").bindElement({
				path: `/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`,
				parameters: {
					expand: "Categories,Categories/Products"
				}
			});
		},

		//CATEGORIES
		onAddCategory: function() {
			var restaurant = this.getView().getBindingContext().getObject();
			this.openCategoryDialog({
				RestaurantId: restaurant.RestaurantId
			});
		},

		onEditCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext();
			this.openCategoryDialog(categoryCtx);
		},

		onDeleteCategory: function(evt) {
			var categoryCtx = evt.getParameter("listItem").getBindingContext();
			var categoryId = categoryCtx.getProperty("CategoryId");
			this.getModel().remove(categoryCtx.getPath(), {
				success: function() {
					this.showMessageToast("CategoryDeleted", [categoryId]);
				}.bind(this)
			});
		},

		//PRODUCTS

		onAddProduct: function(evt) {
			var category = evt.getSource().getBindingContext().getObject();
			this.openProductDialog({
				RestaurantId: category.RestaurantId,
				"Category.CategoryId": category.CategoryId
			});
		},

		onEditProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext();
			this.openProductDialog(productCtx);
		},

		onDeleteProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext();
			var productId = productCtx.getProperty("ProductId");
			this.getModel().remove(productCtx.getPath(), {
				success: function() {
					this.showMessageToast("ProductDeleted", [productId]);
				}.bind(this)
			});
		}

	});
});