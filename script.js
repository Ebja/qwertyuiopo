// 1. Configuración de la UI (Estilo moderno y limpio)
document.body.innerHTML = '';
document.body.style.cssText = 'margin: 0; background: #0f172a; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, sans-serif;';

const card = document.createElement('div');
card.style.cssText = 'background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); width: 100%; max-width: 400px; text-align: center; border: 1px solid #334155;';

card.innerHTML = `
    <h2 style="color: #38bdf8; margin: 0 0 10px;">Subida Directa</h2>
    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 25px;">Servicio estable vía Catbox.moe</p>
    <input type="file" id="fileInput" style="display: none;">
    <label for="fileInput" style="display: block; padding: 20px; border: 2px dashed #334155; border-radius: 8px; color: #94a3b8; cursor: pointer; margin-bottom: 20px; transition: border-color 0.3s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#334155'">
        Click para seleccionar archivo
    </label>
    <button id="uploadBtn" style="width: 100%; padding: 12px; background: #38bdf8; color: #0f172a; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
        Subir a la Nube
    </button>
    <div id="status" style="margin-top: 25px; min-height: 40px;"></div>
`;

document.body.appendChild(card);

const fileInput = document.getElementById('fileInput');
const btn = document.getElementById('uploadBtn');
const status = document.getElementById('status');

// 2. Lógica de subida a Catbox
btn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) return alert("Selecciona un archivo primero");

    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.innerText = 'Subiendo...';
    status.innerHTML = '<span style="color: #38bdf8;">⏳ Procesando...</span>';

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    try {
        // Usamos un proxy de CORS si es necesario, pero Catbox suele aceptar bien peticiones directas
        const response = await fetch('https://corsproxy.io/?https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Error en la conexión con el servidor');

        // Catbox devuelve directamente el link como TEXTO, no como JSON
        const link = await response.text();

        if (link.startsWith('http')) {
            status.innerHTML = `
                <div style="background: rgba(56, 189, 248, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #38bdf8;">
                    <p style="color: #38bdf8; margin: 0 0 10px; font-size: 14px;">✅ Archivo disponible en:</p>
                    <a href="${link}" target="_blank" style="color: white; font-size: 13px; word-break: break-all;">${link}</a>
                </div>
            `;
        } else {
            throw new Error(link || 'Respuesta inesperada del servidor');
        }

    } catch (err) {
        console.error(err);
        status.innerHTML = `<p style="color: #f87171; font-size: 13px;">❌ Error: ${err.message}.<br>Prueba desactivando tu AdBlock.</p>`;
    } finally {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerText = 'Subir a la Nube';
    }
};
