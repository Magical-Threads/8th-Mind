<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class General_model extends CI_Model {
	
	public function create_slug($txt, $table, $field) {
		$slug = url_title(strtolower($txt));
		$params[$field] = $slug;
    	if ($this->input->post('id')) {
        	$params['id !='] = $this->input->post('id');
   		}
		$i = 0;
		while ($this->db->where($params)->get($table)->num_rows()) {
        if (!preg_match ('/-{1}[0-9]+$/', $slug )) {
            $slug .= '-' . ++$i;
        } else {
            $slug = preg_replace ('/[0-9]+$/', ++$i, $slug );
        }
        $params ['slug'] = $slug;
        }
		return $slug;
	}
	
	public function total_rows() {
		$sql = "SELECT FOUND_ROWS() as total";
		$res = $this->db->query($sql);
		if($res->num_rows() > 0) {
			$return = $res->result_array();
			return $return[0]['total'];
		}
		return 0;
	}
	
	
	public function get_countries() {
		$sql = "SELECT * FROM countries";
		$res = $this->db->query($sql);
		if($res->num_rows() > 0) {
			return $res->result_array();
		}
		return false;
	}
    public function get_cities($sid)
    {
   	     $sql = "SELECT * FROM cities where state_id=".$sid;
         $res = $this->db->query($sql);
    		if($res->num_rows() > 0) {
    			return $res->result_array();
    		}
    		return false;
    }
	public function get_provinces($cid) {
		$sql = "SELECT * FROM states where country_id=".$cid;
		$res = $this->db->query($sql);
		if($res->num_rows() > 0) {
			return $res->result_array();
		}
		return false;
	}
	public function forbidden_access() {
			$this->load->view('cheating');
			$this->CI = get_instance(); 
			$this->CI->output->_display();
			die();
	}
	public function get_table_data($table,$select,$where=NULL,$order=NULL,$row=0)
    {
        $this->db->select($select);
        if($where) $this->db->where($where);
        if($order) $this->db->order_by($order);
        $query = $this->db->get($table);
        if($row) return $query = $query->row(); 
        return $result = $query->result();
   }
   public function count_rows($table,$where=NULL)
   {
        $this->db->select('*');
        if($where) $this->db->where($where);
        $query = $this->db->get($table);
        return $query->num_rows();   
   }
	function select_where($table=NULL,$where=NULL)
	  {
		  if($table != NULL && $where != NULL)
		  {
		  		$this->db->select('*');
				$this->db->from($table);
				$this->db->where($where);
				$query = $this->db->get();
				return $query->row(); 
		  }
		  else
		  {
			  return false;
		  }
	  }	
	  
	  function insert($table=NULL,$query=NULL)
	  {
		  if($table != NULL && $query != NULL)
		  {
		  		$this->db->insert($table,$query);
				return true;
		  }
		  else
		  {
			  return false;
		  }
	  }
	  
	   function update($table=NULL,$query=NULL,$where=NULL)
	  {
		  if($table != NULL && $query != NULL && $where != NULL)
		  {
		  		$this->db->where($where);
				$this->db->update($table,$query);				
				return true;
		  }
		  else
		  {
			  return false;
		  }
	  }
	 function select($table=NULL)
	 {
		 $this->db->select('*')->from($table);
		 $query = $this->db->get();
		 if($query->num_rows() > 0)
		 {
			 return $query->result();
		 }
		 else
		 {
			 return false;
		 }
	 }
     function role_exists($key,$str,$table)
    {
        
        $this->db->where($key,$str);
        $query = $this->db->get($table);
        
        if ($query->num_rows() > 0){
         
            return false;
        }
        else{
           
            return true;
        }
    }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */