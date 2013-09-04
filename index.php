<?php
error_reporting(E_ALL);
header('content-type: text/plain');
$vocabTXT = file_get_contents('vocab.json');
if (!($vocabList = json_decode($vocabTXT)))
{
    echo "crap";
}

print_r($vocabList);
exit;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Megadiction</title>
    <style>
        input#def { font-size: 150%; }
    </style>
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