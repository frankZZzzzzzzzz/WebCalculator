evaluate(left, operation, right){
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
        expressionArray.at(-1) += num;
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
            expressionArray.at(-1) += ".";
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
    if (beginning === "(")
        
}
function updateBar(){
    let bar = expressionArray.map(item => item instanceof NumberClass ? item.toString() : item).join("");
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
};