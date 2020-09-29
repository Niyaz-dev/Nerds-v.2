let filtersButton = document.querySelector('.catalog__show-filters');
let filters = document.querySelector('.filters');

filtersButton.addEventListener('click',() => {
    filters.classList.toggle('show-filter');
})

