var conn = $.db.getConnection();
var dateGroupBy = $.request.parameters.get("dateGroupBy");
const restaurantSet = new Set();
var stRevenueBy = conn.prepareStatement(
	`SELECT "${dateGroupBy}" as "DateGroupBy",
			"RestaurantId",
			"RestaurantName",
			SUM("Price") as "Total"
		FROM "HANARESTAURANTS_HDI_DB_1"."restaurants.db.views::RevenueByTime"
		group by "${dateGroupBy}","RestaurantId","RestaurantName";`
);

var resultSet = stRevenueBy.executeQuery();
var aggregatedResults = resultSet._rows.reduce((acum, item) => {
	var dateElement = acum.find(i => i.DateGroupBy === item.DateGroupBy);
	if (dateElement) {
		dateElement[item.RestaurantName] = dateElement[item.RestaurantName] ?
			(dateElement[item.RestaurantName] + item.Total) :
			item.Total;
	} else {
		var newDateElement = {
			DateGroupBy: item.DateGroupBy
		};
		newDateElement[item.RestaurantName] = item.Total;
		acum.push(newDateElement);
	}
	restaurantSet.add(item.RestaurantName);
	return acum;
}, []);

var restaurantArray = Array.from(restaurantSet);
aggregatedResults.forEach(result => {
	result.Total = restaurantArray.reduce((acum, restaurant) => (Number(result[restaurant]) || 0) + acum, 0);
});

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	restaurants: restaurantArray,
	results: aggregatedResults
}));