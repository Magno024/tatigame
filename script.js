let linkComprobante = "No subido"; // Variable global
let desuscribirHistorialFB = null;

// --- CONFIGURACIÓN DE DATOS ---
const DATOS_PAGO = {
    titular: "Franklin R. Flores Castro",
    numero: "78914558",
    qr: "img/qr.png",
    whatsappAdmin: "59178914558" // Tu número de WhatsApp aquí
};
//imagnes y nombres de catalogo de juegos
const JUEGOS = [
    { id: "ff", nombre: "FREE FIRE", img: "img/ff.png", color: '#00b2ff', bg: 'img/fff.jpg', paquetes: [{ n: "100+10 💎", p: "Bs 12.0" }, { n: "310+31 💎", p: "Bs 35.0" }, { n: "520+52 💎", p: "50 Bs" }, { n: "1060+106 💎", p: "90 Bs" }, { n: "2180+218 💎", p: "175 Bs" }, { n: "5600+560 💎", p: "420 Bs" }, { n: "Semanal Basica", p: "6 Bs" }, { n: "Tarjeta Semanal", p: "20 Bs" }, { n: "Tarjeta Mensual", p: "85 Bs" }] },
    { id: "ml", nombre: "MOBILE LEGENDS", img: "img/ml-small.png", color: '#f3ae1a', bg: 'img/fml.png', requiereZona: true, paquetes: [{ n: "50 💎", p: "10 Bs" }, { n: "78+8 💎", p: "16 Bs" }, { n: "156+16 💎", p: "30 Bs" }, { n: "234+23 💎", p: "40 Bs" }, { n: "625+81 💎", p: "110 Bs" }, { n: "1860+335 💎", p: "295 Bs" }, { n: "3099+589 💎", p: "495 Bs" }, { n: "Pase Semanal", p: "20 Bs" }, { n: "Pase Crepuscular", p: "90 Bs" }] },
    { id: "gs", nombre: "GENSHIN IMPACT", img: "img/gs-small.png", color: '#bd28ce', bg: 'img/fml.png', requiereRegion: true, paquetes: [{ n: "60 💠", p: "15 Bs" }, { n: "300+30 💠", p: "50 Bs" }, { n: "980+110 💠", p: "125 Bs" }, { n: "1980+260 💠", p: "250 Bs" }, { n: "3280+600 💠", p: "410 Bs" }, { n: "Bendición Lunar 🌙", p: "50 Bs" }] },
    { id: "pg", nombre: "PUBG MOBILE", img: "img/pubg-small.png", color: '#0a9b9b', bg: 'img/fml.png', paquetes: [{ n: "60 💵", p: "15 Bs" }, { n: "300+25 💵", p: "60 Bs" }, { n: "600+60 💵", p: "110 Bs" }, { n: "1500+300 💵", p: "260 Bs" }] },
    { id: "bl", nombre: "BLOOD STRIKE", img: "img/blood-small.png", color: '#f30f22', bg: 'img/fml.png', paquetes: [{ n: "100+5 🧈", p: "10 Bs" }, { n: "300+20 🧈", p: "28 Bs" }, { n: "500+40 🧈", p: "45 Bs" }, { n: "1000+100 🧈", p: "85 Bs" }, { n: "2000+260 🧈", p: "165 Bs" }, { n: "5000+800 🧈", p: "390 Bs" }] }
];

let sel = { juego: null, paquete: null, metodo: null, id: "", nick: "", extra: "" };

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("contenedor-juegos");
    grid.innerHTML = JUEGOS.map(j => `
        <div class="card-juego" onclick="abrirFormulario('${j.id}')">
            <img src="${j.img}" onerror="this.src='https://via.placeholder.com/150?text=LOGO'">
            <div style="font-size: 12px; font-weight: bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${j.nombre}</div>
        </div>
    `).join('');
});

function abrirFormulario(id) {
    sel.juego = JUEGOS.find(j => j.id === id);

    // Extraemos el color del juego o usamos el cian por defecto
    const colorPrimario = sel.juego.color || '#05d2dd';
    /*
        // 1. CAMBIAR LA IMAGEN DE FONDO DEL BODY, efecto cristal
        if (sel.juego.bg) {
            document.body.style.backgroundImage = `url('${sel.juego.bg}')`;
        }
    */
    // 1. Cambiar color del Título
    const titulo = document.getElementById("titulo-formulario");

    // Forzar el efecto de cristal con el color del juego
    const form = document.getElementById("vista-formulario");
    //form.style.backdropFilter = "blur(0)";
    //form.style.backgroundColor = "rgba(15, 23, 42, 0.7)";
    form.style.border = `1px solid ${sel.juego.color}44`; // Borde sutil del color del juego

    if (titulo) {
        titulo.innerText = sel.juego.nombre;
        titulo.style.color = colorPrimario;
        // Opcional: añade un brillo neón al título
        //titulo.style.textShadow = `0 0 10px ${colorPrimario}`;
    }

    // 2. Cambiar de vista
    document.getElementById("vista-catalogo").classList.add("hidden");
    document.getElementById("vista-formulario").classList.remove("hidden");
    
    // Agregar clase para ocultar footer
    document.body.classList.add("modal-open");

    // 3. Logo de juego seleccionado en formulario y campos
    document.getElementById("logo-juego-contenedor").innerHTML = `
        <img src="${sel.juego.img}" style="width:70px; display:block; margin: 0 auto 15px; border-radius:10px; border: 0px solid ${colorPrimario};">
    `;
    //muestra la imagen en la vista de los paquetes
    //**//document.getElementById("logo-juego-contenedor").innerHTML = `<img src="${sel.juego.img}" style="width:70px; display:block; margin: 0 auto 15px; border-radius:10px;">`;
    //
    document.getElementById("zona-jugador").classList.toggle("hidden", !sel.juego.requiereZona);
    document.getElementById("region-jugador").classList.toggle("hidden", !sel.juego.requiereRegion);

    // 4. Generar paquetes y precios con el color del juego
    const pGrid = document.getElementById("grid-paquetes");
    pGrid.innerHTML = sel.juego.paquetes.map((p, i) => `
        <div class="pack-box" id="p-${i}" onclick="seleccionarPaquete(${i})" style="border-color: ${colorPrimario}44;">
            <div style="font-size:15px; color: #fff;">${p.n}</div>
            <div style="color:${colorPrimario}; font-size:14px; font-weight:bold">${p.p}</div>
        </div>
    `).join('');


    //funcion para que cambie de color el boton comprar ahora
    const btnEnviar = document.querySelector(".btn-v2"); // Asegúrate de que esta sea la clase de tu botón
    if (btnEnviar) {
        btnEnviar.style.backgroundColor = colorPrimario;
        btnEnviar.style.boxShadow = `0 4px 15px ${colorPrimario}66`;
    }

    // Buscamos todos los circulitos de los pasos
    const circulos = document.querySelectorAll('.paso-numero');
    circulos.forEach(circulo => {
        circulo.style.backgroundColor = colorPrimario; // El color del juego
        circulo.style.boxShadow = `0 0 10px ${colorPrimario}aa`; // Brillo neón
    });


    // Creamos un estilo temporal para el efecto Hover con el color del juego paquetes
    let estiloHover = document.getElementById("hover-dinamico");
    if (!estiloHover) {
        estiloHover = document.createElement("style");
        estiloHover.id = "hover-dinamico";
        document.head.appendChild(estiloHover);
    }

    // Aplicamos el color del juego al borde y al brillo cuando pasan el mouse
    estiloHover.innerHTML = `
        /* Efecto para Paquetes y Métodos de Pago */
        .pack-box:hover, .btn-pago:hover {
            border-color: ${colorPrimario} !important;
            box-shadow: 0 0 15px ${colorPrimario}66;
            transform: translateY(-3px);
            background: rgba(255,255,255,0.05);
        }
        .pack-box.selected, .btn-pago.selected {
            border-color: ${colorPrimario} !important;
            background: ${colorPrimario}22 !important;
            box-shadow: 0 0 20px ${colorPrimario}aa;
        }
        /* Color de los bordes iniciales */
        .pack-box, .btn-pago {
            border: 1px solid ${colorPrimario}33;
            transition: all 0.3s ease;
        }
    `;


    const colorBase = sel.juego.color || '#0fd6e0';
    //el if creo que ya no hace nada, lo borre y todo seguia igual
    // Aplicar un ligero resplandor del color del juego al borde del cristal
    const formGlass = document.getElementById("vista-formulario");
    if (formGlass) {
        formGlass.style.boxShadow = `0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 15px ${colorBase}22`;
        formGlass.style.borderColor = `${colorBase}44`;
    }

    // Guardar historial para el botón atrás
    history.pushState({ paso: "formulario" }, "Formulario", "#formulario");
}


function seleccionarPaquete(idx) {
    sel.paquete = sel.juego.paquetes[idx];
    document.querySelectorAll(".pack-box").forEach(el => el.classList.remove("selected"));
    document.getElementById(`p-${idx}`).classList.add("selected");

    // Actualizar la nueva barra inferior
    const txtPack = document.getElementById("resumen-paquete");
    const txtPrice = document.getElementById("resumen-precio");

    if (txtPack && txtPrice) {
        txtPack.innerText = sel.paquete.n; // Nombre: 100 Diamantes
        txtPrice.innerText = sel.paquete.p; // Precio: 13 Bs
    }
}

/*
window.seleccionarPaquete = (idx) => {
    sel.paquete = sel.juego.paquetes[idx];

    const paquetes = document.querySelectorAll(".pack-box");
    
    paquetes.forEach((card, i) => {
        if (i === idx) {
            const colorJuego = sel.juego.color || "#00f2ff";
            
            // EFECTO DE RESPLANDOR (Glow)
            card.style.borderColor = colorJuego;
            // Aplicamos una sombra externa difuminada con el color del juego
            card.style.boxShadow = `0 0 15px ${colorJuego}88, inset 0 0 10px ${colorJuego}33`;
            card.style.backgroundColor = `${colorJuego}15`; // Fondo sutil (15% opacidad)
            card.style.transform = "scale(1.03)"; // Un pequeño salto visual
            card.classList.add("seleccionado");
        } else {
            // RESET
            card.style.borderColor = "#334155"; 
            card.style.boxShadow = "none";
            card.style.backgroundColor = "transparent";
            card.style.transform = "scale(1)";
            card.classList.remove("seleccionado");
        }
    });

    const txtPack = document.getElementById("resumen-paquete");
    const txtPrice = document.getElementById("resumen-precio");
    if(txtPack && txtPrice) {
        txtPack.innerText = sel.paquete.n;
        txtPrice.innerText = sel.paquete.p;
    }
};
*/
function seleccionarMetodo(m) {
    sel.metodo = m;
    document.getElementById("btn-qr").classList.toggle("selected", m === 'QR Simple');
    document.getElementById("btn-tigo").classList.toggle("selected", m === 'Tigo Money');
}
//boton comprar ahora
function procesarSolicitud() {
    sel.id = document.getElementById("id-jugador").value;
    sel.nick = document.getElementById("nick-jugador").value || "No especificado";

    const zona = document.getElementById("zona-jugador").value || "0000";
    const region = document.getElementById("region-jugador").value || "n/a";

    //if (!sel.id || !sel.paquete || !sel.metodo) return mostrarNotificacion("Completa los datos requeridos");

    if (!sel.id) return mostrarNotificacion("Ingresa tu ID");
    if (!sel.paquete) return mostrarNotificacion("Selecciona un paquete");
    if (!sel.metodo) return mostrarNotificacion("Selecciona un Método de Pago");

    // Guardar dato extra (Zona o Región)
    sel.extra = sel.juego.requiereZona ? `(${zona})` : (sel.juego.requiereRegion ? `(${region})` : "");

    //oculta la sección del formulario y muestra la sección del ticket
    document.getElementById("vista-formulario").classList.add("hidden");
    document.getElementById("vista-ticket").classList.remove("hidden");
    
    // Mantener la clase modal-open para seguir ocultando el footer

    // RESUMEN EN PANTALLA
    document.getElementById("resumen-ticket").innerHTML = `
        <div class="ticket-item"><span>Juego:</span> <code>${sel.juego.nombre}</code></div>
        <div class="ticket-item"><span>ID:</span> <code>${sel.id} ${sel.extra}</code></div>
        <div class="ticket-item"><span>Nickname:</span> <code>${sel.nick}</code></div>
        <div class="ticket-item"><span>Paquete:</span> <code>${sel.paquete.n}</code></div>
        <div class="ticket-item"><span>Método de Pago:</span> <code>${sel.metodo}</code></div>
        <div class="ticket-item"><span><h3>TOTAL:</h3></span> <h3>${sel.paquete.p}</h3></div>
    `;

    mostrarInfoPago();
}

function mostrarInfoPago() {
    const info = document.getElementById("info-pago-ticket");
    // Asumiendo que 'sel' viene de tu lógica previa
    if (sel.metodo === "Tigo Money") {
        info.innerHTML = `
        <div class="detalle-box-v2">
            <p style="font-size:13px; opacity:0.7;">Transferir a Tigo Money:</p>
            <div class="pago-row">
                <span>${DATOS_PAGO.numero}</span>
                <button class="btn-copiar-mini" onclick="copiar()">COPIAR</button>
            </div>
            <p style="font-size:13px; margin-top:5px; opacity:0.7;">Titular: ${DATOS_PAGO.titular}</p>
        </div>`;
    } else {
        info.innerHTML = `
        <div class="detalle-box-v2" style="text-align:center">
            <p style="font-size:13px; opacity:0.7">Escanea el QR y realiza el Pago:</p>
            <img src="${DATOS_PAGO.qr}" style="width:220px; margin:10px 0; border:2px solid white; border-radius:10px;">
            <p style="font-size:13px; margin-top:3px; opacity:0.7;">Titular: ${DATOS_PAGO.titular}</p>
            <button class="btn-copiar-mini" onclick="descargarQR()">DESCARGAR QR</button>
        </div>`;
    }

    const colorJuego = sel.juego.color || '#00f2ff';
    const vistaTicket = document.getElementById("vista-ticket");

    // Cambiar el borde superior del ticket o de la tarjeta
    if (vistaTicket) {
        vistaTicket.style.borderTop = `5px solid ${colorJuego}`;

        // título detalle compra del ticket:
        const tituloTicket = vistaTicket.querySelector('h2');
        if (tituloTicket) tituloTicket.style.color = colorJuego;

        // total del ticket:
        const totalTicket = vistaTicket.querySelector('h3');
        if (totalTicket) totalTicket.style.color = colorJuego;
    }

    // El botón de "Enviar por WhatsApp" también debe combinar
    const btnWhatsApp = document.querySelector(".btn-whatsapp");
    if (btnWhatsApp) {
        btnWhatsApp.style.backgroundColor = colorJuego;
    }

    // El botón de "copiar mini" también debe combinar
    const btncopiarmini = document.querySelector(".btn-copiar-mini");
    if (btncopiarmini) {
        btncopiarmini.style.backgroundColor = colorJuego;
    }

    // OTRO PASO EN EL HISTORIAL:
    history.pushState({ paso: "ticket" }, "Ticket", "#ticket");
}

// Función para copiar el número al portapapeles
function copiar() {
    navigator.clipboard.writeText(DATOS_PAGO.numero).then(() => {
        mostrarNotificacion("¡Número copiado!");
    });
}


// Función para descargar el QR
function descargarQR() {
    const link = document.createElement('a');
    link.href = DATOS_PAGO.qr;
    link.download = 'QR_Pago.png'; // Nombre con el que se guardará
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarNotificacion("¡Descarga Completa!");
}

// Función para mostrar el mensaje temporal
function mostrarNotificacion(mensaje) {
    // Creamos un pequeño elemento flotante
    const aviso = document.createElement("div");
    aviso.textContent = mensaje;
    aviso.className = "aviso-temporal";
    document.body.appendChild(aviso);

    // Desaparece después de 2 segundos
    setTimeout(() => {
        aviso.classList.add("ocultar");
        setTimeout(() => aviso.remove(), 500);
    }, 2000);
}


// 1. Función para mostrar la imagen apenas se selecciona
function mostrarVistaPrevia(event) {
    const input = event.target;
    const preview = document.getElementById('img-preview');
    const contenedor = document.getElementById('contenedor-preview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            contenedor.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

//FINALIZAR RECARGA
async function finalizarRecarga() {
    const fileInput = document.getElementById('input-comprobante');
    const status = document.getElementById('status-carga');
    const btnEnvio = document.querySelector(".btn-enviar-wa");

    if (!fileInput.files[0]) {
        mostrarNotificacion("¡Adjuntar comprobante de pago!");
        return;
    }

    // Feedback inicial
    status.innerText = "⏳ Subiendo comprobante y registrando...";
    status.style.color = "#f3ae1a";
    if (btnEnvio) btnEnvio.disabled = true;

    try {
        // --- PASO A: Subir comprobante ---
        const linkFoto = await window.subirArchivoFB(fileInput.files[0]);

        // --- PASO B: Preparar los datos ---
        const zonaML = document.getElementById("zona-jugador")?.value || null;
        const regionGenshin = document.getElementById("region-jugador")?.value || null;

        const datosParaDB = {
            juego: sel.juego.nombre,
            id_jugador: sel.id,
            id_zona: zonaML,
            region: regionGenshin,
            nickname: sel.nick,
            paquete: sel.paquete.n,
            precio: sel.paquete.p,
            metodo: sel.metodo,
            comprobante: linkFoto,
            fecha: new Date().toLocaleString(),
            estado: "Pendiente",
            idPedido: "REC-" + Math.random().toString(36).substr(2, 6).toUpperCase()
        };

        // --- PASO C: Guardar en Firebase ---
        // Usamos la función global que ya tienes configurada
        if (window.guardarPedidoFB) {
            await window.guardarPedidoFB(datosParaDB);
        } else {
            // Backup por si la función global no está disponible
            const dbRef = ref(getDatabase(), 'pedidos/' + datosParaDB.idPedido);
            await set(dbRef, datosParaDB);
        }

        // --- PASO D: Interfaz Final ---
        // Eliminamos status.innerText porque aquí ya cambiamos de pantalla
        //alert("¡Pedido enviado con éxito!");

        // Ocultar ticket y mostrar modal de éxito
        document.getElementById("vista-ticket").classList.add("hidden");
        document.getElementById("modal-final").classList.remove("hidden");
        
        // Mantener la clase modal-open para seguir ocultando el footer

        // Guardar localmente
        if (typeof guardarEnHistorialLocal === "function") {
            guardarEnHistorialLocal(datosParaDB);
        }

    } catch (error) {
        console.error("Error en el proceso:", error);
        status.innerText = "❌ Error al procesar.";
        status.style.color = "red";
        if (btnEnvio) btnEnvio.disabled = false;
        alert("Hubo un problema. Intenta de nuevo.");
    }
}



/*
//finalizar recarga
async function finalizarRecarga() {
    const fileInput = document.getElementById('input-comprobante');
    const status = document.getElementById('status-carga');
    const btnEnvio = document.querySelector(".btn-enviar-wa"); //creo que se cambio el nombre a btn-whatsapp pero aun asi funciona

    if (!fileInput.files[0]) {
        mostrarNotificacion("Adjuntar comprobante de pago!");
        //alert("⚠️ Selecciona la foto del comprobante de pago antes de enviar.");
        return;
    }

    status.innerText = "⏳ Subiendo comprobante y registrando...";
    status.style.color = "#f3ae1a";
    if (btnEnvio) btnEnvio.disabled = true;

    try {
        // --- PASO A: Subir a Firebase Storage ---
        const linkFoto = await window.subirArchivoFB(fileInput.files[0]);

        // --- PASO B: Preparar los datos ---
        const zonaML = document.getElementById("zona-jugador") ? document.getElementById("zona-jugador").value : null;
        const regionGenshin = document.getElementById("region-jugador") ? document.getElementById("region-jugador").value : null;

        const datosParaDB = {
            juego: sel.juego.nombre,
            id_jugador: sel.id,
            id_zona: zonaML,
            region: regionGenshin,
            nickname: sel.nick,
            paquete: sel.paquete.n,
            precio: sel.paquete.p,
            metodo: sel.metodo,
            comprobante: linkFoto,
            fecha: new Date().toLocaleString(),
            estado: "Pendiente",
            idPedido: "REC-" + Math.random().toString(36).substr(2, 6).toUpperCase()
        };

        // Guardar en Firebase Database (Si la función existe)
        if (window.guardarPedidoFB) {
            const resultadoGuardado = await window.guardarPedidoFB(datosParaDB);
            if (resultadoGuardado && resultadoGuardado.dbKey) {
                datosParaDB.dbKey = resultadoGuardado.dbKey;
            }
        }

        // --- PASO C: Notificación a Telegram ---
        // Usamos los mismos datos que preparamos para la DB
        //await enviarNotificacionTelegram(datosParaDB); //borrado
        // REEMPLAZA LA LLAMADA ANTIGUA POR ESTO:
        try {
            const dbRef = ref(getDatabase(), 'pedidos/' + datosParaDB.idPedido);
            await set(dbRef, datosParaDB);

            alert("¡Pedido enviado con éxito!");
            // Aquí puedes redirigir al usuario o limpiar el formulario
        } catch (error) {
            console.error("Error al guardar pedido:", error);
            alert("Hubo un error al procesar tu solicitud.");
        }
        //


        // --- PASO D: Interfaz Final---
        //status.innerText = "✅ ¡Recarga solicitada con éxito!"; //creo que ya no se usa xk hay otra

        //Ocultar el ticket y mostrar el modal de éxito (como ya lo hacías)
        document.getElementById("vista-ticket").classList.add("hidden");
        document.getElementById("modal-final").classList.remove("hidden");

        // Guardar en el historial local del cliente para que pueda consultar luego
        if (typeof guardarEnHistorialLocal === "function") {
            guardarEnHistorialLocal(datosParaDB);
        }

    } catch (error) {
        console.error(error);
        status.innerText = "❌ Error al procesar.";
        if (btnEnvio) btnEnvio.disabled = false;
        alert("Hubo un problema. Intenta de nuevo.");
    }
}
*/

/*
async function finalizarRecarga() {
    const fileInput = document.getElementById('input-comprobante');
    const status = document.getElementById('status-carga');
    const btnEnvio = document.querySelector(".btn-enviar-wa"); // Referencia al botón

    // 1. Validaciones
    if (!fileInput.files[0]) {
        alert("⚠️ Por favor, selecciona la foto de tu comprobante antes de enviar.");
        return;
    }

    // 2. Bloqueo de interfaz para evitar doble clic
    status.innerText = "⏳ Subiendo comprobante y registrando...";
    status.style.color = "#f3ae1a";
    if (btnEnvio) btnEnvio.disabled = true;

    try {
        // --- PASO A: Subir a Firebase Storage (Adiós ImgBB) ---
        // Usamos la función que creamos en el HTML unificado
        const linkFoto = await window.subirArchivoFB(fileInput.files[0]);

        // --- PASO B: Guardar en Firebase Realtime Database ---
        // Capturar campos extra si existen
        const zonaML = document.getElementById("zona-jugador") ? document.getElementById("zona-jugador").value : null;
        const regionGenshin = document.getElementById("region-jugador") ? document.getElementById("region-jugador").value : null;

        const datosParaDB = {
            juego: sel.juego.nombre,
            id_jugador: sel.id,
            id_zona: zonaML, // Ahora se guardará si es Mobile Legends
            region: regionGenshin, // Ahora se guardará si es Genshin
            nickname: sel.nick,
            paquete: sel.paquete.n,
            precio: sel.paquete.p,
            metodo: sel.metodo,
            comprobante: linkFoto,
            fecha: new Date().toLocaleString(),
            estado: "Pendiente",
            idPedido: "REC-" + Math.random().toString(36).substr(2, 6).toUpperCase() // Generamos el ID de pedido aquí
        };

        // Guardamos y obtenemos el resultado (que incluye el ID de seguimiento generado)
        if (window.guardarPedidoFB) {
            await window.guardarPedidoFB(datosParaDB);
        }

        // --- PASO C: Notificación Silenciosa a Telegram ---
        // Llamamos a una función que crearemos abajo
        await enviarNotificacionTelegram(datosParaDB);

        // --- PASO D: Interfaz Final ---
        status.innerText = "✅ ¡Recarga solicitada con éxito!";

        // Ocultar el ticket y mostrar el modal de éxito (como ya lo hacías)
        document.getElementById("vista-ticket").classList.add("hidden");
        document.getElementById("modal-final").classList.remove("hidden");

        // Guardar en el historial local del cliente para que pueda consultar luego
        guardarEnHistorialLocal(datosParaDB);

    } catch (error) {
        console.error(error);
        status.innerText = "❌ Error al procesar. Intenta de nuevo.";
        if (btnEnvio) btnEnvio.disabled = false;
        alert("Hubo un problema técnico. Tu comprobante está a salvo, intenta enviar otra vez.");
    }
}
*/

function mostrarPantallaExito() {
    // Ocultamos todo lo anterior
    document.getElementById("vista-ticket").classList.add("hidden");
    document.getElementById("vista-formulario").classList.add("hidden");

    // Mostramos el modal de éxito que ya tienes en tu HTML
    const modalFinal = document.getElementById("modal-final");
    if (modalFinal) modalFinal.classList.remove("hidden"); //hiddem = oculta el elemento de la vista del usuario

    // Recargamos el historial para que aparezca la nueva recarga sin refrescar toda la página
    cargarHistorial();

    limpiarFondo();
}
/*
async function enviarNotificacionTelegram(datos) {
    const token = "8731862768:AAFMlGF49gkDmOqUy-nlKbHnFfSk2owVIbI"; // Lo obtienes de @BotFather
    const chatId = "8730026280";   // Lo obtienes de @userinfobot

    const mensaje = `🚀 *NUEVA SOLICITUD DE RECARGA*%0A%0A` +
        `🎮 *Juego:* ${datos.juego}%0A` +
        `👤 *ID Jugador:* ${datos.id_jugador}%0A` +
        `🏷️ *Nick:* ${datos.nickname}%0A` +
        `💎 *Paquete:* ${datos.paquete}%0A` +
        `💰 *Precio:* ${datos.precio}%0A` +
        `💳 *Método:* ${datos.metodo}%0A%0A` +
        `📸 *Comprobante:* [Ver Imagen](${datos.comprobante})`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${mensaje}&parse_mode=Markdown`;

    try {
        await fetch(url);
    } catch (e) {
        console.log("Error enviando a Telegram, pero el pedido se guardó en DB.");
    }
}
    */
/*
function guardarEnHistorialLocal(pedido) {
    let historial = JSON.parse(localStorage.getItem('mis_pedidos_elite')) || [];
    historial.push({
        id: pedido.id_jugador,
        juego: pedido.juego,
        fecha: pedido.fecha,
        estado: "Pendiente"
    });
    localStorage.setItem('mis_pedidos_elite', JSON.stringify(historial));
}
*/

function guardarEnHistorialLocal(pedido) {
    let historial = JSON.parse(localStorage.getItem('mis_pedidos_elite')) || [];

    // Creamos un objeto limpio para el historial
    const nuevoItemHistorial = {
        dbKey: pedido.dbKey || null, // Key real de Firebase para sincronización exacta
        idPedido: pedido.idPedido, // El REC-XXXX
        juego: pedido.juego,
        nick: pedido.nickname,
        id_jugador: pedido.id_jugador, // El ID del cliente
        id_zona: pedido.id_zona || null,
        region: pedido.region || null,
        paquete: pedido.paquete,
        precio: pedido.precio,
        fecha: pedido.fecha,
        estado: pedido.estado
    };

    historial.push(nuevoItemHistorial);

    // Solo guardamos los últimos 5 para no llenar la memoria del cel
    if (historial.length > 5) historial.shift();

    localStorage.setItem('mis_pedidos_elite', JSON.stringify(historial));
}


function nuevaRecarga() {
    document.getElementById("modal-final").classList.add("hidden");

    // Limpiamos todo y volvemos al catálogo principal
    document.getElementById("vista-formulario").classList.remove("hidden");
    //document.getElementById("vista-catalogo").classList.remove("hidden");
    
    // Mantener la clase modal-open ya que volvemos al formulario

    //Regresa a formulario con los mismos datos de recarga
    if (document.getElementById("input-id")) document.getElementById("input-id").value = "";
    document.getElementById("contenedor-preview").style.display = 'none';
    document.getElementById("input-comprobante").value = "";
    window.linkComprobante = "No subido";

    //el usuario ve la parte superior del sitio.
    window.scrollTo(0, 0);
}

function finalizarTodo() {
    // Simplemente recarga la página para limpiar toda la memoria de la App
    location.reload();
    //el usuario ve la parte superior del sitio.
    window.scrollTo(0, 0);
    
    // La clase modal-open se elimina automáticamente al recargar la página
}


// Función para la X del Formulario
function cerrarFormulario() {
    // 1. Ocultar el formulario (ajusta el ID si el tuyo es diferente)
    document.getElementById("vista-formulario").classList.add("hidden");
    // 2. Mostrar la galería de juegos inicial
    document.getElementById("vista-catalogo").classList.remove("hidden");
    
    // Quitar clase para mostrar footer nuevamente
    document.body.classList.remove("modal-open");

    // 3. Resetear el scroll al inicio
    window.scrollTo(0, 0);

    //limpiarFondo();
}

// Función para la X del Ticket
function cerrarTicket() {
    // 1. Ocultar el ticket
    document.getElementById("vista-ticket").classList.add("hidden");

    // 2. Regresar al formulario (por si el usuario quiere corregir el ID o Nick)
    document.getElementById("vista-formulario").classList.remove("hidden");
    
    // Mantener la clase modal-open ya que volvemos al formulario

    // 3. Opcional: Limpiar la vista previa del comprobante si quieres que lo suba de nuevo
    const preview = document.getElementById("contenedor-preview");
    if (preview) preview.style.display = 'none';
    document.getElementById("input-comprobante").value = "";
}

//boton con 3 lineas
function toggleMenu() {
    // Activa o desactiva la clase 'active' en el menú y el fondo
    document.getElementById("side-menu").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

// 1. Detectar cuando el usuario presiona el botón "Atrás" del celular
window.onpopstate = function (event) {
    // Si el usuario da atrás, forzamos a que vuelva al catálogo
    // sin cerrar la página completa
    cerrarTodoYVolverAlCatalogo();
};

function cerrarTodoYVolverAlCatalogo() {
    // Ocultamos todas las capas posibles
    const secciones = ["vista-formulario", "vista-ticket", "modal-final"];

    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });

    // Mostramos el catálogo principal
    const catalogo = document.getElementById("vista-catalogo");
    if (catalogo) catalogo.classList.remove("hidden");

    limpiarFondo();
}

function limpiarFondo() {
    document.body.style.backgroundImage = "none";
}

window.onpopstate = function (event) {
    const formulario = document.getElementById("vista-formulario");
    const ticket = document.getElementById("vista-ticket");

    if (!ticket.classList.contains("hidden")) {
        // Si está en el ticket, volver al formulario
        ticket.classList.add("hidden");
        formulario.classList.remove("hidden");
    } else if (!formulario.classList.contains("hidden")) {
        // Si está en el formulario, volver al catálogo
        formulario.classList.add("hidden");
        document.getElementById("vista-catalogo").classList.remove("hidden");
    }
};

// --- LÓGICA DEL CARRUSEL ---
const track = document.querySelector('.carousel__track');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

const dots = document.querySelectorAll('.dot');
let contador = 0; // Para rastrear qué punto activar

function actualizarDots(indice) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[indice].classList.add('active');
}

function moverSiguiente() {
    const slides = document.querySelectorAll('.slide');
    // Movemos el track hacia la izquierda
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-100%)`;

    // Lógica del contador para los dots (0 a 4)
    contador = (contador + 1) % dots.length;
    actualizarDots(contador);

    // Al terminar la animación, reordenamos el DOM
    setTimeout(() => {
        track.style.transition = "none";
        track.appendChild(slides[0]); // Mueve el primero al final
        track.style.transform = `translateX(0)`;
    }, 500);
}

function moverAnterior() {
    const slides = document.querySelectorAll('.slide');

    // Lógica del contador para los dots
    contador = (contador - 1 + dots.length) % dots.length;
    actualizarDots(contador);

    track.style.transition = "none";
    // Mueve el último al inicio antes de mostrarlo
    track.prepend(slides[slides.length - 1]);
    track.style.transform = `translateX(-100%)`;

    setTimeout(() => {
        track.style.transition = "transform 0.5s ease-in-out";
        track.style.transform = `translateX(0)`;
    }, 10);
}

// Botones y Auto-play
document.querySelector('.next').addEventListener('click', moverSiguiente);
document.querySelector('.prev').addEventListener('click', moverAnterior);
let autoPlay = setInterval(moverSiguiente, 5000);

/*
// Eventos de flechas
nextBtn.addEventListener('click', moverSiguiente);
prevBtn.addEventListener('click', moverAnterior);

// Auto-play cada 5 segundos
let autoPlay = setInterval(moverSiguiente, 5000);
*/

// Pausar al poner el mouse encima
document.querySelector('.carousel').addEventListener('mouseenter', () => clearInterval(autoPlay));
document.querySelector('.carousel').addEventListener('mouseleave', () => autoPlay = setInterval(moverSiguiente, 5000));




/*
let slideActual = 0;
const slides = document.querySelectorAll('.carrusel-slide');
const track = document.getElementById('carrusel-track');
const puntos = document.querySelectorAll('.punto');
const totalSlides = slides.length;

// Función para cambiar de slide
function cambiarSlide(indice) {
    if (indice >= totalSlides) slideActual = 0;
    else if (indice < 0) slideActual = totalSlides - 1;
    else slideActual = indice;

    // Movemos la "pista" (track)
    // Multiplicamos por -(100 / totalSlides) para mover el porcentaje correcto
    const desplazamiento = slideActual * -(100 / totalSlides);
    track.style.transform = `translateX(${desplazamiento}%)`;

    // Actualizamos los puntitos indicadores
    puntos.forEach(p => p.classList.remove('activo'));
    puntos[slideActual].classList.add('activo');
}

// Movimiento automático cada 5 segundos
let autoPlay = setInterval(() => {
    cambiarSlide(slideActual + 1);
}, 5000);

// Permitir cambiar slide al tocar los puntitos
puntos.forEach((punto, i) => {
    punto.addEventListener('click', () => {
        clearInterval(autoPlay); // Paramos el auto-play si el usuario interactúa
        cambiarSlide(i);
        // Reiniciamos el auto-play después de 10 segundos de inactividad
        autoPlay = setInterval(() => cambiarSlide(slideActual + 1), 5000);
    });
});
*/



async function cargarHistorial() {
    const lista = document.getElementById("lista-historial-v2");
    const historial = JSON.parse(localStorage.getItem('mis_pedidos_elite')) || [];

    if (!lista) return;

    if (historial.length === 0) {
        lista.innerHTML = "<p style='text-align:center; opacity:0.5; padding:20px; color:white;'>Aún no tienes recargas.</p>";
        return;
    }

    // Sincroniza estados desde Firebase para reflejar cambios hechos en admin.
    if (typeof window.obtenerEstadoPedidoFB === "function") {
        const historialSincronizado = await Promise.all(
            historial.map(async (pedido) => {
                let estadoDB = null;

                // Primero: consulta exacta por key real (si existe)
                if (pedido.dbKey && typeof window.obtenerEstadoPedidoPorKeyFB === "function") {
                    estadoDB = await window.obtenerEstadoPedidoPorKeyFB(pedido.dbKey);
                }

                // Fallback para pedidos antiguos que no tienen dbKey
                if (!estadoDB) {
                    estadoDB = await window.obtenerEstadoPedidoFB(pedido.idPedido);
                }

                return estadoDB ? { ...pedido, estado: estadoDB } : pedido;
            })
        );

        localStorage.setItem('mis_pedidos_elite', JSON.stringify(historialSincronizado));
    }

    const historialActualizado = JSON.parse(localStorage.getItem('mis_pedidos_elite')) || [];
    lista.innerHTML = "";

    // .reverse() para que el último pedido salga arriba
    [...historialActualizado].reverse().forEach(pedido => {
        const estadoPedido = (pedido.estado || "Pendiente").toString();
        const estadoClase = estadoPedido.toLowerCase() === "completado" ? "entregado" : "pendiente";
        const juegoNormalizado = (pedido.juego || "").toLowerCase();
        let idConExtra = pedido.id_jugador || "---";

        if (juegoNormalizado.includes("mobile legends") && pedido.id_zona) {
            idConExtra = `${idConExtra} (${pedido.id_zona})`;
        } else if (juegoNormalizado.includes("genshin impact") && pedido.region) {
            idConExtra = `${idConExtra} (${pedido.region})`;
        }

        lista.innerHTML += `
            <div class="ticket-historial">
                
                <div class="fila-superior">
                    <span class="juego-nombre">${pedido.juego || 'Juego'}</span>
                    <span class="pedido-id">${pedido.idPedido || '#S/N'}</span>
                </div>
                
                <div class="fila-media">
                    <div class="info-cliente">
                        <span class="paquete-info">${pedido.paquete || 'En proceso..'}</span>                                                                
                    </div>                  
                        <span class="precio-info">${pedido.precio || ''}</span>
                </div>

                <div class="fila-inferior">
                    <span class="nick-info">${pedido.nick || 'nickname'}</span>
                    <span class="fecha-info">${pedido.fecha || ''}</span>                   
                </div>

                <div class="fila-inferior">
                        <span class="id-cliente-text">ID: ${idConExtra}</span>
                        <span class="${estadoClase}">${estadoPedido}</span>                        
                </div>
            </div>
        `;
    });
}

function toggleHistorial() {
    const modal = document.getElementById("modal-historial");
    if (modal) {
        modal.classList.toggle("hidden");
        // Solo cargamos los datos si el modal se va a mostrar
        if (!modal.classList.contains("hidden")) {
            cargarHistorial();
            iniciarTiempoRealHistorial();
        } else {
            detenerTiempoRealHistorial();
        }
    } else {
        console.error("No se encontró el elemento modal-historial");
    }
}

function iniciarTiempoRealHistorial() {
    if (desuscribirHistorialFB || typeof window.suscribirPedidosFB !== "function") return;

    desuscribirHistorialFB = window.suscribirPedidosFB((pedidosDB) => {
        const historial = JSON.parse(localStorage.getItem('mis_pedidos_elite')) || [];
        if (!historial.length) return;

        let huboCambios = false;
        const historialActualizado = historial.map((pedido) => {
            let estadoNuevo = null;

            if (pedido.dbKey && pedidosDB[pedido.dbKey]) {
                estadoNuevo = pedidosDB[pedido.dbKey].estado || null;
            } else if (pedido.idPedido) {
                const matchKey = Object.keys(pedidosDB).find((key) => pedidosDB[key]?.idPedido === pedido.idPedido);
                if (matchKey) {
                    estadoNuevo = pedidosDB[matchKey]?.estado || null;
                    if (!pedido.dbKey) pedido.dbKey = matchKey; // Migración silenciosa para pedidos viejos
                }
            }

            if (estadoNuevo && estadoNuevo !== pedido.estado) {
                huboCambios = true;
                return { ...pedido, estado: estadoNuevo };
            }

            return pedido;
        });

        if (huboCambios) {
            localStorage.setItem('mis_pedidos_elite', JSON.stringify(historialActualizado));
            cargarHistorial();
        }
    });
}

function detenerTiempoRealHistorial() {
    if (typeof desuscribirHistorialFB === "function") {
        desuscribirHistorialFB();
    }
    desuscribirHistorialFB = null;
}



window.onload = function () {
    // 1. Cargamos el historial apenas abre la web
    cargarHistorial();

    // 2. Si tienes otras cosas que inicializar (como el carrusel), van aquí
    console.log("Web cargada y lista");
};

window.addEventListener("beforeunload", () => {
    detenerTiempoRealHistorial();
});

/*
async function enviarNotificacionTelegram(datos) {
    const URL_FIREBASE = "https://enviarmensajebot-itbyzbuzha-uc.a.run.app"; // La que te dio la terminal

    try {
        await fetch(URL_FIREBASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos) // Enviamos el objeto 'datos' tal cual
        });
        console.log("Notificación enviada al servidor");
    } catch (e) {
        console.error("Error al contactar al servidor:", e);
    }
}
*/

/* original
async function enviarNotificacionTelegram(datos) {
    const token = "";
    const chatId = "";

    // Función interna para limpiar textos raros del cliente
    const limpiar = (txt) => String(txt).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const mensaje = `
<b>🚀 NUEVA RECARGA ELITE</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>Recarga:</b> <code>${datos.idPedido}</code>
🎮 <b>Juego:</b> ${limpiar(datos.juego)}
🆔 <b>ID:</b> <code>${limpiar(datos.id_jugador)}</code>
📍 <b>Extra:</b> ${limpiar(datos.id_zona || datos.region || 'N/A')}
👤 <b>Nick:</b> ${limpiar(datos.nickname || 'N/A')}
💎 <b>Pack:</b> ${datos.paquete}
💰 <b>Monto:</b> ${datos.precio}
💳 <b>Pago:</b> ${datos.metodo}
━━━━━━━━━━━━━━━━━━
<a href="${datos.comprobante}">📸 CLICK PARA VER COMPROBANTE</a>
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensaje,
                parse_mode: 'HTML' // Cambiamos Markdown por HTML para evitar errores
            })
        });
    } catch (e) {
        console.error("Error Telegram:", e);
    }
}
*/

/* codigo antes del error
async function enviarNotificacionTelegram(datos) {
    const token = ""; // <--- PEGA AQUÍ TU TOKEN DE BOTFATHER
    const chatId = "";    // <--- PEGA AQUÍ TU ID DE USERINFOBOT

    // Construimos un mensaje profesional para tu Telegram
    const mensaje = `
🚀 *NUEVA RECARGA ELITE*
━━━━━━━━━━━━━━━━━━
🎮 *Juego:* ${datos.juego}
🆔 *ID:* \`${datos.id_jugador}\`
👤 *Nick:* ${datos.nickname || 'No indicado'}
💎 *Pack:* ${datos.paquete}
💰 *Monto:* ${datos.precio}
💳 *Pago:* ${datos.metodo}
📍 *Extra:* ${datos.id_zona || datos.region || 'N/A'}
🆔 *Pedido:* \`${datos.idPedido}\`
━━━━━━━━━━━━━━━━━━
📸 [VER COMPROBANTE](${datos.comprobante})
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });
        console.log("✅ Telegram notificado");
    } catch (e) {
        console.error("❌ Error notificando a Telegram", e);
    }
}
*/

/*
function seleccionarPaquete(idx) {
    sel.paquete = sel.juego.paquetes[idx];

    // ... aquí mantén tu código que cambia los colores de los bordes ...

    // Actualizar la nueva barra inferior
    const txtPack = document.getElementById("resumen-paquete");
    const txtPrice = document.getElementById("resumen-precio");

    if (txtPack && txtPrice) {
        txtPack.innerText = sel.paquete.n; // Nombre: 100 Diamantes
        txtPrice.innerText = sel.paquete.p; // Precio: 13 Bs
    }
}
*/

document.addEventListener('DOMContentLoaded', () => {
    // Solo un manejador de eventos
    document.onkeydown = function (e) {
        if (e.keyCode == 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || // Ctrl+Shift+I/J/C
            (e.ctrlKey && e.keyCode == 85)) { // Ctrl+U

            e.preventDefault(); // Forma moderna de evitar la acción
            return false;
        }
    };
});

//tactil para el banner en celular
let touchStartX = 0;
let touchEndX = 0;

// Función para procesar el gesto
function procesarGesto() {
    const diferencia = touchStartX - touchEndX;
    const umbral = 50; // Mínimo de píxeles para considerar que fue un deslizamiento

    if (diferencia > umbral) {
        // Deslizó hacia la izquierda -> Siguiente
        moverSiguiente();
    } else if (diferencia < -umbral) {
        // Deslizó hacia la derecha -> Anterior
        moverAnterior();
    }
}

// Eventos táctiles
const carrusel = document.querySelector('.carousel');

carrusel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carrusel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    procesarGesto();
}, { passive: true });

