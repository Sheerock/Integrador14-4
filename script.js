const apiUrl = 'https://rickandmortyapi.com/api/character';
let currentPageUrl = apiUrl;
let allCharacters = [];

let allSpecies = new Set();

async function fetchCharacters(url) {
    const charactersDiv = document.getElementById('characters');

    charactersDiv.innerHTML = "";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            allCharacters = data.results;
            displayCharacters(allCharacters);
            updateNavigation(data.info);
        } else {
            charactersDiv.innerHTML = "<p>No se encontraron personajes.</p>";
        }
    } catch (error) {
        charactersDiv.innerHTML = "<p>Error al cargar los personajes.</p>";
        console.error("Error:", error);
    }
}

function displayCharacters(characters) {
    const charactersDiv = document.getElementById('characters');
    charactersDiv.innerHTML = "";

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
        `;
        characterDiv.onclick = () => showDetails(character);
        charactersDiv.appendChild(characterDiv);
    });
}

function updateSpeciesFilter(speciesList) {
    const speciesFilter = document.getElementById('speciesFilter');
    speciesFilter.innerHTML = '<option value="">Todas las especies</option>';

    speciesList.forEach(species => {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        speciesFilter.appendChild(option);
    });
}
async function fetchAllSpecies() {
    let speciesSet = new Set();
    let url = `${apiUrl}?page=1`;

    try {
        while (url) {
            const response = await fetch(url);
            const data = await response.json();

            data.results.forEach(character => speciesSet.add(character.species));

            url = data.info.next;
        }
        updateSpeciesFilter(Array.from(speciesSet));
    } catch (error) {
        console.error("Error al obtener todas las especies:", error);
    }
}

function updateNavigation(info) {
    document.getElementById('prevBtn').disabled = !info.prev;
    document.getElementById('nextBtn').disabled = !info.next;

    document.getElementById('prevBtn').onclick = () => fetchCharacters(info.prev);
    document.getElementById('nextBtn').onclick = () => fetchCharacters(info.next);
}

function showDetails(character) {
    const modal = document.getElementById("modal");
    const modalDetails = document.getElementById("modalDetails");

    modalDetails.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Especie: ${character.species}</p>
        <p>Estado: ${character.status}</p>
        <p>Género: ${character.gender}</p>
    `;

    modal.style.display = "flex";
}
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
});
//Cierra la ventana modal sin la x
document.getElementById('modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('modal')) {
        document.getElementById('modal').style.display = "none";
    }
});
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    document.getElementById('modalDetails').innerHTML = "";
});

function applyFilters() {
    let filteredUrl = `${apiUrl}?`;
    const name = document.getElementById('nameFilter').value.trim();
    const species = document.getElementById('speciesFilter').value;
    const status = document.getElementById('statusFilter').value;
    const gender = document.getElementById('genderFilter').value;

    if (name) filteredUrl += `name=${encodeURIComponent(name)}&`;
    if (species) filteredUrl += `species=${encodeURIComponent(species)}&`;
    if (status) filteredUrl += `status=${encodeURIComponent(status)}&`;
    if (gender) filteredUrl += `gender=${encodeURIComponent(gender)}&`;

    console.log("Filtrando personajes con URL:", filteredUrl);
    fetchCharacters(filteredUrl);
}

document.getElementById('applyFilters').addEventListener('click', applyFilters);

fetchAllSpecies();
fetchCharacters(currentPageUrl);