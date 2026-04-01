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
window.expressionArray = ["0"];
window.openParenthesisCount = 0;

function addNum(num){
    if (expressionArray.length === 0){
        expressionArray.push("0");
    }
    if (isFinite(expressionArray.at(-1))){
        if (expressionArray.at(-1).length === 1 && expressionArray.at(-1).charAt(0) === "0")
            expressionArray[expressionArray.length-1] = num.toString();
        else
            expressionArray[expressionArray.length-1] += num.toString();
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
        expressionArray.push(new NumberClass(hasDecimal = true));
    updateBar()
}
function plusMinusListener(){
    if (expressionArray.at(-1).at(0) === "-")
        expressionArray[expressionArray.length-1] = expressionArray.at(-1).charAt(0);
    else
        expressionArray[expressionArray.length-1] = "-" + expressionArray.at(-1);
    updateBar()
}
function parenthesisListener(symbol){
    if (symbol === ")" && (openParenthesisCount === 0 || !isFinite(expressionArray.at(-1))))
        return;
    if (symbol === "(")
        openParenthesisCount++;
    if (symbol === ")")
        openParenthesisCount--;
    expressionArray.push(symbol);
    updateBar();
}
function evaluateExpression(){
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
                continue;
            }

            let rightTerm = getTerm();
            leftTerm = evaluate(leftTerm, operation, rightTerm);
        }
        return (leftTerm);
    }
    function getTerm(){
        let term = expressionArray.shift();
        if (term === "("){
            const result = evaluateExpression();

            expressionArray.shift();
            if (expressionArray.length > 0 && expressionArray.at(0) instanceof NumberClass)
                expressionArray.unshift("*");

            return (result);
        }
        return (term);
    }
    validateExpression()
    const result = evaluateAddSubtract();
    expressionArray.unshift(result.toString());
    updateBar();
}
function updateBar(){
    let bar = expressionArray.join("");
    document.getElementById("bar").textContent = bar;
}
function initialize(){
    updateBar();

    for (let i = 0; i <= 9; i++)
        document.getElementById(i.toString()).onclick = () => addNum(i);

    let operations = ["+","-","*","/"];
    for (let i = 0; i < operations.length; i++)
        document.getElementById("op" + operations.at(i)).onclick = ()=>operationListener(operations.at(i));

    document.getElementById("op(").onclick = ()=>parenthesisListener("(");
    document.getElementById("op)").onclick = ()=>parenthesisListener(")");

    document.getElementById("op.").onclick = decimalListener;
    document.getElementById("op+/-").onclick = plusMinusListener;

    document.getElementById("op=").onclick = evaluateExpression;
}
window.onload = function() {
    initialize();
    updateBar();
};