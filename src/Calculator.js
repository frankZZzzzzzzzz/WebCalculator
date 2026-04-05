const expressionArray = ["0"];
window.openParenthesisCount = 0;

function evaluate(left, operation, right){
    left = parseFloat(left);
    right = parseFloat(right);
    switch(operation){
        case "+": return (left + right);
        case "-": return (left - right);
        case "*": return (left * right);
        case "/": return (left / right);
    }
}

function addNum(num){
    if (expressionArray.length === 0){
        expressionArray.push("0");
    }
    if (isFinite(expressionArray.at(-1))){
        let lastIndex = expressionArray.length-1;

        if (expressionArray[lastIndex] === "-0"){
            expressionArray[lastIndex] = "-" + num.toString();
        }
        else if (expressionArray[lastIndex].length === 1 && expressionArray[lastIndex].charAt(0) === "0")
            expressionArray[lastIndex] = num.toString();
        else
            expressionArray[lastIndex] += num.toString();
    }
    else{
        expressionArray.push(num.toString());
    }
    updateBar()
}
function operationListener(symbol){
    if (expressionArray.length === 0)
        return;
    if (isFinite(expressionArray.at(-1)) || expressionArray.at(-1) === "(" || expressionArray.at(-1) === ")"){
        expressionArray.push(symbol);
    }
    else{
        expressionArray[expressionArray.length-1] = symbol;
    }
    updateBar()
}
function decimalListener(){
    if (isFinite(expressionArray.at(-1))){
        let index = expressionArray.at(-1).indexOf(".");
        if (index != -1)
            expressionArray[expressionArray.length-1] = expressionArray.at(-1).slice(0,index);
        else
            expressionArray[expressionArray.length-1] += ".";
    }
    else
        expressionArray.push("0.");
    updateBar()
}
function plusMinusListener(){
    let lastIndex = expressionArray.length-1;

    if (isFinite(expressionArray[lastIndex])){
        if (expressionArray[lastIndex].charAt(0) === "-")
            expressionArray[lastIndex] = expressionArray[lastIndex].slice(1);
        else
            expressionArray[lastIndex] = "-" + expressionArray[lastIndex];
    }
    else
        expressionArray.push("-0")
    updateBar()
}
function parenthesisListener(symbol){
    if (symbol === ")" && (openParenthesisCount === 0 || !isFinite(expressionArray.at(-1))))
        return;
    if (symbol === "(")
        openParenthesisCount++;
    if (symbol === ")")
        openParenthesisCount--;
    if (expressionArray.length === 1 && expressionArray[0] === "0")
        expressionArray.pop();
    expressionArray.push(symbol);
    updateBar();
}
function validateExpression(){
    while (openParenthesisCount > 0){
        openParenthesisCount--;
        expressionArray.push(")");
    }
    for (let i = 0; i < expressionArray.length-1; i++)
        if (expressionArray.at(i) === "(" && expressionArray.at(i+1) === ")"){
            expressionArray.splice(i,2);
            i = Math.max(0, i-2);
        }

    while (expressionArray.at(-1) !== ")" && !isFinite(expressionArray.at(-1)))
        expressionArray.pop();
}
function evaluateAddSubtract(){
    let leftTerm = evaluateDivMulti();
    while (expressionArray.length > 0 && (expressionArray.at(0) === "+" || expressionArray.at(0) === "-")){
        let operation = getTerm();
        let rightTerm = evaluateDivMulti();
        leftTerm = evaluate(leftTerm, operation, rightTerm);
    }
    return (leftTerm);
}
function evaluateDivMulti(){
    let leftTerm = getTerm();
    while (expressionArray.length > 0 && (expressionArray[0] === "*" || expressionArray[0] === "/" || expressionArray.at(0) === "(")){
        let operation = getTerm();

        if (isFinite(operation)){
            expressionArray.unshift(operation);
            operation = "*";
        }

        let rightTerm = getTerm();
        leftTerm = evaluate(leftTerm, operation, rightTerm);
    }
    return (leftTerm);
}
function getTerm(){
    let term = expressionArray.shift();
    if (term === "("){
        const result = evaluateExpressionHelper();

        expressionArray.shift();
        if (expressionArray.length > 0 && isFinite(expressionArray.at(0)))
            expressionArray.unshift("*");

        return (result);
    }
    return (term);
}
function evaluateExpressionHelper(){
    return (evaluateAddSubtract());
}
function evaluateExpression(){
    validateExpression()
    const result = evaluate(evaluateAddSubtract(), "+", 0);
    expressionArray.unshift(result.toString());
    updateBar();
}
function backspace(){
    let lastTerm = expressionArray.at(-1);

    //"-#"
    if (lastTerm.length === 2 && lastTerm.charAt(0) === "-")
        return;

    if (lastTerm.length === 1){
        expressionArray.pop();
        if (expressionArray.length === 0)
            expressionArray.push("0");
    }
    else{
        expressionArray[expressionArray.length-1] = expressionArray[expressionArray.length-1].slice(0,-1);
    }
    updateBar()
}
function clearExpression(){
    expressionArray.length = 0;
    expressionArray.push("0");
    updateBar()
}
function updateBar(){
    let bar = expressionArray.join("");
    console.log(bar);
    document.getElementById("barText").textContent = bar;
}
function initialize(){
    updateBar();

    //Buttons 1-9
    for (let i = 0; i <= 9; i++)
        document.getElementById("btn-number-" + i.toString()).onclick = () => addNum(i);

    //Other Buttons
    document.getElementById("btn-op-plus-minus").onclick = plusMinusListener;
    document.getElementById("btn-op-decimal").onclick = decimalListener;
    
    document.getElementById("btn-op-add").onclick = ()=>operationListener("+");
    document.getElementById("btn-op-subtract").onclick = ()=>operationListener("-");
    document.getElementById("btn-op-multiply").onclick = ()=>operationListener("*");
    document.getElementById("btn-op-divide").onclick = ()=>operationListener("/");

    document.getElementById("btn-op-openParenthesis").onclick = ()=>parenthesisListener("(");
    document.getElementById("btn-op-closeParenthesis").onclick = ()=>parenthesisListener(")");
    
    document.getElementById("btn-op-equals").onclick = evaluateExpression;

    document.getElementById("btn-op-clear").onclick = clearExpression;
    document.getElementById("btn-op-backspace").onclick = backspace;
}
window.onload = function() {
    initialize();
    updateBar();
};