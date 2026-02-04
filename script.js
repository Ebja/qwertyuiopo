// 1. Estilos y Estructura (UI limpia)
document.body.innerHTML = '';
document.body.style.cssText = 'margin: 0; background: #121212; color: #e0e0e0; font-family: "Segoe UI", sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;';

const card = document.createElement('div');
card.style.cssText = 'background: #1e1e1e; padding: 2rem; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); width: 90%; max-width: 450px; text-align: center; border: 1px solid #333;';

const title = document.createElement('h2');
title.innerText = 'Subida Cloud (Gofile)';
title.style.color = '#bb86fc';

const input = document.createElement('input');
input.type = 'file';
input.style.cssText = 'margin: 20px 0; width: 100%; color: #bb86fc;';

const btn = document.createElement('button');
btn.innerText = 'Subir Ahora';
btn.style.cssText = 'background: #bb86fc; color: #000; font-weight: bold; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; width: 100%; transition: opacity 0.3s;';

const status = document.createElement('div');
status.style.marginTop = '20px';
status.style.fontSize = '14px';
status.style.wordBreak = 'break-all';

card.appendChild(title);
card.appendChild(input);
card.appendChild(btn);
card.appendChild(status);
document.body.appendChild(card);

// 2. Lógica de Gofile (Paso 1: Buscar Servidor -> Paso 2: Subir)
btn.addEventListener('click', async () => {
    const file = input.files[0];
    if (!file) return alert('Selecciona un archivo');

    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.innerText = 'Conectando con servidor...';
    status.innerHTML = '<span style="color: yellow;">🔄 Obteniendo servidor disponible...</span>';

    try {
        // PASO 1: Pedir a Gofile qué servidor usar (evita CORS y 401)
        const serverReq = await fetch('https://api.gofile.io/getServer');
        const serverData = await serverReq.json();

        if (serverData.status !== 'ok') throw new Error('No hay servidores disponibles');
        
        const serverToUse = serverData.data.server;
        console.log(`Usando servidor: ${serverToUse}`);

        // PASO 2: Subir el archivo a ese servidor específico
        btn.innerText = 'Subiendo archivo...';
        status.innerHTML = `<span style="color: cyan;">⬆️ Subiendo a ${serverToUse}...</span>`;

        const formData = new FormData();
        formData.append('file', file);

        const uploadUrl = `https://${serverToUse}.gofile.io/uploadFile`;
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'ok') {
            const downloadLink = result.data.downloadPage;
            status.innerHTML = `
                <div style="background: #2e7d32; color: white; padding: 10px; border-radius: 5px; margin-top: 10px;">
                    <strong>✅ ¡ÉXITO!</strong><br><br>
                    <a href="${downloadLink}" target="_blank" style="color: #fff; font-weight: bold; text-decoration: underline;">${downloadLink}</a>
                </div>
            `;
        } else {
            throw new Error('Falló la subida final.');
        }

    } catch (error) {
        console.error(error);
        status.innerHTML = `<p style="color: #cf6679;">❌ Error: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerText = 'Subir Ahora';
    }
});
