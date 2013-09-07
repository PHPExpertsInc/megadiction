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

$customCSS = array('css/flashcards.css');

include 'views/_header.tpl.php';

?>
<script>
	var flashcardList = <?php echo json_encode($list); ?>;
</script>

	<div id="main">
		<ul class="menu">
			<li><a href=".">Vocab</a></li>
			<li><a href="?list=addition">Addition Tables</a></li>
			<li><a href="?list=multitables">Multiplication Tables</a></li>
		</ul>
		<div id="inner">
			<h3 id="listtitle"><span id="title663"></span> Question #<span id="qNo"></span></h3>
			<h2 id="term"></h2>
			<div style="position: relative; height: 35px">
				<input type="text" id="def" class="typeInBox" name="def" accesskey="d" />
				<input type="text" id="defHint" class="typeOverBox" name="def" accesskey="d" />
			</div>
			<div id="showAnswerBox">
				<input type="checkbox" id="showAnswer" accesskey="a"/> <label for="showAnswer">Show answer</label><br/>
			</div>
			<div id="correctAnswer">
				<h4>Correct!</h4>
				<button class="red" style="font-weight: bold" id="next" accesskey="n">Next...</button>
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
	<div id="main" style="margin-top: 20px; padding: 10px 0;">
		<div style="text-align: center"><button class="blue" style="background: #F73437; color: white" id="startTestMode">Start Test Mode</button></div>
	</div>
	<div id="dedication">Dedicated to Hudson Q. Lee</div>
	<script src="js/flashcards.js"/>
	<script src="js/accesskeys.js"/>
<?php
include 'views/_footer.tpl.php';

