var m_plus;
var m_minus;
var completedEvaluation = false;

$(document).ready(function(){
	//alert("hello World !!!");
	clearInputBox();
	//window.addEventListener('keydown', focusInputBox, true);
	$(document).bind('keydown', focusInputBox);
	$(document).bind('keyup',function(e){
		
		/*console.clear();
			console.log(e.keyCode);
			if(e.shiftKey) console.log("shift");
		*/

		//if(document.getElementById("inputbox").value=="error")
		//	clearInputBox();
		
		if($("#inputbox").val()==="error")
			clearInputBox();

		if(e.keyCode ===57 && e.shiftKey){
			addTokenElement('(');
		} else if(e.keyCode ===48 && e.shiftKey){
				addTokenElement(')');
		}else if(e.keyCode === 107 && e.shiftKey){	// for mozilla
			addTokenElement('+');
		}else if(e.keyCode === 187 && e.shiftKey){	// for chrome
			addTokenElement('+');
		}else if(e.keyCode === 56 && e.shiftKey){
			addTokenElement('*');
		} else if(e.keyCode===190){
				addTokenElement('.');
		} else if(e.keyCode===109){	// FOR MOZILLA
			addTokenElement('-');
		}else if(e.keyCode===189){	//FOR CHROME
			addTokenElement('-');
		} else if(e.keyCode===191){
				addTokenElement('/');
		} else if(e.keyCode===54 && e.shiftKey){
			addTokenElement('^');
		} else if(e.keyCode>=48 && e.keyCode<=57){
			addTokenElement(e.keyCode-48);
		} else if(e.keyCode===8){
			removeTokenElement();
		} else if(e.keyCode ===13){
			evaluateExp();
		} else if(e.keyCode === 27){
			clearInputBox();
			completedEvaluation = false;
		}
	});
});

// handles M+
function mPlus(){
	//a=document.getElementById("inputbox").value;
	a=$("#inputbox").val();
	if(isNaN(m_plus))
		m_plus=Number(a);
	else
		m_plus+=Number(a);
	//document.getElementById("inputbox").value = m_plus;
	$("#inputbox").val(m_plus);
}

// handles M-
function mMinus(){
	//a=document.getElementById("inputbox").value;
	a=$("#inputbox").val();
	if(isNaN(m_minus))
		m_minus=Number(a);
	else
		m_minus-=Number(a);
	//document.getElementById("inputbox").value = m_minus;
	$("#inputbox").val(m_minus);
}

// handles Clear Memory (MC)
function mClear(){
	m_minus = "a";
	m_plus = "a";
}

function focusInputBox(){
	document.getElementById("inputbox").focus();
	//$("#inputbox").focus();
}

function clearInputBox(){
	//document.getElementById("inputbox").value="";
	$("#inputbox").val("");
}

/*window.onload = function(){
	clearInputBox();
	window.addEventListener('keydown', focusInputBox, true);
}*/

// Adds elements as entered by the user from button clicks or from the keyboard
function addTokenElement(a){
	if(completedEvaluation){
		if(!(a=='+' || a=='-' || a=='*' || a=='/' || a=='^'))
			clearInputBox();
		completedEvaluation = false;
	}
	
	if(a=='.'){
		if(isPossible())
			document.getElementById("inputbox").value+=a;
	} else {
		document.getElementById("inputbox").value+=a;
	}
}

// extracts numbers and operators (called tokens) from the expression string
function getTokens(){
	//var string = document.getElementById("inputbox").value;
	var string = $("#inputbox").val();
	var tokens = new Array();
	var i;
	var tokenCounter=0;
	if(string.length==0)
		return false;
	for(i=0;i<string.length;i++){
		if(string[i]=='-' || string[i]=='+'){
			if(i==0){
				tokens[tokenCounter] = string[i];			
				if(i+1<string.length){
					while(!isNaN(string[i+1])||(string[i+1]=='.')){
						tokens[tokenCounter] += string[++i];
						if(i+1==string.length)
							break;
					}
				}
				tokenCounter++;
				continue;
			} else if(string[i-1]=='^' || string[i-1]=='+' || string[i-1]=='-' || string[i-1]=='*' || string[i-1]=='/' || string[i-1]=='('){
				tokens[tokenCounter] = string[i];			
				if(i+1<string.length){
					while(!isNaN(string[i+1])||(string[i+1]=='.')){
						tokens[tokenCounter] += string[++i];
						if(i+1==string.length)
							break;
					}
				}
				tokenCounter++;
				continue;
			}
		}
		if(string[i]=='^' || string[i]=='+' || string[i]=='-' || string[i]=='*' || string[i]=='/' || string[i]=='(' || string[i]==')'){
			tokens[tokenCounter++] = string[i];
		}else if(!isNaN(string[i])){
			tokens[tokenCounter] = string[i];			
			if(i+1<string.length){
				while(!isNaN(string[i+1])||(string[i+1]=='.')){
					tokens[tokenCounter] += string[++i];
					if(i+1==string.length)
						break;
				}
			}
			tokenCounter++;
		} else {
			//document.getElementById("inputbox").value = "error";
			$("#inputbox").val("error");
			return false;
		}
	}
	tokenCounter--;
	
	/*for(i=0;i<=tokenCounter;i++)
		alert(tokens[i]);
	*/
	//console.log(tokens);
	return tokens;
//	computeExpression(tokens);
}

//converts infix expression into postfix
function computeExpression(tokens){
	var operatorStack = new Array();
	var operatorStackSize = 0;
	var postFixTokens = new Array();
	var postFixTokenSize = 0;
	
	var i;
	for(i=0;i<tokens.length;i++){
		if(tokens[i]=='('){
			operatorStack[operatorStackSize++] = tokens[i];
		} else if(tokens[i]==')'){
			if(operatorStackSize==0){
				//document.getElementById("inputbox").value = "error";
				$("#inputbox").val("error");
				return false;
			}
			while(operatorStack[operatorStackSize-1]!='('){
				postFixTokens[postFixTokenSize++] = operatorStack[--operatorStackSize];
				if(operatorStackSize==0)
					break;
			}
			if(operatorStackSize>0){
				if(operatorStack[operatorStackSize-1]=='(')
					operatorStackSize--;
			}
		}else if(isNaN(tokens[i])){
			if(operatorStackSize>0){
				while(getPrecedence(tokens[i])<=getPrecedence(operatorStack[operatorStackSize-1])){
					postFixTokens[postFixTokenSize++] = operatorStack[--operatorStackSize];
				}
			}
			operatorStack[operatorStackSize++] = tokens[i];
		} else {
				postFixTokens[postFixTokenSize++]=tokens[i];
		}
	}
		
	while(operatorStackSize!=0){
		if(operatorStack[operatorStackSize-1]=='('){
			//document.getElementById("inputbox").value = "error";
			$("#inputbox").val("error");
			return false;
		}
		postFixTokens[postFixTokenSize++] = operatorStack[--operatorStackSize];
	}
	/*alert("postfix begins here");
	for(i=0;i<postFixTokenSize;i++)
		alert(postFixTokens[i]);
	*/
	//console.log(postFixTokens);
	return postFixTokens;
	//evaluatePostfix(postFixTokens);
}

// to decide on the operator precedence
function getPrecedence(operator){
	switch(operator){
		case '^': return 3;
		case '*':
		case '/': return 2;
		case '+' :
		case '-': return 1;
		default: return 0;
	}
}

// evaluates the final postfix expression and displays result
function evaluatePostfix(postFixTokens){
	var i;
	var operand = new Array();
	var operandSize=0;
	
	for(i=0;i<postFixTokens.length;i++){
		if(isNaN(postFixTokens[i])){
			var operand2 = operand[--operandSize];
			var operand1 = operand[--operandSize];
			var result = compute(operand1, operand2, postFixTokens[i]);
			operand[operandSize++] = result;
			//alert("result = "+result);
		}else{
			operand[operandSize++]=postFixTokens[i];
		}	
	}
	//alert("size of operand stack = "+operandSize);
	
	if(isNaN(operand[operandSize-1]) || (operandSize-1!=0))
		//document.getElementById("inputbox").value = "error";
		$("#inputbox").val("error");
	else
		//document.getElementById("inputbox").value = operand[operandSize-1];
		$("#inputbox").val(operand[operandSize-1]);
	//console.log(operand);
}

// performs computation given two operands and an operator
function compute(operand1, operand2, operator){
	operand1 = Number(operand1);
	operand2 = Number(operand2);
	//console.log(operand1);
	//console.log(operand2);
	switch (operator){
		case '^': return Math.pow(operand1, operand2);
		case '+': return operand1 + operand2;
		case '-': return operand1 - operand2;
		case '*': return operand1 * operand2;
		case '/': return operand1 / operand2;
	}
}

// event listener to handle inputs from the keyboard
/*window.addEventListener('keyup', function(e){
	
	/*console.clear();
		console.log(e.keyCode);
		if(e.shiftKey) console.log("shift");
	
	
	if(document.getElementById("inputbox").value=="error")
		clearInputBox();
	
	if(e.keyCode ===57 && e.shiftKey){
		addTokenElement('(');
	} else if(e.keyCode ===48 && e.shiftKey){
			addTokenElement(')');
	}else if(e.keyCode === 107 && e.shiftKey){	// for mozilla
		addTokenElement('+');
	}else if(e.keyCode === 187 && e.shiftKey){	// for chrome
		addTokenElement('+');
	}else if(e.keyCode === 56 && e.shiftKey){
		addTokenElement('*');
	} else if(e.keyCode===190){
			addTokenElement('.');
	} else if(e.keyCode===109){
		addTokenElement('-');
	} else if(e.keyCode===191){
			addTokenElement('/');
	} else if(e.keyCode===54 && e.shiftKey){
		addTokenElement('^');
	} else if(e.keyCode>=48 && e.keyCode<=57){
		addTokenElement(e.keyCode-48);
	} else if(e.keyCode===8){
		removeTokenElement();
	} else if(e.keyCode ===13){
		evaluateExp();
	} else if(e.keyCode === 27){
		clearInputBox();
		completedEvaluation = false;
	}
}, false);*/

// handles backspace on keyboard
function removeTokenElement(){
	if(completedEvaluation){
		clearInputBox();
		completedEvaluation = false;	
	}
	
	//var a = document.getElementById("inputbox").value;
	var a = $("#inputbox").val();
	if(a == "error"){
		clearInputBox();
	} else if(a.length>0){
		a = a.substring(0,a.length-1);
		//document.getElementById("inputbox").value = a;
		$("#inputbox").val(a);
	}
}

// checks if its possible to add a decimal point
function isPossible(){
	var a = getTokens();
	var lastToken = a[a.length-1];
	if(isNaN(lastToken))
		return false;
	else{
		var i;
		for(i = 0;i<lastToken.length;i++){
			if(lastToken[i]=='.')
				return false;
		}
		return true;
	}
}

// perform the necessary checks and
// calls all the necessary functions to evaluate the expression entered by the user
function evaluateExp(){
	var a = getTokens();
	if(a.length>=3){
		evaluatePostfix(computeExpression(a));
		completedEvaluation = true;
	}
}