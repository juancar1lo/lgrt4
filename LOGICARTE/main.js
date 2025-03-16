// Función para cargar de forma dinámica el contenido del módulo
async function loadModule(modulePath) {
    try {
        const response = await fetch(modulePath + '/index.html');
        if (!response.ok) throw new Error("Error al cargar el módulo " + modulePath);
        const html = await response.text();
        document.getElementById('content').innerHTML = html;

        // Cargar dinámicamente el script propio del módulo
        const script = document.createElement('script');
        script.src = modulePath + '/script.js';
        script.defer = true;
        document.body.appendChild(script);
    } catch (error) {
        document.getElementById('content').innerHTML = '<p>Error: ' + error.message + '</p>';
    }
}

// Asignación de eventos a los botones del menú
document.getElementById('btnConceptos').addEventListener('click', () => {
    loadModule('./modulos/conceptos');
});

document.getElementById('btnTablas').addEventListener('click', () => {
    loadModule('./modulos/tablas');
});

document.getElementById('btnReduccion').addEventListener('click', () => {
    loadModule('./modulos/reduccion');
});

document.getElementById('btnDeduccion').addEventListener('click', () => {
    loadModule('./modulos/deduccion');
});