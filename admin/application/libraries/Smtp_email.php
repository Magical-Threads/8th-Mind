<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Smtp_email{

public function __construct()
{
    $this->config=array();
     
     if(getenv('MAIL_DRIVER')=='smtp')
     {
        $this->config['protocol'] = getenv('MAIL_DRIVER');
        $this->config['smtp_host']=getenv('MAIL_HOST');
        $this->config['smtp_port']=getenv('MAIL_PORT');
        $this->config['smtp_user']=getenv('MAIL_USERNAME');
        $this->config['smtp_pass']=getenv('MAIL_PASSWORD');
     }
     
     $this->config['mailtype']='html';
     $this->config['charset']='utf-8';
     $this->config['charset']='utf-8';
     $this->config['priority']=TRUE;
}


public function send($from=NULL,$name=NULL,$toEmail,$subject,$msg){
   
        if($from==NULL)
        {          
           $from=getenv('MAIL_FROM_ADDRESS')!=''? getenv('MAIL_FROM_ADDRESS'): 'info@site.com';               
        }
        if($name==NULL)
        {
            $name=getenv('MAIL_FROM_NAME')!=''?getenv('MAIL_FROM_NAME'):'Adminstrator'; 
        }
        
        
        $ci =& get_instance();    
        $ci->load->library('email');
      	$ci->email->initialize($this->config);
		$ci->email->set_newline("\r\n");
		$ci->email->from($from,$name);
		$ci->email->to($toEmail);//to address here
		$ci->email->subject($subject);
        $ci->email->message($msg);
		if($ci->email->send())
			return true;
		else
		    return false;



	}
    public function send_attach_mail($from=NULL,$name=NULL,$toEmail,$subject,$msg,$filename)
    {

        if($from==NULL)
        {          
           $from=getenv('MAIL_FROM_ADDRESS')!=''? getenv('MAIL_FROM_ADDRESS'): 'info@site.com';               
        }
        if($name==NULL)
        {
            $name=getenv('MAIL_FROM_NAME')!=''?getenv('MAIL_FROM_NAME'):'Adminstrator'; 
        }
      
        $ci =& get_instance();    
        $ci->load->library('email');
      	$ci->email->initialize($this->config);
		$ci->email->set_newline("\r\n");
		$ci->email->from($from,$name);
		$ci->email->to($toEmail);//to address here
		$ci->email->subject($subject);
        $ci->email->message($msg);
        $ci->email->attach($filename);
		if($ci->email->send())
			return true;
		else
		    show_error($ci->email->print_debugger());

        

    }



	//============================================================================================	



}