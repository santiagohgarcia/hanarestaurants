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
		onInit: function() {
			this.getRouter().getRoute("Menu").attachMatched(this._attachMenuMatched.bind(this));
		},

		_attachMenuMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.byId("categoryProductsView").initialize({
				RestaurantId: args.RestaurantId
			});
			this.byId("categoryProductsView").setMode("U");
		}

	});
});