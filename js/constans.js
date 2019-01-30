var TWO_YEAR_REAL_IDX = 0;	//2년실거주idx
var ADJ_AREA_IDX = 1;			//조정대상지역idx
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
var mstGenTaxRt = new Array();

//2019년이전기준
mstGenTaxRt[0] = [0, 12000000, 6, 0, "19000101", "20181231"];
mstGenTaxRt[1] = [12000001, 46000000, 15, 1080000, "19000101", "20181231"];
mstGenTaxRt[2] = [46000001, 88000000, 24, 5220000, "19000101", "20181231"];
mstGenTaxRt[3] = [88000001, 150000000, 35, 14900000, "19000101", "20181231"];
mstGenTaxRt[4] = [150000001, 500000000, 38, 19400000, "19000101", "20181231"];
mstGenTaxRt[5] = [500000001, 0, 40, 35400000, "19000101", "20181231"];

//2019년이후
mstGenTaxRt[6] = [0, 12000000, 6, 0, "20190101", "99991231"];
mstGenTaxRt[7] = [12000001, 46000000, 15, 1080000, "20190101", "99991231"];
mstGenTaxRt[8] = [46000001, 88000000, 24, 5220000, "20190101", "99991231"];
mstGenTaxRt[9] = [88000001, 150000000, 35, 14900000, "20190101", "99991231"];
mstGenTaxRt[10] = [150000001, 300000000, 38, 19400000, "20190101", "99991231"];
mstGenTaxRt[11] = [300000001, 500000000, 40, 25400000, "20190101", "99991231"];
mstGenTaxRt[12] = [500000001, 0, 42, 35400000, "20190101", "99991231"];