// 1. Crear el contenedor principal y estilos básicos
const container = document.createElement('div');
container.style.cssText = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 30px;
    max-width: 450px;
    margin: 50px auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
`;

// 2. Título
const title = document.createElement('h2');
title.innerText = 'Subir a File.io';
container.appendChild(title);

// 3. Crear el formulario
const form = document.createElement('form');

// Input de archivo
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.name = 'file'; // Importante: file.io espera el campo con nombre 'file'
fileInput.style.display = 'block';
fileInput.style.margin = '20px auto';

// Botón de envío
const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.innerText = 'Subir Archivo';
submitBtn.style.cssText = `
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
`;

form.appendChild(fileInput);
form.appendChild(submitBtn);
container.appendChild(form);

// 4. Área para mostrar el resultado (donde saldrá el link)
const resultDiv = document.createElement('div');
resultDiv.style.marginTop = '20px';
container.appendChild(resultDiv);

// 5. Inyectar al body
document.body.appendChild(container);

// 6. Lógica de envío
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    // Limpiar resultado anterior y mostrar estado de carga
    resultDiv.innerHTML = '<p style="color: #666;">Subiendo archivo...</p>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Petición POST a file.io
        const response = await fetch('https://file.io', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Mostrar el link en pantalla
            resultDiv.innerHTML = `
                <p style="color: green; font-weight: bold;">¡Subida con éxito!</p>
                <p>Tu archivo se borrará después de la primera descarga:</p>
                <a href="${data.link}" target="_blank" style="word-break: break-all; color: #007bff;">
                    ${data.link}
                </a>
            `;
        } else {
            throw new Error(data.message || 'Error al subir');
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
});
