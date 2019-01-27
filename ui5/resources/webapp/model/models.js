sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(JSONModel, Device, ODataModel, Filter, FO) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createViewModel: function() {
			return new JSONModel();
		},

		createRestaurantsModel: function() {
			return new ODataModel("https://hxehost:51029/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},

		getNewOrderId: function(restaurantId, restaurantTableId) {
			return jQuery.ajax({
				type: "GET",
				url: `https://hxehost:51029/xsjs/sequences/NewRestaurantOrderId.xsjs?RestaurantId=${restaurantId}&RestaurantTableId=${restaurantTableId}`,
				contentType: "application/json",
				dataType: "json"
			});
		},

		getNewProductId: function() {
			return jQuery.ajax({
				type: "GET",
				url: `https://hxehost:51029/xsjs/sequences/NewProductId.xsjs`,
				contentType: "application/json",
				dataType: "json"
			});
		},

		setFavImage: function(productId, imageId) {
			return jQuery.ajax({
				type: "POST",
				url: `https://hxehost:51029/xsjs/functions/SetFavImage.xsjs?ProductId=${productId}&ImageId=${imageId}`,
				contentType: "application/json",
				dataType: "json"
			});
		},

		getProductImageUploadUrl: function(productId) {
			return `https://hxehost:51029/xsjs/functions/NewProductId.xsjs?ProductId=${productId}`;
		},

		getFavProductImageDownloadUrl: function(images) {
			var restaurantModel = sap.ui.getCore().getModel("restaurants");
			var favImage = images.map(i => restaurantModel.getObject("/" + i))
				.find(i => i.Favorite);
				
			if (favImage.ProductId && favImage.ImageId) {
				return `https://hxehost:51029/xsjs/functions/GetProductImage.xsjs?ProductId=${favImage.ProductId}&ImageId=${favImage.ImageId}`;
			} else {
				return "sap-icon://product";
			}
		},

		getProductImageDownloadUrl: function(image) {
			if (image.ProductId && image.ImageId) {
				return `https://hxehost:51029/xsjs/functions/GetProductImage.xsjs?ProductId=${image.ProductId}&ImageId=${image.ImageId}`;
			} else {
				return "sap-icon://product";
			}
		},

		changeOrderStatus: function(orderCtx, status) {
			var restaurantModel = sap.ui.getCore().getModel("restaurants");
			restaurantModel.setProperty("Status.StatusId", status, orderCtx);
			return new Promise(function(resolve, reject) {
				restaurantModel.submitChanges({
					success: function(resp) {
						resolve(resp);
					},
					error: function(resp) {
						reject(resp);
					}
				});
			});
		},

		closeTable: function(restaurantId, restaurantTableId) {
			return jQuery.ajax({
				type: "POST",
				url: `https://hxehost:51029/xsjs/functions/CloseTable.xsjs?RestaurantId=${restaurantId}&RestaurantTableId=${restaurantTableId}`,
				contentType: "application/json",
				dataType: "json"
			});
		},

		getCategories: function(restaurantId, categoryId) {
			var restaurantModel = sap.ui.getCore().getModel("restaurants");
			return new Promise(function(resolve, reject) {
				restaurantModel.read("/Categories", {
					filters: [
						new Filter("RestaurantId", FO.EQ, restaurantId),
						new Filter("ParentCategory.CategoryId", FO.EQ, categoryId || 0)
					],
					urlParameters: {
						"$expand": "SubCategories/SubCategories/SubCategories" //Max 4 levels
					},
					success: function(resp) {
						resolve(resp.results.map(this._formatSubCategories.bind(this)));
					}.bind(this),
					error: function(resp) {
						reject(resp);
					}
				});
			}.bind(this));
		},

		_formatSubCategories: function(category) {
			category.SubCategories = category.SubCategories.results || [];
			category.SubCategories = category.SubCategories.map(this._formatSubCategories.bind(this));
			return category;
		}
	};
});