<?php


//这里进行了通配符的适配，为了安全性考虑，应该做域名限制
header('Access-Control-Allow-Origin:*');
	
	//进行表格的解析得到数字
	require_once('PHPExcel/IOFactory.php');//phpexcel功能php文件
	require_once('db.php');//sqlite数据库处理文件


	// 连接数据库，开启事务
	$db = new MyDb(1);
	$db->beginTransaction();
	$type = $_POST['type'];

	//拿到所有的数据表集合
	function gettable($db){
		$sql = "SELECT * FROM ANTABLE";
		$res = $db->query($sql);
		$returntable = array();
		foreach($res as $k => $v){
			$tablename = $v['tabname'];
			$returntable[$tablename] = array();
			$returntable[$tablename]['name'] = $v['name'];
			$temp_sql = 'SELECT * FROM `'.$tablename.'` LIMIT 1';
			$temp_res = $db->query($temp_sql);
			foreach($temp_res[0] as $k => $v){
				if(is_numeric($k))
					continue;
				$returntable[$tablename]['data'][$k] = $v;
			}
		}
		echo json_encode($returntable);
	}


	//根据表格和字段数组进行下载
	function down($db){
		$tabname = $_POST['tabname'];
		$tabnamecn = $_POST['tabnamecn'];
		$fieldarr = substr($_POST['fieldarr'], 0,(strlen($_POST['fieldarr'])-1));
		
		//查询数据内容并进行表格内容的下载
		$sql = "SELECT {$fieldarr} FROM {$tabname} ";
		$res = $db->query($sql);
		export($tabnamecn,$tabname,$res);
	}

	//导出表格
	function export($tabnamecn,$tabname,$data){
		$objPHPExcel = new PHPExcel();
		$objPHPExcel->getProperties()->setCreator("spec")  
           ->setLastModifiedBy("spec")  
           ->setTitle($tabnamecn)  
           ->setSubject($tabnamecn)  
           ->setDescription($tabnamecn)  
           ->setKeywords("excel")  
           ->setCategory("result file");

        foreach ($data as $key => $value) {
        	$num = $key+1;
        	$zero = range('A','Z');
        	$index = 0;
        	$objPHPExcel->setActiveSheetIndex(0);
			foreach($value as $k1 => $v1){
				if(is_numeric($k1))
					continue;
				$objPHPExcel->getActiveSheet()->setCellValue($zero[$index].$num, $v1);
				$index++;
			}
		}
		// $objPHPExcel->getActiveSheet()->setTitle($tabname);
		$objPHPExcel->setActiveSheetIndex(0);
		ob_end_clean();  
		header('Content-Type: applicationnd.ms-excel');  
	    header('Content-Disposition: attachment;filename="'.$tabnamecn.'.xls"');  
	    header('Cache-Control: max-age=0');  
	    header('Content-Type: text/html; charset=utf-8'); //编码
	    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');  
	    $objWriter->save('php://output');  
	    exit;  
	}

	switch ($type) {
		case 'gettable':
			gettable($db);
			break;
		case 'down':
			down($db);
			break;
		
		default:
			gettable();
			break;
	}

