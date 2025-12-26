// ==== js/flashcards.js ====
/****  BEGIN NAVIGATION CODE  *****/

let flashcardList = [];
let subject = '';
let listId = 1;
let lessonType = 'vocab';

// Mapping of subjects to lesson types
const MATH_LESSONS = ['multitables', 'division', 'addition'];

function getLessonType(subject) {
	if (MATH_LESSONS.includes(subject)) {
		return 'math';
	}
	return 'vocab';
}

function getInputType() {
	return lessonType === 'math' ? 'number' : 'text';
}

$.address.change(function(e) {
	let file = '';
	let listJumpBox;
	if (e.pathNames[0] === undefined) {
		subject = 'vocab';
		file = 'vocab.json';
	}
	else {
		subject = e.pathNames[0];
		file = e.pathNames[0] + '.json';
	}

	// Update subject dropdown to match current selection
	updateSubjectDropdown(subject);

	// Determine lesson type based on subject
	lessonType = getLessonType(subject);

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

		for (let a = 1; a <= data_in.length; ++a) {
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

let score = new Score();
let totalTerms = 0;

function setupList() {
	window.testMode = false;
	$('div#wonBox').hide();
	$('button#startTestMode').html('<span class="accesskey">T</span>est');
	window.termNo = -1;
	window.questionNo = 0;
	$('span#title663').html(flashcardList.title + ' | ');
	$('input#def').trigger('focus');
	$('#progressbar').progressbar({ value: 0 });

	window.sets = [];

	if (window.currentSet !== 'random') {
		for (const [propName, value] of Object.entries(flashcardList)) {
			if (typeof value === 'object') {
				window.sets.push(propName);
				totalTerms += value.length;
			}
		}

		window.origSets = window.sets.slice(0);  // Use array.slice(0) to clone an array.
		window.currentSet = window.sets.shift();
	}

	$('div#jumpListBox').show();
}

function showVictoryBox() {
	const wonBox = $('div#wonBox');
	const nextListId = +listId + 1;

	wonBox.find('a#nextLessonLink').attr('href', '#/' + subject + '/' + nextListId);

	wonBox.find('.terms').html(score.terms);
	wonBox.find('.correct').html(score.correct + ' (' + ((score.correct / score.terms) * 100).toFixed(1) + ')');
	wonBox.find('.wrong').html(score.wrong + ' (' + ((score.wrong / score.terms) * 100).toFixed(1) + ')');

	wonBox.show();
}

function nextTerm() {
	let inputDef, defHint;
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
		const inputType = getInputType();
		// Handle both cases: div#def (after correct answer) and input#def (initial or current)
		if ($('div#def').length) {
			$('div#def').replaceWith('<input type="' + inputType + '" id="def" class="typeInBox"/>');
		} else if ($('input#def').length) {
			$('input#def').attr('type', inputType);
		}

		if (window.testMode === false && $('input#showAnswer').prop('checked') === true) {
			defHint.val(window.currentDef);
		}

		defHint.show();

//	}

	$('input#def').trigger('focus').trigger('select');
}

function switchToNextListSet() {
	if (flashcardList[window.currentSet][window.termNo] === undefined) {
		window.termNo = 0;
		window.currentSet = window.sets.shift();
	}
}

function checkAnswer(answer) {
	let buttonNext;
	let progress;
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

		buttonNext.show().trigger('focus');

		progress = (score.terms / totalTerms) * 100;
		$('#progressbar').progressbar({ value: progress });

		//if (window.sets.length === 0 && window.termNo == flashcardList[window.currentSet].length - 1) {
		if (totalTerms - score.terms === 0) {
			buttonNext.trigger('blur').hide();

			showVictoryBox();
		}

	} else {
		if (this.lastTerm !== window.currentDef) {
			++score.wrong;
		}

		++window.guessNo;
		$('#correctAnswer').hide();
		$('#wrongAnswer').show();

		if (window.testMode === true && window.guessNo >= 3) {
			this.lastTerm = window.currentDef;

			alert("You've given an incorrect answer 3x. Going to next word.");
			nextTerm();
		}
	}

	this.lastTerm = window.currentDef;

	$('input#def').trigger('focus').trigger('select');
}

/*
	Fischer-Yates Shuffle.
	License: Public Domain
 	http://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {
	let m = array.length, t, i;

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
	const newTS = {};

	newTS.term = termSet.def;
	newTS.def = termSet.term;

	return newTS;
}

function randomizeLesson(chanceSwapped) {
	let superArray = [];
	let cardCount;

	if (chanceSwapped === undefined) { chanceSwapped = 5; }
	window.questionNo = 0;
	score = new Score();

	window.sets = [];
	window.currentSet = 'random';
	window.termNo = -1;

	setupList();


	flashcardList.random = [];
	for (let i = 0; i < window.origSets.length; ++i) {
		if (window.origSets[i] === 'random') { continue; }

		superArray = superArray.concat(flashcardList[window.origSets[i]]);
	}

	let diceRoll = 0;
	let origSet;
	let numOfRolls = 1;
	if (window.testMode === true) { ++numOfRolls; }

	cardCount = superArray.length;
	for (let i = cardCount - 1; i >= 0; --i) {
		origSet = null;
		// Remove terms that are bad for tests.
		if (Object.prototype.hasOwnProperty.call(superArray[i], 'dontTest') && superArray[i].dontTest === true) {
			superArray.splice(i, 1);
			continue;
		}

		if ($.isNumeric(superArray[i].def) === true ) { continue; }

		for (let j = 0; j < numOfRolls; ++j) {
			diceRoll = Math.floor((Math.random() * chanceSwapped) + 1);
			origSet = superArray[i];

			if (diceRoll === chanceSwapped) {
				superArray[i] = substituteTermWithDef(origSet);
				superArray.push(origSet);
				break;
			}
		}
	}

	flashcardList.random = shuffle(superArray);
	totalTerms = flashcardList.random.length;

	//alert(JSON.stringify(flashcardList.random, null, 2));

	/*
	window.termNo = -1;
	window.sets = ['random'];
	*/


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

// Update subject dropdown to match current URL
function updateSubjectDropdown(currentSubject) {
	const dropdown = $('#subjectSelect');

	if (currentSubject === 'vocab' || currentSubject === '') {
		dropdown.val('.');
	} else {
		dropdown.val('#!/' + currentSubject);
	}
}

$('input#alwaysShowHint').on('click', function() {
	const showAnswer = $('input#showAnswer');
	if ($(this).prop('checked') === true) {
		showAnswer.prop('checked', true);
		$('input#defHint').val(window.currentDef);
		showAnswer.prop('disabled', true);
	}
	else {
		showAnswer.prop('disabled', false);
	}

	$('input#def').trigger('focus');
});

$(window).on('resize', function() {
	const pageWrapper = $('div#page-wrapper');
	const scrollHeight = pageWrapper.get(0).scrollHeight;
	let newHeight = $(window).height() - pageWrapper.offset().top;
	if (newHeight < scrollHeight - 20) { newHeight = scrollHeight - 20; }
	pageWrapper.height(newHeight);
});

$(document).on('keypress', 'input#def', function(e) {
    if (e.key === 'Enter') {
		checkAnswer($(this).val());
	}
});

$(document).on('keyup', 'input#def', function() {
	if (window.testMode === true) { return; }
	const typedText = $(this).val();

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

$('button#next').on('click', function () {
	nextTerm();
});

$('input#showAnswer').on('click', function() {
	if ($(this).prop('checked') === true) {
		$('input#defHint').val(window.currentDef);
	} else {
		$('input#defHint').val('');
	}

	$('input#def').trigger('focus').trigger('select');
});

$('button#startTestMode').on('click', function() {
	startTestMode();
	$(this).text('Testing');
});

$('#listJumpBox').on('change', function() {
	$.address.value(subject + '/' + $(this).val())
});

// Subject dropdown navigation handler
$('#subjectSelect').on('change', function() {
	const selectedValue = $(this).val();
	if (selectedValue === '.') {
		$.address.value('/');
	} else {
		// Extract the path from the hash link (e.g., "#!/addition" -> "addition")
		const path = selectedValue.replace('#!/', '');
		$.address.value('/' + path);
	}
});

$(function () {
	$(window).trigger('resize');

	$('#progressbar').progressbar({ value: 0 });
	nextTerm()
});
