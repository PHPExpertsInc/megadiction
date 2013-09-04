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


$listId = filter_input(INPUT_GET, 'list', FILTER_VALIDATE_INT) ? filter_input(INPUT_GET, 'list', FILTER_SANITIZE_NUMBER_INT) : 0;

$list = $vocabLists[$listId];

?>
<!DOCTYPE html>
<html>
<head>
    <title>Megadiction</title>
    <style>
        input#def { font-size: 150%; }
    </style>
    <script>
        var vocabList = <?php echo json_encode($list); ?>;
    </script>
</head>
<body>
    <h1 id="term"></h1>
    <div>
        <input type="text" id="def" name="def"/>
    </div>
    <script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
    <script type="text/javascript">
function checkAnswer(answer) {
    alert(answer);
}

 $(function () {
    $('input#def').bind('keypress', function(e) {
        if (e.keyCode == 13) {
            checkAnswer($(this).val());
        }
    });

 });
    </script>
</body>
</html>