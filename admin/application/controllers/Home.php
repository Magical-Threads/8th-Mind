<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
    
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
       
        $this->data['page_title']='Home - Admin';
        $this->data['total_staff'] = $this->user(2);        
        $this->data['total_user'] = $this->user(3);
        $this->data['total_article'] = 0;
        $this->data['balance'] = 0;
       
        
        $this->load->view('home', $this->data);
        
    }
   	
    	public function user($roleid) 
     {
	   
		$sql = "SELECT COUNT(userID) as total from users where userRole=".$roleid;
		$res = $this->db->query($sql);
		if($res->num_rows() > 0) {
			$res = $res->result_array();
			return $res[0]['total'];
		}
		return 0;
	}
    
    
	

}
