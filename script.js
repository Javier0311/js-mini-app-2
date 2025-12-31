const toggleMenu = document.querySelector('.toggle-menu');
const body = document.body;

toggleMenu.addEventListener('click', () => {
    body.classList.toggle('sidebar-hidden');
});
