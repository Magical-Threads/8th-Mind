<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Profile extends CI_Controller
{
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
        $this->data['page_title'] = "Profile Update";
        $query = $this->db->query("SELECT * FROM users WHERE userID='".$this->userID."'");
        $this->data['user_data']= $query->row();       
        $this->load->view('admin_edit', $this->data);
        
    }
    public function update_code()
    {
   	    $this->form_validation->set_rules('firstName', 'First Name', 'required');
        $this->form_validation->set_rules('lastName', 'Last Name', 'required');

		if ($this->form_validation->run() == FALSE)
		{
		    $error=validation_errors();
		    $this->session->set_flashdata('error', $error);
			redirect("profile");
		}
		else
		{
						
            $user_date['userFirstName']=$this->input->post('firstName');
            $user_date['userLastName']=$this->input->post('lastName');
            $this->db->where('userID', $this->userID);
		    $this->db->update('users',$user_date);
           
            
             $this -> db -> select('*');
        	 $this -> db -> from('users');
        	 $this->db->where('userID', $this->userID);        	
        	 $query = $this->db->get(); 
             $sess_data = $query->row();
             
            unset($sess_data->userPassword);
            unset($sess_data->emailConfirmationToken);
            unset($sess_data->passwordResetToken);
            unset($sess_data->createdAt);
            unset($sess_data->updatedAt);
             	
             $this->session->set_userdata(array('admin'=>$sess_data));
            
		    $this->session->set_flashdata('success', 'Profile Updated Successfully');
		    redirect('profile');
			
		}
        
    }
     public function change_password()
    {
        		
		$this->form_validation->set_rules('password', 'Password', 'required');
		$this->form_validation->set_rules('new_password', 'New Password', 'required|matches[c-password]|min_length[8]');
		$this->form_validation->set_rules('c-password', 'Password Confirmation', 'required');
		
		if ($this->form_validation->run() == FALSE)
		{
			  $error=validation_errors();
		      $this->session->set_flashdata('perror', $error);             
			  redirect("profile");
		}
		else
		{						
			$password=($this->input->post('password'));
			$new_password=($this->input->post('new_password'));
			
		    $this -> db -> select('*');
        	$this -> db -> from('users');
        	$this->db->where('userID', $this->userID); 
			$this -> db -> limit(1);			
			$query = $this->db->get(); 
			if($query -> num_rows() == 1)
			{
			     $sess_data = $query->row();
                 $pass_node=httpPostNode(array('userPassword'=>$password,'hashPassword'=>$sess_data->userPassword,'type'=>'check')); 
                 if($pass_node=='false' || $pass_node=='')
                 {
                    $this->session->set_flashdata('perror', 'Incorrect Old Password');				
                    redirect('profile');
                 }                
                $pass_new_node=httpPostNode(array('userPassword'=>$new_password,'type'=>'hash')); 
                 if($pass_new_node=='false' || $pass_new_node=='')
                 {
                    $this->session->set_flashdata('perror', 'Incorrect Old Password');				
                    redirect('profile');
                 }
			   $this->db->set('userPassword', $pass_new_node);
		   	   $this -> db -> where('userID', $this->userID);
			   $this->db->update('users');
			}
            else
            {
            $this->session->set_flashdata('perror', 'The password is incorrect!!!');
			redirect('profile');
            }
			
			$this->session->set_flashdata('psuccess', 'The password changed successfully');
			redirect('profile');
		}
    }
}