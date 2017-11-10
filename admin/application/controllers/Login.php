<?php

defined('BASEPATH') OR exit('No direct script access allowed');
class Login extends CI_Controller {
    public function __construct()
    {
        parent::__construct();        
        $sess_data=$this->session->userdata('admin');
        if(isset($sess_data->userUserID))
        {
            redirect('home');
        }  
    
    }
    public function index()
    {
                
        $this->data['page_title']="login"; 
        $this->load->view('login',$this->data);
        
    } 
    public function login_access()
    {
        $this->data['page_title']="login"; 
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
		$this->form_validation->set_rules('password', 'Password', 'required');
		if ($this->form_validation->run() == FALSE)
		{		  	
			$this->load->view('login', $this->data);
		}
		else
		{     
        		
       $email = $this->input->post('email'); 
	   $password = $this->input->post('password');
            
	   $this -> db -> select('*');
	   $this -> db -> from('users');
	   $this -> db -> where('userEmail', $email);
	   $this -> db -> limit(1);
	   $query = $this->db->get(); 
	   if($query -> num_rows() >= 1)
       {
			$sess_data = $query->row();
            
             $pass_node=httpPostNode(array('userPassword'=>$password,'hashPassword'=>$sess_data->userPassword,'type'=>'check'));

             if($pass_node=='false' || $pass_node=='')
             {
                $this->session->set_flashdata('error', 'Incorrect Password');				
                redirect('login');
             }            
           
           	if($sess_data->emailStatus != 'Verified')
            {			  	         
               $this->session->set_flashdata('error', 'Email Verified, Please Contact Administrator');				
                redirect('login');
			}		
			if($sess_data->userStatus != 'Active')
            {			  	         
               $this->session->set_flashdata('error', 'Account Inactive, Please Contact Administrator');				
                redirect('login');
			}
            if($sess_data->userRole==3)
            {			  	         
               $this->session->set_flashdata('error', 'No access to login');				
                redirect('login');
			}
            
            unset($sess_data->userPassword);
            unset($sess_data->emailConfirmationToken);
            unset($sess_data->passwordResetToken);
            unset($sess_data->createdAt);
            unset($sess_data->updatedAt);  

			$this->session->set_userdata(array('admin'=>$sess_data));
			$data_array = array('lastLogin'=> date('Y-m-d H:i:s'));	
			$this->db->update('users', $data_array,array('userEmail'=>$email));				   
            redirect('home');
            exit();

	   }
	   else
	   {	       
	  	$this->session->set_flashdata('error', 'Incorrect Email');	
        redirect('login');
	    exit;           

	   }
       }
    }
    public function forgot()
    {      
        $this->data['page_title']="login";
		$this->form_validation->set_rules('email', 'Email', 'required|valid_email');
		if ($this->form_validation->run() == FALSE)
 	     {
			 $response=array('code'=>0,'msg'=> validation_errors());
             echo json_encode($response);
             exit();
            
         }
		else
		{
			$email=$this->input->post('email');
            $query = $this->db->query("SELECT * FROM users WHERE userEmail='".$email."' and userRole!=3");
            if($query->num_rows()<1)
                {
                
                 $response=array('code'=>0,'msg'=> 'Email does not exist');
                 echo json_encode($response);
                 exit();
                
                
                } 
                else 
                {
				$pass_code = (uniqid());
				$this->db->set('passwordResetToken', $pass_code);
				$this->db->where('userEmail',$email);
				$this->db->update('users');                
                
                // email //
                 
                 $to=$email;
                 $subject='Reset Password';
                 $message='Your New Password Renewal Link is '.base_url().'login/update_password/'.$pass_code;
                                
                 $this->smtp_email->send('','',$to,$subject,$message);
            
              
                 $response=array('code'=>1,'msg'=> 'A Password Change Link has been sent to your email');
                 echo json_encode($response);
                 exit();

			  }			
		}
        
    }
    public function update_password()
    {        
        $this->data['page_title']='Update password';
		if($this->uri->segment(3)){	
        
        $this -> db -> select('userID');
	    $this -> db -> from('users');
	    $this -> db -> where('passwordResetToken', $this->uri->segment(3));
        $this -> db -> where('userRole!=', 3);         
	    $this -> db -> limit(1);
	    $query = $this->db->get(); 
	    if($query -> num_rows() == 0)
        {
        redirect('login');
        exit();       
        }        
        
        $this->data['pass_code']=$this->uri->segment(3);
		$this->load->view('update_password_view', $this->data);
		} else {
		redirect('login');
        exit();
		}
	}
	public function update_password_code() 
    {
        $this->form_validation->set_rules('password', 'Password', 'required|matches[c-password]|min_length[8]');
		$this->form_validation->set_rules('c-password', 'Password Confirmation', 'required');
		$pass_code=$this->input->post('pass_code');
		if ($this->form_validation->run() == FALSE)
		{
		  $error=validation_errors();
		  $this->session->set_flashdata('error', $error);
	       redirect('login/update_password/'.$pass_code);
           exit();
		}
		else
		{
           $this -> db -> select('userID');
	       $this -> db -> from('users');
	       $this -> db -> where('passwordResetToken',$pass_code);
           $this -> db -> where('userRole!=', 3);  
	       $this -> db -> limit(1);
	       $query = $this->db->get(); 
	       if($query -> num_rows() == 0)
            {
                
                redirect('login');
                exit();       
            } 
			$password=$this->input->post('password');            
            $pass_node=httpPostNode(array('userPassword'=>$password,'type'=>'hash')); 
            if($pass_node=='false' || $pass_node=='')
             {
               	$this->session->set_flashdata('error', 'Something Wrong');	
                redirect('login');
             }  
			$this->db->set('userPassword', $pass_node);
			$this->db->where('passwordResetToken', $pass_code);
			$this->db->update('users');			
            $this->db->set('passwordResetToken', '');
			$this->db->where('passwordResetToken', $pass_code);
			$this->db->update('users');
			$this->session->set_flashdata('success', 'The password changed successfully');
			redirect('login');
            exit();

		}

	}   

}
