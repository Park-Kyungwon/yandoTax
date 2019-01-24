var view = 0;
var flag = 0;
var temp = 0;

var pointFlag = false;

function btnNumber(num) {
	if (!pointFlag) {
		if (Number(view) == 0 && num == 0) {

		} else if (Number(view) == 0 && num != 0) {
			view = num;
		} else if (Number(view) != 0) {
			view = view + "" + num;
		}

		$("#message").text(view);

	} else {
		view = view + "" + num;
		
		$("#message").text(view);
	}

}

function btnClear()	{
	view = 0;
	$("#message").text(0);

}

function btnPlus(){
	temp = view;
	flag = 1;
	view = 0;		
	pointFlag = false;
}

function btnMinus(){
	temp = view;
	flag = 2;
	view = 0;		
	pointFlag = false;
}

function btnMulti(){
	temp = view;
	flag = 3;
	view = 0;		
	pointFlag = false;
}

function btnDivide(){
	temp = view;
	flag = 4;
	view = 0;
	pointFlag = false;		

}

function btnEqual() {
	if (flag == 1) {
		temp = Number(temp) + Number(view);
	} else if (flag == 2) {
		temp = Number(temp) - Number(view);
	} else if (flag == 3) {
		temp = Number(temp) * Number(view);
	} else if (flag == 4) {
		temp = Number(temp) / Number(view);
	}

	$("#message").text(temp);

	pointFlag = false;
	view = 0;		

}

function btnBackspace() {
	view = view.substring(0, view.length-1);
	$("#message").text(view);	
}

function btnPoint() {
	pointFlag = true;
	view += ".";
	$("#message").text(view);
}