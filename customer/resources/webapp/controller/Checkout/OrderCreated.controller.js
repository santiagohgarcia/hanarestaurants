sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter"
], function(BaseController, types, models, formatter) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Checkout.OrderCreated", {

		types: types,
		models: models,
		formatter: formatter,
		
		onPressFinish:function(){
			
		}

	});
});