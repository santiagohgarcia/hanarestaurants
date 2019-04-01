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
				"READY": ValueState.Success
			}[status];
		},

		orderStatusToIcon: function(status) {
			return {
				"PENDING": "sap-icon://pending",
				"CANCELLED": "sap-icon://decline",
				"READY": "sap-icon://accept"
			}[status];
		},

		orderStatusToIconColor: function(status) {
			return {
				"PENDING": IconColor.Critical,
				"CANCELLED": IconColor.Negative,
				"READY": IconColor.Positive
			}[status];
		},

		paymentMethodToIcon: function(paymentMethod) {
			return {
				"CASH": "sap-icon://money-bills",
				"CREDIT_CARD": "sap-icon://credit-card"
			}[paymentMethod];
		}

	};
});