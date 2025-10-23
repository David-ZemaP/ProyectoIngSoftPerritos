import buscar from './search.js';

/**
 * Función para renderizar una tarjeta de mascota con los datos proporcionados.
 * Esto mantiene la lógica de construcción de la vista fuera del manejador de eventos principal.
 * @param {string} name - Nombre de la mascota.
 * @param {string} breed - Raza y sexo de la mascota (Ej: Golden Retriever • Macho).
 * @param {string} age - Edad de la mascota.
 * @param {string} description - Descripción corta de la mascota.
 * @param {string} imageSrc - Ruta de la imagen.
 * @param {string} specie - Especie (Perro/Gato).
 * @returns {Node} El elemento de la tarjeta clonado.
 */
function renderPetCard(name, breed, age, description, imageSrc, specie) {
    const template = document.getElementById('pet-card-template');
    const card = template.content.cloneNode(true);
    
    card.querySelector('h3').textContent = name;
    card.querySelector('.pet-info-line:nth-child(2)').textContent = breed;
    card.querySelector('.age').textContent = age;
    card.querySelector('.pet-description').textContent = description;
    card.querySelector('img').src = imageSrc;
    card.querySelector('img').alt = name;
    card.querySelector('.species-tag').textContent = specie;
    
    return card;
}

/**
 * Muestra resultados simulados (Max, Luna, Rocky) y actualiza el conteo.
 * @param {number} petCount - Número de mascotas a mostrar.
 */
function displayResults(petCount) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    // Si petCount es mayor a 0, muestra las tarjetas simuladas
    if (petCount >= 1) {
        // Max
        resultsGrid.appendChild(renderPetCard(
            'Max', 'Golden Retriever • Macho', '2 años',
            'Súper juguetón y amigable, le encanta nadar y jugar a buscar la pelota. Ideal para...',
            '../assets/Max-pet.png', 'Perro'
        ));
    }
    if (petCount >= 2) {
        // Luna
        resultsGrid.appendChild(renderPetCard(
            'Luna', 'Mestizo • Hembra', '1 año',
            'Tranquila y cariñosa, perfecta para apartamento. Le gusta acurrucarse en el...',
            '../assets/Luna-pet.png', 'Gato'
        ));
    }
    if (petCount >= 3) {
        // Rocky
        resultsGrid.appendChild(renderPetCard(
            'Rocky', 'Beagle • Macho', '3 años',
            'Curioso y aventurero, excelente compañero para caminatas largas. Muy sociable con...',
            '../assets/Rocky-pet.png', 'Perro'
        ));
    }

    document.getElementById('petCount').textContent = `${petCount} mascotas encontradas`;
    document.getElementById('searchResults').style.display = 'block';
}

/**
 * Inicializa los manejadores de eventos del DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
    const resultsGrid = document.getElementById('resultsGrid');

    // 1. Inicializar la vista: Ocultar la sección de resultados y poner el conteo a 0
    resultsGrid.innerHTML = ''; 
    document.getElementById('petCount').textContent = '0 mascotas encontradas';
    document.getElementById('searchResults').style.display = 'none';
    
    // 2. Manejadores para los botones de especie (Mantenido)
    const specieButtons = document.querySelectorAll('.input-group button');
    specieButtons.forEach(button => {
        button.addEventListener('click', () => {
            specieButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // 3. Manejador del botón de búsqueda
    document.getElementById('search-btn').addEventListener('click', () => {
        const searchValue = document.getElementById('breed-input').value; 
        
        resultsGrid.innerHTML = ''; // Limpiar antes de buscar

        try {
            const result = buscar(searchValue);
            
            if (result === '¡Mascota No Encontrada!') {
                // Muestra el mensaje de "no disponible" y el conteo a 0
                resultsGrid.innerHTML = `
                    <div class="no-results">
                        <p class="not-found-message">Mascotas no disponibles 😞</p> 
                        <p>Intenta con otros criterios de búsqueda</p>
                    </div>`;
                document.getElementById('petCount').textContent = '0 mascotas encontradas';
            } else {
                // Si la búsqueda tiene éxito, muestra 3 resultados simulados
                displayResults(3); 
            }
        } catch (error) {
            // Manejo de errores (ej: el throw en search.js)
            console.error("Error inesperado durante la búsqueda:", error);
            resultsGrid.innerHTML = `<div class="no-results"><p class="not-found-message">Ocurrió un error en el sistema. 😔</p><p>Revisa la consola para más detalles.</p></div>`;
            document.getElementById('petCount').textContent = '0 mascotas encontradas';
        }
    });
    
    // 4. Manejador del botón Limpiar
    document.getElementById('clear-btn').addEventListener('click', () => {
        // Limpiar inputs
        document.getElementById('name-input').value = '';
        document.getElementById('breed-input').value = '';
        document.getElementById('species-select').value = 'todos';
        document.getElementById('sex-select').value = 'todos';
        document.getElementById('age-select').value = 'todos';
        
        // Volver al estado inicial: oculto y con conteo a 0
        resultsGrid.innerHTML = '';
        document.getElementById('petCount').textContent = '0 mascotas encontradas';
        document.getElementById('searchResults').style.display = 'none';
    });
    
    // 5. Manejador para los botones de Match (Mantenido)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('match-button')) {
            const petName = e.target.closest('.pet-card').querySelector('h3').textContent;
            alert(`¡Has hecho match con ${petName}! Te contactaremos pronto.`);
        }
    });
});
