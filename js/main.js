// Mostrar el año actual en el footer automáticamente
document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  document.querySelector('footer').innerHTML += ` - ${year}`;
});
