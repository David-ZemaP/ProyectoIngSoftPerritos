import { buscar } from './search.js';

function getPetsFromStorage() {
    try {
        const pets = localStorage.getItem('pets');
        return pets ? JSON.parse(pets) : [];
    } catch (error) {
        console.error('Error al parsear las mascotas de localStorage:', error);
        return []; // Devuelve un array vacío si hay un error
    }
}

function renderPetCard(pet) {
    const template = document.getElementById('pet-card-template');
    if (!template) {
        console.error('La plantilla de tarjeta de mascota no se encontró.');
        return null;
    }
    const card = template.content.cloneNode(true);

    const petImageContainer = card.querySelector('.pet-image-container');
    if (petImageContainer) {
        // Establecer la imagen de fondo
        petImageContainer.style.backgroundImage = `url(${pet.image || '../assets/Max-pet.png'})`;
    }
    
    card.querySelector('h3').textContent = pet.name;
    const genderText = pet.gender === 'M' ? 'Macho' : (pet.gender === 'H' ? 'Hembra' : '');
    card.querySelector('.pet-info-line').textContent = `${pet.breed} • ${genderText}`;
    card.querySelector('.age').textContent = pet.age ? `${pet.age} años` : 'Edad no especificada';
    card.querySelector('.pet-description').textContent = pet.personality || 'No se ha proporcionado una descripción.';
    card.querySelector('.species-tag').textContent = pet.species;

    return card;
}

function displayPets(pets) {
    const resultsGrid = document.getElementById('resultsGrid');
    const petCountElement = document.getElementById('petCount');
    const searchResultsContainer = document.getElementById('searchResults');

    resultsGrid.innerHTML = '';

    if (pets.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <p class="not-found-message">No se encontraron mascotas con esos criterios. 😞</p>
                <p>Intenta con otros filtros de búsqueda.</p>
            </div>`;
        petCountElement.textContent = '0 mascotas encontradas';
    } else {
        pets.forEach(pet => {
            const card = renderPetCard(pet);
            if (card) {
                resultsGrid.appendChild(card);
            }
        });
        petCountElement.textContent = `${pets.length} mascota(s) encontrada(s)`;
    }

    searchResultsContainer.style.display = 'block';
}

function handleSearch() {
    const name = document.getElementById('name-input').value;
    const species = document.getElementById('species-select').value;
    const gender = document.getElementById('sex-select').value;
    const age = document.getElementById('age-select').value;
    const breed = document.getElementById('breed-input').value;

    const allPets = getPetsFromStorage();
    const filters = { name, species, gender, age, breed };
    const filteredPets = buscar(allPets, filters);
    
    displayPets(filteredPets);
}

function handleClear() {
    document.getElementById('name-input').value = '';
    document.getElementById('breed-input').value = '';
    document.getElementById('species-select').value = 'todos';
    document.getElementById('sex-select').value = 'todos';
    document.getElementById('age-select').value = 'todos';

    const allPets = getPetsFromStorage();
    displayPets(allPets);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-btn');
    const clearButton = document.getElementById('clear-btn');

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (clearButton) {
        clearButton.addEventListener('click', handleClear);
    }

    // Carga inicial de todas las mascotas
    const allPets = getPetsFromStorage();
    displayPets(allPets);

    // Manejador para los botones de Match
    document.addEventListener('click', (e) => {
        const matchButton = e.target.closest('.match-button');
        if (matchButton) {
            const petName = matchButton.closest('.pet-card').querySelector('h3').textContent;
            alert(`¡Has hecho match con ${petName}! Te contactaremos pronto.`);
        }
    });
});