<?php 
$this->load->view('include/header.php');
?>
<link href="<?=base_url()?>assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css" rel="stylesheet" type="text/css" />
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
		 Edit <small> Article</small>
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
						<a href="">Edit Article</a>
                 
						
					</li>
					
				</ul>
			
			</div>
			<!-- END PAGE HEADER-->
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">	
				<div class="col-md-offset-1 col-md-10">
					<!-- BEGIN SAMPLE FORM PORTLET-->
					<div class="portlet box green ">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-gift"></i>Edit Article Information
							</div>
							<div class="tools">
								<a href="" class="collapse">
								</a>						
								
							</div>
						</div>
						<div class="portlet-body form"> 
							<form class="form-horizontal" id="edit_user" method="post" action="<?php echo base_url(); ?>article/edit_code/<?php echo $result->articleID; ?>" enctype="multipart/form-data" role="form">
                          		<?php $this->load->view('include/alert'); ?>                                
                                  
                                  <div class="form-body" style="display: flow-root;">
									<div class="col-md-12 form-group">
										<label class="control-label" style="margin-bottom:5px;">Article Title</label>
											<input type="text" class="form-control" name="articleTitle" placeholder="Article Title" value="<?php if($result->articleTitle){ echo $result->articleTitle; }?>" >
									</div>
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Description</label>									
                                        <textarea class="form-control" placeholder="Article Description" name="articleDescription"><?php if($result->articleDescription){ echo $result->articleDescription; }?></textarea>									
									</div>					
									<div class="col-md-12 form-group">
									
									       <div class="col-md-8">
                                           	<label for="exampleInputFile" class="control-label"  style="margin-bottom:5px;">Article Image</label>
											<input type="file" name="articleImage" id="exampleInputFile">
                                             </div>
                                         <div class="col-md-4" style="padding-top: 5px;">
                                         <?php if($result->articleImage!=""){ ?>
                                        <img class="img-responsive" src="<?=getenv('STORAGE_URL')?>articles/<?php echo $result->articleImage; ?>" /> 
                                        <?php } ?>
                                        </div>
										
									</div>
									<div class="col-md-12 form-group">
                                                    <label class="control-label"  style="margin-bottom:5px;">Article Start Date</label>
                                                    
                                                        <div class="input-group date articleStartDate" data-date-format="dd-mm-yyyy">
                                                            <input type="text" class="form-control"  value="<?php if($result->articleStartDate){ echo $result->articleStartDate; }?>" name="articleStartDate" id="articleStartDate" readonly="">
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
                                                            <input type="text" class="form-control" value="<?php if($result->articleExpireDate){ echo $result->articleExpireDate; }?>"   name="articleExpireDate" id="articleExpireDate" readonly="">
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
												<input type="radio" name="articleAllowSubmission" id="optionsRadios25" <?php if($result->articleAllowSubmission=='Yes') {?> checked="" <?php } ?> value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowSubmission" id="optionsRadios26" <?php if($result->articleAllowSubmission=='No') {?> checked="" <?php } ?> value="No" /> No </label>
											    
											</div>
										
									</div> 
                                    
                                   <!-- <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Submission Type</label>
										
											<div class="radio-list">
                                                <label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios26" <?php if($result->articleSubmissionType=='File') {?> checked="" <?php } ?> value="File" /> File </label>
											 	<label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios25" <?php if($result->articleSubmissionType=='Photo') {?> checked="" <?php } ?> value="Photo" /> Photo</label>
												<label class="radio-inline">
												<input type="radio" name="articleSubmissionType" id="optionsRadios26" <?php if($result->articleSubmissionType=='Video') {?> checked="" <?php } ?> value="Video" /> Video </label>
                                                   
											</div>
										
									</div> -->
                                     <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Gallery</label>
										
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowGallery" id="optionsRadios25" <?php if($result->articleAllowGallery=='Yes') {?> checked="" <?php } ?> value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowGallery" id="optionsRadios26" <?php if($result->articleAllowGallery=='No') {?> checked="" <?php } ?> value="No" /> No </label>
											    
											</div>
										
									</div>
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Upvoting</label>
								
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowUpvoting" id="optionsRadios25" <?php if($result->articleAllowUpvoting=='Yes') {?> checked="" <?php } ?> value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowUpvoting" id="optionsRadios26" <?php if($result->articleAllowUpvoting=='No') {?> checked="" <?php } ?> value="No" /> No </label>
											    
											</div>
									
									</div> 
                                    <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Article Allow Comment</label>
										
											<div class="radio-list">
												<label class="radio-inline">
												<input type="radio" name="articleAllowComment" id="optionsRadios25" <?php if($result->articleAllowComment=='Yes') {?> checked="" <?php } ?> value="Yes" /> Yes</label>
												<label class="radio-inline">
												<input type="radio" name="articleAllowComment" id="optionsRadios26" <?php if($result->articleAllowComment=='No') {?> checked="" <?php } ?> value="No" /> No </label>
											    
											</div>
										
									</div>                             
                                   	<div class="col-md-12 form-group">
                                                    <label class="control-label"  style="margin-bottom:5px;">Article End Voting Date</label>
                                                    
                                                        <div class="input-group date articleEndVotingDate" data-date-format="dd-mm-yyyy">
                                                            <input type="text" class="form-control" value="<?php if($result->articleEndVotingDate){ echo $result->articleEndVotingDate; }?>"  name="articleEndVotingDate" id="articleEndVotingDate" readonly="">
                                                            <span class="input-group-btn">
                                                                <button class="btn default" type="button">
                                                                    <i class="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                       
                                                    
                                     </div>
                                     <div class="col-md-12 form-group">
										<label class="control-label"  style="margin-bottom:5px;">Tags</label>
									
											<input type="text" id="articleTags" name="articleTags" placeholder="Article Tags" value="<?php if($result->articleTags){ echo $result->articleTags; }?>" >
									
									</div>
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<button type="submit" class="btn green">Save</button>
											<a href="<?php echo base_url(); ?>articles"><button type="button" class="btn default">Cancel</button></a>
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
                    articleTitle: {                        
                        required: true
                    },
                    articleDescription: {                        
                        required: function() 
                        {
                         CKEDITOR.instances.articleDescription.updateElement();
                        }
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