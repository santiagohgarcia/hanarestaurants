sap.ui.define(["sap/ui/core/ValueState", "sap/ui/core/IconColor"], function(ValueState, IconColor) {
	"use strict";

	return {

		getLength: function(list) {
			return list && list.length;
		},

		orderStatusToValueState: function(status) {
			return {
				"PENDING": ValueState.Warning,
				"CANCELLED": ValueState.Error,
				"PAYED": ValueState.Success
			}[status];
		},

		orderStatusToIcon: function(status) {
			return {
				"PENDING": "sap-icon://pending",
				"CANCELLED": "sap-icon://decline",
				"PAYED": "sap-icon://accept"
			}[status];
		},

		orderStatusToIconColor: function(status) {
			return {
				"PENDING": IconColor.Critical,
				"CANCELLED": IconColor.Negative,
				"PAYED": IconColor.Positive
			}[status];
		}

	};
});