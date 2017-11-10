<?php 
$this->load->view('include/header.php');
?>
<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="<?=base_url()?>assets/global/plugins/select2/select2.css"/>
<link rel="stylesheet" type="text/css" href="<?=base_url()?>assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"/>
<!-- END PAGE LEVEL STYLES -->
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
			View Users
			</h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li>
						<i class="fa fa-home"></i>
					    <a href="<?=base_url()?>">Home</a>
						<i class="fa fa-angle-right"></i>
					</li>
					<li>
						<a href="">Users</a>
						
					</li>
				
				</ul>
				
			</div>
			<!-- END PAGE HEADER-->
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
				<div class="col-md-12">
                      <?php $this->load->view('include/alert'); ?>
					<!-- BEGIN EXAMPLE TABLE PORTLET-->
					<div class="portlet box grey-cascade">
						<div class="portlet-title">
							<div class="caption">
								<i class="fa fa-globe"></i>View Users
							</div>
							<div class="tools">
								<a href="javascript:;" class="collapse">
								</a>
							
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="row">
									<div class="col-md-6">
										<div class="btn-group">
											<a href="<?=base_url()?>user/add"><button id="sample_editable_1_new" class="btn green">
											Add New <i class="fa fa-plus"></i>
											</button></a>
										</div>
									</div>
									<div class="col-md-6">
										<div class="btn-group pull-right">
										
										</div>
									</div>
								</div>
							</div>
							<table class="table table-striped table-bordered table-hover" id="sample_1">
							<thead>
							<tr>								
								 <th> Name</th>
                                 <th> Email</th>
                                 <th> Created On</th>
                                 <th> Last login</th>
                                 <th> Status</th> 
                                 <th> Email Status</th>                                
                                 <th> Action</th>
							</tr>
							</thead>
							<tbody>
                            <?php foreach($users as $row){ ?>
							<tr class="odd gradeX">
						      
								<td>
									 <?php echo $row->userFirstName." ".$row->userLastName; ?>
								</td>
								<td>
									<a href="mailto:<?php echo $row->userEmail; ?>">
								<?php echo $row->userEmail; ?> </a>
								</td>
								<td>
                                  <?=date('F d,Y g:i A',strtotime($row->createdAt))?>
								
								</td>
								<td class="center">
									 <?php if($row->lastLogin=='0000-00-00 00:00:00')
                                        {
                                        echo "Never Logged In"; 
                                        }
                                        else
                                        {
                                        echo date('F d,Y g:i A',strtotime($row->lastLogin));
                                        }
                                    ?>
								</td>
                                	
								<td>
                                <a  href="javascript:status(<?php echo $row->userID; ?>);">
                                            <?php if($row->userStatus != 'Active'){ ?>
                                            <img src="<?php echo base_url(); ?>assets/global/img/icon-img-down.png" data-id="0" id="t_<?php echo $row->userID; ?>" />
                                           <?php }  else { ?>
                                            <img src="<?php echo base_url(); ?>assets/global/img/icon-img-up.png" data-id="1" id="t_<?php echo $row->userID; ?>" />
                                            <?php } ?>       
                                                                                     
                                 </a>                                   
								</td>
                                <td>
                                  <?php echo $row->emailStatus; ?>                                
                                </td>
                               
                                <td class="center">
                                  <a href="<?php echo base_url();?>user/reset_password/<?php echo $row->userID; ?>" class="btn btn-primary btn-xs"><i class="fa fa-lock"></i></a>
                                  <a href="<?php echo base_url();?>user/edit/<?php echo $row->userID; ?>" class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></a>                                
								  <a href="<?php echo base_url();?>user/view_profile/<?php echo $row->userID; ?>" class="btn btn-primary btn-xs"><i class="fa fa-eye"></i></a> 
								  <a href="#" onClick="deletePrompt(this, '<?php echo base_url();?>user/delete/<?php echo $row->userID; ?>')" class="btn btn-primary btn-xs"><i class="fa fa-trash"></i></a>
                            	</td>
							</tr>
						     <?php } ?>
						
							</tbody>
							</table>
						</div>
					</div>
					<!-- END EXAMPLE TABLE PORTLET-->
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
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="<?=base_url()?>assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {       
  $('#sample_1').dataTable({
//"scrollY": "200px",
//"scrollCollapse": true,
"paging": true,
"bSort": false
/* aoColumnDefs: [
  {
     bSortable: false,
	 ordering: false
	 
   //  aTargets: [ -1,-2, -3, -4 ]
  }
] */
});
});
</script>
 <script type="text/javascript">
     
        function status(did)
       {

           var didsts = $( "#t_" + did ).data("id"); 
   
           $.post("<?php echo base_url(); ?>user/change_status/",{id:did},function(data)
           {     
               var result = JSON.parse(data);   
               if(result.status == 1)
               {
                 
                   if(didsts == 1)
                   {
                       
                     $( "#t_" + did ).data("id", 0);
                       document.getElementById("t_" + did).src = "<?php echo base_url(); ?>/assets/global/img/icon-img-down.png";
       
                   }
                   else
                   {
       
                       $( "#t_" + did ).data("id", 1);
                       document.getElementById("t_" + did).src = "<?php echo base_url(); ?>assets/global/img/icon-img-up.png";
        
                   }
                 } 
               
               else
               {
                   alert("Error");
               }
           })
       }
                              
                              
</script>
</body>
<!-- END BODY -->
</html>