sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/format/ChartFormatter'
], function(BaseController, formatter, types, models, JSONModel, ChartFormatter) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Reporting.Reporting", {
		types: types,
		formatter: formatter,

		onInit: function() {
			//Set popover
			var revenueByTime = this.byId("revenueByTime"),
				revenueByTimePopover = this.byId("revenueByTimePopover");
			this.setModel(new JSONModel(), "revenueByTime");
			revenueByTimePopover.connect(revenueByTime.getVizUid());
			this.getRouter().getRoute("Reporting").attachMatched(this._onReportingMatched.bind(this));

		},

		_onReportingMatched: function() {
			this._getRevenueByTime(this.byId("dateGroupBy").getSelectedKey());
		},

		onSelectDateGroupByChange: function() {
			this._getRevenueByTime(this.byId("dateGroupBy").getSelectedKey());
		},

		_getRevenueByTime: async function(dateGroupBy) {
			//Get Data	
			var response = await models.getRevenueByTime(dateGroupBy);

			var formatPattern = ChartFormatter.DefaultPattern; // set explored app's demo model on this sample
			//set properties
			this.byId("revenueByTime").setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					},
					dataShape: {
						primaryAxis: ["line", response.restaurants.map(() => "bar")].flat()
					}
				},
				valueAxis: {
					label: {
						visible: true
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				}
			});

			this.getModel("revenueByTime").setData(response.results);

			this._addFeeds(response.restaurants);
			this._addMeasures(response.restaurants)

		},

		_addMeasures: async function(restaurants) {
			var revenueByTimeDataSet = this.byId("revenueByTimeDataSet");
			var MeasureDefinition = await this.requirePromisified("sap/viz/ui5/data/MeasureDefinition");
			revenueByTimeDataSet.destroyMeasures()
				.addMeasure(new MeasureDefinition({
					name: "Total",
					value: "{Price}"
				}));
			restaurants.forEach(restaurantName => {
				revenueByTimeDataSet.addMeasure(new MeasureDefinition({
					name: restaurantName,
					value: `{${restaurantName}}`
				}));
			});
		},

		_addFeeds: async function(restaurants) {
			var FeedItem = await this.requirePromisified("sap/viz/ui5/controls/common/feeds/FeedItem");
			this.byId("revenueByTime").destroyFeeds()
				.addFeed(new FeedItem({
					uid: "categoryAxis",
					type: "Dimension",
					values: ["Time"]
				})).addFeed(new FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: ["Total", restaurants].flat()
				}));
		}

	});
});