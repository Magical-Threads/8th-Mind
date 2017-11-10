<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Article extends CI_Controller{
    
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
        $this->response['page_title'] = "List Articles";
        $sql='SELECT articles.*,users.userFirstName,users.userLastName FROM `articles`
              LEFT JOIN users ON articles.userID=users.userID
              ORDER BY articleID DESC';
                            
        $query=$this->db->query($sql);      
        $this->response['result'] = $query->result();       
		$this->load->view('list_articles_view', $this->response);
    }
    
    public function add()
    {
        $this->response['page_title'] = "Add Article";  
		$this->load->view('add_article_view', $this->response);
    }
    function add_access()
    {
	
		$this->form_validation->set_rules('articleTitle', 'Article Title', 'required');
		$this->form_validation->set_rules('articleDescription', 'Article Description', 'required');
		$this->form_validation->set_rules('articleStartDate', 'Article Start Date', 'required');
        $this->form_validation->set_rules('articleExpireDate', 'Article Expire Date', 'required');
        $this->form_validation->set_rules('articleEndVotingDate', 'Article End Voting Date', 'required');
        
		if ($this->form_validation->run() == FALSE)
			{
		         $error=validation_errors();
                 $this->session->set_flashdata('error', $error);    
                 redirect('article/add');
			}
		  else
			{
			 
             $articleStartDate=strtotime($this->input->post('articleStartDate'));
             $articleExpireDate=strtotime($this->input->post('articleExpireDate'));
             
             $articleEndVotingDate=strtotime($this->input->post('articleEndVotingDate'));
			 if($articleStartDate>$articleExpireDate)
             {  
                 $error="Article Expire Date not small than Start Date";
                 $this->session->set_flashdata('error', $error);    
                 redirect('article/add');
                 exit();
             }
              if($articleStartDate>$articleEndVotingDate)
             {  
                 $error="Article End Voting Date not small than Article Start Date";
                 $this->session->set_flashdata('error', $error);    
                 redirect('article/add');
                 exit();
             }
             
             
			     $data['articleTitle'] = $this->input->post('articleTitle');
                 $data['articleDescription'] = $this->input->post('articleDescription');
                 $data['articleStartDate'] = $this->input->post('articleStartDate');
                 $data['articleExpireDate'] = $this->input->post('articleExpireDate');
                 $data['articleEndVotingDate'] = $this->input->post('articleEndVotingDate');
                 $data['articleTags'] = $this->input->post('articleTags');
                 $data['articleAllowSubmission'] = $this->input->post('articleAllowSubmission');
                 $data['articleSubmissionType'] = $this->input->post('articleSubmissionType');
			     $data['articleAllowGallery'] = $this->input->post('articleAllowGallery');
                 $data['articleAllowUpvoting'] = $this->input->post('articleAllowUpvoting');
                 $data['articleAllowComment'] = $this->input->post('articleAllowComment');
                 $data['articleStatus']='Active';             
                 $data['userID'] = $this->userID;
                 $data['createdAt'] = date('Y-m-d H:i:s');
                 $data['updatedAt'] = date('Y-m-d H:i:s');
                 
                 $config['upload_path'] = './storage/articles/';
                 $config['allowed_types'] = 'gif|jpg|jpeg|png|bmp';
                 $config['encrypt_name'] = true;
                 $this->load->library('upload', $config);
        
                 if (!$this->upload->do_upload('articleImage')) 
                 {
                 
                     $error=$this->upload->display_errors();
                     $this->session->set_flashdata('error', $error);    
                     redirect('article/add');
                     exit();  
                 } 
                 else 
                 {
                    $imageDetailArray = $this->upload->data();
                    $image = $imageDetailArray['file_name'];
                    $data['articleImage'] = $image;                   
                    
                  }  
      
                 	
         	     $this->db->insert('articles', $data);
                 $id=$this->db->insert_id();
                 
                
                $this->session->set_flashdata('success', 'Article Added Successfully');
                    
            
                 redirect('article/view/'.$id);
			
			}
		}
        function view($id)
		{	
		      $sql='SELECT articles.*,users.userFirstName,users.userLastName FROM `articles`
              LEFT JOIN users ON articles.userID=users.userID
              WHERE articleID='.$id;
          
          
		    $article=$this->db->query($sql);          
           	if($article->num_rows() == 0)
		      {
		     	redirect("article");
   			  }
          
    		$this->response['page_title'] = "View Article";
    		$this->response['result'] = $article->row();
    		$this->load->view('view_article_profile', $this->response);
		} 
    
    	function edit($id)
		{
            $this->response['page_title'] = "Edit Article";
            $sql='SELECT articles.*,users.userFirstName,users.userLastName FROM `articles`
              LEFT JOIN users ON articles.userID=users.userID
              WHERE articleID='.$id;
          
          
		    $article=$this->db->query($sql);          
           	if($article->num_rows() == 0)
		      {
		     	redirect("article");
   			  }
               
            $this->response['result'] = $article->row();
            
    		$this->load->view('edit_article_view', $this->response);
		}

        // delete an article
		function delete($id) {
            $sql = "DELETE FROM articles WHERE articleID = '{$id}' LIMIT 1";
            $this->db->query($sql);
            
            // if debugging, check for $this->db->affected_rows == 0
            
            redirect('article');
		}

        function edit_code($user_id)
		{
	
		    $this->form_validation->set_rules('articleTitle', 'Article Title', 'required');
    		$this->form_validation->set_rules('articleDescription', 'Article Description', 'required');
    		$this->form_validation->set_rules('articleStartDate', 'Article Start Date', 'required');
            $this->form_validation->set_rules('articleExpireDate', 'Article Expire Date', 'required');
            $this->form_validation->set_rules('articleEndVotingDate', 'Article End Voting Date', 'required');          
    		if ($this->form_validation->run() == FALSE)
    			{
    			     $error=validation_errors();
                     $this->session->set_flashdata('error', $error);    
                     redirect('article/edit/'.$user_id);
    			}
    		  else
    			{
    		
    			if ($user_id == "")
    				{
    				redirect("article");
    				}
                  $sql='SELECT articles.*,users.userFirstName,users.userLastName FROM `articles`
                  LEFT JOIN users ON articles.userID=users.userID
                  WHERE articleID='.$user_id;
              
              
    		    $article=$this->db->query($sql);          
               	if($article->num_rows() == 0)
    		      {
    		     	redirect("article");
       			  }
                  
                  
             $articleStartDate=strtotime($this->input->post('articleStartDate'));
             $articleExpireDate=strtotime($this->input->post('articleExpireDate'));
             
             $articleEndVotingDate=strtotime($this->input->post('articleEndVotingDate'));
			 if($articleStartDate>$articleExpireDate)
             {  
                 $error="Article Expire Date not small than Start Date";
                 $this->session->set_flashdata('error', $error);    
                 redirect('article/edit/'.$user_id);
                 exit();
             }
              if($articleStartDate>$articleEndVotingDate)
             {  
                 $error="Article End Voting Date not small than Article Start Date";
                 $this->session->set_flashdata('error', $error);    
                 redirect('article/edit/'.$user_id);
                 exit();
             }
             
             
			     $data['articleTitle'] = $this->input->post('articleTitle');
                 $data['articleDescription'] = $this->input->post('articleDescription');
                 $data['articleStartDate'] = $this->input->post('articleStartDate');
                 $data['articleExpireDate'] = $this->input->post('articleExpireDate');
                 $data['articleEndVotingDate'] = $this->input->post('articleEndVotingDate');
                 $data['articleTags'] = $this->input->post('articleTags');
                 $data['articleAllowSubmission'] = $this->input->post('articleAllowSubmission');
               //  $data['articleSubmissionType'] = $this->input->post('articleSubmissionType');
			     $data['articleAllowGallery'] = $this->input->post('articleAllowGallery');
                 $data['articleAllowUpvoting'] = $this->input->post('articleAllowUpvoting');
                 $data['articleAllowComment'] = $this->input->post('articleAllowComment');
                                 
                 $data['updatedAt'] = date('Y-m-d H:i:s');
                 
                if($_FILES['articleImage']['tmp_name']!='') {
                     $config['upload_path'] = './storage/articles/';
                     $config['allowed_types'] = 'gif|jpg|jpeg|png|bmp';
                     $config['encrypt_name'] = true;
                     $this->load->library('upload', $config);
            
                     if (!$this->upload->do_upload('articleImage')) 
                     {
                     
                         $error=$this->upload->display_errors();
                         $this->session->set_flashdata('error', $error);    
                        redirect('article/edit/'.$user_id);
                         exit();  
                     } 
                     else 
                     {
                        $imageDetailArray = $this->upload->data();
                        $image = $imageDetailArray['file_name'];
                        $data['articleImage'] = $image;                   
                        
                      }  	
    		    }
    			 $this->db->where('articleID', $user_id);
    			 $this->db->update('articles', $data);                
              
            
                
    			$this->session->set_flashdata('success', 'Updated Successfully');
    	    	redirect('article/view/'.$user_id);
    			}
		}
       
    public function change_status()
    {
        $id=$_POST['id'];
        if($id)
        {
             $query = $this->db->query("SELECT * FROM articles WHERE articleID='".$id."'");
             $result= $query->result_array();
             if($result[0]['articleStatus']=='Active')
             {                
                $this->db->set('articleStatus', 'Disable');
                $this->db->set('updatedAt', date('Y-m-d H:i:s'));              
		   	    $this ->db->where('articleID',$id);
			    $this->db->update('articles');
               echo json_encode(array("status"=>1,"msg"=>"Status Updated Successfully"));
             }
             else
             {
                $this->db->set('articleStatus', 'Active');
                $this->db->set('updatedAt', date('Y-m-d H:i:s'));   
		   	    $this ->db->where('articleID',$id);
			    $this->db->update('articles');
               echo json_encode(array("status"=>1,"msg"=>"Status Updated Successfully"));
             }
               
        }
        else
        {
            echo json_encode(array("status"=>0,"msg"=>"Status Changing Failed"));
        }
     
    }
    
  
    
    
}
