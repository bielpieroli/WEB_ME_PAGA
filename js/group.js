// Acrescente o Enter à busca
document.getElementById('friend-search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('search-friend-btn').click();
    }
});

// Função para buscar amigos 
document.getElementById('search-friend-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('friend-search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');

    // Se o usuário não pesquisou nada, mantém display como none
    if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
    }

    // Busca dos usuários na database, adicionando em uma lista de resultados
    const results = [];

    usersDatabase.forEach((user, index) => {
        if (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            results.push({user, index});
        }
    });

    // Chama a função de mostrar os resultados de busca
    displaySearchResults(results);
});


// Função para exibir resultados da busca
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'block';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum usuário encontrado</p>';
        return;
    }

    // Filtra resultados: remove usuários já adicionados
    const filteredResults = results.filter(({ index }) => {
        return !friendshipDatabase.includes(Number(index)); // Convertemos para número para garantir a comparação
    });

    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum usuário novo encontrado</p>';
        return;
    }

    // Adiciona apenas usuários que não estão na lista de amigos
    filteredResults.forEach(({ user, index }) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'friend-result';
        resultDiv.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <button class="accept-btn add-friend" data-id="${index}">Adicionar</button>
        `;
        resultsContainer.appendChild(resultDiv);
    });

    // Adiciona interação aos botões de adicionar
    document.querySelectorAll('.add-friend').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            
            // Verificação adicional para garantir que não está duplicando
            if (!friendshipDatabase.includes(Number(userId))) {
                friendshipDatabase.push(Number(userId));
                document.getElementById('search-results').style.display = 'none';
                document.getElementById('friend-search-input').value = '';
                updateUserList('friends-list', 'Remover');
                updateUserList('connections-list', 'Adicionar ao evento');
            } else {
                alert('Este usuário já está na sua lista de amigos!');
            }
        });
    });
}

// Função para remover amigo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-friend')) {
        const index = e.target.dataset.id;
        friendshipDatabase.splice(index, 1);
        updateUserList('friends-list', 'Remover');
        updateUserList('connections-list', 'Adicionar ao evento');
    }
});

// Função para atualizar a lista de amigos na tela
function updateUserList(listId, buttonText) {
    const listElement = document.getElementById(listId);

    listElement.innerHTML = '';
    friendshipDatabase.forEach((friendId, index) => {
        const friend = usersDatabase[friendId];
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${friend.pic}" alt="Foto do usuário" class="post-avatar">
            ${friend.name} <button class="negate-btn remove-friend" data-id=${index}>${buttonText}</button>
        `;
        listElement.appendChild(li);
    });
}