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
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
		},

		_attachMenuMatched: function(evt) {

		},

		onPressCategory: function(evt) {
			var subcategoriesPage = this.byId("subcategories");
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			subcategoriesPage.bindElement(`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
			this.byId("menuSplitCont").toMaster(subcategoriesPage);
		},

		onPressSubCategoriesBack: function() {
			this.byId("menuSplitCont").backMaster();
		},

		onSubCategoryPress: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this.byId("menuSplitCont").toDetail(this.byId("category"));
			this.byId("category").bindElement(`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
		},

		//CATEGORIES
		onAddCategory: function() {
			var restaurant = this.getView().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: restaurant.RestaurantId
			});
		},

		onAddSubCategory: function(evt) {
			var parentCategory = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: parentCategory.RestaurantId,
				"ParentCategory.CategoryId": parentCategory.CategoryId
			});
		},

		onEditCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			this.openCategoryDialog(categoryCtx);
		},

		onDeleteCategory: function(evt) {
			var categoryCtx = evt.getParameter("listItem").getBindingContext("restaurants");
			var categoryId = categoryCtx.getProperty("CategoryId");
			this.getModel("restaurants").remove(categoryCtx.getPath(), {
				success: function() {
					this.showMessageToast("CategoryDialog_CategoryDeleted", [categoryId]);
				}.bind(this)
			});
		},

		//PRODUCTS

		onAddProduct: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this.openProductDialog({
				RestaurantId: category.RestaurantId,
				"Category.CategoryId": category.CategoryId
			});
		},

		onEditProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext("restaurants");
			this.openProductDialog(productCtx);
		},

		onDeleteProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext("restaurants");
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