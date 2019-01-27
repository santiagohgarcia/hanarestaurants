var conn = $.db.getConnection();
var params = $.request.parameters;

var stCloseOrder = conn.prepareStatement(
	`UPDATE "restaurants.db::RestaurantsContext.RestaurantOrder" 
		SET "Status.StatusId" = 1 
		WHERE "RestaurantId" = ? and 
			  "RestaurantTableId" = ? and
			  ( "Status.StatusId" = 2 or  "Status.StatusId" = 3 )`
);
stCloseOrder.setInteger(1, Number(params.get("RestaurantId")));
stCloseOrder.setInteger(2,  Number(params.get("RestaurantTableId")));
stCloseOrder.executeUpdate();

conn.commit();
conn.close();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({}));