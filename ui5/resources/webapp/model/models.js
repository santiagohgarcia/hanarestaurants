sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"restaurants/ui5/utils/PromisifiedODataModel"
], function(JSONModel, Device, PromisifiedODataModel) {
	"use strict";

	var baseURl = "https://hxehost:51030";

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
			return new PromisifiedODataModel(baseURl + "/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},

		updateRestaurantStaffRelation: function(staffRestaurantRelation) {
			return jQuery.ajax({
				type: "POST",
				data: JSON.stringify(staffRestaurantRelation),
				contentType: 'application/json',
				url: baseURl + `/xsjs/functions/UpdateRestaurantStaffRelation.xsjs`,
				dataType: "json"
			});
		},

		getNewOrderId: function(restaurant) {
			return jQuery.ajax({
				type: "GET",
				contentType: 'application/json',
				url: baseURl + `/xsjs/sequences/NewOrderId.xsjs?RestaurantId=${restaurant.RestaurantId}`,
				dataType: "json"
			});
		},

		getBase64: function(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			});
		},

		subscribeToRestaurantTopic: function(token, restaurant) {
			return jQuery.ajax({
				type: "POST",
				contentType: 'application/json',
				url: baseURl + `/xsjs/SubscribeToRestaurantTopic.xsjs`,
				dataType: "json",
				data: JSON.stringify({
					Token: token,
					RestaurantId: restaurant.RestaurantId
				})
			});
		}

	};
});