sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseController, formatter, types, models) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Staff.Staff", {
		types: types,
		formatter: formatter,
		models: models

	});
});