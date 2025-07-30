document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', e => {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    if (nombre.trim() === '' || email.trim() === '') {
      e.preventDefault();
      alert('Por favor, completá todos los campos obligatorios.');
    }
  });
});
