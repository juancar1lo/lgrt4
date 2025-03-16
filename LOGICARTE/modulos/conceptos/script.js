// Función para desplegar u ocultar contenido con transiciones dinámicas
function toggleContent(id) {
    // Cerrar todos los containers que no sean el actual
    document.querySelectorAll(".concept-content").forEach(cont => {
        if (cont.id !== id) {
            cont.style.maxHeight = "0px";
            cont.classList.remove("open");
            const btn = document.querySelector(`button[onclick="toggleContent('${cont.id}')"]`);
            if (btn) {
                btn.setAttribute("aria-expanded", "false");
            }
        }
    });
    // Alternar el container actual
    const content = document.getElementById(id);
    const button = document.querySelector(`button[onclick="toggleContent('${id}')"]`);
    if (content.classList.contains("open")) {
        // Cerrar
        content.style.maxHeight = "0px";
        content.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
    } else {
        // Abrir: se establece maxHeight al scrollHeight real del contenido
        content.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
        button.setAttribute("aria-expanded", "true");
    }
}

// Traducciones para retroalimentación en español y euskera
const feedbackTranslations = {
    es: {
        correct: "¡Correcto!",
        incorrect: "Incorrecto. Intenta de nuevo."
    },
    eu: {
        correct: "Zuzen!",
        incorrect: "Okerra. Saiatu berriro."
    }
};

// Variable para el idioma actual
let currentLang = 'es'; // Idioma por defecto

// Función para cambiar el idioma
function changeLanguage(lang) {
    currentLang = lang;
    // Cambiar visibilidad del título principal
    document.getElementById('main-title-es').style.display = lang === 'es' ? 'block' : 'none';
    document.getElementById('main-title-eu').style.display = lang === 'eu' ? 'block' : 'none';

    // Cambiar visibilidad de los botones con id que terminan en -es o -eu
    document.querySelectorAll('[id^=button-]').forEach(button => {
        if (button.id.endsWith('-es')) {
            button.style.display = lang === 'es' ? 'inline' : 'none';
        } else if (button.id.endsWith('-eu')) {
            button.style.display = lang === 'eu' ? 'inline' : 'none';
        }
    });

    // Cambiar visibilidad de los textos de contenido
    document.querySelectorAll('[id$=-text-es], [id$=-intro-es]').forEach(el => {
        el.style.display = lang === 'es' ? 'block' : 'none';
    });
    document.querySelectorAll('[id$=-text-eu], [id$=-intro-eu]').forEach(el => {
        el.style.display = lang === 'eu' ? 'block' : 'none';
    });

    // Cambiar visibilidad de los contenedores específicos
    document.querySelectorAll('[id$=-es]').forEach(el => {
        if (!el.classList.contains('check-btn')) {
            el.style.display = lang === 'es' ? 'block' : 'none';
        }
    });
    document.querySelectorAll('[id$=-eu]').forEach(el => {
        if (!el.classList.contains('check-btn')) {
            el.style.display = lang === 'eu' ? 'block' : 'none';
        }
    });

    // Cambiar visibilidad del footer
    document.getElementById('footer-es').style.display = lang === 'es' ? 'block' : 'none';
    document.getElementById('footer-eu').style.display = lang === 'eu' ? 'block' : 'none';

    // Actualizar placeholders según el idioma
    document.querySelectorAll('.ejercicio input').forEach(input => {
        input.placeholder = lang === 'es' ? 'Escribe tu respuesta' : 'Idatzi zure erantzuna';
    });
    document.querySelectorAll('.ejercicio select option[value=""]').forEach(option => {
        option.text = lang === 'es' ? 'Selecciona una opción' : 'Hautatu aukera bat';
    });

    // Actualizar los textos de los botones de comprobación (check-btn)
    document.querySelectorAll('.check-btn').forEach(btn => {
        btn.textContent = currentLang === 'es' ? btn.getAttribute('data-es') : btn.getAttribute('data-eu');
    });
}

// Función para insertar símbolos en el campo de entrada
function insertSymbol(symbol, idInput) {
    const input = document.getElementById(idInput);
    input.value += symbol;
    input.focus();
}

// Función para comprobar la respuesta de entrada libre
function comprobarRespuesta(idInput, respuestaCorrecta, feedbackId) {
    const entrada = document.getElementById(idInput).value.trim();
    const feedback = document.getElementById(feedbackId);
    if (entrada === respuestaCorrecta) {
        feedback.textContent = feedbackTranslations[currentLang].correct;
        feedback.style.color = "green";
    } else {
        feedback.textContent = feedbackTranslations[currentLang].incorrect;
        feedback.style.color = "red";
    }
}

// Función para comprobar la respuesta de tipo test
function comprobarRespuestaTest(idSelect, respuestaCorrecta, feedbackId) {
    const seleccion = document.getElementById(idSelect).value;
    const feedback = document.getElementById(feedbackId);
    if (seleccion === respuestaCorrecta) {
        feedback.textContent = feedbackTranslations[currentLang].correct;
        feedback.style.color = "green";
    } else {
        feedback.textContent = feedbackTranslations[currentLang].incorrect;
        feedback.style.color = "red";
    }
}

// Función para borrar el aviso de retroalimentación y limpiar el campo asociado
function clearFeedback(feedbackId) {
    const feedbackElem = document.getElementById(feedbackId);
    if (feedbackElem) {
        feedbackElem.textContent = "";
    }
    // Se asume que el id del campo es el mismo que el del feedback sin el prefijo "feedback-"
    const fieldId = feedbackId.replace("feedback-", "");
    const fieldElem = document.getElementById(fieldId);
    if (fieldElem) {
        if (fieldElem.tagName.toLowerCase() === "input") {
            fieldElem.value = "";
        } else if (fieldElem.tagName.toLowerCase() === "select") {
            fieldElem.selectedIndex = 0;
        }
    }
}

// Establecer idioma por defecto al cargar la página (español)
window.onload = function() {
    changeLanguage('es');
};