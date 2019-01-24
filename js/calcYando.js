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
	acqVal = $("#acqTaxAcqVal").val();
	
	var ACQ_TAX_AMT_FST = 600000000;
	var ACQ_TAX_AMT_SND = 900000000; 
		
	var ACQ_TAX_RT_GEN = 0.01;
	var ACQ_TAX_RT_FST = 0.02;
	var ACQ_TAX_RT_SND = 0.03;
	
	var FARM_TAX_RT = 0.1;
	
	var acqTax = 0;
	var farmTaxAmt = 0;
	var totTaxAmt = 0;
	var acqRt = 0;
	
	if(acqVal > ACQ_TAX_AMT_SND){
		acqTax = acqVal * ACQ_TAX_RT_SND;
		acqRt = ACQ_TAX_RT_SND * 100;
		
	} if(acqVal > ACQ_TAX_AMT_FST){
		acqTax = acqVal * ACQ_TAX_RT_FST;
		acqRt = ACQ_TAX_RT_FST * 100;
		
	} else {
		acqTax = acqVal * ACQ_TAX_RT_GEN;
		acqRt = ACQ_TAX_RT_GEN * 100;
	}
	
	farmTaxAmt = acqTax * FARM_TAX_RT;
	
	totTaxAmt = acqTax + farmTaxAmt;
	dispAcqTax(acqVal, acqTax, farmTaxAmt, totTaxAmt, acqRt);
	
}

function dispAcqTax(acqVal, acqTax, farmTaxAmt, totTaxAmt, acqRt){
	//취득세표시
	//엘리먼트 추가
	var obj = document.getElementById("divCalcAcqRst");
	obj.removeChild(obj.childNodes[0]);
	
	var newDIV = document.createElement("div");	
	newDIV.innerHTML = "<hr><hr>취득세 계산 결과";
	newDIV.innerHTML += "<p>총취득세 : " + totTaxAmt + "</p>";
	newDIV.innerHTML += "<p>취득가액 : " + acqVal + "</p>";
	newDIV.innerHTML += "<p>취득세 : " + acqTax + "</p>";
	newDIV.innerHTML += "<p>취득세율 : " + acqRt + "%</p>";
	newDIV.innerHTML += "<p>지방교육세 : " + farmTaxAmt + "</p>";
	newDIV.setAttribute("id", "divCalcAcqDtl");    
    newDIV.innerHTML += "<hr><hr>";    
    obj.appendChild(newDIV);
    
}

function initAcqTax(){	
	$("#acqTaxAcqVal").val("");
	var obj = document.getElementById("divCalcAcqRst");
	obj.removeChild(obj.childNodes[0]);	
}