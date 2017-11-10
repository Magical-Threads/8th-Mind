<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//http://www.robertmullaney.com/2012/07/12/generic-database-table-model-codeigniter-2/
class Generic_model extends CI_Model {

    var $table_name = '';  //required
    var $field_prefix = '';
    var $primary_key = ''; //required
    var $select_fields = '*';
    var $num_rows = 0;
    var $insert_id = 0;
    var $affected_rows = 0;
    var $last_query = '';
    var $error_msg = array();

    public function initialize($params = array())
    {
        if (count($params) > 0) {
            foreach ($params as $key => $val) {
                if (isset($this->$key)) {
                    $this->$key = $val;
                }
            }
        }
        if ($this->table_name == '') {
            $this->_set_error('table_name_required');
        }
        if ($this->primary_key == '') {
            $this->_set_error('primary_key_required');
        }
        if (count($this->error_msg) > 0) {
            return FALSE;
        }
    }
    
    public function get($limit = NULL, $offset = NULL, $sort = NULL, $search = NULL)
    {
        if ($limit !== NULL) $limit = (int) $limit;
        if ($offset !== NULL) $offset = (int) $offset;
        if (is_array($sort)) {
            foreach ($sort as $field => $order) {
                $this->db->order_by($this->field_prefix . $field, $order);
            }
        }
        if (is_array($search)) {
            foreach ($search as $field => $match) {
                $this->db->like($this->field_prefix . $field, $match);
            }
        }
        $this->db->select($this->select_fields);
        $query = $this->db->get($this->table_name, $limit, $offset);
        $this->last_query = $this->db->last_query();
        $this->num_rows = $this->_num_rows($search);
        return ($limit == 1) ? $query->row() : $query->result();
    }

    public function insert($data = array())
    {
        if (is_array($data)) {
            $this->db->insert($this->table_name, $data);
            $this->insert_id = $this->db->insert_id();
            $this->_optimize();
        }
    }
    
    public function update($id = 0, $data = array())
    {
        $id = (int) $id;
        if ($id && is_array($data)) {
            $this->db->where($this->primary_key, $id);
            $this->db->update($this->table_name, $data); 
            $this->_optimize();
        }
    }
    
    public function delete($id = 0)
    {
        $id = (int) $id;
        if ($id) {
            $this->db->where($this->primary_key, $id);
            $this->db->delete($this->table_name); 
            $this->_optimize();
        }
    }
    
    private function _num_rows($search = NULL)
    {
        if ($search !== NULL) {
            foreach ($search as $field => $match) {
                $this->db->like($this->field_prefix . $field, $match);
            }
            return $this->db->count_all_results($this->table_name);
        }
        return $this->db->count_all($this->table_name);
    }

    private function _optimize()
    {
        $this->last_query = $this->db->last_query();
        $this->affected_rows = $this->db->affected_rows();
        $this->load->dbutil();
        $this->dbutil->optimize_table($this->table_name);
    }

    private function _set_error($msg)
    {
        if (is_array($msg)) {
            foreach ($msg as $val) {
                $this->error_msg[] = $val;
                log_message('error', $val);
            }
        } else {
            $this->error_msg[] = $msg;
            log_message('error', $msg);
        }
    }

    public function display_errors($open = '<p>', $close = '</p>')    {
        $str = '';
        foreach ($this->error_msg as $val) {
            $str .= $open . $val . $close;
        }
        return $str;
    }

}

/* End of file generic_model.php */
/* Location: ./application/models/generic_model.php */