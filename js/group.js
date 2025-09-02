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
        return !friendshipDatabase.includes(Number(index));
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
            const userId = parseInt(this.getAttribute('data-id'));
            
            // Verificação adicional para garantir que não está duplicando
            if (!friendshipDatabase.includes(userId)) {
                friendshipDatabase.push(userId);
                document.getElementById('search-results').style.display = 'none';
                document.getElementById('friend-search-input').value = '';

                // Atualiza as listas
                updateFriendsList();
                updateConnectionsList();

                // DEBUG LISTA DE AMIGOS
                // console.log('Amigo adicionado. friendshipDatabase:', [...friendshipDatabase]);
            }
        });
    });
}

// Função para remover amigo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-friend')) {
        const arrayIndex = parseInt(e.target.dataset.index);
        
        // DEBUGS DE REMOÇÃO
        // console.log('Tentando remover amigo:', arrayIndex);
        // console.log('friendshipDatabase antes:', [...friendshipDatabase]);
        
        // Procura pelo índice e o remove
        if (arrayIndex >= 0 && arrayIndex < friendshipDatabase.length) {
            friendshipDatabase.splice(arrayIndex, 1);

            // DEBUG REMOÇÃO
            // console.log('friendshipDatabase depois:', [...friendshipDatabase]);
            
            // Atualiza as listas
            updateFriendsList();
            updateConnectionsList();
        } else {
            console.error('Índice inválido:', arrayIndex);
        }
    }
});

// Função específica para atualizar lista de amigos na aba Group
function updateFriendsList() {
    const listElement = document.getElementById('friends-list');
    if (!listElement) return;

    // DEBUG DA LISTA DE AMIGOS
    // console.log('Atualizando lista de amigos. friendshipDatabase:', [...friendshipDatabase]);

    listElement.innerHTML = '';
    
    // Se não tem ninguém, então, imprime a mensagem de empty
    if (friendshipDatabase.length === 0) {
        listElement.innerHTML = '<li class="empty-msg">Nenhum amigo adicionado ainda</li>';
        return;
    }

    // Procura por cada amigo com base no database
    friendshipDatabase.forEach((friendId, arrayIndex) => {
        const friend = usersDatabase.find(user => user.id === friendId);

        if (!friend) {
            console.error('Usuário não encontrado para ID:', friendId);
            return;
        }

        // Cria os elementos da lista
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${friend.pic}" alt="Foto do usuário" class="post-avatar">
            ${friend.name} 
            <button class="negate-btn remove-friend" data-index="${arrayIndex}">Remover</button>
        `;
        listElement.appendChild(li);
    });
}

