<?php
if (!($vocabTXT = file_get_contents('vocab.json')))
{
	throw new RuntimeException("Could not read vocab.json.");
}
if (!($vocabLists = json_decode($vocabTXT)))
{
	throw new RuntimeException("Could not parse vocab.json.");
}

//header('content-type: text/plain');
//print_r($vocabList);


$listId = filter_input(INPUT_GET, 'listId', FILTER_VALIDATE_INT) ? filter_input(INPUT_GET, 'listId', FILTER_SANITIZE_NUMBER_INT) : 0;

$list = $vocabLists[$listId];

?>
<!DOCTYPE html>
<html>
<head>
	<title>Megadiction</title>
	<style>
		div#main {
			width: 25em;
			margin: 0 auto;
		}
		#def { font-size: 150%; }
		div#correctAnswer, div#wrongAnswer { display: none; }
		span.accesskey { text-decoration: underline; }
		a span.accesskey { font-weight: bold; padding: 1px; }


		div#wonBox { display: none; background: #FEF5CA; border: 1px dotted grey; padding: 0 50px; }
		div#wonBox h2 { font-size: 120%; text-align: center; }
		div#wonBox p { text-align: center; }

		table.score { background: white; padding-right: -20px; margin: 0 auto; }
		table.score th { text-align: left; padding-left: 20px; }
		table.score td { width: 7em; text-align: center; }
		table.score .correct { color: green; }
		table.score .wrong { color: red; }
	</style>
	<script>
		var vocabList = <?php echo json_encode($list); ?>;
	</script>
	<script src="js/accesskeys.js"></script>
</head>
<body>
	<div id="main">
		<h1 id="title">Vocab: <span></span></h1>
		<h2 id="term"></h2>
		<div>
			<input type="text" id="def" name="def" accesskey="d" />
		</div>
		<div id="showAnswerBox">
			<input type="checkbox" id="showAnswer" accesskey="a"/> <label for="showAnswer">Show answer</label>
		</div>
		<div id="correctAnswer">
			<h4>Correct!</h4>
			<button id="next" accesskey="n">Next...</button>
		</div>
		<div id="wrongAnswer"><h4>Wrong! Try again.</h4></div>
		<div id="wonBox">
			<h2>Congratulations! You've won!</h2>
			<table class="score">
				<tr>
					<th>Guesses</th>
					<td class="guesses"></td>
				</tr>
				<tr>
					<th>Correct</th>
					<td class="correct"></td>
				</tr>
				<tr>
					<th>Wrong</th>
					<td class="wrong"></td>
				</tr>
			</table>
			<p>Go to the <a href="?listId=<?php echo ($listId + 1); ?>"><strong>next lesson</strong></a>, <br/>
			   or <strong><a href="javascript: randomizeLesson();">randomize</a></strong> the current flash cards and play again.</p>
		</div>
	</div>
	<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
	<script type="text/javascript">

function Score() {
	this.guesses = 0;
	this.correct = 0;
	this.wrong = 0;
}

var score = new Score();

function setupList() {
	window.termNo = 0;
	$('h1#title span').html(vocabList.title);
	$('input#def').focus();

	window.sets = [];
	for (var propName in vocabList) {
		 if (typeof vocabList[propName] === 'object') {
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
	$('div#correctAnswer').hide();
	$('div#wrongAnswer').hide();
	$('div#showAnswerBox').show();

	window.currentDef = vocabList[window.currentSet][window.termNo].def;

	$('h2#term').html((window.termNo + 1) + ". " + vocabList[window.currentSet][window.termNo].term);

	if ($('div#def')) {
		$('div#def').replaceWith('<input type="text" id="def"/>');
	}

	$('input#def').focus().select();
}

function switchToNextListSet() {
	if (vocabList[window.currentSet][window.termNo] === undefined) {
		//alert("Before: " + window.currentSet);
		window.termNo = 0;
		window.currentSet = window.sets.shift();
		//alert("After: " + window.currentSet);

		if (window.currentSet === undefined)
		{
			$('button#next').hide();
			$('button#next').blur();

			showVictoryBox();
		}
	}
}

function checkAnswer(answer) {
	//alert("answer -" + answer + "- vs " + vocabList.roots[window.termNo].def);
	++score.guesses;

	if (answer == window.currentDef) {
		++score.correct;
		$('div#wonBox').hide();
		$('div#wrongAnswer').hide();
		$('div#correctAnswer').show();
		$('input#def').replaceWith('<div id="def">' + answer + '</div>');
		$('div#showAnswerBox').hide();
		$('input#showAnswer').prop('checked', false);
		$('button#next').show().focus();
		++window.termNo;

		switchToNextListSet();
	} else {
		++score.wrong;
		$('div#correctAnswer').css('display', 'none');
		$('div#wrongAnswer').css('display', 'block');
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

function randomizeLesson()
{
	score = new Score();
	setupList();

	vocabList.random = [];
	var superArray = [];
	for (var i = 0; i < window.origSets.length; ++i) {
		if (window.origSets[i] == 'random') { continue; }

		superArray = superArray.concat(vocabList[window.origSets[i]]);
	}

	vocabList.random = shuffle(superArray);
/*	alert('hmm ' + vocabList.random);

	for (var i = 0; i < vocabList.random.length; ++i) {
		alert("term: " + vocabList.random[i].term);
	}
*/
	window.sets.push('random');
	window.currentSet = 'random';


	switchToNextListSet();
	nextTerm();
}

 $(function () {
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

	$('input#showAnswer').click(function () {
		if ($(this).prop('checked') == true) {
			$('input#def').val('');
			$('input#def').attr('placeholder', window.currentDef);
		}

		$('input#def').focus().select();
	});
 });
	</script>
</body>
</html>