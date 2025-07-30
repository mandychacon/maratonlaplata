console.log("✅ Script cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  const categorias = document.querySelectorAll(".categoria");
  const btnAbrirModal = document.getElementById("abrirCarrito");
  const modal = document.getElementById("modalCarrito");
  const btnCerrarModal = document.getElementById("cerrarModal");
  const modalContenidoCarrito = document.getElementById("contenidoCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const agregarCategoriaBtn = document.getElementById("agregarCategoriaBtn");
  const btnPagarEnviar = document.getElementById("btnPagarEnviar");
  const btnEnviar = document.getElementById("btnEnviar");
  const form = document.getElementById("formInscripcion");

  // NUEVOS botones para limpiar
  const btnLimpiarFormulario = document.getElementById("btnLimpiarFormulario");
  const btnLimpiarCarrito = document.getElementById("btnLimpiarCarrito");

  let carritoCategorias = JSON.parse(localStorage.getItem("carrito")) || [];

  // --- ACTUALIZAR CONTADOR DINÁMICO ---
  function actualizarContador() {
    const contador = carritoCategorias.length;
    btnAbrirModal.textContent = `Chequear carrito de inscripción (${contador})`;
  }

  // --- ACTUALIZAR CARRITO EN EL MODAL ---
  function actualizarCarrito() {
    modalContenidoCarrito.innerHTML = "";
    let total = 0;

    carritoCategorias.forEach(cat => {
      const item = document.createElement("div");
      item.classList.add("item-carrito");
      item.innerHTML = `
        <span>${cat.nombre} - $${cat.precio}</span>
        <button data-nombre="${cat.nombre}" class="eliminar">Eliminar</button>
      `;
      modalContenidoCarrito.appendChild(item);
      total += cat.precio;
    });

    totalCarrito.textContent = `Total: $${total}`;

    // Botones eliminar dentro del carrito
    modalContenidoCarrito.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const nombre = e.target.dataset.nombre;
        carritoCategorias = carritoCategorias.filter(cat => cat.nombre !== nombre);

        // quitar clase seleccionada del formulario
        document.querySelector(`.categoria[data-nombre="${nombre}"]`).classList.remove("seleccionada");

        guardarCarrito();
        actualizarCarrito();
        actualizarContador();
      });
    });
  }

  // --- GUARDAR EN LOCALSTORAGE ---
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoCategorias));
  }

  // --- FUNCIÓN LIMPIAR TODO (formulario + carrito) ---
  function limpiarTodo() {
    form.reset();
    carritoCategorias = [];
    categorias.forEach(categoria => categoria.classList.remove("seleccionada"));
    actualizarCarrito();
    actualizarContador();
    localStorage.removeItem("carrito");
  }

  // Asignar evento a los dos botones de limpiar
  btnLimpiarFormulario.addEventListener("click", limpiarTodo);
  btnLimpiarCarrito.addEventListener("click", limpiarTodo);

  // --- VALIDAR FORMULARIO ---
  function validarFormulario() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const sexo = document.getElementById("sexo").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const pais = document.getElementById("pais").value.trim();

    if (!nombre || !apellidos || !sexo || !edad || !pais) {
      alert("Por favor, completa todos los campos.");
      return false;
    }
    return true;
  }

  // --- SELECCIÓN DE CATEGORÍAS ---
  categorias.forEach(categoria => {
    if (carritoCategorias.some(cat => cat.nombre === categoria.dataset.nombre)) {
      categoria.classList.add("seleccionada");
    }

    categoria.addEventListener("click", () => {
      const nombre = categoria.dataset.nombre;
      const precio = parseInt(categoria.dataset.precio);

      if (carritoCategorias.some(cat => cat.nombre === nombre)) {
        carritoCategorias = carritoCategorias.filter(cat => cat.nombre !== nombre);
        categoria.classList.remove("seleccionada");
      } else {
        carritoCategorias.push({ nombre, precio });
        categoria.classList.add("seleccionada");
      }

      guardarCarrito();
      actualizarContador();
    });
  });

  // --- ABRIR MODAL ---
  btnAbrirModal.addEventListener("click", () => {
    if (carritoCategorias.length === 0) {
      alert("No has seleccionado ninguna categoría aún.");
      return;
    }
    actualizarCarrito();
    modal.classList.remove("oculto");
  });

  // --- CERRAR MODAL ---
  btnCerrarModal.addEventListener("click", () => modal.classList.add("oculto"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("oculto");
  });
  agregarCategoriaBtn.addEventListener("click", () => modal.classList.add("oculto"));

// --- PAGAR Y ENVIAR ---
btnPagarEnviar.addEventListener("click", () => {
  if (carritoCategorias.length === 0) {
    alert("Debes seleccionar al menos una categoría.");
    return;
  }

  if (!validarFormulario()) return;

  let inputCategorias = document.querySelector('input[name="categorias_seleccionadas"]');
  if (!inputCategorias) {
    inputCategorias = document.createElement("input");
    inputCategorias.type = "hidden";
    inputCategorias.name = "categorias_seleccionadas";
    form.appendChild(inputCategorias);
  }

  inputCategorias.value = carritoCategorias.map(cat => cat.nombre).join(", ");

  // Importante: dispara el evento submit (sí pasa por el listener de submit)
  form.requestSubmit();
});


  // --- Redirección manual después de enviar el formulario a Formspree ---
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Detiene el envío clásico

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        // Limpiar datos y carrito
        localStorage.removeItem("carrito");
        carritoCategorias = [];
        form.reset();
        actualizarCarrito();
        actualizarContador();

        // Redirigir a la página de gracias
        window.location.href = "gracias.html";
      } else {
        alert("Ocurrió un error al enviar la inscripción. Intenta de nuevo.");
      }
    }).catch(error => {
      alert("Error de conexión. Intenta más tarde.");
    });
  });

  // --- Mostrar contador al iniciar ---
  actualizarContador();
});

