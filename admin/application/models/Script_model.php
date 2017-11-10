<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Script_model extends CI_Model {
	
	public function getComments($postID) {	  
       
       $sql='SELECT users.userID,users.firstName,users.lastName,users.roleID,users.gender,users.profilePic,post_commets.* 
             FROM `post_commets`
             LEFT JOIN users ON post_commets.commentByID=users.userID
             WHERE  post_commets.postID='.$postID.'
             order by commentID desc LIMIT 5';
        $res=$this->db->query($sql);
	    if($res->num_rows() > 0) {
			return $res->result();
		}
		return false;
	
	}
	public function get_all_Comments($postID) {	  
       
       $sql='SELECT users.userID,users.firstName,users.lastName,users.roleID,users.gender,users.profilePic,post_commets.* 
             FROM `post_commets`
             LEFT JOIN users ON post_commets.commentByID=users.userID
             WHERE  post_commets.postID='.$postID.'
             order by commentID asc';
        $res=$this->db->query($sql);
	    if($res->num_rows() > 0) {
			return $res->result();
		}
		return false;
	
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */