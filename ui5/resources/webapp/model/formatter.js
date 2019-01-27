sap.ui.define(["sap/ui/core/ValueState"], function(ValueState) {
	"use strict";

	return {

		orderStatusToState: function(status) {
			var state;
			switch (status) {
				case 1:
				case 2:
					state = ValueState.Success;
					break;
				case 3:
					state = ValueState.Warning;
					break;
				case 4:
					state = ValueState.Error;
					break;
			}
			return state;
		},
		
		tableStatusToState: function(status) {
			var state;
			switch (status) {
				case 1:
					state = ValueState.Success;
					break;
				case 2:
					state = ValueState.Error;
					break;
			}
			return state;
		},

		statusToIcon: function(status) {
			var icon;
			switch (status) {
				case 1: // Payed
					icon = "sap-icon://lead";
					break;
				case 2: //Ready
					icon = "sap-icon://accept";
					break;
				case 3: //In preparation
					icon = "sap-icon://pending";
					break;
				case 4: //Cancel
					icon = "sap-icon://decline";
					break;
			}
			return icon;
		},

		concatOrderDetails: function(itemsPath) {
			var resturantModel = sap.ui.getCore().getModel("restaurants");
			return itemsPath.map(itemPath => {
				var item = resturantModel.getObject("/" + itemPath, {
					expand: "Product"
				});
				return `${item.Quantity} x ${item.ProductDescription}`;
			}).join(", ");
		}

	};
});