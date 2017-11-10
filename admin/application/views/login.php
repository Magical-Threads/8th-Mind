<?php
defined('BASEPATH') OR exit('No direct script access allowed');

?>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8"/>
<title><?=$page_title?></title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL STYLES -->
<link href="<?=base_url()?>assets/admin/pages/css/login.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN THEME STYLES -->
<link href="<?=base_url()?>assets/global/css/components.css" id="style_components" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/admin/layout/css/layout.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/admin/layout/css/themes/darkblue.css" rel="stylesheet" type="text/css" id="style_color"/>
<link href="<?=base_url()?>assets/admin/layout/css/custom.css" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->
<link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login" style="background-color: white !important;">
<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
<div class="menu-toggler sidebar-toggler">
</div>
<!-- END SIDEBAR TOGGLER BUTTON -->
<!-- BEGIN LOGO -->
<div class="logo">
	<a href="<?=base_url()?>adminpanel">
	<img  src="<?php echo base_url(); ?>assets/images/logo.png" style="width: 100px;" alt=""/>
	</a>
</div>
<!-- END LOGO -->
<!-- BEGIN LOGIN -->
<div class="content">
	<!-- BEGIN LOGIN FORM -->
	<form class="login-form" action="<?php echo base_url(); ?>login/login_access" method="post">
		<h3 class="form-title">Sign In</h3>       
       <?php $this->load->view('include/alert'); ?>
		<div class="form-group">
			<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
			<label class="control-label visible-ie8 visible-ie9">Email</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="email" autocomplete="off" placeholder="Email" name="email" value="<?=set_value('email')?>" required=""  autofocus  />
		</div>
		<div class="form-group">
			<label class="control-label visible-ie8 visible-ie9">Password</label>
			<input class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="Password" name="password" required=""/>
		</div>
		<div class="form-actions">
			<button type="submit" class="btn btn-success uppercase">Login</button>		
			<a href="javascript:;" id="forget-password" class="forget-password">Forgot Password?</a>
		</div>	
	
	</form>
	<!-- END LOGIN FORM -->
	<!-- BEGIN FORGOT PASSWORD FORM -->
	<form class="forget-form" id="forget_pass_form" action="<?php echo base_url();?>login/forgot" method="post">
		<h3>Forget Password ?</h3>
		<p>
			 Enter your e-mail address below to reset your password.
		</p>
        <div class="alert alert-danger" style="display: none;" id="forget_error">
			<button class="close" data-close="alert"></button>
			<span id="forget_error_msg"> </span>
		</div>
        <div class="alert alert-success" style="display: none;" id="forget_succ">
			<button class="close" data-close="alert"></button>
			<span id="forget_succ_msg">	  </span>
		</div>
		<div class="form-group">
			<input class="form-control placeholder-no-fix" id="forget_email" type="text" autocomplete="off" placeholder="Email" name="email" required=""/>
		</div>
		<div class="form-actions">
			<button type="button" id="back-btn" class="btn btn-default">Back</button>
			<button type="button" onclick="forget_pass()" class="btn btn-success uppercase pull-right">Submit</button>
		</div>
	</form>
	<!-- END FORGOT PASSWORD FORM -->
</div>
<div class="copyright">
	 <?php echo date('Y'); ?> @ Admin panel
</div>
<!-- END LOGIN -->
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="<?=base_url()?>assets/global/plugins/respond.min.js"></script>
<script src="<?=base_url()?>assets/global/plugins/excanvas.min.js"></script> 
<![endif]-->
<script src="<?=base_url()?>assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="<?=base_url()?>assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="<?=base_url()?>assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/admin/pages/scripts/login.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {     
Metronic.init(); // init metronic core components
Layout.init(); // init current layout
Login.init();
Demo.init();
});
</script>
<script type="text/javascript">

function forget_pass()
{
    var forget_email=$('#forget_email').val();
    if(forget_email=="")
    {
        $('#forget_error_msg').html('Email is Required');
        $('#forget_error').show();
    }
    else
    {
        $.ajax({
           url: $('#forget_pass_form').attr('action'),
           type:'post',
           data:$('#forget_pass_form').serialize(),
           dataType:'json',
           success:function(res)
           {
              if(res.code==1)
              {
                $('#forget_error').hide();
                $('#forget_succ_msg').html(res.msg);
                $('#forget_succ').show();
                $('#forget_email').val(' ');
              }
              else
              {
                $('#forget_succ').hide();
                $('#forget_error_msg').html(res.msg);
                $('#forget_error').show();
              }
           }
            
        });
        
    }
    
}

</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
