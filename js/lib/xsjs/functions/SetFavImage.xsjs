var conn = $.db.getConnection();
var params = $.request.parameters;

var stSetFavImage = conn.prepareStatement(
	`UPDATE "restaurants.db::RestaurantsContext.ProductImage" AS PI
		SET "Favorite" = CASE PI."ImageId" WHEN ? THEN 1 ELSE 0 END
		WHERE "ProductId" = ?;`
);
stSetFavImage.setInteger(1,  Number(params.get("ImageId")));
stSetFavImage.setInteger(2, Number(params.get("ProductId")));
stSetFavImage.executeUpdate();

conn.commit();
conn.close();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({}));