sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(JSONModel, Device, ODataModel) {
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
			return new ODataModel("/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},

		updateRestaurantStaffRelation: function(staffRestaurantRelation,add) {
			return jQuery.ajax({
				type: add ? "POST" : "DELETE",
				data: JSON.stringify(staffRestaurantRelation),
				contentType: 'application/json',
				url: `/xsjs/functions/UpdateRestaurantStaffRelation.xsjs`,
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
		}

	};
});