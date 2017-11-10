<?php 
$this->load->view('include/header.php');
?>
<link href="<?=base_url()?>assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css" rel="stylesheet" type="text/css" />
<link href="<?=base_url()?>assets/selectize.css" rel="stylesheet" type="text/css" />

<style type="text/css">
.form-group{
    margin: 0px !important;
}

</style>
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
		 ADD <small> Article</small>
			</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
					    <a href="<?=base_url()?>">Home</a>
						<i class="fa fa-angle-right"></i>
					</li>
					<li>
						<a href="<?=base_url()?>article">Articles</a>
                        <i class="fa fa-angle-right"></i>
						
					</li>
                    	<li>
						<a href="">Add Article</a>
                 
						
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
								<i class="fa fa-gift"></i>Add Article Information
							</div>
							<div class="tools">
								<a href="" class="collapse">
								</a>						
								
							</div>
						</div>
						<div class="portlet-body form"> 
							<form class="form-horizontal" id="add_user" method="post" enctype="multipart/form-data" action="<?php echo base_url(); ?>article/add_access" role="form">
                          		    <?php $this->load->view('include/alert'); ?>                                
                                  
                                  <div class="form-body" style="display: flow-root;">
									<div class="col-md-12 form-group">
										<label class="control-label" style="margin-bottom:5px;">Article Title</label>
											<input type="text" class="form-control" name="articleTitle" placeholder="Article Title" value="" >
									</div>
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Description</label>									
                                        <textarea class="form-control" placeholder="Article Description" name="articleDescription"></textarea>									
									</div>					
									<div class="col-md-12 form-group">
										<label for="exampleInputFile" class="control-label"  style="margin-bottom:5px;">Article Image</label>
									
											<input type="file" name="articleImage" id="exampleInputFile">
										
									</div>
									<div class="col-md-12 form-group">
                                                    <label class="control-label"  style="margin-bottom:5px;">Article Start Date</label>
                                                    
                                                        <div class="input-group date articleStartDate" data-date-format="dd-mm-yyyy">
                                                            <input type="text" class="form-control"  name="articleStartDate" id="articleStartDate" readonly="">
                                                            <span class="input-group-btn">
                                                                <button class="btn default" type="button">
                                                                    <i class="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    
                                                    
                                     </div>                          
                                    <div class="col-md-12 form-group">
                                                    <label class="control-label"  style="margin-bottom:5px;">Article Expire Date</label>
                                                 
                                                        <div class="input-group date articleExpireDate" data-date-format="dd-mm-yyyy">
                                                            <input type="text" class="form-control"  name="articleExpireDate" id="articleExpireDate" readonly="">
                                                            <span class="input-group-btn">
                                                                <button class="btn default" type="button">
                                                                    <i class="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                     
                                     </div>
                                     <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Submission</label>
									
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowSubmission" id="optionsRadios25" checked="" value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowSubmission" id="optionsRadios26" value="No" /> No </label>
											    
											</div>
										
									</div> 
                                    
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Submission Type</label>
										
											<div class="radio-list">
                                                <label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios26" value="File" /> File </label>
											 	<label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios25" checked="" value="Photo" /> Photo</label>
												<label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios26" value="Video" /> Video </label>
                                                   
											</div>
										
									</div>
                                     <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Gallery</label>
										
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowGallery" id="optionsRadios25" checked="" value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowGallery" id="optionsRadios26" value="No" /> No </label>
											    
											</div>
										
									</div>
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Upvoting</label>
								
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowUpvoting" id="optionsRadios25" checked="" value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowUpvoting" id="optionsRadios26" value="No" /> No </label>
											    
											</div>
									
									</div> 
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Comment</label>
										
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowComment" id="optionsRadios25" checked="" value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowComment" id="optionsRadios26" value="No" /> No </label>
											    
											</div>
										
									</div>                             
                                   	<div class="col-md-12 form-group">
                                                    <label class="control-label"  style="margin-bottom:5px;">Article End Voting Date</label>
                                                    
                                                        <div class="input-group date articleEndVotingDate" data-date-format="dd-mm-yyyy">
                                                            <input type="text" class="form-control"  name="articleEndVotingDate" id="articleEndVotingDate" readonly="">
                                                            <span class="input-group-btn">
                                                                <button class="btn default" type="button">
                                                                    <i class="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                       
                                                    
                                     </div>
                                     <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Tags</label>
									
											<input type="text" id="articleTags" name="articleTags" placeholder="Article Tags" value="" >
									
									</div>
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<button type="submit" class="btn green">Add</button>
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
<script src="<?=base_url()?>assets/ckeditor/ckeditor.js"></script>
<script src="<?=base_url()?>assets/selectize.js"></script>
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/jquery-validation/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/jquery-validation/js/additional-methods.min.js"></script>
 <script src="<?=base_url()?>assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js" type="text/javascript"></script>
<script>
CKEDITOR.replace('articleDescription' );
</script>
<script type="text/javascript">
 $('.articleStartDate').datepicker({
    format: 'yyyy-mm-dd'
      
   }); 
    $('.articleExpireDate').datepicker({
    format: 'yyyy-mm-dd'
      
   });
    $('.articleEndVotingDate').datepicker({
    format: 'yyyy-mm-dd'
      
   });
   
$('#articleTags').selectize({
    delimiter: ',',
    persist: false,
    create: function(input) {
        return {
            value: input,
            text: input
        }
    }
}); 
$.validator.addMethod("greaterThan", 
function(value, element, params) {

    if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(params).val());
    }

    return isNaN(value) && isNaN($(params).val()) 
        || (Number(value) > Number($(params).val())); 
},'Must be greater than {0}.');
var form3 = $('#add_user');
var error3 = $('.alert-danger', form3);
var success3 = $('.alert-success', form3);
/*$.validator.addMethod("password",function(value,element)
{
return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(value);
},"Passwords must be Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet, 1 Number and 1 Special Character");*/
    form3.validate({
                ignore: [],              
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
               // ignore: "", // validate all fields including form hidden input
                rules: {
                    articleTitle: {                        
                        required: true
                    },
                    articleDescription: {                        
                        required: function() 
                        {
                         CKEDITOR.instances.articleDescription.updateElement();
                        }
                    },
                    articleImage: {                        
                        required: true,
                        accept:"jpg,png,jpeg,gif"
                    },
                    articleStartDate: {                        
                        required: true
                    },
                    articleExpireDate: {                        
                        required: true,
                        greaterThan: "#articleStartDate"
                    },
                    articleEndVotingDate: {                        
                        required: true,
                        greaterThan: "#articleStartDate"
                    }
                    
                    
                   
                      
                                      
                },

                messages: { 
                    
                   articleImage:{
                    required: "Select Image",
                    accept: "Only image type jpg/png/jpeg/gif is allowed"
                } 
                   
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