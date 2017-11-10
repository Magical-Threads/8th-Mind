<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller{
    
    public function __construct()
    {
        parent::__construct();
        
        $sess_data=$this->session->userdata('admin');    
        if(!isset($sess_data->userID))
        {
            redirect('login');
        }  
            
        $this->userID = $sess_data->userID;
       
    }
    public function index()
    {           
        $this->response['page_title'] = "List Users";
		$this->response['users'] = $this->general_model->get_table_data('users','*',array('userRole'=>3));       
		$this->load->view('list_user_view', $this->response);
    }
     public function add()
    {
        $this->response['page_title'] = "Add User";  
		$this->load->view('add_user_view', $this->response);
    }
    function add_access()
    {
	
		$this->form_validation->set_rules('userFirstName', 'First Name', 'required');
		$this->form_validation->set_rules('userLastName', 'Last Name', 'required');
		$this->form_validation->set_rules('userEmail', 'Email', 'required|valid_email|callback_customer_email_check');
		$this->form_validation->set_rules('userPassword', 'Password', 'required|matches[cpassword]|min_length[8]');
		$this->form_validation->set_rules('cpassword', 'Password Confirmation', 'required|min_length[8]');       
        
		if ($this->form_validation->run() == FALSE) {
				$error=validation_errors();
				$this->session->set_flashdata('error', $error);    
				redirect('user/add');
		}
		else {
				$password=$this->input->post('userPassword');
				$pass_node=httpPostNode(array('userPassword'=>$password,'type'=>'hash'));
				if($pass_node=='false' || $pass_node=='')
				{
				$this->session->set_flashdata('error', 'Something Wrong');	
				redirect('user');
				}
				$data['userFirstName'] = $this->input->post('userFirstName');
				$data['userLastName'] = $this->input->post('userLastName');
				$data['userEmail'] = $this->input->post('userEmail');
				$data['userPassword'] = $pass_node; 
				$data['emailStatus']='Verified';             
				$data['userRole'] = 3;
				$data['createdAt'] = date('Y-m-d H:i:s');
				$data['updatedAt'] = date('Y-m-d H:i:s');		
				$data['userStatus'] = 'Active'; 
				$this->db->insert('users', $data);
				$id=$this->db->insert_id();
				
			
			
				// send activation link //
			
				$name=$this->input->post('userFirstName');
				$to=$this->input->post('userEmail');
				$subject='Login Information';
				$content ='<h2>Login Information</h2>';
				$content .='<p>Email: '.$to.' <br/>Password: '.$this->input->post('userPassword').' <br/> Please click on the following link (or copy and paste it into your browser) to sign in.<br/><br/> <a href="'.getenv('FRONTEND_URL').'">'.getenv('FRONTEND_URL').'</a><br/></p>';
				$email_data['content']= $content;                 
				$message=$this->load->view('emails/general',$email_data,true); 
				$this->smtp_email->send('','',$to,$subject,$message);                 
	
				$this->session->set_flashdata('success', 'Created Successfully');    
		
				redirect('user');
		
		}
	}
	
	function view_profile($id) {	
		$user=$this->general_model->select_where('users',array('userID'=>$id,'userRole'=>3));          
		if($user == false)
			{
			redirect("user");
			}
		
		$this->response['page_title'] = "View Profile";
		$this->response['user'] = $user;
		$this->load->view('view_user_profile', $this->response);
	} 

    function reset_password($id)
	{	
		$user=$this->general_model->select_where('users',array('userID'=>$id,'userRole'=>3));          
		if($user == false)
			{
			redirect("user");
			}
		
		$this->response['page_title'] = "User Reset Password";
		$this->response['staff'] = $user;
		$this->load->view('edit_user_password', $this->response);
	} 
	
	function edit_pass_code($user_id)
	{

		$this->form_validation->set_rules('userPassword', 'Password', 'required|matches[cpassword]|min_length[8]');
		$this->form_validation->set_rules('cpassword', 'Password Confirmation', 'required|min_length[8]');       
				
		if ($this->form_validation->run() == FALSE)
			{
					$error=validation_errors();
					$this->session->set_flashdata('error', $error);    
					redirect('user/reset_password/'.$user_id);
			}
			else
			{
			
			if ($user_id == "")
				{
				redirect("user");
				}
			$staff=$this->general_model->select_where('users',array('userID'=>$user_id,'userRole'=>3));  
			
			
			if ($staff == false)
				{
				redirect("user");
				}
				
				$password=$this->input->post('userPassword');   
				$pass_node=httpPostNode(array('userPassword'=>$password,'type'=>'hash'));
				if($pass_node=='false' || $pass_node=='')
				{
				$this->session->set_flashdata('error', 'Something Wrong');	
					redirect('user/reset_password/'.$user_id);
				}
								
				$user_date['userPassword'] = $pass_node; 
				$user_date['updatedAt'] = date('Y-m-d H:i:s');	
		
				$this->db->where('userID', $user_id);
				$this->db->update('users', $user_date);
				
				// send activation link //
			
				$name=$staff->userFirstName;
				$to=$staff->userEmail;
				$subject='Reset Password Information';
				$content ='<h2>Reset Password Information</h2>';
				$content .='<p>New Password: '.$password.' <br/> Please click on the following link (or copy and paste it into your browser) to sign in.<br/><br/> <a href="'.getenv('FRONTEND_URL').'">'.getenv('FRONTEND_URL').'</a><br/></p>';
				$email_data['content']= $content;                 
				$message=$this->load->view('emails/general',$email_data,true); 
				$this->smtp_email->send('','',$to,$subject,$message); 
				
				$this->session->set_flashdata('success', 'Password Updated Successfully');
				redirect('user');
			}
	}  
         
    function edit($id) {
		$this->response['page_title'] = "Edit User";
		$user=$this->general_model->select_where('users',array('userID'=>$id,'userRole'=>3));          
		if ($user == false)
			{
			redirect("user");
			}
			
			$this->response['user'] =$user;
		
		$this->load->view('edit_user_view', $this->response);
	}
	
	// delete user
	function delete($id) {
		$sql = "DELETE FROM users WHERE userID = '{$id}' LIMIT 1";
		$this->db->query($sql);

		redirect('user');
	}

	function edit_code($user_id)
	{

		$this->form_validation->set_rules('userFirstName', 'First Name', 'required');
		$this->form_validation->set_rules('userLastName', 'Last Name', 'required');          
		if ($this->form_validation->run() == FALSE)
			{
					$error=validation_errors();
					$this->session->set_flashdata('error', $error);    
					redirect('user/edit/'.$user_id);
			}
			else
			{
		
			if ($user_id == "")
				{
				redirect("user");
				}
				$user=$this->general_model->select_where('users',array('userID'=>$user_id,'userRole'=>3));   
		
			if ($user == false)
				{
				redirect("user");
				}
				
				$user_date['userFirstName'] = $this->input->post('userFirstName');
				$user_date['userLastName'] = $this->input->post('userLastName');                 
				$user_date['updatedAt'] = date('Y-m-d H:i:s');	
		
			$this->db->where('userID', $user_id);
			$this->db->update('users', $user_date);                
			
		
			
			$this->session->set_flashdata('success', 'Updated Successfully');
			redirect('user');
			}
	}
     
    function customer_email_check($str)
		{
	
		$r = $this->general_model->role_exists('userEmail', $str,'users');
		if ($r == false)
			{
			$this->form_validation->set_message('customer_email_check', 'Email Already Exists!!!');
			return false;
			}
		  else
			{
			return true;
			}
		}    
    public function change_status()
    {
        $id=$_POST['id'];
        if($id)
        {
             $query = $this->db->query("SELECT * FROM users WHERE userID='".$id."' and userRole=3");
             $result= $query->result_array();
             if($result[0]['userStatus']=='Active')
             {                
                $this->db->set('userStatus', 'Block');
                $this->db->set('updatedAt', date('Y-m-d H:i:s'));              
		   	    $this ->db->where('userID',$id);
			    $this->db->update('users');
               echo json_encode(array("status"=>1,"msg"=>"Status Updated Successfully"));
             }
             else
             {
                $this->db->set('userStatus', 'Active');
                $this->db->set('updatedAt', date('Y-m-d H:i:s'));   
		   	    $this ->db->where('userID',$id);
			    $this->db->update('users');
               echo json_encode(array("status"=>1,"msg"=>"Status Updated Successfully"));
             }
               
        }
        else
        {
            echo json_encode(array("status"=>0,"msg"=>"Status Changing Failed"));
        }
     
    }
      public function email_checks()
		{
    	   if(isset($_GET['userEmail']))
           {
                $str=$_GET['userEmail'];
        		$r = $this->general_model->role_exists('userEmail', $str,'users');
            		if ($r == false)
            			{            		
            			echo 'false';
            			}
            		  else
            			{
            			echo 'true';
            			}
             }
             else
             {
                echo 'false';
             }   
		}
  
  
    
    
}