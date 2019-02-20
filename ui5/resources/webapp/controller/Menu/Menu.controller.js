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

		onCategoriesReceived: function(evt) {
			var data = evt.getParameter("data"),
				categoryList = this.byId("categoryList");
			if (data) {
				var category = data.results[0];
				this.byId("category").bindElement(
					`/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
				categoryList.setSelectedItem(categoryList.getItems()[0]);
			}
		},

		onSelectCategory: function(evt) {
			var category = evt.getParameter("listItem").getBindingContext().getObject();
			this.byId("category").bindElement(
				`/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
		},

		//CATEGORIES
		onAddCategory: function() {
			var restaurant = this.getView().getBindingContext().getObject();
			this.openCategoryDialog({
				RestaurantId: restaurant.RestaurantId
			});
		},

		onAddSubCategory: function(evt) {
			var parentCategory = evt.getSource().getBindingContext().getObject();
			this.openCategoryDialog({
				RestaurantId: parentCategory.RestaurantId,
				"ParentCategory.CategoryId": parentCategory.CategoryId
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

		onDeleteSubCategory: function(evt) {
			var categoryCtx = evt.getSource.getBindingContext();
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