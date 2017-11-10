<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pagination_lib{

    public function make($base_url,$total_rows,$per_page,$uri_segment,$num_links)
    {
        $ci =& get_instance();    
        $ci->load->library('pagination');
        
        $config = array();
        $config["base_url"] = $base_url;
        $config["total_rows"] = $total_rows;
        $config["per_page"] = $per_page;
        $config["uri_segment"] = $uri_segment;       
        $config["num_links"] = $num_links;
        
        
         //config for bootstrap pagination class integration
        $config['full_tag_open'] = '<ul class="pagination">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = false;
        $config['last_link'] = false;
        $config['first_tag_open'] = '<li>';
        $config['first_tag_close'] = '</li>';
        $config['prev_link'] = '&laquo;';
        $config['prev_tag_open'] = '<li class="prev">';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = '&raquo;';
        $config['next_tag_open'] = '<li class="next">';
        $config['next_tag_close'] = '</li>';
        $config['last_tag_open'] = '<li>';
        $config['last_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="active"><a href="javascript:;" >';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li class="num">';
        $config['num_tag_close'] = '</li>';
        
        
        $ci->pagination->initialize($config);
        
        return $ci->pagination->create_links();
          
    
    
    }
  


}