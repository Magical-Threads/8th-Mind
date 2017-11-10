<?php 
$this->load->view('include/header.php');
?>
<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="<?=base_url()?>assets/global/plugins/select2/select2.css"/>
<link rel="stylesheet" type="text/css" href="<?=base_url()?>assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"/>
<!-- END PAGE LEVEL STYLES -->
<style type="text/css">
th{
    white-space: nowrap;
    width: 20%;
    text-align: right;
    border-right: solid 1px;
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
			View Article Detail
			</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
					    <a href="<?=base_url()?>">Home</a>
						<i class="fa fa-angle-right"></i>
					</li>
					<li>
						<a href="<?=base_url()?>article">articles</a>
                        <i class="fa fa-angle-right"></i>
						
					</li>
                    	<li>
						<a href=""><?php echo short_text($result->articleTitle,30); ?></a>
                 
						
					</li>
				
				</ul>
				
			</div>
			<!-- END PAGE HEADER-->
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
            <div class="col-md-12">
            <?php $this->load->view('include/alert'); ?>
            </div>
            	<div class="col-md-8">
                       
		<!-- BEGIN SAMPLE TABLE PORTLET-->
					<div class="portlet box purple">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-comments"></i> Article Detail
							</div>
							<div class="tools">
								<a href="javascript:;" class="collapse">
								</a>
							
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-scrollable">
								<table class="table table-striped table-hover">
							
								<tbody>
                                <tr>
									<td>
										<img class="img-responsive" src="<?=getenv('STORAGE_URL')?>articles/<?php echo $result->articleImage; ?>" /> 
									</td>
																	
								</tr>
								<tr>
									<td style="style="font-weight: bold;"">
										 <?php echo $result->articleTitle; ?>
									</td>
																	
								</tr>
								<tr>
									<td>
										 <?php echo $result->articleDescription; ?>
									</td>
																	
								</tr>
                               
                                <tr>
									<td>
										<b>TAGS :</b> <?php echo $result->articleTags; ?>
									</td>
																		
								</tr>
                                <tr>
									<td>
										<b>CREATED BY :</b>	<?php echo $result->userFirstName.' '.$result->userLastName; ?>
									</td>
																		
								</tr> 
                                  
								</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4">
                  
		<!-- BEGIN SAMPLE TABLE PORTLET-->
					<div class="portlet box purple">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-comments"></i> Article Detail
							</div>
							<div class="tools">
								<a href="javascript:;" class="collapse">
								</a>
							
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-scrollable">
								<table class="table table-striped table-hover">
							
								<tbody>
							
									<th>
										Article Start Date
									</th>
									<td>
										<?php echo $result->articleStartDate; ?>
									</td>									
								</tr>                                                       
                              
                              	<tr>
									<th>
										Article Expire Date
									</th>
									<td>
										<?php echo $result->articleExpireDate; ?>
									</td>									
								</tr>
                                 <tr>
									<th>
										Article Allow Submission
									</th>
									<td>
										<?php echo $result->articleAllowSubmission; ?>
									</td>									
								</tr>                                                       
                              
                              	<tr>
									<th>
										Article Submission Type
									</th>
									<td>
										<?php echo $result->articleSubmissionType; ?>
									</td>									
								</tr>
                                  <tr>
									<th>
										Article Allow Gallery
									</th>
									<td>
										<?php echo $result->articleAllowGallery; ?>
									</td>									
								</tr>                                                       
                              
                              	<tr>
									<th>
										Article End Voting Date
									</th>
									<td>
										<?php echo $result->articleEndVotingDate; ?>
									</td>									
								</tr>
                                <tr>
									<th>
										Article Allow Upvoting
									</th>
									<td>
										<?php echo $result->articleAllowUpvoting; ?>
									</td>									
								</tr>                                                       
                              
                              	<tr>
									<th>
										Article Allow Comment
									</th>
									<td>
										<?php echo $result->articleAllowComment; ?>
									</td>									
								</tr>
                               	<tr>
									<th>
									 Status
									</th>
									<td>
										<?php echo $result->articleStatus; ?>
									</td>									
								</tr>
                              	<tr>
									<th>
										 Created At 
									</th>
									<td>
									
                                         <?=date('F d,Y g:i A',strtotime($result->createdAt))?>
									</td>									
								</tr>
                                <tr>
									<th>
										 Updated At 
									</th>
									<td>
									
                                         <?=date('F d,Y g:i A',strtotime($result->updatedAt))?>
									</td>									
								</tr>
                             
                                <tr>
                                <td colspan="2" style="text-align: right;">
                                <a href="<?php echo base_url();?>article/edit/<?php echo $result->articleID; ?>"><button type="button" class="btn green">Edit Article</button></a>
                                </td>
                                </tr>
                                  
								</tbody>
								</table>
							</div>
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
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/select2/select2.min.js"></script>


</body>
<!-- END BODY -->
</html>