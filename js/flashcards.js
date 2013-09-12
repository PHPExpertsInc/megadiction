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
				listJumpBox.prepend('<option value="' + a + '" selected="selected">' + data_in[a - 1].title + '</option>')
			} else {
				listJumpBox.append('<option value="' + a + '">' + data_in[a - 1].title + '</option>')
			}

		}

		setupList();
		nextTerm();
	});
});

/****  END NAVIGATION CODE  *****/

function Score() {
	this.terms = 0;
	this.correct = 0;
	this.wrong = 0;
}

var score = new Score();

function setupList() {
	window.testMode = false;
	$('div#wonBox').hide();
	$('button#startTestMode').html('<span xmlns="http://www.w3.org/1999/xhtml" class="accesskey">T</span>est');
	window.termNo = -1;
	window.questionNo = 0;
	$('span#title663').html(flashcardList.title + ' | ');
	$('input#def').focus();

	window.sets = [];
	for (var propName in flashcardList) {
		 if (flashcardList.hasOwnProperty(propName) && typeof flashcardList[propName] === 'object') {
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

	wonBox.find('.terms').html(score.terms);
	wonBox.find('.correct').html(score.correct + ' (' + ((score.correct / score.terms) * 100).toFixed(1) + ')');
	wonBox.find('.wrong').html(score.wrong + ' (' + ((score.wrong / score.terms) * 100).toFixed(1) + ')');

	wonBox.show();
}

function nextTerm() {
	var inputDef; var defHint;
	++window.termNo;
	switchToNextListSet();

	window.guessNo = 0;
	++window.questionNo;
	inputDef = $('input#def');
	defHint = $('#defHint');

	inputDef.val('').removeClass('wrongAnswer');
	$('img.wrongAnswer').hide();
	$('#correctAnswer').hide();
	$('#wrongAnswer').hide();
	if (window.testMode === false) {
		$('div#showAnswerBox').show();
	}

	window.currentDef = flashcardList[window.currentSet][window.termNo].def;

	$('#qNo').html(window.questionNo);
	$('#term').html(flashcardList[window.currentSet][window.termNo].term);

//	if ($('div#def')) {
		$('div#def').replaceWith('<input type="text" id="def" class="typeInBox"/>');

		if (window.testMode === false && $('input#showAnswer').prop('checked') == true) {
			defHint.val(window.currentDef);
		}

		defHint.show();

//	}

	$('input#def').focus().select();
}

function switchToNextListSet() {
	if (flashcardList[window.currentSet][window.termNo] === undefined) {
		window.termNo = 0;
		window.currentSet = window.sets.shift();
	}
}

function checkAnswer(answer) {
	var buttonNext;
	//alert("answer -" + answer + "- vs " + flashcardList.roots[window.termNo].def);

	if (this.lastTerm !== window.currentDef) {
		++score.terms;
	}

	if (answer == window.currentDef) {
		++score.correct;

		buttonNext = $('button#next');

		$('#wonBox').hide();
		$('#wrongAnswer').hide();
		$('#correctAnswer').show();
		$('input#def').replaceWith('<div id="def">' + answer + '</div>');
		$('input#defHint').hide().val('');
		$('#showAnswerBox').hide();

		if ($('input#alwaysShowHint').prop('checked') === false) {
			$('input#showAnswer').prop('checked', false);
		}

		buttonNext.show().focus();

		if (window.sets.length === 0 && window.termNo == flashcardList[window.currentSet].length - 1) {
			buttonNext.blur().hide();

			showVictoryBox();
		}

	} else {
		if (this.lastTerm !== window.currentDef) {
			++score.wrong;
		}

		++window.guessNo;
		$('#correctAnswer').hide();
		$('#wrongAnswer').show();

		if (window.testMode == true && window.guessNo >= 3) {
			alert("You've given an incorrect answer 3x. Going to next word.");
			nextTerm();
		}
	}

	this.lastTerm = window.currentDef;

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

function substituteTermWithDef(termSet) {
	var newTS = new Object();

	newTS.term = termSet.def;
	newTS.def = termSet.term;

	return newTS;
}

function randomizeLesson(chanceSwapped) {
	var superArray = [];
	var cardCount;

	if (chanceSwapped === undefined) { chanceSwapped = 5; }
	window.questionNo = 0;
	score = new Score();
	setupList();


	flashcardList.random = [];
	for (var i = 0; i < window.origSets.length; ++i) {
		if (window.origSets[i] == 'random') { continue; }

		superArray = superArray.concat(flashcardList[window.origSets[i]]);
	}

	var diceRoll = 0;
	var origSet;
	var numOfRolls = 1;
	if (window.testMode === true) { ++numOfRolls; }

	cardCount = superArray.length;
	for (i = cardCount - 1; i >= 0; --i) {
		origSet = null;
		// Remove terms that are bad for tests.
		if (superArray[i].hasOwnProperty('dontTest') && superArray[i].dontTest === true) {
			superArray.splice(i, 1);
			continue;
		}

		if ($.isNumeric(superArray[i].def) === true ) { continue; }

		for (var j = 0; j < numOfRolls; ++j) {
			diceRoll = Math.floor((Math.random() * chanceSwapped) + 1);
			origSet = superArray[i];

			if (diceRoll == chanceSwapped) {
				superArray[i] = substituteTermWithDef(origSet);
				superArray.push(origSet);
				break;
			}
		}
	}

	flashcardList.random = shuffle(superArray);

	//alert(JSON.stringify(flashcardList.random, null, 2));

	/*
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
	randomizeLesson(3);

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
	var pageWrapper = $('div#page-wrapper');
	var scrollHeight = pageWrapper.get(0).scrollHeight;
	var newHeight = $(window).height() - pageWrapper.offset().top;
	if (newHeight < scrollHeight - 20) { newHeight = scrollHeight - 20; }
	pageWrapper.height(newHeight);
});

$(document).on('keypress', 'input#def', function(e) {
	if (e.keyCode == 13) {

		checkAnswer($(this).val());
	}
});
$(document).on('keyup	', 'input#def', function() {
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
	$(this).text('Testing');
});

$('#listJumpBox').change(function() {
	$.address.value(subject + '/' + $(this).val())
});


$(function () {
	//$.address.crawlable(true);	// SE crawl support was removed in 1.6?
	$(window).trigger('resize');

	$('ul.menu li a').address();
});
