	<!-- BEGIN SIDEBAR -->

	<div class="page-sidebar-wrapper">

		<div class="page-sidebar navbar-collapse collapse">

			<ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">

				<!-- DOC: To remove the sidebar toggler from the sidebar you just need to completely remove the below "sidebar-toggler-wrapper" LI element -->

				<li class="sidebar-toggler-wrapper">

					<!-- BEGIN SIDEBAR TOGGLER BUTTON -->

					<div class="sidebar-toggler">

					</div>

					<!-- END SIDEBAR TOGGLER BUTTON -->

				</li>

			<?php $sess_data=$this->session->userdata('admin'); ?>			

                <li class="start <?php if($this->uri->segment(1)=='' || $this->uri->segment(1)=="home") {?> active <?php } ?>">
					<a href="<?=base_url()?>home">
					<i class="icon-home"></i>
					<span class="title">Dashboard </span>
                    <?php if($this->uri->segment(1)=='' || $this->uri->segment(1)=="home") {?>
                    <span class="selected"></span>
                    <?php } ?>				
					</a>				
				</li>
                
               <?php if( ($sess_data->userRole==1) && (1==0) ) {  // add 1==0 logic to temporarily prevent this segment from displaying -Ray
				   ?> 
                
                   <li class="<?php if($this->uri->segment(1)=="staff") {?> active open<?php } ?>">
    					<a href="javascript:;">
    					<i class="icon-users"></i>
    					<span class="title">Staff Management</span>
    					<span class="arrow <?php if($this->uri->segment(1)=="staff") {?> open<?php } ?> "></span>
    					</a>
    					<ul class="sub-menu">
    						<li <?php if($this->uri->segment(2)=='add'){echo "class='active'";} ?>>
    							<a href="<?=base_url()?>staff/add">
    							<i class="icon-user"></i>
    							Add Staff</a>
    						</li>
                            	<li <?php if($this->uri->segment(2)=='' || $this->uri->segment(2)=='index'){echo "class='active'";} ?>>
    							<a href="<?=base_url()?>staff">
    							<i class="icon-users"></i>
    							View Staff</a>
    						</li>
    					
    					</ul>
    				</li>

    			<?php } ?>
                
                
                
                <li class="<?php if($this->uri->segment(1)=="user") {?> active open<?php } ?>">
					<a href="javascript:;">
					<i class="icon-users"></i>
					<span class="title">User Management</span>
					<span class="arrow <?php if($this->uri->segment(1)=="user") {?> open<?php } ?> "></span>
					</a>
					<ul class="sub-menu">
						<li <?php if($this->uri->segment(2)=='add'){echo "class='active'";} ?>>
							<a href="<?=base_url()?>user/add">
							<i class="icon-user"></i>
							Add User</a>
						</li>
                        	<li <?php if($this->uri->segment(2)=='' || $this->uri->segment(2)=='index'){echo "class='active'";} ?>>
							<a href="<?=base_url()?>user">
							<i class="icon-users"></i>
							View Users</a>
						</li>
					
					</ul>
				</li>
                <li class="<?php if($this->uri->segment(1)=="article") {?> active open<?php } ?>">
					<a href="javascript:;">
					<i class="icon-briefcase"></i>
					<span class="title">Article Management</span>
					<span class="arrow <?php if($this->uri->segment(1)=="article") {?> open<?php } ?> "></span>
					</a>
					<ul class="sub-menu">
						<li <?php if($this->uri->segment(2)=='add'){echo "class='active'";} ?>>
							<a href="<?=base_url()?>article/add">
							<i class="icon-briefcase"></i>
							Add Article</a>
						</li>
                        	<li <?php if($this->uri->segment(2)=='' || $this->uri->segment(2)=='index'){echo "class='active'";} ?>>
							<a href="<?=base_url()?>article">
							<i class="icon-briefcase"></i>
							View Articles</a>
						</li>
					
					</ul>
				</li>
					
					</ul>
				</li>
                
                
				</ul>

			<!-- END SIDEBAR MENU -->

		</div>

	</div>

	<!-- END SIDEBAR -->