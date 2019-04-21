sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types"
], function(BaseController, formatter, types) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Invoicing.Invoicing", {
		types: types,
		formatter: formatter
		
	});
});