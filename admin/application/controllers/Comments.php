<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Comments extends CI_Controller{
    
    public function __construct()
    {
        parent::__construct();        
       
       
    }
    public function index($articleID)
    {   
             
        echo $this->getComments($articleID,0);
        
    }
    function getComments($articleID,$parentID){
        $html='';
        $sql='SELECT comments.*,users.userFirstName,users.userLastName FROM `comments`
              LEFT JOIN users ON comments.userID=users.userID
              WHERE comments.parentID='.$parentID.' and comments.articleID='.$articleID;                            
        $query=$this->db->query($sql);
        if($query->num_rows()>0)
        {
            if($parentID!=0)
            {
            $html.='<div class="nested">';
            }
            foreach($query->result() as $row)
            {
                $html.='<div class="comment-box">
        								<img src="'.base_url().'/assets/dummy/male.png" class="myimage">
        								<div class="other-comment-box">
        									<h3>'.$row->userFirstName.' |<small>'.date('Y-m-d',strtotime($row->createdAt)).'</small> <small class="pull-right"><span class="reply"><a href="javascript:;" onclick="reply(2)"><i class="fa fa-reply"></i> Reply</a></span> </small></h3>
        									<p>'.$row->commentText.'</p>
        							
        							    </div>';
                                        $html.='</div>';
                                        $html.=$this->getComments($articleID,$row->commentID);
                                        
            } 
            if($parentID!=0)
            {
            $html.='</div>';
            }            
        }
        
        return $html;
        
    }
  
   
  
    
    
}