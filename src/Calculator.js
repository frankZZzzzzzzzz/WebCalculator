class NumberClass{
    constructor(num = 0, isNegative = false, hasDecimal = false){
        this.isNegative = isNegative;
        this.hasDecimal = hasDecimal;

        let whole = Math.trunc(num)
        num -= this.whole;
        while (num < 1)
            num *= 10;

        this.whole = whole !== 0 ? whole.toString() : "";
        this.decimal = num !== 0 ? num.toString() : "";
    }
    addDigit(digit){
        if (this.hasDecimal)
            this.decimal += digit;
        else   
            this.whole += digit;
    }
    toString(){
        return ((this.isNegative ? "-" : "") + (this.whole === "" ? "0" : this.whole) + (this.hasDecimal ? "."+this.decimal : ""))
    }
    evaluate(){
        let whole = parseInt(this.whole);
        let decimal = parseInt(this.decimal);
        while (decimal >= 1)
            decimal /= 10;

        let num = whole + decimal;
        if (this.isNegative)
            num *= -1;

        return (num);
    }
}
class evaluationNode{
    constructor(left, operation = "+", right = null){
        this.left = left;
        this.right = right;
        this.operation = operation;
    }
    evaluate(){
        if (this.right === null)
            return (this.left);
        switch(this.operation){
            case "+": return (this.left.evaluate() + this.right.evaluate());
            case "-": return (this.left.evaluate() - this.right.evaluate());
            case "*": return (this.left.evaluate() * this.right.evaluate());
            case "/": return (this.left.evaluate() / this.right.evaluate());
        }
    }
}
window.expressionArray = [new NumberClass()];
window.openParenthesisCount = 0;

function addNum(num){
    if (expressionArray.length === 0){
        expressionArray.push(new NumberClass(num));
    }
    if (expressionArray.at(-1) instanceof NumberClass){
        expressionArray.at(-1).addDigit(num);
    }
    else{
        expressionArray.push(new NumberClass(num));
    }
    updateBar()
}
function operationListener(symbol){
    if (expressionArray.length === 0)
        return;
    if (expressionArray.at(-1) instanceof NumberClass || expressionArray.at(-1) === "(" || expressionArray.at(-1) === ")"){
        expressionArray.push(symbol);
    }
    else{
        expressionArray[expressionArray.length-1] = symbol;
    }
    updateBar()
}
function decimalListener(){
    if (expressionArray.at(-1) instanceof NumberClass){
        expressionArray.at(-1).hasDecimal = !expressionArray.at(-1).hasDecimal;
        expressionArray.at(-1).decimal = "";
    }
    else
        expressionArray.push(new NumberClass(hasDecimal = true));
    updateBar()
}
function plusMinusListener(){
    expressionArray.at(-1).isNegative = !expressionArray.at(-1).isNegative;
    updateBar()
}
function parenthesisListener(symbol){
    if (symbol === ")" && (openParenthesisCount === 0 || !(expressionArray.at(-1) instanceof NumberClass)))
        return;
    if (symbol === "(")
        openParenthesisCount++;
    if (symbol === ")")
        openParenthesisCount--;
    expressionArray.push(symbol);
    updateBar();
}
function evaluateExpression(beginning, end){
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