// 1. Limpieza inicial
document.body.innerHTML = '';
document.body.style.cssText = 'margin: 0; background-color: #2d3436; font-family: "Courier New", monospace; display: flex; justify-content: center; align-items: center; height: 100vh; color: white;';

// 2. Crear la tarjeta (Estilo Terminal/Hacker)
const card = document.createElement('div');
card.style.cssText = `
    background: #000;
    padding: 2rem;
    border: 1px solid #00b894;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 184, 148, 0.4);
    width: 90%;
    max-width: 450px;
    text-align: center;
`;

// 3. Elementos
const title = document.createElement('h2');
title.innerText = '> UPLOAD_SYSTEM';
title.style.color = '#00b894';
title.style.marginTop = '0';

const instructions = document.createElement('p');
instructions.innerText = 'Servidor: transfer.sh (Método PUT)';
instructions.style.fontSize = '12px';
instructions.style.color = '#b2bec3';

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.cssText = 'margin: 20px 0; color: white; width: 100%;';

const btn = document.createElement('button');
btn.innerText = '[ EJECUTAR SUBIDA ]';
btn.style.cssText = `
    background: transparent;
    color: #00b894;
    border: 1px solid #00b894;
    padding: 10px 20px;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;
    width: 100%;
    transition: all 0.3s;
`;

// Efecto hover simple en JS
btn.onmouseover = () => { btn.style.background = '#00b894'; btn.style.color = 'black'; };
btn.onmouseout = () => { btn.style.background = 'transparent'; btn.style.color = '#00b894'; };

const log = document.createElement('div');
log.style.cssText = 'margin-top: 20px; text-align: left; font-size: 12px; min-height: 50px; word-break: break-all;';
log.innerText = '> Esperando archivo...';

card.appendChild(title);
card.appendChild(instructions);
card.appendChild(fileInput);
card.appendChild(btn);
card.appendChild(log);
document.body.appendChild(card);

// 4. Lógica de subida usando PUT (Más robusto contra CORS)
btn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) {
        log.innerText = '> ERROR: Input vacío.';
        log.style.color = '#ff7675';
        return;
    }

    btn.disabled = true;
    btn.innerText = '[ PROCESANDO... ]';
    log.innerText = '> Iniciando conexión con transfer.sh...';
    log.style.color = '#dfe6e9';

    try {
        // Usamos el nombre del archivo en la URL y el método PUT
        // Esto suele saltarse muchas restricciones que tienen los POST
        const response = await fetch(`https://transfer.sh/${file.name}`, {
            method: 'PUT',
            body: file
        });

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }

        const downloadLink = await response.text(); // transfer.sh devuelve el link como texto plano

        log.innerHTML = `
            <span style="color: #00b894;">> ÉXITO. Archivo transferido.</span><br><br>
            Link de descarga:<br>
            <a href="${downloadLink}" target="_blank" style="color: #74b9ff; text-decoration: none; font-size: 14px;">${downloadLink}</a>
        `;

    } catch (error) {
        console.error(error);
        log.innerHTML = `
            <span style="color: #ff7675;">> FATAL ERROR:</span> ${error.message}<br>
            <span style="color: #fab1a0;">> Posible causa: AdBlocker activo o red restringida.</span>
        `;
    } finally {
        btn.disabled = false;
        btn.innerText = '[ EJECUTAR SUBIDA ]';
    }
};
