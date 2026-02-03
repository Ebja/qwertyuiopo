// 1. Limpiamos el body por si acaso
document.body.innerHTML = '';

const container = document.createElement('div');
container.style.cssText = `
    font-family: sans-serif;
    padding: 40px;
    max-width: 500px;
    margin: 50px auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    text-align: center;
`;

const title = document.createElement('h2');
title.innerText = 'Subidor de Archivos Pro';
container.appendChild(title);

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.margin = '20px 0';

const btn = document.createElement('button');
btn.innerText = 'Subir a la nube';
btn.style.cssText = 'padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;';

const resultDiv = document.createElement('div');
resultDiv.style.marginTop = '20px';

container.appendChild(fileInput);
container.appendChild(document.createElement('br'));
container.appendChild(btn);
container.appendChild(resultDiv);
document.body.appendChild(container);

btn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) return alert("Selecciona un archivo");

    btn.disabled = true;
    btn.innerText = 'Subiendo...';
    resultDiv.innerHTML = '⏳ Procesando envío...';

    const formData = new FormData();
    // Importante: file.io requiere que el nombre sea 'file'
    formData.append('file', file);

    try {
        // Usamos file.io pero con un manejo de errores más claro
        const response = await fetch('https://file.io/?expires=1d', { 
            method: 'POST',
            body: formData
            // Nota: Al usar GitHub Pages, el navegador envía el Header 'Origin'
        });

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <p style="color: green;">✅ ¡Subido!</p>
                <input type="text" value="${data.link}" readonly style="width: 80%; padding: 5px; text-align: center;">
                <p><small>El link expirará en 24h o tras 1 descarga.</small></p>
            `;
        } else {
            throw new Error(data.message || 'Fallo en la subida');
        }
    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = `
            <p style="color: red;">❌ Error de Red</p>
            <p><small>Esto puede ser por un bloqueador de anuncios o restricciones de CORS de la API.</small></p>
        `;
    } finally {
        btn.disabled = false;
        btn.innerText = 'Subir a la nube';
    }
};
