var conn = $.db.getConnection();
var params = $.request.parameters;

var stRestaurantOrderId = conn.prepareStatement(
	`SELECT (IFNULL(MAX("RestaurantOrderId"), 0) + 1) as "RestaurantOrderId" 
		FROM "restaurants.db::RestaurantsContext.RestaurantOrder" 
		WHERE "RestaurantId" = ? and 
			  "RestaurantTableId" = ?`
);
stRestaurantOrderId.setInteger(1, Number(params.get("RestaurantId")));
stRestaurantOrderId.setInteger(2,  Number(params.get("RestaurantTableId")));
var resultSet = stRestaurantOrderId.executeQuery();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	RestaurantOrderId: resultSet._rows[0].RestaurantOrderId
}));