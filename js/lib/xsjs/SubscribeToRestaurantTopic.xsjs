
var payload = JSON.parse($.request.body.asString());

var messaging = $.import("xsjslib", "messaging");

messaging.subscribeToTopic(payload.Token,"restaurant-"+payload.RestaurantId) ;                        

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify({}));