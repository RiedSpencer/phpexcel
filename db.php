<?php
//sqlite事务
class MyDb extends PDO{
	protected $transactionCounter = 0;
	protected $lasterror = "";

	function __construct($index=0){
		try{
			if($index == 1){
				parent::__construct('sqlite:'.dirname(__FILE__)."/data.db");
			}
			else{
				parent::__construct('sqlite:'.dirname(__FILE__)."/tool.db");
			}
			$this->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		}catch(PDOException $e){
			$this->lasterror = $e->getMessage();
		}
	}

	//	预处理，然后执行返回结果集 prepare->execute->fetchAll[直接就返回结果集直接调用，就可以]
	function query($sql){
		$result = array();
		try{

			$sth = $this->prepare($sql);
			if(!$sth){
				$this->lasterror = "Incorrect statement";
				return array();
			}
			$sth->execute();
			$result = $sth->fetchAll();

		}catch(PDOException $e){
			$this->lasterror = $e->getMessage();
		}catch(Exception $e){
			$this->lasterror = $e->getMessage();
		}
		return $result;
	}

	function exec($sql){
		$count = 0;
		try{
			$count = parent::exec($sql);
		}catch(PDOException $e){
			$count = 0;
			// $this->rollback();
			$this->lasterror = $e->getMessage();
			print_r($e->getMessage());
		}
		return $count;
	}

	//开始事务
	 function beginTransaction()  
    {  
        if(!$this->transactionCounter++){  
            return parent::beginTransaction();  
        }  
        return $this->transactionCounter >= 0;  
    }  

	//提交事务
	function commit(){
		if(!--$this->transactionCounter){
			return parent::commit();
		}
		return $this->transactionCounter >= 0;
	}

	function close(){}

	//回滚
	function rollback(){
		if($this->transactionCounter >= 0){
			$this->transactionCounter = 0;
			return parent::rollback();
		}
		$this->transactionCounter = 0;
		return false;
	}

	function getLasterror(){
		return $this->lasterror;
	}
}

// 创建antable表格储存表名和中文名
/*$db = new MyDb(1);
$db->beginTransaction();
$createsql = 'DROP TABLE IF EXISTS ANTABLE; CREATE TABLE ANTABLE(id INTEGER PRIMARY KEY autoincrement NOT NULL,name CHAR(50) NOT NULL ,tabname CHAR(50) NOT NULL ,createdtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)';
$db->exec($createsql);
$db->commit();
$res = $db->query("select * from antable");
print_r($res);*/
