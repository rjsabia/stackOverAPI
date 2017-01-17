// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();

	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result for unanswered
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=https://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// This is where top answers output
var showAnswers = function(answer) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var answerElem = result.find('.question-text a');
	$('.quest').replaceWith("<dt>User Name</dt>");
	answerElem.attr('href', answer.user.link);
	answerElem.text(answer.user.display_name);

	// set the date asked property in result
	var rep = result.find('.asked-date');
	$('.ask').replaceWith("<dt>Reputation Points</dt>");
	rep.html(answer.user.reputation);

	// set the .viewed for question property in result for unanswered
	var viewed = result.find('.viewed');
	$('.view').replaceWith("<dt>Post Count</dt>");
	viewed.html(answer.post_count);
	
	// set some properties related to asker
	var asker = result.find('.asker');
	$('.askee').replaceWith("<dt>User Score</dt>");
	asker.html(answer.score);

	return result;

};

// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "https://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		
		var searchResults = showSearchResults(request.tagged, result.items.length);

		console.log(result);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// This function searches for the top rated answers for the subject entered in search bar 
var getTopAnswer = function(topAnswer) {
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tag: topAnswer,
		period: 'all_time'
	};
	
	$.ajax({
		url: "https://api.stackexchange.com/2.2/tags/" + request.tag +
			 "/top-answerers/" + request.period + "?site=stackoverflow",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		
		var searchResults = showSearchResults(request.tag, result.items.length);

		console.log(result);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {

			var answer = showAnswers(item);
			
			$('.results').append(answer);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		
		var errorElem = showError(error);
		
		$('.search-results').append(errorElem);
	});
};

$(document).ready( function() {
	// This grabs the submit for un-answered questions
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();

		getUnanswered(tags);
		// clears out input bar after search is run
		$('.unanswer-bar').val('');
	});

	// this grabs the submit for inspiration getter, i.e. top answers
	$('.inspiration-getter').submit( function(e){
		
		e.preventDefault();
		
		$('.results').html('');
		
		var topAnswer = $(this).find("input[name='answerers']").val();
		
		getTopAnswer(topAnswer);
		// clears out input bar after search is run
		$('.top-answer-bar').val('');
	});
	
});
// **********END OF PROGRAM*********************************************
// *********************************************************************