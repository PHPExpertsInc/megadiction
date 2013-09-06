<?php
header('Content-Type: application/xhtml+xml');

$flashcardList = isset($_GET['list']) ? filter_input(INPUT_GET, 'list', FILTER_SANITIZE_STRING) : 'vocab';
if (preg_match('/(\.\.|\/)/', $flashcardList) === 1)
{
	throw new RuntimeException("Invalid list.");
}

$flashcardFile = "$flashcardList.json";
if (!file_exists($flashcardFile))
{
	throw new RuntimeException("Could not find the flashcard file.");
}

if (!($flashcardTXT = file_get_contents($flashcardFile)))
{
	throw new RuntimeException("Could not read $flashcardFile.");
}
if (!($flashcardLists = json_decode($flashcardTXT)))
{
	throw new RuntimeException("Could not parse $flashcardFile.");
}

//header('content-type: text/plain');
//print_r($flashcardList);


$listId = filter_input(INPUT_GET, 'listId', FILTER_VALIDATE_INT) ? filter_input(INPUT_GET, 'listId', FILTER_SANITIZE_NUMBER_INT) : 0;

$list = $flashcardLists[$listId];

echo "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?" . ">\n";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Megadiction</title>
	<style>
		body { background: url('images/abstract_0005.jpg') white; }
		div#main {
			background: white;
			width: 25em;
			margin: 0 auto;
			border: 2px solid #4933D6;
			height: 100%;
			position: relative; top: -1px; right: -1px; 
		}
		div#main #inner { margin: 20px; }

		#def { font-size: 150%; width: 100%; }
		div#correctAnswer, div#wrongAnswer { display: none; }
		span.accesskey { text-decoration: underline; }
		a span.accesskey { font-weight: bold; padding: 1px; }


		div#wonBox { display: none; background: #FEF5CA; border: 1px dotted grey; padding: 0 50px; }
		div#wonBox h2 { font-size: 120%; text-align: center; }
		div#wonBox p { text-align: center; }

		table.score { background: white; margin: 0 auto; }
		table.score th { text-align: left; padding-left: 20px; }
		table.score td { width: 7em; text-align: center; }
		table.score .correct { color: green; }
		table.score .wrong { color: red; }

		div#dedication { position: fixed; bottom: 0; left: 0; color: white; }

		ul.menu { margin: 0 auto; padding: 5px 10px; text-align: center; list-style: none; font-weight: bold; background: #4933D6; color: white; }
		ul.menu a { background: #4933D6; color: white; }
		ul.menu li { display: inline;  }
		ul.menu li + li::before { content: " | "; }
	</style>
	<script>
		var flashcardList = <?php echo json_encode($list); ?>;
	</script>
	<script src="js/accesskeys.js"></script>
</head>
<body>
	<div id="main">
		<ul class="menu">
			<li><a href=".">Vocab</a></li>
			<li><a href="?list=multitables">Multiplication Tables</a></li>
		</ul>
		<div id="inner">
			<h1 id="title">Flashcards: <span></span></h1>
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
	</div>
	<div id="dedication">Dedicated to Hudson Q. Lee</div>
	<script src="js/jquery-2.0.3.min.js"/>
	<script src="js/flashcards.js"/>
</body>
</html>
