sap.ui.define([
	"sap/ui/model/SimpleType",
	"sap/ui/model/CompositeType",
	"sap/ui/model/ValidateException",
	"sap/ui/model/type/Date",
	"sap/ui/model/type/DateTime"
], function(SimpleType, CompositeType, ValidateException, Date, DateTime) {
	"use strict";

	return {

		dateType: Date.extend("DateType", {

			setFormatOptions: function(oFormatOptions) {
				var standardFormatOptions = jQuery.extend(oFormatOptions, {
					pattern: "dd/MM/yyyy"
				});
				this.oFormatOptions = standardFormatOptions;
				this._createFormats();
			}

		}),

		dateTimeType: DateTime.extend("DateTimeType", {

			setFormatOptions: function(oFormatOptions) {
				var standardFormatOptions = jQuery.extend(oFormatOptions, {
					relative: true,
					relativeScale: "auto"
				});
				this.oFormatOptions = standardFormatOptions;
				this._createFormats();
			}

		}),

		floatType: sap.ui.model.type.Float.extend("CurrencyType", {

			constructor: function(oFormatOptions, oConstraints) {
				var standardFormatOptions = jQuery.extend({
					groupingEnabled: false,
					groupingSeparator: ".",
					minIntegerDigits: 0,
					decimalSeparator: ",",
					minFractionDigits: 0,
					maxFractionDigits: 2,
					parseAsString: true,
					roundingMode: sap.ui.core.format.NumberFormat.RoundingMode.HALF_TOWARDS_ZERO
				}, oFormatOptions);
				var standardConstraints = jQuery.extend({
					minimum: 1,
					maximum: 999999999999999,
					maximumExclusive: false,
					minimumExclusive: false
				}, oConstraints);
				sap.ui.model.type.Float.prototype.constructor.apply(this, [standardFormatOptions, standardConstraints]);
			},

			formatValue: function(value) {
				if (value) {
					return sap.ui.model.type.Float.prototype.formatValue.apply(this, [Number(value), "string"]);
				} else {
					return "";
				}
			},

			validateValue: function(value) {
				sap.ui.model.type.Float.prototype.validateValue.apply(this, [value]);
				var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
				if (this.oConstraints.minimumExclusive && Number(value) <= this.oConstraints.minimum) {
					throw new ValidateException(i18n.getText("insertHighValue", [this.oConstraints.minimum]));
				}
				if (this.oConstraints.maximumExclusive && Number(value) >= this.oConstraints.maximum) {
					throw new ValidateException(i18n.getText("insertLowValue", [this.oConstraints.maximum]));
				}
			}

		}),

		hanaBoolean: SimpleType.extend("hanaBoolean", {
			formatValue: function(oValue) {
				return oValue === 1 ? true : false;
			},
			parseValue: function(oValue) {
				return oValue ? 1 : 0;
			},
			validateValue: function(value) {}
		})

	};
});