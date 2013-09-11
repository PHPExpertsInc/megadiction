<?php
header('Content-Type: application/xhtml+xml');
/*
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
*/
//header('content-type: text/plain');
//print_r($flashcardList);


//$lesson = filter_input(INPUT_GET, 'lesson', FILTER_VALIDATE_INT) ? filter_input(INPUT_GET, 'lesson', FILTER_SANITIZE_NUMBER_INT) : 0;

$customCSS = array('css/flashcards.css');

include 'views/_header.tpl.php';

?>

<script>
var data;
var flashcardList;
$.getJSON('vocab.json', function(data_in) {
	flashcardList = data_in[0];
	//alert(data_in[0].title);
});
</script>

	<div class="contentBox">
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
				<input type="checkbox" id="showAnswer" accesskey="s"/> <label for="showAnswer">Show answer</label>
				<input type="checkbox" id="alwaysShowHint" accesskey="a"/> <label for="alwaysShowHint">Always show answer</label>
			</div>
			<img class="wrongAnswer" style="display: none" src="images/exclaim.png"/>
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
				<p>Go to the <a href="?listId=<?php echo ($lesson + 1); ?>"><strong>next lesson</strong></a>, <br/>
				   or <strong><a href="javascript: randomizeLesson();">randomize</a></strong> the current flash cards and play again.</p>
			</div>
		</div>
	</div>
	<div class="contentBox">
		<div style="text-align: center"><button class="blue" style="background: #F73437; color: white" id="startTestMode">Start Test Mode</button></div>
	</div>
	<div class="contentBox" id="todoBox">
		<div id="inner">
			<h4>TODO List</h4>
			<?php include '_todo.php'; ?>
		</div>
	</div>
	<div id="dedication">Dedicated to Hudson Q. Lee</div>
	<script src="js/flashcards.js"/>
	<script src="js/accesskeys.js"/>
<?php
include 'views/_footer.tpl.php';

