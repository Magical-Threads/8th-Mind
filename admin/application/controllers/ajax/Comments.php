<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Comments extends CI_Controller{
    
    public function __construct()
    {
        parent::__construct();        
       
       
    }
    public function index($articleID)
    {   
             
      $result=$this->buildTree($articleID, 0);
      $json=json_encode($result);
      echo($json);
        
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
               
                                        $this->getComments($articleID,$row->commentID);
                                        
            } 
            if($parentID!=0)
            {
            $html.='</div>';
            }            
        }
        
        return $html;
        
    }
    
    function buildTree($articleID, $parentID = 0) {
    $branch = array();
    
    $sql='SELECT comments.*,users.userFirstName,users.userLastName FROM `comments`
              LEFT JOIN users ON comments.userID=users.userID
              WHERE comments.parentID='.$parentID.' and comments.articleID='.$articleID;                            
        $query=$this->db->query($sql);
    
    

    foreach ($query->result() as $row) {
        if ($row->parentID == $parentID) {
            $children = $this->buildTree($articleID, $row->commentID);
            if ($children) {
                $row->children = $children;
            }
            $branch[] = $row;
        }
    }

    return $branch;
}
  
   
  
    
    
}