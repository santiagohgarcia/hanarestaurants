var conn = $.db.getConnection(),
	restaurantId = $.request.parameters.get("RestaurantId");

var stOrderId = conn.prepareStatement(
	`SELECT (IFNULL(MAX("RestaurantOrderId"), 0) + 1) as "RestaurantOrderId" 
		FROM "restaurants.db::RestaurantsContext.RestaurantOrder" WHERE "RestaurantId" = ?`
);
stOrderId.setInteger(1, Number(restaurantId));
var resultSet = stOrderId.executeQuery();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	RestaurantOrderId: resultSet._rows[0].RestaurantOrderId
}));