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
			<p>Go to the <a href="?listId=<?php echo ($listId + 1); ?>"><strong>next lesson</strong></a>.</p>
		</div>
	</div>
	<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
	<script type="text/javascript">
function setupList(listNo) {
	window.termNo = 0;
	$('h1#title span').html(vocabList.title);
	$('input#def').focus();

	window.sets = [];
	for (var propName in vocabList) {
		 if (typeof vocabList[propName] === 'object') {
			 window.sets.push(propName);
		 }
	}

	window.currentSet = window.sets.shift();
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

function checkAnswer(answer) {
	//alert("answer -" + answer + "- vs " + vocabList.roots[window.termNo].def);
	if (answer == window.currentDef) {
		$('div#wrongAnswer').hide();
		$('div#correctAnswer').show();
		$('input#def').replaceWith('<div id="def">' + answer + '</div>');
		$('div#showAnswerBox').hide();
		$('input#showAnswer').prop('checked', false);
		$('button#next').focus();
		++window.termNo;

		if (vocabList[window.currentSet][window.termNo] === undefined) {
			window.termNo = 0;
			window.currentSet = window.sets.shift();

			if (window.currentSet === undefined)
			{
				$('button#next').hide();
				$('div#wonBox').show();
			}
		}
	} else {
		$('div#correctAnswer').css('display', 'none');
		$('div#wrongAnswer').css('display', 'block');
	}

	$('input#def').focus().select();
}

 $(function () {
	setupList(<?php echo $listId; ?>);
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