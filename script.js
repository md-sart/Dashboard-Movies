// URL e cabeçalhos para a API
const API_URL = 'https://parseapi.back4app.com/parse/classes/Filmes';
const HEADERS = {
    'X-Parse-Application-Id': '00p7E4sStvXibIFPxfV3V1DG0F0Jyr7eASXaaJsq',
    'X-Parse-REST-API-Key': 'ApKQl2wQeyMOLLVQc3H9RATwjRRhXa20nqH4ujbK',
    'Content-Type': 'application/json'
};

// Recuperar dados e gerar gráfico
fetch(API_URL, { headers: HEADERS })
    .then(response => response.json())
    .then(data => {
        const filmes = data.results || [];

        // Dados para gráficos
        const generoCounts = {};
        const paisCounts = {};
        const scores = [];

        filmes.forEach(filme => {
            // Contagem de gêneros
            if (filme.genre) {
                generoCounts[filme.genre] = (generoCounts[filme.genre] || 0) + 1;
            }

            // Contagem de países
            if (filme.country) {
                paisCounts[filme.country] = (paisCounts[filme.country] || 0) + 1;
            }

            // Escala de scores
            if (filme.score) {
                scores.push(filme.score);
            }
        });

        // Gráfico de filmes por gênero
        const generoCtx = document.getElementById("chartGenero").getContext("2d");
        new Chart(generoCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(generoCounts),
                datasets: [{
                    label: 'Filmes por Gênero',
                    data: Object.values(generoCounts),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'Filmes por Gênero' } }
            }
        });

        // Gráfico de filmes por país
        const paisCtx = document.getElementById("chartPais").getContext("2d");
        new Chart(paisCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(paisCounts),
                datasets: [{
                    label: 'Filmes por País',
                    data: Object.values(paisCounts),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { title: { display: true, text: 'Filmes por País' } }
            }
        });

        // Escala de scores dos filmes
        const scoreCtx = document.getElementById("chartScore").getContext("2d");
        new Chart(scoreCtx, {
            type: 'line',
            data: {
                labels: scores.map((_, index) => `Filme ${index + 1}`),
                datasets: [{
                    label: 'Scores dos Filmes',
                    data: scores,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'Escala de Scores dos Filmes' } }
            }
        });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));




// Adicionar filme
document.getElementById('dadosForm').addEventListener('submit', event => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const ano = parseInt(document.getElementById('ano').value, 10);

    fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ name: nome, year: ano })
    })
        .then(response => response.json())
        .then(() => alert('Filme adicionado com sucesso!'))
        .catch(error => console.error('Erro ao adicionar filme:', error));
});

// Editar filme
document.getElementById('editarForm').addEventListener('submit', event => {
    event.preventDefault();

    const objectId = document.getElementById('editObjectId').value;
    const nome = document.getElementById('editNome').value;
    const ano = document.getElementById('editAno').value;

    const updates = {};
    if (nome) updates.name = nome;
    if (ano) updates.year = parseInt(ano, 10);

    fetch(`${API_URL}/${objectId}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updates)
    })
        .then(response => response.json())
        .then(() => alert('Filme editado com sucesso!'))
        .catch(error => console.error('Erro ao editar filme:', error));
});

// Deletar filme
document.getElementById('deletarForm').addEventListener('submit', event => {
    event.preventDefault();

    const objectId = document.getElementById('deleteObjectId').value;

    fetch(`${API_URL}/${objectId}`, {
        method: 'DELETE',
        headers: HEADERS
    })
        .then(() => alert('Filme deletado com sucesso!'))
        .catch(error => console.error('Erro ao deletar filme:', error));
});
