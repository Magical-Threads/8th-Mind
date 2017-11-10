<?php 
$this->load->view('include/header.php');
?>
<!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
<link href="<?=base_url()?>assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/fullcalendar/fullcalendar.min.css" rel="stylesheet" type="text/css"/>
<link href="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL PLUGIN STYLES -->
<!-- BEGIN PAGE STYLES -->
<link href="<?=base_url()?>assets/admin/pages/css/tasks.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE STYLES -->
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
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
						<a href="<?=base_url()?>">Dashboard</a>
						<i class="fa fa-angle-right"></i>
					</li>
				
				</ul>
			
			</div>
			<h3 class="page-title">
			Dashboard <small>reports & statistics</small>
			</h3>
			<!-- END PAGE HEADER-->
			<!-- BEGIN DASHBOARD STATS -->
			<div class="row">
			
				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					<div class="dashboard-stat red-intense">
						<div class="visual">
							<i class="fa fa-users"></i>
						</div>
						<div class="details">
							<div class="number">
								 <?=$total_article?>
							</div>
							<div class="desc">
								Total Articles
							</div>
						</div>
						<a class="more" href="<?php echo base_url(); ?>">
						View more <i class="m-icon-swapright m-icon-white"></i>
						</a>
					</div>
				</div>
					<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					<div class="dashboard-stat green-haze">
						<div class="visual">
							<i class="fa fa-users"></i>
						</div>
						<div class="details">
							<div class="number">
							<?=$total_staff?>
							</div>
							<div class="desc">
							Total Staff
							</div>
						</div>
						<a class="more" href="<?php echo base_url(); ?>staff">
						View more <i class="m-icon-swapright m-icon-white"></i>
						</a>
					</div>
				</div>
				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					<div class="dashboard-stat purple-plum">
						<div class="visual">
							<i class="fa fa-users"></i>
						</div>
						<div class="details">
							<div class="number">
								<?=$total_user?>
							</div>
							<div class="desc">
							Total Users
							</div>
						</div>
						<a class="more" href="<?php echo base_url(); ?>user">
						View more <i class="m-icon-swapright m-icon-white"></i>
						</a>
					</div>
				</div>
                <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					<div class="dashboard-stat blue-madison">
						<div class="visual">
							<i class="fa fa-globe"></i>
						</div>
						<div class="details">
							<div class="number">
							$<?php echo $balance; ?>
							</div>
							<div class="desc">
						     Balance
							</div>
						</div>
						<a class="more" href="javascript:;">
						View more <i class="m-icon-swapright m-icon-white"></i>
						</a>
					</div>
				</div>
                
               
			</div>
            	<div class="clearfix">
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
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/flot/jquery.flot.resize.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery.pulsate.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
<!-- IMPORTANT! fullcalendar depends on jquery-ui.min.js for drag & drop support -->
<script src="<?=base_url()?>assets/global/plugins/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery-easypiechart/jquery.easypiechart.min.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/global/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->

<script src="<?=base_url()?>assets/admin/pages/scripts/index.js" type="text/javascript"></script>
<script src="<?=base_url()?>assets/admin/pages/scripts/tasks.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {  
   Index.init();   
   Index.initDashboardDaterange();
   Index.initJQVMAP(); // init index page's custom scripts
   Index.initCalendar(); // init index page's custom scripts
   Index.initCharts(); // init index page's custom scripts
   Index.initChat();
   Index.initMiniCharts();
   Tasks.initDashboardWidget();
});
</script>

