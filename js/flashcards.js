/****  BEGIN NAVIGATION CODE  *****/

var flashcardList = [];
var subject = '';
var listId = 1;

$.address.change(function(e) {
	var file = '';
	var listJumpBox;
	if (e.pathNames[0] === undefined) {
		subject = 'vocab';
		file = 'vocab.json';
	}
	else {
		subject = e.pathNames[0];
		file = e.pathNames[0] + '.json';
	}

	if (e.pathNames[1] === undefined) {
		listId = 1;
	} else {
		listId = e.pathNames[1];
	}

	$.getJSON(file, function(data_in) {
		//alert(JSON.stringify(data_in, null, 2));
		flashcardList = data_in[listId - 1];
		//alert(data_in[0].title);

		listJumpBox = $('select#listJumpBox');
		listJumpBox.html('');

		for (var a = 1; a <= data_in.length; ++a) {
		//	alert(a);
			if (a == listId)
			{
				listJumpBox.prepend('<option value="' + a + '" selected="selected">' + a + '</option>')
			} else {
				listJumpBox.append('<option value="' + a + '">' + a + '</option>')
			}

		}

		setupList();
		nextTerm();
	});
});

/****  END NAVIGATION CODE  *****/

function Score() {
	this.guesses = 0;
	this.correct = 0;
	this.wrong = 0;
}

var score = new Score();

function setupList() {
	window.testMode = false;
	window.termNo = -1;
	window.questionNo = 0;
	$('#listtitle span#title663').html(flashcardList.title + ' | ');
	$('input#def').focus();

	window.sets = [];
	for (var propName in flashcardList) {
		 if (typeof flashcardList[propName] === 'object') {
			 window.sets.push(propName);
		 }
	}

	window.origSets = window.sets.slice(0);  // Use array.slice(0) to clone an array.
	window.currentSet = window.sets.shift();
	$('div#jumpListBox').show();
}

function showVictoryBox() {
	var wonBox = $('div#wonBox');
	var nextListId = +listId + 1;

	wonBox.find('a#nextLessonLink').attr('href', '#!/' + subject + '/' + nextListId);

	wonBox.find('.guesses').html(score.guesses);
	wonBox.find('.correct').html(score.correct + ' (' + ((score.correct / score.guesses) * 100).toFixed(1) + ')');
	wonBox.find('.wrong').html(score.wrong + ' (' + ((score.wrong / score.guesses) * 100).toFixed(1) + ')');

	wonBox.show();
}

function nextTerm() {
	++window.termNo;
	switchToNextListSet();

	window.guessNo = 0;
	++window.questionNo;
	$('input#def').val('').removeClass('wrongAnswer');
	$('img.wrongAnswer').hide();
	$('div#correctAnswer').hide();
	$('div#wrongAnswer').hide();
	if (window.testMode === false) {
		$('div#showAnswerBox').show();
	}

	window.currentDef = flashcardList[window.currentSet][window.termNo].def;

	$('h3#listtitle span#qNo').html(window.questionNo);
	$('h2#term').html(flashcardList[window.currentSet][window.termNo].term);

	if ($('div#def')) {
		$('div#def').replaceWith('<input type="text" id="def" class="typeInBox"/>');

		if (window.testMode === false && $('input#showAnswer').prop('checked') == true) {
			$('input#defHint').val(window.currentDef);
		}

		$('input#defHint').show();

	}

	$('input#def').focus().select();
}

function switchToNextListSet() {
	if (flashcardList[window.currentSet][window.termNo] === undefined) {
		window.termNo = 0;
		window.currentSet = window.sets.shift();
	}
}

function checkAnswer(answer) {
	//alert("answer -" + answer + "- vs " + flashcardList.roots[window.termNo].def);
	++score.guesses;

	if (answer == window.currentDef) {
		++score.correct;
		$('div#wonBox').hide();
		$('div#wrongAnswer').hide();
		$('div#correctAnswer').show();
		$('input#def').replaceWith('<div id="def">' + answer + '</div>');
		$('input#defHint').hide().val('');
		$('div#showAnswerBox').hide();

		if ($('input#alwaysShowHint').prop('checked') === false) {
			$('input#showAnswer').prop('checked', false);
		}

		$('button#next').show().focus();

		if (window.sets.length === 0 && window.termNo == flashcardList[window.currentSet].length - 1) {
			$('button#next').blur();
			$('button#next').hide();

			showVictoryBox();
		}

	} else {
		++window.guessNo;
		++score.wrong;
		$('div#correctAnswer').css('display', 'none');
		$('div#wrongAnswer').css('display', 'block');

		if (window.testMode == true && window.guessNo >= 3) {
			alert("You've given an incorrect answer 3x. Going to next word.");
			nextTerm();
		}
	}

	$('input#def').focus().select();
}

/*
	Fischer-Yates Shuffle.
	License: Public Domain
 	http://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
  		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

function randomizeLesson() {
	window.questionNo = 0;
	score = new Score();
	setupList();


	flashcardList.random = [];
	var superArray = [];
	for (var i = 0; i < window.origSets.length; ++i) {
		if (window.origSets[i] == 'random') { continue; }

		superArray = superArray.concat(flashcardList[window.origSets[i]]);
	}

	flashcardList.random = shuffle(superArray);

	/*
	for (var i = 0; i < flashcardList.random.length; ++i) {
		alert("term: " + flashcardList.random[i].term);
	}

	window.termNo = -1;
	window.sets = ['random'];
	*/

	window.sets = [];
	window.currentSet = 'random';
	window.termNo = -1;

	//switchToNextListSet();
	nextTerm();
}

function startTestMode() {
	randomizeLesson();

	// This has to be after randomizeLesson()
	window.testMode = true;

	$('input#defHint').hide();
	$('div#showAnswerBox').hide();
	$('div#jumpListBox').hide();
}

$('input#alwaysShowHint').click(function() {
	var showAnswer = $('input#showAnswer');
	if ($(this).prop('checked') == true) {
		showAnswer.prop('checked', true);
		$('input#defHint').val(window.currentDef);
		showAnswer.attr('disabled', true);
	}
	else {
		showAnswer.removeAttr('disabled');
	}

	$('input#def').focus();
});

$(window).resize(function() {
	var scrollHeight = $('div#page-wrapper').get(0).scrollHeight;
	var newHeight = $(window).height() - $('div#page-wrapper').offset().top;
	if (newHeight < scrollHeight - 20) { newHeight = scrollHeight - 20; }
	$('div#page-wrapper').height(newHeight);
});

$('body').on('keypress', 'input#def', function(e) {
	if (e.keyCode == 13) {

		checkAnswer($(this).val());
	}
});
$('body').on('keyup	', 'input#def', function(e) {
	if (window.testMode === true) { return; }
	var typedText = $(this).val();

	if (typedText !== '' && window.currentDef.indexOf(typedText) !== 0)
	{
		$(this).addClass('wrongAnswer');
		$('img.wrongAnswer').show();
	} else
	{
		$(this).removeClass('wrongAnswer');
		$('img.wrongAnswer').hide();
	}
});

$('button#next').click(function () {
	nextTerm();
});

$('input#showAnswer').click(function() {
	if ($(this).prop('checked') == true) {
		$('input#defHint').val(window.currentDef);
	} else {
		$('input#defHint').val('');
	}

	$('input#def').focus().select();
});

$('button#startTestMode').click(function() {
	startTestMode();
	$(this).text('Test Mode is Active');
});

$('select#listJumpBox').change(function(e) {
	//alert(a);
	$.address.value(subject + '/' + $(this).val())

});


$(function () {
	$.address.crawlable(true);
	//alert($.address.crawlable());
	$(window).trigger('resize');
	//$.address.parameter('q', 'val');
	newHash = window.location.hash.substring(1);

	$('ul.menu li a').address();
	//window.location.hash = '';
	//alert($.address.state('stateBasePath'));
});
