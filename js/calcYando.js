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
	acqVal = acqVal.toString();
	acqVal = acqVal.replace(/,/gi, "");	
	
	acqVal = Number(acqVal);
	
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
		
	} else if(acqVal > ACQ_TAX_AMT_FST){
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
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
		
	var newDIV = document.createElement("div");
	newDIV.setAttribute("id", "divCalcAcqDtl");
	newDIV.setAttribute("class", "ui-grid-c calcResult");	
	newDIV.innerHTML = "<hr><hr>";
	newDIV.innerHTML += "<p>취득세 계산 결과</p>";
//	newDIV.innerHTML += "<div class=ui-grid-c'>";
	newDIV.innerHTML += "<div class='ui-block-a'>총취득세</div>";
	newDIV.innerHTML += "<div class='ui-block-b' style='text-align:right'>" + $.number(totTaxAmt) + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c' style='text-align:left'>원</div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b' style='text-align:right'>" + $.number(acqVal) + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c' style='text-align:left'>원</div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득세</div>";
	newDIV.innerHTML += "<div class='ui-block-b' style='text-align:right'>" + $.number(acqTax) + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c' style='text-align:left'>원</div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득세율</div>";
	newDIV.innerHTML += "<div class='ui-block-b' style='text-align:right'>" + $.number(acqRt) + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c' style='text-align:left'>%</div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>지방교육세</div>";
	newDIV.innerHTML += "<div class='ui-block-b' style='text-align:right'>" + $.number(farmTaxAmt) + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c' style='text-align:left'>원</div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";	
	
	/*
	newDIV.innerHTML += "<p>총취득세 : " + $.number(totTaxAmt) + "</p>";
	newDIV.innerHTML += "<p>취득가액 : " + $.number(acqVal) + "</p>";
	newDIV.innerHTML += "<p>취득세 : " + $.number(acqTax) + "</p>";
	newDIV.innerHTML += "<p>취득세율 : " + $.number(acqRt) + "%</p>";
	newDIV.innerHTML += "<p>지방교육세 : " + $.number(farmTaxAmt) + "</p>";
	*/	
//    newDIV.innerHTML += "<hr><hr>";    
    obj.appendChild(newDIV);
    
    var newDIVHr = document.createElement("div");
    newDIVHr.setAttribute("id", "divHr");
    newDIVHr.innerHTML = "<hr><hr>";
    
    obj.appendChild(newDIVHr);
    
}

function initAcqTax(){	
	$("#acqTaxAcqVal").val("");
	var obj = document.getElementById("divCalcAcqRst");
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
}

function inputAddPeriod(inputId)
{	
	//alert("inputId : " + inputId);
	var selId = "#" + inputId;
    var nStr = $(selId).val();
    //alert("nStr : " + $.number(nStr));
    $(selId).val($.number(nStr));
    
}