let currentPokemonId = 1;
let isShiny = false;

function fetchPokemonData(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
    .then(data => {
      displayPokemonData(data);
      fetchSpeciesData(data.species.url);
    })
    .catch(error => console.error('Error:', error));
}

function fetchSpeciesData(speciesUrl) {
  fetch(speciesUrl)
    .then(response => response.json())
    .then(data => {
      const description = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
      document.getElementById('pokemon-description').textContent = description;
      fetchEvolutionData(data.evolution_chain.url);
    })
    .catch(error => console.error('Error:', error));
}

function fetchEvolutionData(evolutionChainUrl) {
  fetch(evolutionChainUrl)
    .then(response => response.json())
    .then(data => {
      displayEvolutionData(data.chain);
    })
    .catch(error => console.error('Error:', error));
}

function displayPokemonData(data) {
  document.getElementById('pokemon-name').textContent = data.name;
  document.getElementById('pokemon-number').textContent = `#${data.id.toString().padStart(3, '0')}`;
  document.getElementById('pokemon-image').src = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
  document.getElementById('pokemon-stats-list').innerHTML = '';
  data.stats.forEach(stat => {
    const statItem = document.createElement('div');
    statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    document.getElementById('pokemon-stats-list').appendChild(statItem);
  });
}

function displayEvolutionData(chain) {
  const evolutionChain = document.getElementById('evolution-chain');
  evolutionChain.innerHTML = '';

  let currentChain = chain;
  while (currentChain) {
    const evolutionItem = document.createElement('div');
    evolutionItem.textContent = currentChain.species.name;
    evolutionChain.appendChild(evolutionItem);

    if (currentChain.evolves_to.length > 0) {
      currentChain = currentChain.evolves_to[0];
    } else {
      currentChain = null;
    }
  }
}

document.getElementById('shiny-button').addEventListener('click', () => {
  isShiny = !isShiny;
  fetchPokemonData(currentPokemonId);
});

document.getElementById('prev-button').addEventListener('click', () => {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    fetchPokemonData(currentPokemonId);
  }
});

document.getElementById('next-button').addEventListener('click', () => {
  currentPokemonId++;
  fetchPokemonData(currentPokemonId);
});

fetchPokemonData(currentPokemonId);
