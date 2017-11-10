<?php 
$this->load->view('include/header.php');
?>
 <link href="<?=base_url()?>assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css" rel="stylesheet" type="text/css" />

<?php 
$this->load->view('include/top_menu.php');
?>
<!-- BEGIN CONTAINER -->
<div class="page-container">
<?php 
$this->load->view('include/sidebar.php');
?>

	<!-- BEGIN CONTENT -->
	<div class="page-content-wrapper">
		<div class="page-content">		
			
			<!-- BEGIN PAGE HEADER-->
			<h3 class="page-title">
		 Reset <small> Password</small>
			</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
					    <a href="<?=base_url()?>">Home</a>
						<i class="fa fa-angle-right"></i>
					</li>
					<li>
						<a href="<?=base_url()?>staff">staffs</a>
                        <i class="fa fa-angle-right"></i>
						
					</li>
                    	<li>
						<a href="">Reset <?=$staff->userFirstName?> Password</a>
                 
						
					</li>
					
				</ul>
			
			</div>
			<!-- END PAGE HEADER-->
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">	
				<div class="col-md-offset-2 col-md-8">
					<!-- BEGIN SAMPLE FORM PORTLET-->
					<div class="portlet box green ">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-gift"></i>Reset <?=$staff->userFirstName?> Password
							</div>
							<div class="tools">
								<a href="" class="collapse">
								</a>						
								
							</div>
						</div>
						<div class="portlet-body form"> 
							<form class="form-horizontal" id="edit_user" method="post" action="<?php echo base_url(); ?>staff/edit_pass_code/<?php echo $staff->userID; ?>" enctype="multipart/form-data" role="form">
                          		   <?php $this->load->view('include/alert'); ?>                               
                                  
                                  <div class="form-body">
									
                                     <div class="form-group">
										<label class="col-md-3 control-label">Password</label>
										<div class="col-md-9">
											<div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-lock"></i>
												</span>
												<input type="password" id="password" class="form-control" name="userPassword" value="" >
											</div>
										</div>
									</div>
                                     <div class="form-group">
										<label class="col-md-3 control-label">Confirm Password</label>
										<div class="col-md-9">
											<div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-lock"></i>
												</span>
												<input type="password" id="cpassword" class="form-control" name="cpassword" value="" >
											</div>
										</div>
									</div>  
                                  
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<button type="submit" class="btn green">Reset</button>
											<a href="<?php echo base_url(); ?>staff"><button type="button" class="btn default">Cancel</button></a>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				
				</div>
			</div>
	  	
		</div>
	</div>
	<!-- END CONTENT -->

</div>
<!-- END CONTAINER -->

<?php 
$this->load->view('include/footer.php');
?>
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/jquery-validation/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/jquery-validation/js/additional-methods.min.js"></script>

<script type="text/javascript">

  
var form3 = $('#edit_user');
var error3 = $('.alert-danger', form3);
var success3 = $('.alert-success', form3);
/*$.validator.addMethod("password",function(value,element)
{
return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(value);
},"Passwords must be Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character");
*/    form3.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "", // validate all fields including form hidden input
                rules: {
                   userPassword:{                       
                        required: true,                        
                        minlength:8                         
                    },
                     cpassword: {
                      required: true,
                      minlength:8,
                      equalTo: "#password"
                                }                        
                },

                messages: { 
                    
                   
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.parent(".input-group").size() > 0) {
                        error.insertAfter(element.parent(".input-group"));
                    } else if (element.attr("data-error-container")) { 
                        error.appendTo(element.attr("data-error-container"));
                    } else if (element.parents('.radio-list').size() > 0) { 
                        error.appendTo(element.parents('.radio-list').attr("data-error-container"));
                    } else if (element.parents('.radio-inline').size() > 0) { 
                        error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
                    } else if (element.parents('.checkbox-list').size() > 0) {
                        error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
                    } else if (element.parents('.checkbox-inline').size() > 0) { 
                        error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success3.hide();
                    error3.show();
                    Metronic.scrollTo(error3, -200);
                },

                highlight: function (element) { // hightlight error inputs
                   $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

                submitHandler: function (form) {
                    success3.show();
                    error3.hide();
                    form.submit(); // submit the form
                }

            });

</script>