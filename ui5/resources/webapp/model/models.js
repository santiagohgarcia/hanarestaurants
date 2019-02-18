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
			return new ODataModel("https://hxehost:51030/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},

		getNewProductId: function() {
			return jQuery.ajax({
				type: "GET",
				url: `https://hxehost:51030/xsjs/sequences/NewProductId.xsjs`,
				contentType: "application/json",
				dataType: "json"
			});
		},

		getProductImageUploadUrl: function(productId) {
			return `https://hxehost:51030/xsjs/functions/NewProductId.xsjs?ProductId=${productId}`;
		},

		getProductImageDownloadUrl: function(image) {
			if (image.ProductId && image.ImageId) {
				return `https://hxehost:51030/xsjs/functions/GetProductImage.xsjs?ProductId=${image.ProductId}&ImageId=${image.ImageId}`;
			} else {
				return "sap-icon://product";
			}
		}

	
	};
});