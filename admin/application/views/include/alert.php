 <?php if($this->session->flashdata('error')){ ?>
 <div class="alert alert-block  alert-danger fade in">
     <button data-dismiss="alert" class="close close-sm" type="button">
     <i class="fa fa-times"></i>
     </button>
     <strong></strong> <?php echo $this->session->flashdata('error'); ?>
 </div>
<?php } ?>
<?php if($this->session->flashdata('success')){ ?>
<div class="alert alert-success alert-block fade in">
    <button data-dismiss="alert" class="close close-sm" type="button">
    <i class="fa fa-times"></i>
    </button>
    <h4>
    <i class="fa fa-ok-sign"></i>
    Success!
    </h4>
    <p>
    <?php echo $this->session->flashdata('success'); ?>
    </p>
</div>
<?php } ?> 
 <?php if(validation_errors()){ ?>
		<div class="alert alert-danger">
			<button class="close" data-close="alert"></button>
			<span>
		  <?php echo validation_errors(); ?> </span>
		</div>
 <?php } ?> 