$(document).ready(function() {
	registerSearch();
});

function registerSearch() {
	$("#search").submit(function(ev){
		event.preventDefault();
		$.get($(this).attr('action'), {q: $("#q").val()}, function(data) {
			var template = $('#template').html();
			Mustache.parse(template); 
			var rendered = Mustache.render(template, data);
			$('#resultsBlock').append(rendered);
		});	
	});
}

