sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/json/JSONModel"
], function(BaseController, formatter, types, models, JSONModel) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Menu.Menu", {
		types: types,
		formatter: formatter,
		models: models,
		onInit: function() {
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
			this.setModel(new JSONModel(), "categoriesJSON");
		},

		_attachMenuMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this._getCategories(args.RestaurantId).then(this._bindFirstCategory.bind(this));
		},

		_bindFirstCategory: function() {
			var category = this.byId("categoryTree").getItems()[0].getBindingContext("categoriesJSON").getObject();
			this.byId("categoryContainer").bindElement(
				`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
		},

		_getCategories: function(restaurantId) {
			var categoryTree = this.byId("categoryTree");
			categoryTree.setBusy(true);
			return models.getCategories(restaurantId)
				.then(categories => {
					this.getModel("categoriesJSON").setProperty("/", categories);
					categoryTree.setBusy(false);
				});
		},

		onPressCategory: function(evt) {
			var category = evt.getSource().getBindingContext("categoriesJSON").getObject();
			this.byId("categoryContainer").bindElement(
				`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
		},

		//CATEGORY

		onAddCategory: function(evt) {
			var restaurant = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: restaurant.RestaurantId
			}).then(category => {
				this.byId("categoryContainer").bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
				this._getCategories(category.RestaurantId);
			});
		},

		onAddSubCategory: function(evt) {
			var parentCategory = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: parentCategory.RestaurantId,
				"ParentCategory.CategoryId": parentCategory.CategoryId
			}).then(category => {
				this.byId("categoryContainer").bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
				this._getCategories(category.RestaurantId);
			});
		},

		onEditCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			this.openCategoryDialog(categoryCtx).then(category => {
				this._getCategories(category.RestaurantId);
			});
		},

		onDeleteCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			var restaurantId = categoryCtx.getProperty("RestaurantId");
			var categoryId = categoryCtx.getProperty("CategoryId");
			var parentCategoryId = categoryCtx.getProperty("ParentCategory.CategoryId");
			this.getModel("restaurants").remove(categoryCtx.getPath(), {
				success: function() {
					this.showMessageToast("CategoryDialog_CategoryDeleted", [categoryId]);
					this._getCategories(restaurantId).then(() => {
						if (parentCategoryId > 0) {
							this.byId("categoryContainer").bindElement(
								`restaurants>/Categories(RestaurantId=${restaurantId},CategoryId=${parentCategoryId})`);
						} else {
							this._bindFirstCategory();
						}
					});
				}.bind(this)
			});
		},

		//PRODUCT

		onAddProduct: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this.openProductDialog({
				"Category.CategoryId": category.CategoryId
			});
		},

		onEditProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext("restaurants");
			this.openProductDialog(productCtx);
		},

		onDeleteProduct: function(evt) {
			var productCtx = evt.getParameter("listItem").getBindingContext("restaurants");
			var productId = productCtx.getProperty("ProductId");
			this.getModel("restaurants").remove(productCtx.getPath(), {
				success: function() {
					this.showMessageToast("ProductDialog_ProductDeleted", [productId]);
					this.getModel("restaurants").refresh();
				}.bind(this)
			});
		}

	});
});