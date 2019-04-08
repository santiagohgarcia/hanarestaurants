sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"customer/customer/utils/PromisifiedODataModel"
], function(JSONModel, Device, PromisifiedODataModel) {
	"use strict";

	var baseURl = "https://hxehost:51030";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createRestaurantsModel: function() {
			return new PromisifiedODataModel(baseURl + "/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},

		getNewOrderId: function(restaurant) {
			return jQuery.ajax({
				type: "GET",
				contentType: 'application/json',
				url: baseURl + `/xsjs/sequences/NewOrderId.xsjs?RestaurantId=${restaurant.RestaurantId}`,
				dataType: "json"
			});
		}

	};
});