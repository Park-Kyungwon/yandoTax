var view = 0;
var flag = 0;
var temp = 0;

function btnNumber(num){
	view *= 10;
	view += num;
	$("#message").text(view);
}

function btnClear(){
	view = 0;
	$("#message").text(0);
}

function btnPlus(){
	temp = view;
	flag = 1;
	view = 0;
}

function btnMinus(){
	temp = view;
	flag = 2;
	view = 0;
}

function btnMulti(){
	temp = view;
	flag = 3;
	view = 0;
}

function btnDivide(){
	temp = view;
	flag = 4;
	view = 0;
}

function btnEqual(){
	if (flag == 1)	{
		temp += view;
		
	} else if (flag == 2)	{
		temp = temp - view;
		
	} else if (flag == 3)	{
		temp = temp * view;
		
	} else if (flag == 4)	{
		temp = temp / view;

	} else {

	}

	$("#message").text(temp);

}
