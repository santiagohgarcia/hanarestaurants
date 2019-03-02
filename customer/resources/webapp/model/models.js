sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	var baseURl = "https://hxehost:51030";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

	/*	createRestaurantsModel: function() {
			return new ODataModel(baseURl + "/xsodata/Restaurants.xsodata", {
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put
			});
		},
*/
	};
});