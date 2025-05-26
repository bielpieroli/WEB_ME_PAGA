
// Função que cuida das tabs, fazendo elas aparecerem ou não
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active de todos
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Esconde todos os conteúdos
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

        // Mostra somente o conteúdo clicado
        const target = this.getAttribute('data-tab');
        document.getElementById(target).style.display = 'block';
    });
});

// Simulação de banco de dados de usuários
const usersDatabase = [
    { id: 1, name: "Rudinei Goularte", email: "rudinei@email.com" },
    { id: 2, name: "Cristina Dutra", email: "cristina@email.com" },
    { id: 3, name: "Fred Scheffel", email: "fred@email.com" },
    { id: 4, name: "Laura Pazini", email: "laura@email.com" },
    { id: 5, name: "Pedro Prestes", email: "pedroprestes@email.com"},
    { id: 6, name: "Pedro Dias", email: "pedrodias@email.com"},
    { id: 7, name: "Pedro Lunkes", email: "pedrolunkes@email.com"}
];

// Supondo uma lista de amigos do usuário atual
let friendsList = ["Pedro Prestes", "Pedro Dias", "Pedro Lunkes"];

// Função para buscar amigos
document.getElementById('search-friend-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('friend-search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
    }

    const results = usersDatabase.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(results);
});

// Função para exibir resultados da busca
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum usuário encontrado</p>';
        resultsContainer.style.display = 'block';
        return;
    }

    results.forEach(user => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'friend-result';
        resultDiv.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <button class="accept-btn add-friend" data-id="${user.id}">Adicionar</button>
        `;
        resultsContainer.appendChild(resultDiv);
    });

    resultsContainer.style.display = 'block';

    // Adiciona interação aos botões de adicionar
    document.querySelectorAll('.add-friend').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const user = usersDatabase.find(u => u.id == userId);
            addFriend(user.name);
        });
    });
}

// Função para adicionar amigo
function addFriend(friendName) {
    if (!friendsList.includes(friendName)) {
        friendsList.push(friendName);
        updateFriendsList();
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('friend-search-input').value = '';
    }
}

// Função para remover amigo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-friend')) {
        const friendItem = e.target.parentElement;
        const friendName = friendItem.textContent.replace('Remover', '').trim();
        friendsList = friendsList.filter(name => name !== friendName);
        updateFriendsList();
    }
});

// Função para atualizar a lista de amigos na tela
function updateFriendsList() {
    const friendsListElement = document.getElementById('friends-list');
    friendsListElement.innerHTML = '';

    friendsList.forEach(friend => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${friend} <button class="negate-btn remove-friend">Remover</button>
        `;
        friendsListElement.appendChild(li);
    });
}

// Inicializa a lista de amigos
updateFriendsList();