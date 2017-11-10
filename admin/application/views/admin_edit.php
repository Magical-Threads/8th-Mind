<?php 
$this->load->view('include/header.php');
?>
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
			<?php echo $user_data->userFirstName; ?> Profile <small> Setting</small>
			</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
						<a href="<?=base_url()?>">Home</a>
						<i class="fa fa-angle-right"></i>
					</li>
					<li>
						<a href=""><?php echo $user_data->userFirstName; ?> profile</a>
						
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
								<i class="fa fa-gift"></i>Edit profile Information
							</div>
							<div class="tools">
								<a href="" class="collapse">
								</a>						
								
							</div>
						</div>
						<div class="portlet-body form"> 
							<form class="form-horizontal" method="post" action="<?php echo base_url(); ?>profile/update_code" role="form">
                              <?php $this->load->view('include/alert'); ?>
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">First Name</label>
										<div class="col-md-9">
											<input type="text" class="form-control" name="firstName" value="<?php echo $user_data->userFirstName; ?>" required="">
											
										</div>
									</div>	
                                    	<div class="form-group">
										<label class="col-md-3 control-label">Last Name</label>
										<div class="col-md-9">
											<input type="text" class="form-control" name="lastName" value="<?php echo $user_data->userLastName; ?>" required="">
											
										</div>
									</div>					
									
									<div class="form-group">
										<label class="col-md-3 control-label">Email Address</label>
										<div class="col-md-9">
											<div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-envelope"></i>
												</span>
												<input type="email" class="form-control" name="emailID" value="<?php echo $user_data->userEmail; ?>" readonly>
											</div>
										</div>
									</div>	
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<button type="submit" class="btn green">Save</button>
											<button type="button" class="btn default">Cancel</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				
				</div>
			</div>
	  		<div class="row">	
				<div class="col-md-offset-2 col-md-8">
					<!-- BEGIN SAMPLE FORM PORTLET-->
					<div class="portlet box green ">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-gift"></i>Set New Password
							</div>
							<div class="tools">
								<a href="" class="collapse">
								</a>						
								
							</div>
						</div>
						<div class="portlet-body form"> 
							<form class="form-horizontal" role="form" method="post" action="<?php echo base_url(); ?>profile/change_password">
                             
                            <?php if($this->session->flashdata('psuccess')){ ?>
                                     <div class="alert alert-block  alert-success fade in">
                                          <button data-dismiss="alert" class="close close-sm" type="button">
                                              <i class="fa fa-times"></i>
                                          </button>
                                          <strong></strong> <?php echo $this->session->flashdata('psuccess'); ?>
                                      </div>
                                     
                                   <?php } ?>
                                   <?php if($this->session->flashdata('perror')){ ?>
                                     <div class="alert alert-block  alert-danger fade in">
                                          <button data-dismiss="alert" class="close close-sm" type="button">
                                              <i class="fa fa-times"></i>
                                          </button>
                                          <strong></strong> <?php echo $this->session->flashdata('perror'); ?>
                                      </div>
                                     
                                   <?php } ?>
								<div class="form-body">
									<div class="form-group">
										<label class="col-md-3 control-label">Current  Password</label>
										<div class="col-md-9">
                                        <div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-lock"></i>
												</span>
										  <input name="password" type="password" autocomplete="off" class="form-control" id="c-pwd" placeholder=" ">
										</div>	
										</div>
									</div>					
									
									<div class="form-group">
										<label class="col-md-3 control-label">New Password</label>
										<div class="col-md-9">
											<div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-lock"></i>
												</span>
												 <input name="new_password" type="password" class="form-control" id="n-pwd" placeholder=" ">
											</div>
										</div>
									</div>	
                                    	<div class="form-group">
										<label class="col-md-3 control-label">Re-type New Password</label>
										<div class="col-md-9">
											<div class="input-group">
												<span class="input-group-addon">
												<i class="fa fa-lock"></i>
												</span>
											  <input name="c-password" type="password" class="form-control" id="rt-pwd" placeholder=" ">
											</div>
										</div>
									</div>
								</div>
								<div class="form-actions">
									<div class="row">
										<div class="col-md-offset-3 col-md-9">
											<button type="submit" class="btn green">Save</button>
											<button type="button" class="btn default">Cancel</button>
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