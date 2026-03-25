let linkComprobante = "No subido"; // Variable global

// --- CONFIGURACIÓN DE DATOS ---
const DATOS_PAGO = {
    titular: "Franklin Rogelio Flores",
    numero: "78914558",
    qr: "img/qr.png",
    whatsappAdmin: "59178914558" // Tu número de WhatsApp aquí
};

const JUEGOS = [
    { id: "ff", nombre: "FREE FIRE", img: "img/ff.png", paquetes: [{ n: "100+10 💎", p: "13 Bs" }, { n: "310+31 💎", p: "38 Bs" }, { n: "520+52 💎", p: "55 Bs" }, { n: "1060+106 💎", p: "100 Bs" }, { n: "2180+218 💎", p: "195 Bs" }, { n: "5600+560 💎", p: "460 Bs" }, { n: "Tarjeta Basica", p: "6 Bs" }, { n: "Tarjeta Semanal", p: "20 Bs" }, { n: "Tarjeta Mensual", p: "85 Bs" }] },
    { id: "ml", nombre: "MOBILE LEGENDS", img: "img/mlbb.png", requiereZona: true, paquetes: [{ n: "50 💎", p: "10 Bs" }, { n: "78+8 💎", p: "18 Bs" }, { n: "156+16 💎", p: "30 Bs" }, { n: "234+23 💎", p: "45 Bs" }, { n: "625+81 💎", p: "110 Bs" }, { n: "1860+335 💎", p: "320 Bs" }, { n: "399+589 💎", p: "510 Bs" }, { n: "Pase Crepúsculo", p: "90 Bs" }] },
    { id: "gs", nombre: "GENSHIN IMPACT", img: "img/gs.png", requiereRegion: true, paquetes: [{ n: "60 🌙", p: "15 Bs" }, { n: "120 🌙", p: "30 Bs" }, { n: "300+30 🌙", p: "70 Bs" }, { n: "600+60 🌙", p: "140 Bs" }, { n: "980+110 🌙", p: "180 Bs" }, { n: "1980+260 🌙", p: "360 Bs" }, { n: "3280+600 🌙", p: "550 Bs" }, { n: "Bendición Lunar", p: "65 Bs" }] },
    { id: "pg", nombre: "PUBG MOBILE", img: "img/pubg.jpg", paquetes: [{ n: "60 💵", p: "15 Bs" }, { n: "120 💵", p: "30 Bs" }, { n: "300+25 💵", p: "80 Bs" }, { n: "600+60 💵", p: "115 Bs" }, { n: "900+85 💵", p: "240 Bs" }, { n: "1500+300 💵", p: "300 Bs" }] }
];

let sel = { juego: null, paquete: null, metodo: null, id: "", nick: "", extra: "" };

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("contenedor-juegos");
    grid.innerHTML = JUEGOS.map(j => `
        <div class="card-juego" onclick="abrirFormulario('${j.id}')">
            <img src="${j.img}" onerror="this.src='https://via.placeholder.com/150?text=LOGO'">
            <div style="font-size: 12px; font-weight: bold;">${j.nombre}</div>
        </div>
    `).join('');
});

function abrirFormulario(id) {
    sel.juego = JUEGOS.find(j => j.id === id);
    document.getElementById("vista-catalogo").classList.add("hidden");
    document.getElementById("vista-formulario").classList.remove("hidden");

    document.getElementById("logo-juego-contenedor").innerHTML = `<img src="${sel.juego.img}" style="width:70px; display:block; margin: 0 auto 15px; border-radius:10px;">`;
    document.getElementById("zona-jugador").classList.toggle("hidden", !sel.juego.requiereZona);
    document.getElementById("region-jugador").classList.toggle("hidden", !sel.juego.requiereRegion);

    const pGrid = document.getElementById("grid-paquetes");
    pGrid.innerHTML = sel.juego.paquetes.map((p, i) => `
        <div class="pack-box" id="p-${i}" onclick="seleccionarPaquete(${i})">
            <div style="font-size:12px">${p.n}</div>
            <div style="color:#00f2ff; font-weight:bold">${p.p}</div>
        </div>
    `).join('');
}

function seleccionarPaquete(idx) {
    sel.paquete = sel.juego.paquetes[idx];
    document.querySelectorAll(".pack-box").forEach(el => el.classList.remove("selected"));
    document.getElementById(`p-${idx}`).classList.add("selected");
}

function seleccionarMetodo(m) {
    sel.metodo = m;
    document.getElementById("btn-qr").classList.toggle("selected", m === 'QR Simple');
    document.getElementById("btn-tigo").classList.toggle("selected", m === 'Tigo Money');
}

function procesarSolicitud() {
    sel.id = document.getElementById("id-jugador").value;
    sel.nick = document.getElementById("nick-jugador").value || "No especificado";
    const zona = document.getElementById("zona-jugador").value;
    const region = document.getElementById("region-jugador").value;

    if (!sel.id || !sel.paquete || !sel.metodo) return alert("⚠️ Completa ID, Paquete y Método de Pago.");

    // Guardar dato extra (Zona o Región)
    sel.extra = sel.juego.requiereZona ? `(Zona: ${zona})` : (sel.juego.requiereRegion ? `(Región: ${region})` : "");

    document.getElementById("vista-formulario").classList.add("hidden");
    document.getElementById("vista-ticket").classList.remove("hidden");

    // RESUMEN EN PANTALLA
    document.getElementById("resumen-ticket").innerHTML = `
        <p><b>Juego:</b> ${sel.juego.nombre}</p>
        <p><b>ID Usuario:</b> ${sel.id} ${sel.extra}</p>
        <p><b>Nickname:</b> ${sel.nick}</p>
        <p><b>Paquete:</b> ${sel.paquete.n}</p>
        <p><b>Método de Pago:</b> ${sel.metodo}</p>
        <h3 style="color:#00f2ff; margin-top:10px;">TOTAL: ${sel.paquete.p}</h3>
    `;

    mostrarInfoPago();
}

function mostrarInfoPago() {
    const info = document.getElementById("info-pago-ticket");
    if (sel.metodo === "Tigo Money") {
        info.innerHTML = `
            <div class="detalle-box-v2">
                <p style="font-size:13px; opacity:0.7">Transferir a Tigo Money:</p>
                <div class="pago-row">
                    <span>${DATOS_PAGO.numero}</span>
                    <button class="btn-copiar-mini" onclick="copiar()">COPIAR</button>
                </div>
                <p style="font-size:13px; margin-top:5px; opacity:0.7">Titular: ${DATOS_PAGO.titular}</p>
            </div>`;
    } else {
        info.innerHTML = `
            <div class="detalle-box-v2" style="text-align:center">
                <p style="font-size:13px; opacity:0.7">Escanea el QR de Pago:</p>
                <img src="${DATOS_PAGO.qr}" style="width:220px; margin:10px 0; border:2px solid white; border-radius:10px;">              
                <p style="font-size:15px; margin-top:3px; opacity:0.7; font-family: 'Calibri Light'">Titular: ${DATOS_PAGO.titular}</p>
                <button class="btn-copiar-mini" onclick="window.open('${DATOS_PAGO.qr}')">DESCARGAR QR</button>
            </div>`;
    }
}

// 1. Función para mostrar la imagen apenas se selecciona
function mostrarVistaPrevia(event) {
    const input = event.target;
    const preview = document.getElementById('img-preview');
    const contenedor = document.getElementById('contenedor-preview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            contenedor.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// 2. Función de Envío Unificada (Subida + WhatsApp)
async function enviarWA() {
    const fileInput = document.getElementById('input-comprobante');
    const status = document.getElementById('status-carga');

    // Validación: ¿Hay una imagen seleccionada?
    if (!fileInput.files[0]) {
        alert("⚠️ Por favor, selecciona la foto de tu comprobante antes de enviar.");
        return;
    }

    // Bloqueamos el proceso para mostrar que está trabajando
    status.innerText = "⏳ Procesando pago y enviando...";
    status.style.color = "#ffaa00";

    try {
        // --- PASO A: Subir a ImgBB ---
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        
        const apiKey = '931f3087d3af8ac699d28ca6d839c02e'; // Reemplaza con tu llave real
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if (!data.success) throw new Error("Error al subir imagen");
        
        const linkFoto = data.data.url;

        // --- PASO B: Guardar en Firebase (Opcional) ---
        const datosParaDB = {
            juego: sel.juego.nombre,
            id_jugador: sel.id,
            nickname: sel.nick,
            paquete: sel.paquete.n,
            precio: sel.paquete.p,
            comprobante: linkFoto,
            fecha: new Date().toLocaleString()
        };
        if (window.guardarPedidoFB) await window.guardarPedidoFB(datosParaDB);

        // --- PASO C: Construir Mensaje y Abrir WhatsApp ---
        const mensaje = `*SOLICITUD DE RECARGA*%0A` +
            `*Juego:* ${sel.juego.nombre}%0A` +
            `*ID:* ${sel.id}%0A` +
            `*Nick:* ${sel.nick}%0A` +
            `*Paquete:* ${sel.paquete.n}%0A` +
            `*Total:* ${sel.paquete.p}%0A%0A` +
            `*Comprobante:* ${linkFoto}%0A%0A` +
            `_Verificado automáticamente._`;

        const url = `https://wa.me/${DATOS_PAGO.whatsappAdmin}?text=${mensaje}`;
        window.open(url, '_blank');

        // --- PASO D: Interfaz Final ---
        status.innerText = "✅ ¡Enviado!";
        // Ocultar el ticket y mostrar el modal de éxito
        document.getElementById("vista-ticket").classList.add("hidden");
        document.getElementById("modal-final").classList.remove("hidden");

        // IMPORTANTE: Resetear el link para la siguiente vuelta
        window.linkComprobante = "No subido";


    } catch (error) {
        // Si hay error, hay que devolver el botón a su estado normal
        console.error(error);
        status.innerText = "❌ Error al enviar. Intenta de nuevo.";
        alert("Hubo un problema al procesar la imagen. Revisa tu conexión.");
    }
}

function nuevaRecarga() {
    document.getElementById("modal-final").classList.add("hidden");
    
    // Limpiamos todo y volvemos al catálogo principal
    document.getElementById("vista-formulario").classList.remove("hidden");
    
    // Reset de inputs y vista previa
    if(document.getElementById("input-id")) document.getElementById("input-id").value = "";
    document.getElementById("contenedor-preview").style.display = 'none';
    document.getElementById("input-comprobante").value = "";
    window.linkComprobante = "No subido";
    
    window.scrollTo(0,0);
}

function finalizarTodo() {
    // Simplemente recarga la página para limpiar toda la memoria de la App
    location.reload();
}




// Función para la X del Formulario
function cerrarFormulario() {
    // 1. Ocultar el formulario (ajusta el ID si el tuyo es diferente)
    document.getElementById("vista-formulario").classList.add("hidden");
    
    // 2. Mostrar la galería de juegos inicial
    document.getElementById("vista-catalogo").classList.remove("hidden");
    
    // 3. Resetear el scroll al inicio
    window.scrollTo(0,0);
}



// Función para la X del Ticket
function cerrarTicket() {
    // 1. Ocultar el ticket
    document.getElementById("vista-ticket").classList.add("hidden");
    
    // 2. Regresar al formulario (por si el usuario quiere corregir el ID o Nick)
    document.getElementById("vista-formulario").classList.remove("hidden");
    
    // 3. Opcional: Limpiar la vista previa del comprobante si quieres que lo suba de nuevo
    const preview = document.getElementById("contenedor-preview");
    if (preview) preview.style.display = 'none';
    document.getElementById("input-comprobante").value = "";
}