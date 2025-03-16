// Traducciones para español y euskera
const translations = {
    es: {
        title: "Método de Reducción al Absurdo",
        inputLabel: "Ingresa la fórmula",
        solveButton: "Resolver",
        clearButton: "Limpiar",
        pdfButton: "Guardar como PDF",
        contradiction: "Contradicción encontrada en la variable",
        supposeFalse: "Suponemos que la fórmula",
        isFalse: "es FALSA.",
        applyNegation: "Aplicando regla de negación en",
        assignTrue: "se asigna VERDADERO a",
        assignFalse: "se asigna FALSO a",
        decomposeAndTrue: "Descomponiendo conjunción verdadera en",
        decomposeAndFalse: "Descomponiendo conjunción falsa en",
        decomposeOrTrue: "Descomponiendo disyunción verdadera en",
        decomposeOrFalse: "Descomponiendo disyunción falsa en",
        decomposeConditionalTrue: "Descomponiendo condicional verdadero en",
        decomposeConditionalFalse: "Descomponiendo condicional falso en",
        decomposeBiconditionalTrue: "Reemplazando bicondicional VERDADERO en",
        decomposeBiconditionalFalse: "Reemplazando bicondicional FALSO en",
        tautology: "Tautología detectada en",
        noContradiction: "Tras completar las asignaciones, no se encontró contraejemplo.",
        validFormula: "La fórmula es VÁLIDA (reducción al absurdo exitosa).",
        invalidFormula: "La fórmula NO es válida.",
        counterexample: "Se encontró al menos una rama sin contradicción (contraejemplo):"
    },
    eu: {
        title: "Absurdurako Erredukzioaren Metodoa",
        inputLabel: "Sartu formula",
        solveButton: "Ebatzi",
        clearButton: "Garbitu",
        pdfButton: "Gorde PDF gisa",
        contradiction: "Kontraesana aurkitu da aldagai honetan",
        supposeFalse: "Suposatzen dugu formula",
        isFalse: "FALTSUA dela.",
        applyNegation: "Negazio-araua aplikatuz",
        assignTrue: "EGIAKO balioa esleitzen zaio",
        assignFalse: "FALTSUA balioa esleitzen zaio",
        decomposeAndTrue: "Konjuntzio EGIAKO deskonposatzen",
        decomposeAndFalse: "Konjuntzio FALTSUA deskonposatzen",
        decomposeOrTrue: "Disjuntzio EGIAKO deskonposatzen",
        decomposeOrFalse: "Disjuntzio FALTSUA deskonposatzen",
        decomposeConditionalTrue: "Baldintza EGIAKO deskonposatzen",
        decomposeConditionalFalse: "Baldintza FALTSUA deskonposatzen",
        decomposeBiconditionalTrue: "Bikondizional EGIAKO ordezkatzen",
        decomposeBiconditionalFalse: "Bikondizional FALTSUA ordezkatzen",
        tautology: "Tautologia aurkitu da",
        noContradiction: "Esleipenak osatu ondoren, ez da kontrajarrikeriarik aurkitu.",
        validFormula: "Formula BALIOZKOA da (absurdurako erredukzio arrakastatsua).",
        invalidFormula: "Formula EZ da baliozkoa.",
        counterexample: "Gutxienez kontrajarrikeriarik gabeko adar bat aurkitu da (kontraadibidea):"
    }
};

// Función para actualizar el idioma
function updateLanguage(lang) {
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('inputLabel').textContent = translations[lang].inputLabel;
    document.getElementById('solveButton').textContent = translations[lang].solveButton;
    document.getElementById('clearButton').textContent = translations[lang].clearButton;
    document.getElementById('pdfButton').textContent = translations[lang].pdfButton;
    localStorage.setItem('selectedLanguage', lang); // Guardar idioma seleccionado
}

// Cargar idioma guardado o español por defecto al iniciar
window.onload = function() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'es';
    document.getElementById('language').value = savedLang;
    updateLanguage(savedLang);
};

// Escuchar cambios en el selector
document.getElementById('language').addEventListener('change', function() {
    updateLanguage(this.value);
});

// Función para insertar símbolos en el input
function insertAtCursor(myField, myValue) {
    if (document.selection) {
        myField.focus();
        let sel = document.selection.createRange();
        sel.text = myValue;
    } else if (myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos);
        myField.selectionStart = myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const symbolButtons = document.querySelectorAll('.symbol-button');
    const formulaInput = document.getElementById("formulaInput");
    symbolButtons.forEach(button => {
        button.addEventListener("click", () => {
            const symbol = button.getAttribute("data-symbol");
            insertAtCursor(formulaInput, symbol);
            formulaInput.focus();
        });
    });

    // Botón para limpiar la fórmula y el área de explicación
    document.getElementById("clearButton").addEventListener("click", () => {
        formulaInput.value = "";
        document.getElementById("result").innerHTML = "";
        formulaInput.focus();
    });

    // Botón para generar el PDF con estilos forzados para mayor visibilidad
    document.getElementById("pdfButton").addEventListener("click", () => {
        const formulaInputValue = document.getElementById("formulaInput").value;
        const resultElement = document.getElementById("result");

        // Crear un contenedor temporal con estilo adecuado para el PDF
        const tempContainer = document.createElement("div");
        tempContainer.style.fontFamily = "Arial, sans-serif";
        tempContainer.style.padding = "20px";
        tempContainer.style.background = "#ffffff"; // Fondo blanco fijo
        tempContainer.style.boxShadow = "none"; // Eliminar sombra
        tempContainer.style.border = "none"; // Eliminar bordes

        // Agregar la fórmula evaluada
        const formulaHeader = document.createElement("h2");
        formulaHeader.textContent = "Fórmula Evaluada:";
        const formulaText = document.createElement("p");
        formulaText.textContent = formulaInputValue || "No se ingresó ninguna fórmula";
        formulaText.style.fontSize = "16px";
        formulaText.style.marginBottom = "20px";

        // Clonar el contenido del resultado y ajustar estilos para el PDF
        const resultClone = resultElement.cloneNode(true);
        resultClone.style.marginTop = "0";

        // Recorrer cada elemento con la clase .step y forzar estilos más saturados y sin animación
        resultClone.querySelectorAll(".step").forEach(el => {
            el.style.animation = "none";
            el.style.opacity = "1";
            // Forzar fondo, borde y color en función del estado de la rama
            if (el.classList.contains("closed")) {
                el.style.backgroundColor = "#f5c6cb"; // Fondo más saturado para ramas cerradas
                el.style.border = "1px solid #f5c6cb";
                el.style.color = "#000";
            } else if (el.classList.contains("open")) {
                el.style.backgroundColor = "#c3e6cb"; // Fondo más saturado para ramas abiertas
                el.style.border = "1px solid #c3e6cb";
                el.style.color = "#000";
            }
            // Desactivar cualquier transición que pueda afectar la visibilidad
            el.style.transition = "none";
        });

        // Añadir los elementos al contenedor temporal
        tempContainer.appendChild(formulaHeader);
        tempContainer.appendChild(formulaText);
        tempContainer.appendChild(resultClone);

        // Opciones para html2pdf, asegurando fondo blanco en html2canvas
        const opt = {
            margin: 0.5,
            filename: 'resultado.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generar y guardar el PDF desde el contenedor temporal
        html2pdf().set(opt).from(tempContainer).save();
    });

    document.getElementById("solveButton").addEventListener("click", solveFormula);
});

// --- Definición de nodos del AST ---
function Var(name) { return { type: 'var', name: name }; }

function Not(sub) { return { type: 'not', sub: sub }; }

function And(left, right) { return { type: 'and', left: left, right: right }; }

function Or(left, right) { return { type: 'or', left: left, right: right }; }

function Conditional(left, right) { return { type: 'conditional', left: left, right: right }; }

function Biconditional(left, right) { return { type: 'biconditional', left: left, right: right }; }

// --- Funciones para comparar fórmulas ---
function equalFormula(f1, f2) {
    if (f1.type !== f2.type) return false;
    switch (f1.type) {
        case 'var':
            return f1.name === f2.name;
        case 'not':
            return equalFormula(f1.sub, f2.sub);
        case 'and':
        case 'or':
        case 'conditional':
        case 'biconditional':
            return equalFormula(f1.left, f2.left) && equalFormula(f1.right, f2.right);
        default:
            return false;
    }
}

function isComplementary(f1, f2) {
    if (f1.type === 'not' && equalFormula(f1.sub, f2)) return true;
    if (f2.type === 'not' && equalFormula(f2.sub, f1)) return true;
    return false;
}

// --- Parser (análisis sintáctico) ---
function parseFormula(input) {
    input = input.replace(/\s+/g, '');
    let index = 0;

    function peek() { return input[index]; }

    function consume() { return input[index++]; }

    function parseExpression() { return parseBiconditional(); }

    function parseBiconditional() {
        let left = parseConditional();
        while (input.substr(index, 1) === '↔' || input.substr(index, 3) === '<->') {
            if (input.substr(index, 1) === '↔') consume();
            else index += 3;
            let right = parseConditional();
            left = Biconditional(left, right);
        }
        return left;
    }

    function parseConditional() {
        let left = parseOr();
        while (input.substr(index, 1) === '→' || input.substr(index, 2) === '->') {
            if (input.substr(index, 1) === '→') consume();
            else index += 2;
            let right = parseOr();
            left = Conditional(left, right);
        }
        return left;
    }

    function parseOr() {
        let left = parseAnd();
        while (input.substr(index, 1) === '∨' || input.substr(index, 1) === 'v') {
            consume();
            let right = parseAnd();
            left = Or(left, right);
        }
        return left;
    }

    function parseAnd() {
        let left = parseNot();
        while (input.substr(index, 1) === '∧' || input.substr(index, 1) === '&') {
            consume();
            let right = parseNot();
            left = And(left, right);
        }
        return left;
    }

    function parseNot() {
        if (input.substr(index, 1) === '¬' || input.substr(index, 1) === '!') {
            consume();
            let sub = parseNot();
            return Not(sub);
        } else {
            return parseAtom();
        }
    }

    function parseAtom() {
        if (peek() === '(') {
            consume();
            let expr = parseExpression();
            if (peek() === ')') consume();
            else throw new Error("Falta ')'");
            return expr;
        } else {
            let c = peek();
            if ("pqrstu".includes(c)) {
                consume();
                return Var(c);
            } else {
                throw new Error("Token inesperado: " + c);
            }
        }
    }
    let result = parseExpression();
    if (index < input.length) throw new Error("Error de parseo en: " + input.substr(index));
    return result;
}

// --- Evaluador de fórmulas ---
function evalFormula(formula, assignment) {
    switch (formula.type) {
        case 'var':
            return assignment[formula.name];
        case 'not':
            return !evalFormula(formula.sub, assignment);
        case 'and':
            return evalFormula(formula.left, assignment) && evalFormula(formula.right, assignment);
        case 'or':
            return evalFormula(formula.left, assignment) || evalFormula(formula.right, assignment);
        case 'conditional':
            return (!evalFormula(formula.left, assignment)) || evalFormula(formula.right, assignment);
        case 'biconditional':
            return evalFormula(formula.left, assignment) === evalFormula(formula.right, assignment);
        default:
            return false;
    }
}

// Extrae las variables que aparecen en la fórmula
function getVariables(formula) {
    let vars = new Set();

    function traverse(f) {
        switch (f.type) {
            case 'var':
                vars.add(f.name);
                break;
            case 'not':
                traverse(f.sub);
                break;
            case 'and':
            case 'or':
            case 'conditional':
            case 'biconditional':
                traverse(f.left);
                traverse(f.right);
                break;
        }
    }
    traverse(formula);
    return Array.from(vars);
}

// Completa la rama para variables faltantes
function completeBranch(branch, missingVars, lang) {
    if (missingVars.length === 0) return [branch];
    let varName = missingVars[0];
    let rest = missingVars.slice(1);
    let branchTrue = cloneBranch(branch);
    branchTrue.entries.push({ formula: Var(varName), value: true, processed: true });
    branchTrue.steps.push(translations[lang].assignTrue + " " + varName);
    let branchFalse = cloneBranch(branch);
    branchFalse.entries.push({ formula: Var(varName), value: false, processed: true });
    branchFalse.steps.push(translations[lang].assignFalse + " " + varName);
    return completeBranch(branchTrue, rest, lang).concat(completeBranch(branchFalse, rest, lang));
}

// Obtiene la asignación de una rama
function getAssignment(branch) {
    let assignment = {};
    for (let entry of branch.entries) {
        if (entry.formula.type === 'var') {
            assignment[entry.formula.name] = entry.value;
        }
    }
    return assignment;
}

// Funciones para manejar las ramas del tableau
function cloneBranch(branch) {
    return {
        entries: branch.entries.slice(),
        steps: branch.steps.slice(),
        closed: branch.closed
    };
}

function checkContradiction(branch, lang) {
    let seen = {};
    for (let entry of branch.entries) {
        if (entry.formula.type === 'var') {
            let name = entry.formula.name;
            if (seen[name] === undefined) {
                seen[name] = entry.value;
            } else if (seen[name] !== entry.value) {
                return { contradiction: true, variable: name };
            }
        }
    }
    return { contradiction: false };
}

function expandBranch(branch, lang) {
    let contr = checkContradiction(branch, lang);
    if (contr.contradiction) {
        branch.closed = true;
        branch.steps.push(translations[lang].contradiction + " <span class='highlight'>" + contr.variable + "</span>.");
        return [branch];
    }
    let indexToExpand = -1;
    for (let i = 0; i < branch.entries.length; i++) {
        let entry = branch.entries[i];
        if (!entry.processed && entry.formula.type !== 'var') {
            indexToExpand = i;
            break;
        }
    }
    if (indexToExpand === -1) return [branch];
    let entry = branch.entries[indexToExpand];
    entry.processed = true;
    let newBranches = [];
    let ruleDescription = "";
    switch (entry.formula.type) {
        case 'not':
            ruleDescription = translations[lang].applyNegation + " " + displayFormula(entry.formula);
            let newEntry = { formula: entry.formula.sub, value: !entry.value, processed: false };
            let branchCopy = cloneBranch(branch);
            branchCopy.entries.push(newEntry);
            branchCopy.steps.push(ruleDescription + ": " + (newEntry.value ? translations[lang].assignTrue : translations[lang].assignFalse) + " " + displayFormula(entry.formula.sub));
            newBranches = expandBranch(branchCopy, lang);
            break;
        case 'and':
            if (entry.value === true) {
                ruleDescription = translations[lang].decomposeAndTrue + " " + displayFormula(entry.formula);
                let branchCopy = cloneBranch(branch);
                branchCopy.entries.push({ formula: entry.formula.left, value: true, processed: false });
                branchCopy.entries.push({ formula: entry.formula.right, value: true, processed: false });
                branchCopy.steps.push(ruleDescription + ": " + translations[lang].assignTrue + " " + displayFormula(entry.formula.left) + " y " + displayFormula(entry.formula.right));
                newBranches = expandBranch(branchCopy, lang);
            } else {
                ruleDescription = translations[lang].decomposeAndFalse + " " + displayFormula(entry.formula);
                let branchCopy1 = cloneBranch(branch);
                branchCopy1.entries.push({ formula: entry.formula.left, value: false, processed: false });
                branchCopy1.steps.push(ruleDescription + " (rama 1): " + translations[lang].assignFalse + " " + displayFormula(entry.formula.left));
                let branchCopy2 = cloneBranch(branch);
                branchCopy2.entries.push({ formula: entry.formula.right, value: false, processed: false });
                branchCopy2.steps.push(ruleDescription + " (rama 2): " + translations[lang].assignFalse + " " + displayFormula(entry.formula.right));
                newBranches = expandBranch(branchCopy1, lang).concat(expandBranch(branchCopy2, lang));
            }
            break;
        case 'or':
            if (entry.value === true) {
                if (isComplementary(entry.formula.left, entry.formula.right)) {
                    ruleDescription = translations[lang].tautology + " " + displayFormula(entry.formula) + ". Se marca como procesada sin expandir.";
                    branch.steps.push(ruleDescription);
                    newBranches = expandBranch(branch, lang);
                } else {
                    ruleDescription = translations[lang].decomposeOrTrue + " " + displayFormula(entry.formula);
                    let branchCopy1 = cloneBranch(branch);
                    branchCopy1.entries.push({ formula: entry.formula.left, value: true, processed: false });
                    branchCopy1.steps.push(ruleDescription + " (rama 1): " + translations[lang].assignTrue + " " + displayFormula(entry.formula.left));
                    let branchCopy2 = cloneBranch(branch);
                    branchCopy2.entries.push({ formula: entry.formula.right, value: true, processed: false });
                    branchCopy2.steps.push(ruleDescription + " (rama 2): " + translations[lang].assignTrue + " " + displayFormula(entry.formula.right));
                    newBranches = expandBranch(branchCopy1, lang).concat(expandBranch(branchCopy2, lang));
                }
            } else {
                ruleDescription = translations[lang].decomposeOrFalse + " " + displayFormula(entry.formula);
                let branchCopy = cloneBranch(branch);
                branchCopy.entries.push({ formula: entry.formula.left, value: false, processed: false });
                branchCopy.entries.push({ formula: entry.formula.right, value: false, processed: false });
                branchCopy.steps.push(ruleDescription + ": " + translations[lang].assignFalse + " " + displayFormula(entry.formula.left) + " y " + displayFormula(entry.formula.right));
                newBranches = expandBranch(branchCopy, lang);
            }
            break;
        case 'conditional':
            if (entry.value === true) {
                ruleDescription = translations[lang].decomposeConditionalTrue + " " + displayFormula(entry.formula);
                let branchCopy1 = cloneBranch(branch);
                branchCopy1.entries.push({ formula: entry.formula.left, value: false, processed: false });
                branchCopy1.steps.push(ruleDescription + " (rama 1): " + translations[lang].assignFalse + " " + displayFormula(entry.formula.left));
                let branchCopy2 = cloneBranch(branch);
                branchCopy2.entries.push({ formula: entry.formula.right, value: true, processed: false });
                branchCopy2.steps.push(ruleDescription + " (rama 2): " + translations[lang].assignTrue + " " + displayFormula(entry.formula.right));
                newBranches = expandBranch(branchCopy1, lang).concat(expandBranch(branchCopy2, lang));
            } else {
                ruleDescription = translations[lang].decomposeConditionalFalse + " " + displayFormula(entry.formula);
                let branchCopy = cloneBranch(branch);
                branchCopy.entries.push({ formula: entry.formula.left, value: true, processed: false });
                branchCopy.entries.push({ formula: entry.formula.right, value: false, processed: false });
                branchCopy.steps.push(ruleDescription + ": " + translations[lang].assignTrue + " " + displayFormula(entry.formula.left) + " y " + translations[lang].assignFalse + " " + displayFormula(entry.formula.right));
                newBranches = expandBranch(branchCopy, lang);
            }
            break;
        case 'biconditional':
            if (entry.value === true) {
                ruleDescription = translations[lang].decomposeBiconditionalTrue + " " + displayFormula(entry.formula) +
                    " por (( " + displayFormula(entry.formula.left) + "→" + displayFormula(entry.formula.right) + ") ∧ (" +
                    displayFormula(entry.formula.right) + "→" + displayFormula(entry.formula.left) + ")).";
                let branchCopy = cloneBranch(branch);
                branchCopy.entries.push({ formula: Conditional(entry.formula.left, entry.formula.right), value: true, processed: false });
                branchCopy.entries.push({ formula: Conditional(entry.formula.right, entry.formula.left), value: true, processed: false });
                branchCopy.steps.push(ruleDescription);
                newBranches = expandBranch(branchCopy, lang);
            } else {
                ruleDescription = translations[lang].decomposeBiconditionalFalse + " " + displayFormula(entry.formula) +
                    " por (( " + displayFormula(entry.formula.left) + " ∧ ¬" + displayFormula(entry.formula.right) + ") ∨ (¬" +
                    displayFormula(entry.formula.left) + " ∧ " + displayFormula(entry.formula.right) + ")).";
                let branchCopy1 = cloneBranch(branch);
                branchCopy1.entries.push({ formula: And(entry.formula.left, Not(entry.formula.right)), value: true, processed: false });
                branchCopy1.steps.push(ruleDescription + " (rama 1): se asume ( " + displayFormula(entry.formula.left) + " ∧ ¬" + displayFormula(entry.formula.right) + " ) VERDADERO.");
                let branchCopy2 = cloneBranch(branch);
                branchCopy2.entries.push({ formula: And(Not(entry.formula.left), entry.formula.right), value: true, processed: false });
                branchCopy2.steps.push(ruleDescription + " (rama 2): se asume ( ¬" + displayFormula(entry.formula.left) + " ∧ " + displayFormula(entry.formula.right) + " ) VERDADERO.");
                newBranches = expandBranch(branchCopy1, lang).concat(expandBranch(branchCopy2, lang));
            }
            break;
        default:
            newBranches = [branch];
    }
    return newBranches;
}

function displayFormula(formula) {
    switch (formula.type) {
        case 'var':
            return formula.name;
        case 'not':
            return "¬" + displayFormula(formula.sub);
        case 'and':
            return "(" + displayFormula(formula.left) + " ∧ " + displayFormula(formula.right) + ")";
        case 'or':
            return "(" + displayFormula(formula.left) + " ∨ " + displayFormula(formula.right) + ")";
        case 'conditional':
            return "(" + displayFormula(formula.left) + " → " + displayFormula(formula.right) + ")";
        case 'biconditional':
            return "(" + displayFormula(formula.left) + " ↔ " + displayFormula(formula.right) + ")";
        default:
            return "";
    }
}

// Completar ramas abiertas
function completeOpenBranches(branches, ast, lang) {
    let allVars = getVariables(ast);
    let completed = [];
    for (let branch of branches) {
        if (branch.closed) {
            completed.push(branch);
            continue;
        }
        let assigned = {};
        branch.entries.forEach(entry => {
            if (entry.formula.type === 'var') assigned[entry.formula.name] = entry.value;
        });
        let assignedVars = Object.keys(assigned);
        let missing = allVars.filter(v => !assignedVars.includes(v));
        let completeBranches = completeBranch(branch, missing, lang);
        let counterexampleFound = false;
        for (let compBranch of completeBranches) {
            let asg = getAssignment(compBranch);
            if (evalFormula(ast, asg) === false) {
                counterexampleFound = true;
                completed.push(compBranch);
            }
        }
        if (!counterexampleFound) {
            branch.closed = true;
            branch.steps.push(translations[lang].noContradiction);
            completed.push(branch);
        }
    }
    return completed;
}

// Función principal para resolver la fórmula
function solveFormula() {
    const input = document.getElementById("formulaInput").value;
    const lang = document.getElementById("language").value;
    let ast;
    try {
        ast = parseFormula(input);
    } catch (e) {
        document.getElementById("result").innerHTML = "<p style='color:red;'>Error al parsear la fórmula: " + e.message + "</p>";
        return;
    }
    let initialBranch = {
        entries: [{ formula: ast, value: false, processed: false }],
        steps: [translations[lang].supposeFalse + " " + displayFormula(ast) + " " + translations[lang].isFalse],
        closed: false
    };
    let branches = expandBranch(initialBranch, lang);
    branches = completeOpenBranches(branches, ast, lang);
    let allClosed = branches.every(branch => branch.closed);

    displayResults(branches, allClosed, lang);
}

// Función para mostrar resultados con animación secuencial
function displayResults(branches, allClosed, lang) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const header = document.createElement("h2");
    header.textContent = allClosed ? translations[lang].validFormula : translations[lang].invalidFormula;
    resultDiv.appendChild(header);

    if (!allClosed) {
        const p = document.createElement("p");
        p.textContent = translations[lang].counterexample;
        resultDiv.appendChild(p);
    }

    branches.forEach((branch, index) => {
        if (branch.closed || (!branch.closed && !allClosed)) {
            setTimeout(() => {
                const branchElement = displayBranch(branch, index, lang);
                resultDiv.appendChild(branchElement);
            }, index * 300); // 300ms de retraso entre cada rama
        }
    });
}

// Función auxiliar para crear el elemento que muestra una rama
function displayBranch(branch, index, lang) {
    const stepDiv = document.createElement("div");
    stepDiv.classList.add("step", branch.closed ? "closed" : "open");

    const title = document.createElement("strong");
    title.textContent = `Rama ${index + 1} (${branch.closed ? "Cerrada" : "Abierta"}):`;
    stepDiv.appendChild(title);

    branch.steps.forEach(step => {
        const stepParagraph = document.createElement("p");
        stepParagraph.innerHTML = step;
        stepDiv.appendChild(stepParagraph);
    });

    if (!branch.closed) {
        const assignHeader = document.createElement("strong");
        assignHeader.textContent = "Asignaciones:";
        stepDiv.appendChild(document.createElement("br"));
        stepDiv.appendChild(assignHeader);
        const atoms = getAssignment(branch);
        for (let v in atoms) {
            const assignParagraph = document.createElement("p");
            assignParagraph.textContent = `${v} = ${atoms[v] ? "VERDADERO" : "FALSO"}`;
            stepDiv.appendChild(assignParagraph);
        }
    }
    return stepDiv;
}