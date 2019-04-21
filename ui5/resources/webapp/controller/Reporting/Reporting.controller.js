sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"sap/ui/model/json/JSONModel"
], function(BaseController, formatter, types, JSONModel) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Reporting.Reporting", {
		types: types,
		formatter: formatter,

		onInit: async function() {
			//Set popover
			var revenueByTime = this.byId("revenueByTime"),
				revenueByTimePopover = this.byId("revenueByTimePopover");
			this.setModel(new JSONModel(), "revenueByTime");
			this.getRouter().getRoute("Reporting").attachMatched(this._onReportingMatched.bind(this));
			revenueByTimePopover.connect(revenueByTime.getVizUid());
		},

		_onReportingMatched: function() {
			this._getRevenueByTime(this.byId("dateGroupBy").getSelectedKey());
		},

		onSelectDateGroupByChange: function() {
			this._getRevenueByTime(this.byId("dateGroupBy").getSelectedKey());
		},

		_getRevenueByTime: async function(dateGroupBy) {
			//Get Data	
			var models = await this.requirePromisified("restaurants/ui5/model/models");
			var response = await models.getRevenueByTime(dateGroupBy);

			//set properties
			this.byId("revenueByTime").setVizProperties({
				plotArea: {
					window: {
						start: "firstDataPoint",
						end: "lastDataPoint"
					},
					dataLabel: {
						visible: true
					},
					dataShape: {
						primaryAxis: ["line", response.restaurants.map(() => "bar")].flat()
					}
				},
				valueAxis: {
					visible: true,
					title: {
						visible: false
					}
				},
				timeAxis: {
					levels: this._getLevels(dateGroupBy),
					title: {
						visible: false
					},
					interval: {
						unit: ''
					}
				},
				title: {
					visible: false
				},
				interaction: {
					syncValueAxis: false
				}
			});

			this.getModel("revenueByTime").setData(response.results);

			this._addFeeds(response.restaurants);
			this._addMeasures(response.restaurants)

		},

		_getLevels: function(dateGroupBy) {
			return {
				"Date": ["year", "month", "day"],
				"MonthYear": ["year", "month"],
				"Year": ["year"]
			}[dateGroupBy];
		},

		_addMeasures: async function(restaurants) {
			var revenueByTimeDataSet = this.byId("revenueByTimeDataSet");
			var MeasureDefinition = await this.requirePromisified("sap/viz/ui5/data/MeasureDefinition");
			revenueByTimeDataSet.destroyMeasures()
				.addMeasure(new MeasureDefinition({
					name: "Total",
					unit: "ARS",
					value: "{Total}"
				}));
			restaurants.forEach(restaurantName => {
				revenueByTimeDataSet.addMeasure(new MeasureDefinition({
					name: restaurantName,
					unit: "ARS",
					value: `{${restaurantName}}`
				}));
			});
		},

		_addFeeds: async function(restaurants) {
			var FeedItem = await this.requirePromisified("sap/viz/ui5/controls/common/feeds/FeedItem");
			this.byId("revenueByTime").destroyFeeds()
				.addFeed(new FeedItem({
					uid: "timeAxis",
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