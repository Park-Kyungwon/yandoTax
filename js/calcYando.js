var acqVal = 0;	//취득가액
var trnsVal = 0;	//양도가액

var acqDate = new Date();		//취득일자
var trnsDate = new Date();	//양도일자

function calcYandoTax(){
	//alert("aaa");
	/*
	alert("number-pattern1.value : " + $("#number-pattern1").val());
	alert("number-pattern2.value : " + $("#number-pattern2").val());
	alert("number-pattern3.value : " + $("#number-pattern3").val());
	alert("date1 : " + $("#date1").val());
	alert("date2 : " + $("#date2").val());
	*/
	acqVal = $("#acqVal").val();
	trnsVal = $("#trnsVal").val();
	
//	alert("acqVal : " + acqVal);
//	alert("trnsVal : " + trnsVal);
	
	acqDate = $("#acqDate").val();
	trnsDate = $("#trnsDate").val();
	
//	alert("acqDate : " + acqDate);
//	alert("trnsDate : " + trnsDate);
	
	
	
	//엘리먼트 추가
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");
	
	newDIV.innerHTML = "<hr>추가된 DIV 입니다";
	newDIV.setAttribute("id", "divCalcRstDtl");    
    newDIV.innerHTML += "<hr><hr>"; 
    obj.appendChild(newDIV);
	
}

function calcAcqTax(){
	//취득세구하기
	acqVal = $("#acqVal").val();
	
	var ACQ_TAX_AMT_FST = 600000000;
	var ACQ_TAX_AMT_SND = 900000000; 
		
	var ACQ_TAX_RT_FST = 1;
	var ACQ_TAX_RT_SND = 2;
	var ACQ_TAX_RT_THD = 3;
	
	var FARM_TAX_RT = 10;
	
	if(acqVal > ACQ_TAX_SND){
		
	}
	
}