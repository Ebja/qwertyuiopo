// 1. Crear interfaz básica
document.body.innerHTML = '';
document.body.style.cssText = 'background:#111; color:#eee; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;';

const card = document.createElement('div');
card.style.cssText = 'background:#222; padding:30px; border-radius:15px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5); width:350px; border:1px solid #444;';

card.innerHTML = `
    <h2 style="margin-top:0; color:#00ffcc;">Subidor Directo</h2>
    <p style="font-size:12px; color:#888;">Servicio: Uguu.se (Temporal - 24h)</p>
    <input type="file" id="archivo" style="margin:20px 0; width:100%;">
    <button id="btn" style="width:100%; padding:10px; background:#00ffcc; color:#000; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">SUBIR ARCHIVO</button>
    <div id="resultado" style="margin-top:20px; font-size:14px; word-break:break-all;"></div>
`;

document.body.appendChild(card);

const btn = document.getElementById('btn');
const input = document.getElementById('archivo');
const resultado = document.getElementById('resultado');

// 2. Lógica de subida
btn.onclick = async () => {
    if (!input.files[0]) return alert("Elige un archivo");

    btn.disabled = true;
    btn.innerText = "Subiendo...";
    resultado.innerHTML = "⏳ Conectando...";

    const formData = new FormData();
    formData.append('files[]', input.files[0]); // Uguu requiere el nombre 'files[]'

    try {
        // Petición directa a la API de Uguu
        const response = await fetch('https://uguu.se/upload.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Error en el servidor");

        const data = await response.json();

        // Uguu devuelve un array de archivos
        const link = data.files[0].url;

        resultado.innerHTML = `
            <div style="background:#333; padding:10px; border-radius:5px; border:1px solid #00ffcc;">
                <p style="color:#00ffcc; margin:0 0 5px 0;">¡Subido!</p>
                <a href="${link}" target="_blank" style="color:#fff; text-decoration:none; font-size:12px;">${link}</a>
            </div>
        `;
    } catch (err) {
        console.error(err);
        resultado.innerHTML = `<span style="color:#ff4444;">❌ Error de red. Prueba desactivando el AdBlock.</span>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "SUBIR ARCHIVO";
    }
};
