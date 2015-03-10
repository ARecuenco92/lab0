const totalTweets = 10;
var subscription;
var stompClient;

$(document).ready(function() {
	connect();
	registerSearch();
});

function registerSearch() {
	$("#search").submit(function(ev){
		event.preventDefault();
		unsubscribe();
		subscribe($("#q").val());
	});
}

/* 
 * Establishes the connection with the server
 *  
 */
function connect() {
	var socket = new SockJS('/twitter');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {});
}

/* 
 * Unsubscribes the last search (subscription)
 * 
 */ 
function unsubscribe(){
	// Remove old tweets
	$('#resultsBlock').children("div").remove();
	if(subscription != undefined){
		// Unsubscribe previous subscription
		subscription.unsubscribe();
	}
}

/* 
 * Subscribes the client to the specified word in order 
 * to search for tweets with the specified word 
 */
function subscribe(query){
	stompClient.send("/app/search", {},  query);
	subscription = stompClient.subscribe('/queue/search/'+query, function(data){
		var tweet = JSON.parse(data.body);
		var template = $('#template').html();
		Mustache.parse(template); 
		var rendered = Mustache.render(template, tweet);
		$('#resultsBlock').prepend(rendered);

		// Removes the last tweet if there are more than totalTweets
		if($('#resultsBlock')[0].children.length > totalTweets){
			$('#resultsBlock')[0].children[(totalTweets-1)].remove();
		}
	}, { id: query });
}
