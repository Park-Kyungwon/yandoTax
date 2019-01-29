var ADJ_AREA_IDX = 0;			//조정대상지역inx
var TWO_YEAR_REAL_IDX = 1;	//2년실거주idx
var LNT_LIC_IDX = 2;				//임대사업자idx
var RETENT_MTH = 24;			//보유개월수
var HI_GRADE_AMT = 900000000;		//고가주택기준 9억

var GEN_TAX_MIN_AMT_IDX = 0;
var GEN_TAX_MAX_AMT_IDX = 1;
var GEN_TAX_RT_IDX = 2;
var GEN_TAX_DED_AMT_IDX = 3;
var GEN_TAX_FROM_DATE_IDX = 4;
var GEN_TAX_TO_DATE_IDX = 5;

var HOUSE_QTY_TWO_RATE = 10;
var HOUSE_QTY_MORE_RATE = 20;

var BASIC_DEDUCT_AMT = 2500000;	//기본공제금액

var MAX_PRF_AMT = 500000001;			//최고과세구간

//일반과세세율
var arrGenTaxRt = new Array();

//2019년이전기준
arrGenTaxRt[0] = [0, 12000000, 6, 0, "19000101", "20181231"];
arrGenTaxRt[1] = [12000001, 46000000, 15, 1080000, "19000101", "20181231"];
arrGenTaxRt[2] = [46000001, 88000000, 24, 5220000, "19000101", "20181231"];
arrGenTaxRt[3] = [88000001, 150000000, 35, 14900000, "19000101", "20181231"];
arrGenTaxRt[4] = [150000001, 500000000, 38, 19400000, "19000101", "20181231"];
arrGenTaxRt[5] = [500000001, 0, 40, 35400000, "19000101", "20181231"];

//2019년이후
arrGenTaxRt[6] = [0, 12000000, 6, 0, "20190101", "99991231"];
arrGenTaxRt[7] = [12000001, 46000000, 15, 1080000, "20190101", "99991231"];
arrGenTaxRt[8] = [46000001, 88000000, 24, 5220000, "20190101", "99991231"];
arrGenTaxRt[9] = [88000001, 150000000, 35, 14900000, "20190101", "99991231"];
arrGenTaxRt[10] = [150000001, 300000000, 38, 19400000, "20190101", "99991231"];
arrGenTaxRt[11] = [300000001, 500000000, 40, 25400000, "20190101", "99991231"];
arrGenTaxRt[12] = [500000001, 0, 42, 35400000, "20190101", "99991231"];

function calcYandoTax(){
	
	var acqVal = 0;	//취득가액
	var trnsVal = 0;	//양도가액
	var reqExpnsVal = 0;	//소요경비
	
	var acqDate = new Date();		//취득일자
	var trnsDate = new Date();	//양도일자
	
	var arrRealEstDvCd = new Array();		//부동산구분코드
	
	var arrEtcDvCd = new Array();		//기타정보
	
	var houseQty = "";			//보유갯수
	var jntTncyDvCd = "";		//공동명의구분코드
	
	var obj = document.getElementById("divCalcRst");
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
	
	$("input[name=rdoType]").each(
			function(i){				
				arrRealEstDvCd[i] = this.checked;
				i++;
			}			
		);
	
	$("input[name=chkEtc]").each(
			function(i){				
				arrEtcDvCd[i] = this.checked;
				i++;
			}			
		);
	
	houseQty = $("#selHseQty > option:selected").val();	
	
	jntTncyDvCd = $("#chkJntTncy").is(":checked");
	
	acqVal = $("#acqVal").val();
	acqVal = acqVal.toString();
	acqVal = acqVal.replace(/,/gi, "");
	
	trnsVal = $("#trnsVal").val();
	trnsVal = trnsVal.toString();
	trnsVal = trnsVal.replace(/,/gi, "");
	
	reqExpnsVal = $("#reqExpnsVal").val();
	reqExpnsVal = reqExpnsVal.toString();
	reqExpnsVal = reqExpnsVal.replace(/,/gi, "");
	
	acqDate = $("#acqDate").val();
	trnsDate = $("#trnsDate").val();
	
	var trnsObj = new Object();
	trnsObj.arrRealEstDvCd = arrRealEstDvCd;
	trnsObj.arrEtcDvCd = arrEtcDvCd;
	trnsObj.houseQty = houseQty;
	trnsObj.jntTncyDvCd = jntTncyDvCd;
	trnsObj.acqVal = acqVal;
	trnsObj.trnsVal = trnsVal;
	trnsObj.reqExpnsVal = reqExpnsVal;
	trnsObj.acqDate = acqDate;
	trnsObj.trnsDate = trnsDate;
		
	//dispTrnsObj(trnsObj);
	
	trnsObj = calcTrnsTax(trnsObj);
		
	//dispCalcTrnsTax(trnsObj);
	
}

function calcTrnsTax(trnsObj){
	
	console.log("calcTrnsTax start");
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;
	var arrEtcDvCd = trnsObj.arrEtcDvCd;
	var houseQty = trnsObj.houseQty;
	var acqVal = trnsObj.acqVal;
	var trnsVal = trnsObj.trnsVal;		//양도가액
	var reqExpnsVal = trnsObj.reqExpnsVal;
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;
	
	var adjArea = arrEtcDvCd[ADJ_AREA_IDX];					//조정대상지역
	var flgTwoYrRealRsdn = arrEtcDvCd[TWO_YEAR_REAL_IDX];		//2년실거주
	var flgLentalLicn = arrEtcDvCd[LNT_LIC_IDX];				//임대사업자	
	
	var retnMth = mthDiff(acqDate, trnsDate);		//보유개월
	
	trnsObj.retnMth = retnMth;
	
	//일단 주택만 대상	
	console.log("houseQty : " + houseQty 
			+ "\n" + "flgTwoYrRealRsdn : " + flgTwoYrRealRsdn 
			+ "\n" + "flgLentalLicn : " + flgLentalLicn
			+ "\n" + "retnMth : " + retnMth
			+ "\n" + "trnsVal : " + trnsVal
			+ "\n" + "RETENT_MTH : " + RETENT_MTH
			+ "\n" + "HI_GRADE_AMT : " + HI_GRADE_AMT
			);
	
	if(houseQty == "1" && flgTwoYrRealRsdn && !flgLentalLicn 
			&& retnMth > RETENT_MTH 
			&& trnsVal <= HI_GRADE_AMT ){
		console.log("비과세");
		//비과세
		//1주택, 2년실거주, 임대사업자아니고, 보유기간 24개월초과, 양도가액 9억미만
		dispCalcTrnsNonTax(trnsObj);		
		
	} else if ( trnsVal - acqVal <= 0 ){
		//양도가액이 취득가액보다 작으면 비과세
		dispCalcTrnsNonTax(trnsObj);
		
	} else {
		//과세
		console.log("과세");		
		if(retnMth > RETENT_MTH){
			//보유개월 24개월 초과
			if(trnsVal > HI_GRADE_AMT){
				//9억초과 양도세 계산
				
			} else {
				//9억이하 양도세
				//1주택이상
				//표준과세율대로 계산
				trnsObj = calcGenTrnsTax(trnsObj);
				
			}
			
		} else {
			//보유개월 24개월 미만
			//표준세율에 따라 계산						
			trnsObj = calcGenTrnsTax(trnsObj);			
			
		}
		
		dispCalcTrnsTaxTest(trnsObj);
		
	}

	console.log("calcTrnsTax end");
	
}
function dispCalcTrnsTaxTest(trnsObj){
	
	var trnsVal = trnsObj.trnsVal;
	var acqVal = trnsObj.acqVal;
	
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");	
	newDIV.setAttribute("id", "divCalcRstDtl");
	newDIV.setAttribute("class", "ui-grid-c calcResult");
	
	newDIV.innerHTML = "<hr><hr>";
	newDIV.innerHTML += "<p>과세대상</p>";
	newDIV.innerHTML += "<div class='ui-block-a'>총양도세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.totTaxAmt) + "원" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>취득가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.acqVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>양도가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>소요경비</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.reqExpnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.acqDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.trnsDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>보유개월</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.retnMth + "개월" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도차익</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsProfit) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>과세표준</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxGenAmt) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>표준세율</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxRt) + "%" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도소득세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c textAlignRight'>(누진공제</div>";
	newDIV.innerHTML += "<div class='ui-block-d'>" + $.number(trnsObj.prgDedAmt) + "원)" + "</div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>주민세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.rsdTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
		
	/*
	newDIV.innerHTML = "<hr>과세대상";	
    newDIV.innerHTML += "<hr><hr>"; 
//    newDIV.innerHTML += "realEstDvCd1 : " + realEstDvCd1 + "<br>";
    newDIV.innerHTML += "취득가액 : " + $.number(trnsObj.acqVal) + "<br>";
    newDIV.innerHTML += "양도가액 : " + $.number(trnsObj.trnsVal) + "<br>";
    newDIV.innerHTML += "소요경비 : " + $.number(trnsObj.reqExpnsVal) + "<br>";
    newDIV.innerHTML += "취득일자 : " + $.number(trnsObj.acqDate) + "<br>";
    newDIV.innerHTML += "양도일자 : " + $.number(trnsObj.trnsDate) + "<br>";
    newDIV.innerHTML += "보유개월 : " + $.number(retnMth) + "<br>";
    //newDIV.innerHTML += "양도차익 : " + (trnsVal - acqVal) + "<br>";
    newDIV.innerHTML += "과세금액 : " + $.number(trnsObj.taxGenAmt) + "<br>";
    newDIV.innerHTML += "양도차익 : " + $.number(trnsObj.trnsProfit) + "<br>";
    newDIV.innerHTML += "표준세율 : " + $.number(trnsObj.taxRt) + "<br>";
    newDIV.innerHTML += "양도소득세 : " + $.number(trnsObj.trnsTax) + "<br>";
    newDIV.innerHTML += "누진공제액 : " + $.number(trnsObj.prgDedAmt) + "<br>";    
    newDIV.innerHTML += "주민세 : " + $.number(trnsObj.rsdTax) + "<br>";    
    newDIV.innerHTML += "총금액 : " + $.number(trnsObj.totTaxAmt) + "<br>";
    */
	
    obj.appendChild(newDIV);
	
}

function dispCalcTrnsTax(trnsObj){
	
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	//엘리먼트 추가
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");
	
	newDIV.innerHTML = "<hr>추가된 DIV 입니다";
	newDIV.setAttribute("id", "divCalcRstDtl");
    newDIV.innerHTML += "<hr><hr>"; 
//    newDIV.innerHTML += "realEstDvCd1 : " + realEstDvCd1 + "<br>";
    newDIV.innerHTML += "acqVal : " + trnsObj.acqVal + "<br>";
    newDIV.innerHTML += "trnsVal : " + trnsObj.trnsVal + "<br>";
    newDIV.innerHTML += "reqExpnsVal : " + trnsObj.reqExpnsVal + "<br>";
    newDIV.innerHTML += "acqDate : " + trnsObj.acqDate + "<br>";
    newDIV.innerHTML += "trnsDate : " + trnsObj.trnsDate + "<br>";
    newDIV.innerHTML += "보유개월 : " + retnMth + "<br>";
    newDIV.innerHTML += "양도차익 : " + (trnsVal - acqVal) + "<br>";
    
    obj.appendChild(newDIV);
    
}

function dispCalcTrnsNonTax(trnsObj){
	//비과세표시
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	var trnsVal = trnsObj.trnsVal;
	var acqVal = trnsObj.acqVal;
	
	//엘리먼트 추가
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");
	newDIV.setAttribute("id", "divCalcRstDtl");
	newDIV.setAttribute("class", "calcResult");
	
	newDIV.innerHTML = "<hr><hr>취득세 계산 결과";	
    newDIV.innerHTML += "<hr><hr>"; 
    newDIV.innerHTML += "총양도세 : 비과세 입니다.<br>" ;

    newDIV.innerHTML += "취득가액 : " + $.number(trnsObj.acqVal) + "<br>";    
    newDIV.innerHTML += "양도가액 : " + $.number(trnsObj.trnsVal) + "<br>";
    newDIV.innerHTML += "소요경비 : " + $.number(trnsObj.reqExpnsVal) + "<br>";
    newDIV.innerHTML += "취득일자 : " + trnsObj.acqDate + "<br>";
    newDIV.innerHTML += "양도일자 : " + trnsObj.trnsDate + "<br>";
    newDIV.innerHTML += "보유개월 : " + retnMth + "<br>";
    newDIV.innerHTML += "양도차익 : " + $.number(trnsVal - acqVal) + "<br>";
    
    obj.appendChild(newDIV);
	
}

function dispTrnsObj(trnsObj){
	console.log("trnsObj.arrRealEstDvCd : " + trnsObj.arrRealEstDvCd);
	console.log("trnsObj.arrEtcDvCd : " + trnsObj.arrEtcDvCd);
	console.log("trnsObj.houseQty : " + trnsObj.houseQty);
	console.log("trnsObj.jntTncyDvCd : " + trnsObj.jntTncyDvCd);
	console.log("trnsObj.acqVal : " + trnsObj.acqVal);
	console.log("trnsObj.trnsVal : " + trnsObj.trnsVal);
	console.log("trnsObj.reqExpnsVal : " + trnsObj.reqExpnsVal);
	console.log("trnsObj.acqDate : " + trnsObj.acqDate);
	console.log("trnsObj.trnsDate : " + trnsObj.trnsDate);
}

function calcAcqTax(){
	var acqVal = 0;
	
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

function mthDiff(date1, date2){
	
	date1 = date1.replace(/-/gi, "");
	date2 = date2.replace(/-/gi, "");
	
	date1 = new Date(date1.substr(0,4),date1.substr(4,2)-1,date1.substr(6,2)); 
	date2 = new Date(date2.substr(0,4),date2.substr(4,2)-1,date2.substr(6,2));

	var interval = date2 - date1;
	var day = 1000*60*60*24;
	var month = day*30;
	var year = month*12;
	
	//console.log("기간 개월수: 약 " + parseInt(interval/month) + "개월");
	return parseInt(interval/month);
	
}

function yrDiff(date1, date2){
	
	date1 = date1.replace(/-/gi, "");
	date2 = date2.replace(/-/gi, "");
	
	date1 = new Date(date1.substr(0,4),date1.substr(4,2)-1,date1.substr(6,2)); 
	date2 = new Date(date2.substr(0,4),date2.substr(4,2)-1,date2.substr(6,2));

	var interval = date2 - date1;
	var day = 1000*60*60*24;
	var month = day*30;
	var year = month*12;
	
	//console.log("기간 개월수: 약 " + parseInt(interval/month) + "개월");
	return parseInt(interval/year);
	
}

function calcGenTrnsTax(trnsObj){
	
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;
	var arrEtcDvCd = trnsObj.arrEtcDvCd
	var houseQty = trnsObj.houseQty;
	var jntTncyDvCd = trnsObj.jntTncyDvCd;
	var acqVal = trnsObj.acqVal;
	var trnsVal = trnsObj.trnsVal;
	var reqExpnsVal = trnsObj.reqExpnsVal;
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;
	var taxRtIdx = 0;
	var taxGenAmt = 0;		//과세표준금액

	var trnsProfit = 0;		//양도차익	
	
	trnsProfit = Number(trnsVal) - Number(acqVal) - Number(reqExpnsVal);
	
	if(jntTncyDvCd){
		//공동명의
		trnsProfit = Number(trnsProfit) / 2;
		taxRtIdx = getGenTaxRtIdx(trnsProfit, trnsDate);
		taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
		
	} else {
		//단독명의			
		taxRtIdx = getGenTaxRtIdx(trnsProfit, trnsDate);
		taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
		
	}
	
	var taxRt = 0.0;		//과세율
	taxRt = arrGenTaxRt[taxRtIdx][GEN_TAX_RT_IDX];
	
	//주택수
	if(houseQty == "2"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_TWO_RATE);  
	} else if(houseQty == "3"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_MORE_RATE);
	} 
	
	var trnsTax = 0;			//양도세액
	var prgDedAmt = 0;	//누진공제액
	
	prgDedAmt = arrGenTaxRt[taxRtIdx][GEN_TAX_DED_AMT_IDX];
	trnsTax = Number(taxGenAmt) * Number(taxRt / 100) - Number(prgDedAmt);
		
	var rsdTax = 0.1;	//주민세	
	var totTaxAmt = 0;
	rsdTax =  Number(trnsTax * rsdTax);
	totTaxAmt = Number(trnsTax) + Number(rsdTax);	
	
	if(jntTncyDvCd){
		//공동명의
		totTaxAmt = totTaxAmt * 2;
	}
	
	trnsObj.taxGenAmt = taxGenAmt;
	trnsObj.trnsProfit = trnsProfit;
	trnsObj.taxRt = taxRt;
	trnsObj.trnsTax = trnsTax;
	trnsObj.prgDedAmt = prgDedAmt;
	trnsObj.rsdTax = rsdTax;
	trnsObj.totTaxAmt = totTaxAmt;
	
	return trnsObj;
	
}

function getGenTaxRtIdx(trnsProfit, trnsDate){
	console.log("trnsProfit : " + trnsProfit);
	var minAmt = 0;
	var maxAmt = 0;
	var fromDate;
	var maxDate;
	
	trnsDate = trnsDate.replace(/-/gi, "");

	var i = 0;
	for(i = 0; i < arrGenTaxRt.length; i++){
		minAmt = arrGenTaxRt[i][GEN_TAX_MIN_AMT_IDX];
		maxAmt = arrGenTaxRt[i][GEN_TAX_MAX_AMT_IDX];
		fromDate = arrGenTaxRt[i][GEN_TAX_FROM_DATE_IDX];
		maxDate = arrGenTaxRt[i][GEN_TAX_TO_DATE_IDX];

		if(trnsProfit >= MAX_PRF_AMT){
			if(maxAmt == 0
					&& trnsDate >= fromDate && trnsDate <= maxDate){

				return i;
			}
		} else {
			if(trnsProfit >= minAmt && trnsProfit <= maxAmt
					&& trnsDate >= fromDate && trnsDate <= maxDate){
				return i;
			}
			
		}
		
	}
	
}
