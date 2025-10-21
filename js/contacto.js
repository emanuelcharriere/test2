const formContacto = document.getElementById('contactoForm');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputAsunto = document.getElementById('asunto');
const inputMensaje = document.getElementById('mensaje')

function contacto(event){
    event.preventDefault();
    
    let nombre = inputNombre.value.trim();
    let correo = inputCorreo.value.trim();
    let asunto = inputAsunto.value.trim();
    let mensaje = inputMensaje.value.trim();

    if (!nombre || !correo || !asunto || !mensaje){
        alert ('Por Favor completar los campos vacios');
        return;
    }
    alert('Su consulta fué enviada, responderemos a la brevedad');

    formContacto.reset();

};



formContacto.addEventListener('submit', contacto)