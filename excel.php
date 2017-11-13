<?php

//这里进行了通配符的适配，为了安全性考虑，应该做域名限制
header('Access-Control-Allow-Origin:*');
	
	//进行表格的解析得到数字
	require_once('PHPExcel/IOFactory.php');//phpexcel功能php文件
	require_once('db.php');//sqlite数据库处理文件

	$fileobj = $_FILES["uploadfile"];
	$th = ($_POST['th'])?$_POST['th']:1;
	$rows= $_POST['rowlist'];
	
	if($rows)
		$rowlist = explode(",", $rows);
	else
		$rowlist = range(1,26);

	
	// 连接数据库，开启事务
	$db = new MyDb(1);
	$db->beginTransaction();


	if($fileobj){
		//得到excel的数据
		$filename = $fileobj["name"];
		$content = $fileobj["tmp_name"];
		$typearr = pathinfo($filename);
		$type = strtolower($typearr["extension"]);
		$flname_table = strtoupper(md5($typearr['filename']));
		$flname = $typearr['filename'];

		//打开表格，进行excel加载
		if($type=='xlsx' || $type =='xls'){
			$objPHPExcel = PHPExcel_IOFactory::load($content);
			// print("读取".$type."文件成功");
		}else if($type=='csv'){
			$objReader = PHPExcel_IOFactory::createReader('CSV')
			  ->setDelimiter(',')
			  ->setInputEncoding('GBK') //不设置将导致中文列内容返回boolean(false)或乱码
			  ->setEnclosure('"')
			  ->setLineEnding("\r\n")
			  ->setSheetIndex(0);
			$objPHPExcel = $objReader->load($objReader);
			// print("读取".$type."文件成功");
		}else{
			$return = array("status"=>0,"msg"=>"读取文件失败");
			echo json_encode($return);die;
		}

		//根据需求读取文件内容
		$sheet = $objPHPExcel->getSheet(0);
		//得到行数和列数
		$highestRow= $sheet->getHighestRow();
		$highestCol= $sheet->getHighestColumn();
		
		//得到表头并根据表头创建表
		$delsql = "DELETE FROM ANTABLE WHERE name='{$flname}';";
		$db->exec($delsql);
		$insertsql = "INSERT INTO ANTABLE(name,tabname) VALUES ('{$flname}','{$flname_table}');";
		$db->exec($insertsql);
		//事务提交
		$db->commit();
		$createsql1 = "DROP TABLE IF EXISTS `{$flname_table}`; CREATE TABLE `{$flname_table}`";
		$filedsql = "";
		$i = 1;
		$collist = array();
		$return_thlist = array();
		//得到表头创建数据表的字段
		$temp_val = "";
		$temp_key = ""; 
		foreach(range('A','Z') as $k){
			
			if(!in_array($i, $rowlist)){
				++$i;
				continue;
			}
			++$i;
			$filed = $sheet->getCell($k.$th)->getValue();

			if($filed){
				$return_thlist[$k]=$filed;
				$filedsql .= "{$k} CHAR(120),";
				array_push($collist,$k);
				$temp_val .= "'".$filed."',";
				$temp_key .= $k.","; 
			}else
				break;
		}
		$filedsql = substr($filedsql, 0,(strlen($filedsql)-1));
		$filedsql = $createsql1."(".$filedsql.");";
		$db->exec($filedsql);

		$temp_key = substr($temp_key, 0,(strlen($temp_key)-1));
		$temp_val = substr($temp_val, 0,(strlen($temp_val)-1));
		$temp_sql = "INSERT INTO `{$flname_table}` ({$temp_key}) VALUES ({$temp_val});";
		$db->exec($temp_sql);


		$return_datalist = array();
		$return_filedlist = array();
		//根据excel插入数据表的内容
		for($i=($th+1);$i<=$highestRow;$i++){
			$temp_key = "";
			$temp_val = "";
			$temp_arr = array();
			foreach ($collist as $key) {

				if(!isset($return_filedlist[$key])){
					$return_filedlist[$key] = array();
				}

				$temp_key .= $key.","; 
				$temp_val .= "'".$sheet->getCell($key.$i)->getValue()."',";
				$temp_arr[$key] = $sheet->getCell($key.$i)->getValue();

				if($sheet->getCell($key.$i)->getValue())
					array_push($return_filedlist[$key],$sheet->getCell($key.$i)->getValue());
			}

			array_push($return_datalist,$temp_arr);

			$temp_key = substr($temp_key, 0,(strlen($temp_key)-1));
			$temp_val = substr($temp_val, 0,(strlen($temp_val)-1));
			$temp_sql = "INSERT INTO `{$flname_table}` ({$temp_key}) VALUES ({$temp_val});";
			$db->exec($temp_sql);
		}

		$db->commit();
		$return_data = array("thlist"=>$return_thlist,"tdlist"=>$return_datalist,"filedlist"=>$return_filedlist);
	}

	$data = array("status"=>1,"msg"=>"success","data"=>$return_data);
	echo json_encode($data);
