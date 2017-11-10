<html class="no-js"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<meta name="description" content="">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
<style>
body{margin:0 20px;padding:0px 15px;}
.header{    margin: 0 auto;
    width: 230px;
    padding-top: 50px;
}
.content h2 span {
        color: #fff;
    padding: 20px;
    font-size: 50px;
    background: #000;
}
	.bottom-inner img{max-width:100%;}
.content{text-align:center;padding:80px 20px;line-height: 45px;}
.footer {
    text-align: center;
    padding: 50px 0px 0;
}
a.shopping {
           color: #2a2d3c;
    padding: 20px;
    border-radius: 0;
    border: 2px solid #000;
}
.bottom {
   background: url(<?php echo base_url(); ?>assets/email/bg-footer-top.jpg);
    margin: 50px 0px 0px;
    padding: 10px 0px;
    color: #fff;
    text-align: center;
}
ul.bottom-inner {
    background: #fff;
    padding: 10px;
    list-style-type: none;
	display:flex;
}
ul.bottom-inner li{float:left;width:23%;padding:0px 10px;}
ul.social {
	float:right;
	text-align:right;
    margin: 0 auto;
    list-style-type: none;
        width: 22%;
}
.content h2{    border: 2px solid #000;background: url(<?php echo base_url(); ?>assets/email/bg-footer-top.jpg);color:#fff;}
ul.social li{float:left;padding:0px 10px;}
@media (max-width: 768px) {
	.content h2 span {
		background: #f7ac46;
		color: #fff;
		padding: 10px;
		font-size: 50px;
	}
	.bottom-inner img{max-width:100%;}
}
</style>
</head>
<body>
<div class="header">
	<img src="<?php echo base_url(); ?>assets/email/logo.png">
</div>
<div class="content">
   
	<?php echo $content; ?>
	
</div>
<div class="footer">
	
	<div class="bottom">
		<p style="padding-left:10px;text-align: center;">COPYRIGHTS © 2017 Content Portal. ALL RIGHTS RESERVED</p	>

	</div>
</div>
</body>
</html>