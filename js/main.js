
var count_label='<li class="count-label">显示条数：<select class="select-sm count-num" onchange="changenum(this)"><option class="label-sm count_30" name="count">30</option><option class="label-sm count_50" name="count">50</option><option class="label-sm count_100" name="count">100</option></select> </li>';
var global_thlist = [];
var global_tdlist = [];
var global_filedlist = [];

$(".nav-container .tab-item").click(function(){
	var event = this;
	$(".tab-item").each(function(){
		$(this).removeClass("active");	
	});
	$(event).addClass("active");
	var url = $(event).data("url");
	$(".cont-container").hide();
	$("."+url+"-container").show()
});

$(".upload-btn").click(function(){
	//进行内容为空判断
	if($(".form-input").val()){
		$(".modal-body1").hide();
		$(".modal-body").show();
		$(".excel-submit").show();
	}
	else{
		$(".modal-body").hide();
		$(".modal-body1").show();
		$(".excel-submit").hide();
	}
});

$(".excel-submit").click(function(){
	//首先进行为空判断
	var form = new FormData($(".upload-form")[0]);
	$.ajax({
		type:'POST',
		url:"excel.php",
		data:form,
		processData:false,
		contentType:false,
		success:function(res){
			$(".tab-container").show();
			$(".field-container").show();
			console.log(res);
			window.location.href="#upload-sizes";
			var data = res.data;
			global_thlist = data.thlist;
			global_tdlist = data.tdlist;
			global_filedlist = data.filedlist;
			// 进行内容的遍历拼接
			
			var counts = data.tdlist.length;//总记录数
			var count = $("#countnum").val();//默认条数
			var tharr = vrayth(data.thlist,data.filedlist,count);
			var tbody = vraytd(data.tdlist,count);
			var page_count = tbody["page_count"];
			var page_container = page(1,page_count);

			$(".thead tr").html(tharr['thead']);
			$(".thead").after(tbody['tbody_container']);
			$(".excel-field .tab").html(tharr['filed_th']);
			$(".filed-content").html(tharr['filed_div']);
			$(".data-count").html(counts);
			$(".excel-field .tab li:first-child").addClass("active");
			$(".filed-content div:not(:first)").hide();
			$("#tbody-1").removeClass("hide");
			$("#field_"+tharr['first_th']+"_1").removeClass("hide");
			$(".pagination").html(count_label+page_container);
			$(".page-1").addClass("active");
		},
		dataType:'json'
	})
});
 
function changetab(event){
	var current = $("#current").val();
	$(".excel-field .tab").find(".tab-item").removeClass("active");
	$(event).addClass("active");
	var th = $(event).data("tab");
	$("#tab").val(th);
	$(".filed-content").find(".filed-div").hide();
	$("#field_"+th+"_"+current).show();
}

//进行数据的渲染
//表单渲染

function vrayth(thlist,filedlist,count){
	    var thead = "<th>序号</th>";
		var filed_th = "";
		var filed_div = "";
		
		var first_th = "";
		for(var th in thlist){
			var page = 1;
			if(!first_th)
				first_th = th;
			field_temp_div = "";
			var temp_th = "<th>"+thlist[th]+"</th>";
			thead += temp_th;

			var len = filedlist[th].length;
			var field_temp_th = '<li class="tab-item '+th+'_tab" data-tab='+th+' onclick="changetab(this)"><a href="javascript:;" class="badge" data-badge="'+len+'">'+temp_th+'</a></li>';
			
			//根据count进行内容的截取
			var fieldarrs = split(filedlist[th],count);
			for(var fieldarr in fieldarrs){
				var temp_val = fieldarrs[fieldarr];
				field_temp_div += '<div class=" filed-div '+th+'_content hide" id="field_'+th+'_'+page+'">'+temp_val+'</div>';
				page++;
			}
			filed_th += field_temp_th;
			filed_div += field_temp_div;
		}
		$("#tab").val(first_th);
		return {"thead":thead,"filed_th":filed_th,"filed_div":filed_div,"first_th":first_th};	
}

//数据渲染[进行页面的数据切割]
function vraytd(tdlist,count){
		
		var tbody_container= "";
		var page_count = Math.ceil(tdlist.length/count);
		$("#pages").val(page_count);
		var trarrs = split(tdlist,count);
		var page = 1;
		var index = 1;
		//表格内容截取
		for(var trarr in trarrs){
			var tr_container = "";
			for(var tr in trarrs[trarr]){
				var temp_tr = "<td>"+index+"</td>";
				index++;
				for(var td in trarrs[trarr][tr]){
					var temp_td = "<td>"+trarrs[trarr][tr][td]+"</td>";
					temp_tr += temp_td;
				}
				tr_container += "<tr>"+temp_tr+"</tr>";
			}
			tbody_container += "<tbody class='tbody hide' id='tbody-"+page+"'>"+tr_container+"</tbody>";
			page++;
		}
    	return {'tbody_container':tbody_container,'page_count':page_count};
}

//页数显示[当前页数，总页数]
function page(current,pagecount){
	console.log("current:"+current+";pagecount:"+pagecount);
	var pagehtml = "";
	var temp_page = "";

	var previous = "<li class='page-item' data-id='"+(current-1)+"' onclick='changepage(this)'><a href='javascript:;'>Previous</a></li>";
	var next = "<li class='page-item' data-id='"+(current+1)+"' onclick='changepage(this)'><a href='javascript:;'>Next</a></li>";

	if(current<4){
		if(current == 1)
				previous = "<li class='page-item disabled' data-id='1'><a href='javascript:;'>Previous</a></li>";
		
		if(pagecount<5){
			for(var i=1;i<=pagecount;i++){
				temp_page += "<li class='page-item page-"+i+"' data-id='"+i+"' onclick='changepage(this)'><a href='javascript:;'>"+i+"</a></li>";
			}	
			if(current == pagecount)
				next = "<li class='page-item disabled' data-id='"+current+"' ><a href='javascript:;'>Next</a></li>";
	
		}else{
			for(var i=1;i<=3;i++){
				temp_page += "<li class='page-item page-"+i+"' data-id='"+i+"' onclick='changepage(this)'><a href='javascript:;'>"+i+"</a></li>";
			}
			temp_page += "&nbsp;...&nbsp;<li class='page-item page-"+pagecount+"' data-id='"+pagecount+"' onclick='changepage(this)'><a href='javascript:;'>"+pagecount+"</a></li>";
		}
	}else{
		temp_page = "<li class='page-item page-1' data-id='1' onclick='changepage(this)'><a href='javascript:;'>1</a></li>&nbsp;...&nbsp;";
		if(current < (pagecount-2)){
			for(var i = (current-1);i<=(current+1);i++){
				temp_page += "<li class='page-item page-"+i+"' data-id='"+i+"' onclick='changepage(this)'><a href='javascript:;'>"+i+"</a></li>";
			}
			temp_page += "&nbsp;...&nbsp;<li class='page-item page-"+pagecount+"' data-id='"+pagecount+"' onclick='changepage(this)'><a href='javascript:;'>"+pagecount+"</a></li>";
		}else{
			for(var i = (current-1);i<=pagecount;i++){
				temp_page += "<li class='page-item page-"+i+"' data-id='"+i+"' onclick='changepage(this)'><a href='javascript:;'>"+i+"</a></li>";
			}
			if(current == pagecount)
				next = "<li class='page-item disabled' data-id='"+current+"'><a href='javascript:;'>Next</a></li>";
		}
	}
	pagehtml = previous+temp_page+next;
	return pagehtml;

}

function changepage(event){
	console.log("changepage");
	var current = $(event).data("id");
	var pages = $("#pages").val();
	var tab = $("#tab").val();
	$("#current").val(current);
	console.log("pages:"+pages+",tab:"+tab);
	var pagehtml = page(current,pages);
	$(".filed-content").find(".filed-div").hide();
	$(".table").find(".tbody").hide();
	$("#tbody-"+current).show();
	$("#field_"+tab+"_"+current).show();
	$(".pagination").html(count_label+pagehtml);
	$(".pagination").find(".page-item").removeClass("active");
	$(".page-"+current).addClass("active");
}

function changenum(event){

	var count = $(event).val();
	var tharr = vrayth(global_thlist,global_filedlist,count);
	var tbody = vraytd(global_tdlist,count);
	var page_count = tbody["page_count"];
	var page_container = page(1,page_count);
	var thead = '<thead class="thead"><tr><th>序号</th>'+tharr['thead']+'</tr></thead>';

	$(".table-striped").html(thead+tbody['tbody_container']);
	$(".excel-field .tab").html(tharr['filed_th']);
	$(".filed-content").html(tharr['filed_div']);
	$(".excel-field .tab li:first-child").addClass("active");
	$(".filed-content div:not(:first)").hide();
	$("#tbody-1").removeClass("hide");
	$("#field_"+tharr['first_th']+"_1").removeClass("hide");
	$(".pagination").html(count_label+page_container);
	$(".page-1").addClass("active");
	$(".count_"+count).attr("selected","true");
}


$(document).ready(function(){
	$.post("down.php",{"type":"gettable"},function(res){
		console.log(res);
		var tr = "";
		var index = 1;
		for(var table in res){
			var temp_tr = "<tr data-table='"+table+"'><td>"+res[table]['name']+"</td><td><div class='form-group'>";
			for(var th in res[table]['data']){
				temp_tr += "<label class='form-checkbox'><input type='checkbox'  class='table_"+table+"' data-id='"+th+"' /><i class='form-icon'></i>"+res[table]['data'][th]+"</label>";
			}
			temp_tr += "</div></td><td><button class='btn btn-primary btn-sm' onclick='down(this)' data-tabname='"+res[table]['name']+"' data-tab='"+table+"'>down </button></tr>";
			tr += temp_tr;
		}
		$(".tbody").html(tr);

	},"json");
});

//下载函数
function down(event){
	var table = $(event).data("tab");	
	var fieldarr = "";
	var tabname = $(event).data("tabname");
	$(".table_"+table).each(function(){
		if(this.checked)
			fieldarr += $(this).data("id")+",";
	});
	$(".tabname").val(table);
	$(".fieldarr").val(fieldarr);
	$(".tabnamecn").val(tabname);
	$(".tableform").submit();
	
}


