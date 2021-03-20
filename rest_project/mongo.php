<?php
  
//require 'vendor/autoload.php' ;
  
class db {
    private $user = "8pyrek" ;
    private $pass = "pass8pyrek";
    private $host = "172.20.44.25";
    private $base = "8pyrek";
    private $collUsers = "users";
    private $collSession = "session";
    private $collPoll = "ankieta";
    private $conn;
    private $dbase;
    private $collectionUsers;
    private $collectionSessions;
    private $collectionPoll;
  
  
  
    function __construct() {
      $this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");    
      $this->collectionUsers = $this->conn->{$this->base}->{$this->collUsers};
      $this->collectionSessions = $this->conn->{$this->base}->{$this->collSession};
      $this->collectionPoll = $this->conn->{$this->base}->{$this->collPoll};
    }
  
    function select() {
      $cursor = $this->collectionPoll->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }
  
    function insert($data) {
      $ret = $this->collectionPoll->insertOne($data) ;
      return $ret;
    }
  
    public function register($user)
    {
      $number = $this->collectionUsers->count(['login' => $user['login']]);
      if($number == 0)
      {
        $ret = $this->collectionUsers->insertOne($user);
      }
      else
      {
        return false;
      }
      return $ret;

    }

    public function login($user)
    {
      $log = $user['login'];
      $pass = $user['password'];

      $number = $this->collectionUsers->count(['login' => $log, 'password' => $pass ]);
      if($number == 0)
      {
        $ret = false;
      }
      else
      {
        $session_id = md5(uniqid($log, true));
        $start = date('Y-m-d H:i:s', time());
        $rec = array('sessionID' => $session_id, 'start' => $start);
        $ret = $this->collectionSessions->insertOne($rec);
      }

      return $session_id;
    }

    public function session_check($array) 
    {
      $ses =  $this->collectionSessions->findOne(array('sessionID' => $array['sessionID']));
      if($ses != NULL)
      {
        $start = $ses['start'];
        $date = DateTime::createFromFormat("Y-m-d H:i:s", $start);
        $time = new DateTime('now');
        $diff = $time->getTimestamp() - $date->getTimestamp();
        if($diff > (15*60))
        {
          $this->collectionSessions->remove(array('sessionID' => $array['sessionID']));
          return false;
        }
      }
      else
      {
        return false;
      }
      return true;
    }

     public function logout($session_id){
        $ses =  $this->collectionSessions->find(array('sessionID' => $session_id));
        if($ses != NULL)
        {
          $this->collectionSessions->deleteOne(array('sessionID' => $session_id));
          return true;
        }
        else
          return false;
       
      }


  
    
}
?>