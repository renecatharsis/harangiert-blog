document.getElementById('burger-menu').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    const burger = this;
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';

    menu.classList.toggle('hidden');
    burger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');

    const spans = burger.querySelectorAll('span');
    if (!isExpanded) {
        spans[0].classList.add('rotate-45', 'translate-y-1.5');
        spans[1].classList.add('opacity-0');
        spans[2].classList.add('-rotate-45', '-translate-y-1.5');
    } else {
        spans[0].classList.remove('rotate-45', 'translate-y-1.5');
        spans[1].classList.remove('opacity-0');
        spans[2].classList.remove('-rotate-45', '-translate-y-1.5');
    }
});