console.log("📦 Cargando productos...");

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productos-container");

  fetch("productos.json")
    .then(res => res.json())
    .then(data => {
      contenedor.innerHTML = data.map(prod => `
        <div class="card">
          <img src="${prod.imagen}" alt="${prod.titulo}">
          <h3>${prod.titulo}</h3>
          <p>$${prod.precio.toLocaleString('es-AR')}</p>
        </div>
      `).join("");
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
      contenedor.innerHTML = "<p style='color:red;'>No se pudieron cargar los productos.</p>";
    });
});
