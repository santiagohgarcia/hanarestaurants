var conn = $.db.getConnection();

var stProductId = conn.prepareStatement(
	`SELECT (IFNULL(MAX("ProductId"), 0) + 1) as "ProductId" 
		FROM "restaurants.db::RestaurantsContext.Product"`
);
var resultSet = stProductId.executeQuery();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({
	ProductId: resultSet._rows[0].ProductId
}));