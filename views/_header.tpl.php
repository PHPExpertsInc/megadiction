<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Ted
 * Date: 11/18/12
 * Time: 11:28 AM
 * To change this template use File | Settings | File Templates.
 */
include_once realpath( __DIR__ . '/../lib/meta.php');

if (empty($meta)) {
	$meta = new Meta();
}

if (empty($meta->title)) { $meta->title = 'PHP University'; }
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8"/>
        <title><?php echo $meta->title; ?> | PHP University</title>
        <link href="css/default.css" rel="stylesheet" type="text/css" media="all" />
	    <link href="css/main.css" rel="stylesheet" type="text/css" media="all" />
	    <!--[if IE 6]>
        <link href="css/default_ie6.css" rel="stylesheet" type="text/css" />
        <![endif]-->
        <!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<?php
if (!empty($customCSS)) {
	foreach ($customCSS as $css) {
?>
		<link rel="stylesheet" href="<?php echo $css; ?>"/>
<?php
	}
}
?>
        <script type="text/javascript" src="js/prettify.js"></script>                                   <!-- PRETTIFY -->
        <script type="text/javascript" src="js/kickstart.js"></script>                                  <!-- KICKSTART -->
        <script src="js/jquery-1.8.3.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/kickstart.css" media="all" />                  <!-- KICKSTART -->
        <meta name="description" content="Federal Income Tax Calculator 2012 2013: Fiscal cliff tax calculator"/>
        <meta property="og:image" content="<?php echo $meta->image; ?>"/>
        <meta property="og:title" content="<?php echo $meta->title; ?>"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="http://www.phpu.cc/taxes/individual/"/>
        <script type="text/javascript" src="js/external.js"></script>
<?php if (!empty($customHeader)) { echo $customHeader; } ?>
    </head>
<body>
<div id="fb-root"></div>
<script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&amp;appId=196987497007525";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<div id="header-wrapper">
	<div id="header" class="container">
		<div id="logo">
			<h1 class="title"><a href="/">PHP University <span id="slogan">Learn, code, grow</span></a></h1>
		</div>
		<div id="socialbox">
			<ul>
				<li><div class="fb-like" data-send="false" data-layout="button_count" data-width="100" data-show-faces="false" data-font="tahoma"></div></li>
				<li><div class="twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-lang="en">Tweet</a>
                <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script></div></li>
			</ul>
		</div>
	</div>
	<div id="menu" class="container">
		<nav class="menu"></nav>
		<ul>
			<li class="first"><a href="/" accesskey="1" title="Collabra">Homepage</a></li>
			<li><a href="#" accesskey="2" title="MultiAuth Library">MultiAuth</a></li>
			<li><a href="http://www.phpu.cc/" accesskey="4" title="PHP University">PHPU: Learn To Code</a></li>
		</ul>
	</div>
	<div id="pageHeader" class="container">
        <h2 class="title">Federal Personal Income Tax (Fiscal Cliff) Calculator</h2>
	</div>
</div>
<div id="page-wrapper">
    <div id="page" class="container">
	        <div id="wide-content" class="box-style">

