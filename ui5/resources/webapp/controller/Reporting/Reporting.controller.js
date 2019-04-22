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

		onRangeChanged: async function(e) {
			var data = e.getParameters().data;
			var start = data.start.Time;
			var end = data.end.Time;
			var Filter = await this.requirePromisified("sap/ui/model/Filter");
			var dateFilter = new Filter({
				path: "DateGroupBy",
				test: function(oValue) {
					var time = Date.parse(new Date(oValue));
					return (time >= start && time <= end);
				}
			});
			this.byId("revenueByTime").getDataset().getBinding('data').filter([dateFilter]);
		},

		_onReportingMatched: function() {
			this._getRevenueByTime("Date");
		},

		onSelectDateGroupByChange: function() {
			this._getRevenueByTime(this.byId("dateGroupBy").getSelectedKey());
		},

		_getRevenueByTime: async function(dateGroupBy) {
			var revenueByTime = this.byId("revenueByTime"),
				revenueByTimeDataSet = this.byId("revenueByTimeDataSet"),
				revenueByTimeSlider = this.byId("revenueByTimeSlider"),
				revenueByTimeSliderDataSet = this.byId("revenueByTimeSliderDataSet");
			revenueByTimeDataSet.getBinding("data").filter([]);
			//Get Data	
			var models = await this.requirePromisified("restaurants/ui5/model/models");
			var response = await models.getRevenueByTime(dateGroupBy);

			//set properties
			revenueByTime.setVizProperties({
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

			this._addFeeds(revenueByTime, response.restaurants);
			this._addMeasures(revenueByTimeDataSet, response.restaurants);
			if (revenueByTimeSlider.getFeeds().length === 0 && revenueByTimeSliderDataSet.getMeasures().length === 0) {
				this._addFeeds(revenueByTimeSlider, []);
				this._addMeasures(revenueByTimeSliderDataSet, []);
			}

		},

		_getLevels: function(dateGroupBy) {
			return {
				"Date": ["year", "month", "day"],
				"MonthYear": ["year", "month"],
				"Year": ["year"]
			}[dateGroupBy];
		},

		_addMeasures: async function(dataset, restaurants) {
			var MeasureDefinition = await this.requirePromisified("sap/viz/ui5/data/MeasureDefinition");
			dataset.destroyMeasures()
				.addMeasure(new MeasureDefinition({
					name: "Total",
					unit: "ARS",
					value: "{Total}"
				}));
			restaurants.forEach(restaurantName => {
				dataset.addMeasure(new MeasureDefinition({
					name: restaurantName,
					unit: "ARS",
					value: `{${restaurantName}}`
				}));
			});
		},

		_addFeeds: async function(chart, restaurants) {
			var FeedItem = await this.requirePromisified("sap/viz/ui5/controls/common/feeds/FeedItem");
			chart.destroyFeeds()
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