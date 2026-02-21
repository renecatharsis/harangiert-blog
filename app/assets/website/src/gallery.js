import EmblaCarousel from 'embla-carousel'

(function() {
    const emblaNode = document.querySelector('.embla')
    if (!emblaNode) {
        return;
    }

    const embla = EmblaCarousel(emblaNode, {
        loop: true
    })

    document.querySelector('.btn-gallery-prev').addEventListener('click', embla.scrollPrev)
    document.querySelector('.btn-gallery-next').addEventListener('click', embla.scrollNext)
}());
