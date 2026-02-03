// 1. Limpiamos cualquier cosa previa
document.body.innerHTML = '';
document.body.style.cssText = 'margin: 0; padding: 0; background-color: #f0f2f5; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;';

// 2. Creamos la tarjeta central
const card = document.createElement('div');
card.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 90%;
    max-width: 400px;
    text-align: center;
`;

// 3. Título e instrucciones
const title = document.createElement('h2');
title.innerText = 'Subida de Archivos';
title.style.color = '#333';

const subtitle = document.createElement('p');
subtitle.innerText = 'Servidor: Pixeldrain (Compatible con GitHub Pages)';
subtitle.style.fontSize = '12px';
subtitle.style.color = '#777';
subtitle.style.marginBottom = '20px';

// 4. Input y Botón
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.marginBottom = '15px';
fileInput.style.width = '100%';

const uploadBtn = document.createElement('button');
uploadBtn.innerText = 'Subir Archivo';
uploadBtn.style.cssText = `
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    transition: background 0.3s;
`;

// 5. Contenedor de resultados
const statusDiv = document.createElement('div');
statusDiv.style.marginTop = '20px';
statusDiv.style.wordBreak = 'break-all'; // Para que el link no rompa el diseño

// Ensamblar
card.appendChild(title);
card.appendChild(subtitle);
card.appendChild(fileInput);
card.appendChild(uploadBtn);
card.appendChild(statusDiv);
document.body.appendChild(card);

// 6. Lógica "Arreglada" usando Pixeldrain
uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    
    if (!file) {
        alert("¡Selecciona un archivo primero!");
        return;
    }

    // Estado de carga
    uploadBtn.disabled = true;
    uploadBtn.innerText = 'Subiendo... espere';
    uploadBtn.style.backgroundColor = '#6c757d';
    statusDiv.innerHTML = '<p style="color: blue;">⏳ Enviando datos a la nube...</p>';

    const formData = new FormData();
    formData.append('file', file); // Pixeldrain también usa el campo 'file'

    try {
        // CAMBIO CLAVE: Usamos la API de Pixeldrain
        const response = await fetch('https://pixeldrain.com/api/file', {
            method: 'POST',
            body: formData
            // Pixeldrain tiene cabeceras CORS muy permisivas, ideal para JS puro
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            const link = `https://pixeldrain.com/u/${data.id}`;
            
            statusDiv.innerHTML = `
                <div style="background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; border: 1px solid #c3e6cb;">
                    <strong>¡Subido con éxito!</strong><br><br>
                    <a href="${link}" target="_blank" style="color: #007bff; font-weight: bold;">${link}</a>
                </div>
            `;
        } else {
            throw new Error('La API no devolvió éxito.');
        }

    } catch (error) {
        console.error(error);
        statusDiv.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; border: 1px solid #f5c6cb;">
                <strong>Error:</strong> No se pudo subir.<br>
                <small>${error.message}</small>
            </div>
        `;
    } finally {
        // Restaurar botón
        uploadBtn.disabled = false;
        uploadBtn.innerText = 'Subir Archivo';
        uploadBtn.style.backgroundColor = '#007bff';
    }
});
