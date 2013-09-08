function Score() {
	this.guesses = 0;
	this.correct = 0;
	this.wrong = 0;
}

var score = new Score();

function setupList() {
	window.testMode = false;
	window.termNo = 0;
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
}

function showVictoryBox() {
	var wonBox = $('div#wonBox');

	wonBox.find('.guesses').html(score.guesses);
	wonBox.find('.correct').html(score.correct + ' (' + ((score.correct / score.guesses) * 100).toFixed(1) + ')');
	wonBox.find('.wrong').html(score.wrong + ' (' + ((score.wrong / score.guesses) * 100).toFixed(1) + ')');

	wonBox.show();
}

function nextTerm() {
	window.guessNo = 0;
	++window.questionNo;
	$('div#correctAnswer').hide();
	$('div#wrongAnswer').hide();
	$('div#showAnswerBox').show();

	window.currentDef = flashcardList[window.currentSet][window.termNo].def;

	$('h3#listtitle span#qNo').html(window.questionNo);
	$('h2#term').html(flashcardList[window.currentSet][window.termNo].term);

	if ($('div#def')) {
		$('div#def').replaceWith('<input type="text" id="def" class="typeInBox"/>');
		$('input#defHint').show();
	}

	$('input#def').focus().select();
}

function switchToNextListSet() {
	if (flashcardList[window.currentSet][window.termNo] === undefined) {
		window.termNo = 0;
		window.currentSet = window.sets.shift();

		if (window.currentSet === undefined) {
			$('button#next').hide();
			$('button#next').blur();

			showVictoryBox();
		}
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
		$('input#showAnswer').prop('checked', false);
		$('button#next').show().focus();
		++window.termNo;

		switchToNextListSet();
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
/*	alert('hmm ' + flashcardList.random);

	for (var i = 0; i < flashcardList.random.length; ++i) {
		alert("term: " + flashcardList.random[i].term);
	}
*/
	window.currentSet = 'random';
	switchToNextListSet();
	nextTerm();
}

$(window).resize(function() {
	var scrollHeight = $('div#page-wrapper').get(0).scrollHeight;
	var newHeight = $(window).height() - $('div#page-wrapper').offset().top;
	if (newHeight < scrollHeight - 20) { newHeight = scrollHeight - 20; }
	$('div#page-wrapper').height(newHeight);
});

$(function () {
	$(window).trigger('resize');
	setupList();
	nextTerm();

	$('body').on('keypress', 'input#def', function(e) {
		if (e.keyCode == 13) {

			checkAnswer($(this).val());
		}
	});

	$('button#next').click(function () {
		nextTerm();
	});

	$('input#showAnswer').click(function() {
		if ($(this).prop('checked') == true) {
			$('input#defHint').val(window.currentDef);
		}
		else
		{
			$('input#defHint').val('');
		}

		$('input#def').focus().select();
	});

	$('button#startTestMode').click(function() {
		randomizeLesson();

		// This has to be after randomizeLesson()
		window.testMode = true;
		$(this).text('Test Mode is Active');

		$('input#defHint').hide();
		$('div#showAnswerBox').hide();
	});
});
