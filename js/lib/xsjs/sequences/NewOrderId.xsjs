var conn = $.db.getConnection();
var restaurantId = $.request.parameters.get("RestaurantId");

var stRestaurantOrderId = conn.prepareStatement(
	`SELECT (IFNULL(MAX("RestaurantOrderId"), 0) + 1) as "RestaurantOrderId" 
		FROM "restaurants.db::RestaurantsContext.RestaurantOrder" WHERE "RestaurantId" = ?`
);
stRestaurantOrderId.setInteger(1, Number(restaurantId));
var resultSet = stRestaurantOrderId.executeQuery();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	RestaurantOrderId: resultSet._rows[0].RestaurantOrderId
}));