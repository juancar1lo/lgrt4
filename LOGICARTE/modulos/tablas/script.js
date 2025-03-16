// Traducciones para español y euskera
const translations = {
    es: {
        title: "Calculadora de Tablas de Verdad",
        legendTitle: "Leyenda de Símbolos",
        conjunction: "Conjunción",
        disjunction: "Disyunción",
        negation: "Negación",
        conditional: "Condicional",
        biconditional: "Bicondicional",
        parentheses: "Paréntesis",
        variables: "Variables",
        expressionLabel: "Expresión lógica",
        calculate: "Calcular",
        clear: "Limpiar",
        exportPDF: "Generar PDF",
        resetView: "Resetear Vista",
        randomGeneratorTitle: "Generador de Fórmulas Aleatorias",
        numVariables: "Número de variables (1-6):",
        depth: "Profundidad (1-5):",
        operandsPerSubformula: "Operandos por subfórmula (1-4):",
        allowedOperators: "Operadores permitidos",
        generateFormula: "Generar Fórmula Aleatoria",
        tautology: "Tautología",
        contradiction: "Contradicción",
        indeterminacy: "Indeterminación",
        result: "Resultado:",
        final: "Final",
        pdfTitle: "La tabla de verdad es: ",
        errorInvalidExpression: "Error: Expresión lógica inválida. Revisa la sintaxis.",
        errorGeneratePDF: "No se puede generar el PDF. Por favor, ingrese una expresión lógica válida y corrija la sintaxia.",
        errorGenerateTable: "Primero genera la tabla de verdad para exportarla.",
        historyTitle: "Historial de Expresiones",
        clearHistory: "Limpiar Historial"
    },
    eu: {
        title: "Egia-taulen kalkulagailua",
        legendTitle: "Sinboloen legenda",
        conjunction: "Konjuntzioa",
        disjunction: "Disjuntzioa",
        negation: "Ezeztapena",
        conditional: "Baldintzazkoa",
        biconditional: "Baldintzabikoa",
        parentheses: "Parentesiak",
        variables: "Aldagaiak",
        expressionLabel: "Adierazpen logikoa",
        calculate: "Kalkulatu",
        clear: "Garbitu",
        exportPDF: "PDF sortu",
        resetView: "Berrasieratu",
        randomGeneratorTitle: "Ausazko formulen sorgailua",
        numVariables: "Aldagai kopurua (1-6):",
        depth: "Sakonera (1-5):",
        operandsPerSubformula: "Azpiformula bidezko eragigaiak (1-4):",
        allowedOperators: "Baimendutako eragileak",
        generateFormula: "Sortu ausazko formula",
        tautology: "Tautologia",
        contradiction: "Kontraesana",
        indeterminacy: "Indeterminazioa",
        result: "Emaitza:",
        final: "Emaitza",
        pdfTitle: "Egia-taula da: ",
        errorInvalidExpression: "Errorea: Adierazpen logiko baliogabea. Egiaztatu sintaxia.",
        errorGeneratePDF: "Ezin da PDFa sortu. Mesedez, sartu baliozko adierazpen logiko bat eta zuzendu sintaxia.",
        errorGenerateTable: "Lehenik, egia-taula sortu behar duzu esportatzeko.",
        historyTitle: "Adierazpenen Historia",
        clearHistory: "Historia Garbitu"
    }
};

// Variable global para el idioma actual
let currentLang = 'es';

// Variables globales para el zoom y el árbol actual
let currentSvg = null;
let currentZoomBehavior = null;
let currentD3TreeData = null;

// **Función para actualizar el idioma**
function updateLanguage(lang) {
    currentLang = lang;
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('legendTitle').innerHTML = `<strong>${translations[lang].legendTitle}</strong>`;
    document.getElementById('conjunction').textContent = translations[lang].conjunction;
    document.getElementById('disjunction').textContent = translations[lang].disjunction;
    document.getElementById('negation').textContent = translations[lang].negation;
    document.getElementById('conditional').textContent = translations[lang].conditional;
    document.getElementById('biconditional').textContent = translations[lang].biconditional;
    document.getElementById('parentheses').textContent = translations[lang].parentheses;
    document.getElementById('variables').textContent = translations[lang].variables;
    document.getElementById('expressionLabel').innerHTML = `<strong>${translations[lang].expressionLabel}</strong>`;
    document.getElementById('btnCalcular').textContent = translations[lang].calculate;
    document.getElementById('btnLimpiar').textContent = translations[lang].clear;
    document.getElementById('btnExportar').textContent = translations[lang].exportPDF;
    document.getElementById('btnResetZoom').textContent = translations[lang].resetView;
    document.getElementById('randomGeneratorTitle').textContent = translations[lang].randomGeneratorTitle;
    document.getElementById('numVariablesLabel').textContent = translations[lang].numVariables;
    document.getElementById('depthLabel').textContent = translations[lang].depth;
    document.getElementById('operandsPerSubformulaLabel').textContent = translations[lang].operandsPerSubformula;
    document.getElementById('allowedOperators').textContent = translations[lang].allowedOperators;
    document.getElementById('btnGenerarFormula').textContent = translations[lang].generateFormula;
    document.getElementById('historyTitle').textContent = translations[lang].historyTitle;
    document.getElementById('btnClearHistory').textContent = translations[lang].clearHistory;
}

// **Función para validar la expresión lógica**
function isValidExpression(expr) {
    expr = expr.replace(/\s+/g, ''); // Eliminar espacios en blanco
    const variables = ['p', 'q', 'r', 's', 't', 'u']; // Incluye 'u'
    const unaryOps = ['¬'];
    const binaryOps = ['∧', '∨', '→', '↔'];

    function isVariable(char) {
        return variables.includes(char);
    }

    function isUnaryOp(char) {
        return unaryOps.includes(char);
    }

    function isBinaryOp(char) {
        return binaryOps.includes(char);
    }

    // Verificar balance de paréntesis
    let parenCount = 0;
    for (let char of expr) {
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (parenCount < 0) return false;
    }
    if (parenCount !== 0) return false;

    // Verificar secuencia de caracteres
    let expectVariableOrUnary = true; // Esperamos una variable, "¬" o "("
    for (let i = 0; i < expr.length; i++) {
        let char = expr[i];
        if (char === '(') {
            expectVariableOrUnary = true;
        } else if (char === ')') {
            expectVariableOrUnary = false;
        } else if (isVariable(char)) {
            if (!expectVariableOrUnary) return false;
            expectVariableOrUnary = false;
        } else if (isUnaryOp(char)) {
            if (!expectVariableOrUnary) return false;
            // No cambiamos expectVariableOrUnary, sigue esperando una variable o "("
        } else if (isBinaryOp(char)) {
            if (expectVariableOrUnary) return false;
            expectVariableOrUnary = true;
        } else {
            return false; // Carácter no reconocido
        }
    }
    return !expectVariableOrUnary; // La expresión debe terminar con un operando
}

// **Evaluación y Generación del Árbol Sintáctico**
function defaultAssignment(ast) {
    let assignment = {};

    function traverse(node) {
        if (node.type === "VAR") {
            assignment[node.name] = true;
        } else {
            if (node.operand) traverse(node.operand);
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
        }
    }
    traverse(ast);
    return assignment;
}

function attachValues(node, assignment) {
    if (node.type === "VAR") {
        node.valor = assignment[node.name];
        return node;
    }
    if (node.type === "NOT") {
        node.operand = attachValues(node.operand, assignment);
        node.valor = !node.operand.valor;
        return node;
    }
    if (node.type === "AND") {
        node.left = attachValues(node.left, assignment);
        node.right = attachValues(node.right, assignment);
        node.valor = node.left.valor && node.right.valor;
        return node;
    }
    if (node.type === "OR") {
        node.left = attachValues(node.left, assignment);
        node.right = attachValues(node.right, assignment);
        node.valor = node.left.valor || node.right.valor;
        return node;
    }
    if (node.type === "IMP") {
        node.left = attachValues(node.left, assignment);
        node.right = attachValues(node.right, assignment);
        node.valor = (!node.left.valor) || node.right.valor;
        return node;
    }
    if (node.type === "BICOND") {
        node.left = attachValues(node.left, assignment);
        node.right = attachValues(node.right, assignment);
        node.valor = node.left.valor === node.right.valor;
        return node;
    }
    return node;
}

function attachValuesToAST(ast) {
    const assignment = defaultAssignment(ast);
    return attachValues(ast, assignment);
}

// **Funciones para la Tabla de Verdad**
function splitExpression(expr) {
    expr = expr.replace(/\s+/g, '');
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const ch = expr[i];
        if (/[pqrstu]/.test(ch)) { // Incluye 'u'
            tokens.push(ch);
            i++;
            continue;
        }
        if (ch === '¬' || ch === '∧' || ch === '∨' || ch === '(' || ch === ')') {
            tokens.push(ch);
            i++;
            continue;
        }
        if (ch === '→' || ch === '↔') {
            tokens.push(ch);
            i++;
            continue;
        }
        i++;
    }
    return tokens;
}

function precedence(op) {
    switch (op) {
        case '¬':
            return 5;
        case '∧':
            return 4;
        case '∨':
            return 3;
        case '→':
            return 2;
        case '↔':
            return 1;
        default:
            return 0;
    }
}

function isLeftAssociative(op) { return (op === '∧' || op === '∨' || op === '↔'); }

function isUnary(op) { return (op === '¬'); }

function isBinary(op) { return (op === '∧' || op === '∨' || op === '→' || op === '↔'); }

function applyOperator(op, left, right) {
    switch (op) {
        case '¬':
            return !left;
        case '∧':
            return left && right;
        case '∨':
            return left || right;
        case '→':
            return (!left) || right;
        case '↔':
            return left === right;
        default:
            return false;
    }
}

function evaluateRowInfix(tokens, values) {
    const opStack = [],
        valStack = [],
        resultByIndex = [];

    function popAndApply() {
        const opObj = opStack.pop();
        const op = opObj.op;
        if (isUnary(op)) {
            const val = valStack.pop();
            const res = applyOperator(op, val, null);
            valStack.push(res);
            resultByIndex[opObj.tokenIndex] = res ? 1 : 0;
        } else {
            const right = valStack.pop(),
                left = valStack.pop();
            const res = applyOperator(op, left, right);
            valStack.push(res);
            resultByIndex[opObj.tokenIndex] = res ? 1 : 0;
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        let tk = tokens[i];
        if (/[pqrstu]/.test(tk)) { // Incluye 'u'
            let boolVal = !!values[tk];
            valStack.push(boolVal);
            resultByIndex[i] = boolVal ? 1 : 0;
        } else if (tk === '(') {
            opStack.push({ op: tk, tokenIndex: i });
            resultByIndex[i] = '';
        } else if (tk === ')') {
            while (opStack.length > 0 && opStack[opStack.length - 1].op !== '(') { popAndApply(); }
            if (opStack.length > 0 && opStack[opStack.length - 1].op === '(') { opStack.pop(); }
            resultByIndex[i] = '';
        } else if (isUnary(tk)) {
            opStack.push({ op: tk, tokenIndex: i });
            resultByIndex[i] = '';
        } else if (isBinary(tk)) {
            const currentOpPrec = precedence(tk);
            while (opStack.length > 0 && opStack[opStack.length - 1].op !== '(') {
                const topOp = opStack[opStack.length - 1],
                    topPrec = precedence(topOp.op);
                if ((topPrec > currentOpPrec) || (topPrec === currentOpPrec && isLeftAssociative(topOp.op))) { popAndApply(); } else { break; }
            }
            opStack.push({ op: tk, tokenIndex: i });
            resultByIndex[i] = '';
        } else { resultByIndex[i] = ''; }
    }

    while (opStack.length > 0) {
        const top = opStack.pop();
        if (top.op === '(' || top.op === ')') continue;
        opStack.push({ op: top.op, tokenIndex: top.tokenIndex });
        popAndApply();
    }

    let finalResult = valStack.length > 0 ? (valStack[0] ? 1 : 0) : '';
    resultByIndex.push(finalResult);
    return { partials: resultByIndex, final: finalResult };
}

function generateTruthTable(expression) {
    const tokens = splitExpression(expression);
    if (tokens.length === 0) return null;
    const tokensWithFinal = tokens.slice();
    tokensWithFinal.push(translations[currentLang].final);
    let varsSet = new Set();
    tokens.forEach(t => { if (/[pqrstu]/.test(t)) { varsSet.add(t); } }); // Incluye 'u'
    let vars = Array.from(varsSet);
    vars.sort();
    let numRows = Math.pow(2, vars.length),
        rows = [],
        finalResults = [];

    // Generar filas en orden descendente (más 1's primero)
    for (let i = numRows - 1; i >= 0; i--) {
        let assignment = {};
        for (let j = 0; j < vars.length; j++) {
            let bit = (i >> (vars.length - 1 - j)) & 1;
            assignment[vars[j]] = (bit === 1);
        }
        let evaluation = evaluateRowInfix(tokens, assignment);
        let partials = evaluation.partials,
            final = evaluation.final;
        finalResults.push(final);
        rows.push({ assignment, partials });
    }

    let uniqueVals = new Set(finalResults),
        verdict = '';
    if (uniqueVals.size === 1) { verdict = uniqueVals.has(1) ? translations[currentLang].tautology : translations[currentLang].contradiction; } else { verdict = translations[currentLang].indeterminacy; }
    return { tokens: tokensWithFinal, vars, rows, verdict };
}

function renderTruthTable(tableData) {
    if (!tableData) return '<p style="color:red">Expresión inválida o vacía.</p>';
    const { tokens, rows, verdict } = tableData;

    // Generar subexpresiones completas para cada columna
    const subexpressions = [];
    const expr = tokens.slice(0, -1).join(''); // Reconstruir la expresión sin "Final"
    const ast = parseExpressionParser(expr);
    const d3TreeData = convertToD3Format(ast);
    collectSubexpressions(d3TreeData, subexpressions);

    // Asegurar que "Final" tenga su propia subexpresión
    subexpressions.push(normalizeSubexpression(expr));

    let html = '<table style="margin:auto; border-collapse:collapse;">';
    html += '<thead><tr>';
    tokens.forEach((tk, index) => {
        let subexpr = '';
        if (tk === translations[currentLang].final) {
            subexpr = subexpressions[subexpressions.length - 1]; // Última subexpresión para "Final"
        } else {
            subexpr = subexpressions.find(s => s.includes(tk)) || normalizeSubexpression(tk);
        }
        html += `<th data-subexpression="${subexpr}">${tk}</th>`;
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
        const partials = row.partials;
        html += '<tr>';
        for (let i = 0; i < tokens.length; i++) {
            let cellVal = partials[i] !== undefined ? partials[i] : '';
            html += `<td style="border:1px solid black; padding:4px;">${cellVal}</td>`;
        }
        html += '</tr>';
    });
    html += '</tbody></table>';
    html += `<p><strong>${translations[currentLang].result} ${verdict}</strong></p>`;
    return html;
}

// Función auxiliar para recolectar subexpresiones del árbol
function collectSubexpressions(node, subexprs) {
    if (!node) return;
    subexprs.push(node.subexpression);
    if (node.children) {
        node.children.forEach(child => collectSubexpressions(child, subexprs));
    }
}

// **Exportar a PDF**
document.getElementById('btnExportar').addEventListener('click', function() {
    const tableContainer = document.getElementById('resultadoTabla');
    const errorMessage = tableContainer.textContent.includes(translations[currentLang].errorInvalidExpression);

    // Si hay un mensaje de error, mostrar advertencia y detener la ejecución
    if (errorMessage) {
        alert(translations[currentLang].errorGeneratePDF);
        return;
    }

    // Si el contenedor está vacío, indicar que primero se debe generar la tabla
    if (tableContainer.innerHTML.trim() === "") {
        alert(translations[currentLang].errorGenerateTable);
        return;
    }

    // Generar el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(translations[currentLang].pdfTitle, 10, 20);

    html2canvas(tableContainer, { scale: 2 }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', 10, 30, pdfWidth, pdfHeight);
        doc.save("tabla_verdad.pdf");
    }).catch(function(error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al generar el PDF.");
    });
});

// **Parser y Visualización Interactiva del Árbol Sintáctico**
function tokenizeParser(expr) {
    expr = expr.replace(/\s+/g, '');
    const tokens = [];
    for (let i = 0; i < expr.length; i++) {
        const ch = expr[i];
        if ("pqrstu".includes(ch)) { tokens.push({ type: "VAR", value: ch }); } // Incluye 'u'
        else if ("∧∨¬→↔()".includes(ch)) { tokens.push({ type: "OP", value: ch }); }
    }
    return tokens;
}

function parseExpressionParser(expr) {
    const tokens = tokenizeParser(expr);
    let index = 0;

    function peek() { return tokens[index]; }

    function consume() { return tokens[index++]; }

    function parsePrimary() {
        const token = peek();
        if (!token) throw new Error("Expresión incompleta");
        if (token.type === "VAR") {
            consume();
            return { type: "VAR", name: token.value };
        }
        if (token.value === "(") {
            consume();
            const node = parseBiconditional();
            if (!peek() || peek().value !== ")") throw new Error("Se esperaba ')'");
            consume();
            return node;
        }
        throw new Error("Token inesperado: " + token.value);
    }

    function parseNot() {
        const token = peek();
        if (token && token.value === "¬") {
            consume();
            const operand = parseNot();
            return { type: "NOT", operand: operand };
        }
        return parsePrimary();
    }

    function parseAnd() {
        let node = parseNot();
        while (peek() && peek().value === "∧") {
            consume();
            const right = parseNot();
            node = { type: "AND", left: node, right: right };
        }
        return node;
    }

    function parseOr() {
        let node = parseAnd();
        while (peek() && peek().value === "∨") {
            consume();
            const right = parseAnd();
            node = { type: "OR", left: node, right: right };
        }
        return node;
    }

    function parseImp() {
        let node = parseOr();
        while (peek() && peek().value === "→") {
            consume();
            const right = parseOr();
            node = { type: "IMP", left: node, right: right };
        }
        return node;
    }

    function parseBiconditional() {
        let node = parseImp();
        while (peek() && peek().value === "↔") {
            consume();
            const right = parseImp();
            node = { type: "BICOND", left: node, right: right };
        }
        return node;
    }

    const tree = parseBiconditional();
    if (index < tokens.length) throw new Error("Tokens sobrantes en la expresión");
    return tree;
}

// Convertir al formato D3 con subexpresión normalizada
function convertToD3Format(node) {
    if (!node) return null;
    let d3Node = { subexpression: normalizeSubexpression(generateSubexpression(node)) };
    if (node.type === "VAR") {
        d3Node.name = node.name;
    } else if (node.type === "NOT") {
        d3Node.name = "¬";
        d3Node.children = [convertToD3Format(node.operand)];
    } else if (node.type === "AND") {
        d3Node.name = "∧";
        d3Node.children = [convertToD3Format(node.left), convertToD3Format(node.right)];
    } else if (node.type === "OR") {
        d3Node.name = "∨";
        d3Node.children = [convertToD3Format(node.left), convertToD3Format(node.right)];
    } else if (node.type === "IMP") {
        d3Node.name = "→";
        d3Node.children = [convertToD3Format(node.left), convertToD3Format(node.right)];
    } else if (node.type === "BICOND") {
        d3Node.name = "↔";
        d3Node.children = [convertToD3Format(node.left), convertToD3Format(node.right)];
    } else {
        d3Node.name = node.type;
    }
    return d3Node;
}

// Generar subexpresión como string con paréntesis consistentes
function generateSubexpression(node) {
    if (node.type === "VAR") return node.name;
    if (node.type === "NOT") return "¬" + generateSubexpression(node.operand);
    if (node.type === "AND") return "(" + generateSubexpression(node.left) + "∧" + generateSubexpression(node.right) + ")";
    if (node.type === "OR") return "(" + generateSubexpression(node.left) + "∨" + generateSubexpression(node.right) + ")";
    if (node.type === "IMP") return "(" + generateSubexpression(node.left) + "→" + generateSubexpression(node.right) + ")";
    if (node.type === "BICOND") return "(" + generateSubexpression(node.left) + "↔" + generateSubexpression(node.right) + ")";
    return "";
}

// Normalizar subexpresión eliminando espacios
function normalizeSubexpression(subexpression) {
    return subexpression.replace(/\s+/g, '');
}

// Visualizar el árbol en orientación vertical con animación y evento de doble clic
function visualizeParseTree(treeData) {
    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
        width = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    d3.select("#parseTree").select("svg").remove();
    const svg = d3.select("#parseTree").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    currentSvg = svg;
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => { g.attr("transform", event.transform); });
    svg.call(zoom);
    currentZoomBehavior = zoom;
    const treemap = d3.tree().size([width, height]);
    const nodes = d3.hierarchy(treeData, d => d.children);
    const treeRoot = treemap(nodes);

    const link = g.selectAll(".link")
        .data(treeRoot.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", d => "M" + d.x + "," + d.y + "L" + d.x + "," + d.y)
        .transition()
        .duration(750)
        .delay(d => d.depth * 300)
        .attr("d", d => {
            return "M" + d.x + "," + d.y +
                "C" + d.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + (d.y + d.parent.y) / 2 +
                " " + d.parent.x + "," + d.parent.y;
        });

    const node = g.selectAll(".node")
        .data(treeRoot.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
        .attr("r", 0)
        .attr("fill", d => {
            if (d.data.valor === true) return "lightgreen";
            else if (d.data.valor === false) return "lightcoral";
            else return "#fff";
        })
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "red").attr("stroke-width", 5);
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .style("display", "inline-block")
                .html("<strong>Nodo:</strong> " + d.data.name + "<br><strong>Subexpresión:</strong> " + d.data.subexpression);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("stroke", "steelblue").attr("stroke-width", 3);
            d3.select("#tooltip").style("display", "none");
        })
        .on("dblclick", function(event, d) {
            d3.select(this).attr("fill", "pink"); // Color rojizo al nodo
            highlightColumn(d.data.subexpression); // Resaltar columna
            event.stopPropagation(); // Evitar que el zoom se active
        })
        .transition()
        .duration(750)
        .delay(d => d.depth * 300)
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -13 : 13)
        .style("font-weight", "bold")
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .style("opacity", 0)
        .transition()
        .duration(750)
        .delay(d => d.depth * 300)
        .style("opacity", 1);
}

// Función para resaltar la columna correspondiente
function highlightColumn(subexpression) {
    // Limpiar resaltados previos
    d3.selectAll("#resultadoTabla th").style("background-color", null);
    d3.selectAll("#resultadoTabla td").style("background-color", null);

    // Encontrar la columna con la subexpresión correspondiente
    const header = d3.select(`#resultadoTabla th[data-subexpression="${subexpression}"]`);
    if (!header.empty()) {
        // Resaltar el encabezado
        header.style("background-color", "yellow");

        // Resaltar las celdas de datos debajo de la columna
        const columnIndex = header.node().cellIndex;
        d3.selectAll("#resultadoTabla tbody tr").each(function() {
            d3.select(this).selectAll("td").filter(function(d, i) {
                return i === columnIndex;
            }).style("background-color", "yellow");
        });
    } else {
        console.log(`No se encontró columna con data-subexpression="${subexpression}"`);
    }
}

// **Botón para Resetear Zoom**
document.getElementById('btnResetZoom').addEventListener('click', function() {
    if (currentSvg && currentZoomBehavior) {
        currentSvg.transition().duration(750).call(currentZoomBehavior.transform, d3.zoomIdentity);
    }
});

// **Al enviar el formulario: genera tabla y árbol**
document.getElementById('tablaVerdadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const expression = document.getElementById('expresion').value;

    // Validar la expresión antes de procesar
    if (!isValidExpression(expression)) {
        document.getElementById('resultadoTabla').innerHTML = `<p style="color:red">${translations[currentLang].errorInvalidExpression}</p>`;
        document.getElementById('parseTree').innerHTML = '';
        return;
    }

    try {
        let ast = parseExpressionParser(expression);
        ast = attachValuesToAST(ast);
        const d3TreeData = convertToD3Format(ast);
        currentD3TreeData = d3TreeData;
        visualizeParseTree(d3TreeData);
        const tableData = generateTruthTable(expression);
        const tableHTML = renderTruthTable(tableData);
        document.getElementById('resultadoTabla').innerHTML = tableHTML;

        // Guardar la expresión en el historial
        saveExpression(expression);
    } catch (error) {
        console.error("Error al procesar la expresión:", error);
        document.getElementById('resultadoTabla').innerHTML = `<p style="color:red">Expresión incorrecta: ${error.message}</p>`;
        document.getElementById('parseTree').innerHTML = '';
    }
});

// **Generador Aleatorio de Fórmulas Proposicionales**
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function chance(p) {
    return Math.random() < p;
}

function generateRandomFormula(numVars, depth, varsPerSub, allowedOps) {
    const variables = ["p", "q", "r", "s", "t", "u"].slice(0, numVars); // Incluye 'u'
    const binaryOps = ["∧", "∨", "→", "↔"].filter(op => allowedOps.includes(op));
    const allowNegation = allowedOps.includes("¬");

    if (depth <= 0) {
        let varFormula = randomElement(variables);
        if (allowNegation && chance(0.3)) {
            return "¬" + varFormula;
        }
        return varFormula;
    }

    if (binaryOps.length === 0) {
        throw new Error("Debe permitir al menos un operador binario.");
    }

    const numOperands = Math.floor(Math.random() * (varsPerSub - 1)) + 2;
    let formula = generateRandomFormula(numVars, depth - 1, varsPerSub, allowedOps);

    for (let i = 1; i < numOperands; i++) {
        const op = randomElement(binaryOps);
        const rightExpr = generateRandomFormula(numVars, depth - 1, varsPerSub, allowedOps);
        formula = "(" + formula + op + rightExpr + ")";
    }

    if (allowNegation && chance(0.2)) {
        formula = "¬" + formula;
    }

    return formula;
}

// **Evento para Generar Fórmula Aleatoria**
document.getElementById('btnGenerarFormula').addEventListener('click', function() {
    const numVars = parseInt(document.getElementById('numVariables').value, 10);
    const depth = parseInt(document.getElementById('profundidad').value, 10);
    const varsPerSub = parseInt(document.getElementById('varsSubformula').value, 10);

    const allowedOps = [];
    document.querySelectorAll('.operator:checked').forEach(function(checkbox) {
        allowedOps.push(checkbox.value);
    });

    const binaryOps = ["∧", "∨", "→", "↔"];
    const hasBinaryOp = binaryOps.some(op => allowedOps.includes(op));
    if (depth > 0 && !hasBinaryOp) {
        alert("Debe seleccionar al menos un operador binario.");
        return;
    }

    try {
        const randomFormula = generateRandomFormula(numVars, depth, varsPerSub, allowedOps);
        document.getElementById('expresion').value = randomFormula;
    } catch (error) {
        alert(error.message);
    }
});

// **Botón Limpiar**
document.getElementById('btnLimpiar').addEventListener('click', function() {
    document.getElementById('expresion').value = "";
    document.getElementById('resultadoTabla').innerHTML = "";
    document.getElementById('parseTree').innerHTML = "";
    document.getElementById('numVariables').value = 3;
    document.getElementById('profundidad').value = 3;
    document.getElementById('varsSubformula').value = 2;
});

// **Inserción de Símbolos mediante Botones**
const expresionTextarea = document.getElementById('expresion');

function insertSymbol(symbol) {
    const start = expresionTextarea.selectionStart;
    const end = expresionTextarea.selectionEnd;
    const text = expresionTextarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    expresionTextarea.value = before + symbol + after;
    expresionTextarea.selectionStart = start + symbol.length;
    expresionTextarea.selectionEnd = start + symbol.length;
    expresionTextarea.focus();
}

document.getElementById('btnP').addEventListener('click', function() { insertSymbol('p'); });
document.getElementById('btnQ').addEventListener('click', function() { insertSymbol('q'); });
document.getElementById('btnR').addEventListener('click', function() { insertSymbol('r'); });
document.getElementById('btnS').addEventListener('click', function() { insertSymbol('s'); });
document.getElementById('btnT').addEventListener('click', function() { insertSymbol('t'); });
document.getElementById('btnU').addEventListener('click', function() { insertSymbol('u'); }); // Evento para 'u'
document.getElementById('btnAnd').addEventListener('click', function() { insertSymbol('∧'); });
document.getElementById('btnOr').addEventListener('click', function() { insertSymbol('∨'); });
document.getElementById('btnNot').addEventListener('click', function() { insertSymbol('¬'); });
document.getElementById('btnConditional').addEventListener('click', function() { insertSymbol('→'); });
document.getElementById('btnBiconditional').addEventListener('click', function() { insertSymbol('↔'); });
document.getElementById('btnOpenParen').addEventListener('click', function() { insertSymbol('('); });
document.getElementById('btnCloseParen').addEventListener('click', function() { insertSymbol(')'); });

// **Event listener para el selector de idioma**
document.getElementById('language').addEventListener('change', function() {
    const selectedLang = this.value; // 'es' o 'eu'
    updateLanguage(selectedLang);
});

// **Funciones del Historial de Expresiones**
function saveExpression(expr) {
    let history = JSON.parse(localStorage.getItem('expressionHistory')) || [];
    if (!history.includes(expr)) { // Evitar duplicados
        history.push(expr);
        localStorage.setItem('expressionHistory', JSON.stringify(history));
    }
    renderHistory();
}

function renderHistory() {
    const historyContainer = document.getElementById('historyList');
    historyContainer.innerHTML = ''; // Limpiar la lista
    const history = JSON.parse(localStorage.getItem('expressionHistory')) || [];
    history.forEach((expr, index) => {
        const li = document.createElement('li');
        li.textContent = expr;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.onclick = () => deleteExpression(index);
        li.appendChild(deleteBtn);
        historyContainer.appendChild(li);
    });
}

function deleteExpression(index) {
    let history = JSON.parse(localStorage.getItem('expressionHistory')) || [];
    history.splice(index, 1);
    localStorage.setItem('expressionHistory', JSON.stringify(history));
    renderHistory();
}

function clearHistory() {
    localStorage.removeItem('expressionHistory');
    renderHistory();
}

// **Evento para Limpiar el Historial**
document.getElementById('btnClearHistory').addEventListener('click', function() {
    clearHistory();
});

// **Cargar el Historial al Iniciar y Configurar Idioma**
updateLanguage('es');
renderHistory();