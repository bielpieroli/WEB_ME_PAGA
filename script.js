
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

// Databases
////////////////////////////
const usersDatabase = new Map([
    [1, { name: "Rudinei Goularte", pic: "", email: "rudinei@email.com" }],
    [2, { name: "Cristina Dutra", pic: "https://media.licdn.com/dms/image/v2/C4D03AQGyM7JWrbbVeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1528285696205?e=1755129600&v=beta&t=yaBVUuTFYcwC1MF3Im7rdTc3WtOAbOwkxzydNb40Zs0", email: "cristina@email.com" }],
    [3, { name: "Fred Scheffel", pic: "", email: "fred@email.com" }],
    [4, { name: "Laura Pazini", pic: "", email: "laura@email.com" }],
    [5, { name: "Pedro Prestes", pic: "", email: "pedroprestes@email.com"}],
    [6, { name: "Pedro Perez", pic: "https://media.licdn.com/dms/image/v2/D4D03AQEAULPt21WknA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1673557820430?e=1753920000&v=beta&t=5qcA54uefUHfGUqDugRzGo1DZpMbsYieafP_4NxfbOI", email: "pedrodias@email.com"}],
    [7, { name: "Pedro Lunkes", pic: "https://media.licdn.com/dms/image/v2/C4E03AQGohCvakI97mA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662724548226?e=1755129600&v=beta&t=pPZV14zEvvChYLeCJQp56nbZ-p1OtbhzBGwQZqRPgi8", email: "pedrolunkes@email.com"}],
    [8, { name: "Henrique Vieira Lima", pic: "", email: "henrique@email.com"}]
]);

// Cada usuário teria seu database de post
const postDatabase = [
    { id_author: 6, type: "Convite", event: "Aniversário do Fred"},
    { id_author: 2, type: "Pagamento", dinheiro: 80.00, event: "Última aula de arquivos"},
    { id_author: 7, type: "Lembrete", dinheiro: 2.00, event: "Vaquinha da cirurgia"}
]
////////////////////////////

// Código para a Aba Home
// Simulação de banco de dados com posts
function updateFeedHome() {
    const feedHomeElement = document.getElementById('feed'); // Pega o bloco de feed
    feedHomeElement.innerHTML = ''; // Limpa ele

    // Função para pegar o conteúdo do post baseado no tipo dele
    const getPostContent = (user, element) => {
        const { type, event, dinheiro } = element;
        switch (type) {
            case 'Convite':
                return `<p>${user.name} te convidou para <b>${event}</b></p>
                        <button class="accept-btn"><i class="fa-solid fa-check"></i> Aceitar</button>
                        <button class="negate-btn"><i class="fa-solid fa-x"></i> Negar</button>`;
            case 'Pagamento':
                return `<p>${user.name} pagou R$${dinheiro} de <b>${event}</b></p>
                        <button class="viewed-btn"><i class="fa-solid fa-check-double"></i> Visto</button>`;
            case 'Lembrete':
                return `<p>${user.name} mandou um lembrete que você deve R$${dinheiro} de <b>${event}</b></p>
                        <button class="viewed-btn"><i class="fa-solid fa-check-double"></i> Visto</button>`;
        }
    };

    // Caso onde o feed não tem publicações
    if (!postDatabase.length) {
        const empty_msg = document.createElement('h1')
        empty_msg.innerHTML = "É tudo por hoje :)"
        empty_msg.className = 'empty-msg'
        feedHomeElement.appendChild(empty_msg);

        return;
    }


    // Para todos os posts na postDatabase, cria um elemento dentro da página
    postDatabase.forEach((element, index) => {
        const user = usersDatabase.get(element.id_author);
        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
            <div class="post-header">
                <img src="${user.pic}" alt="Foto do usuário" class="post-avatar">
                <div class="post-user">
                    <b>${user.name}</b>
                    <span class="post-type">${element.type}</span>
                </div>
            </div>
            <div class="post-content">${getPostContent(user, element)}</div>
        `;

        // Atribui o ID à div para facilitar a remoção depois
        post.dataset.id = index;
        feedHomeElement.appendChild(post);
    });
}

document.getElementById('feed').addEventListener('click', function(event) {
    const button = event.target.closest('button');
    if (button) {
        const postElement = button.closest('.post');
        if (postElement && postElement.dataset.id !== undefined) {
            const id = parseInt(postElement.dataset.id);
            postDatabase.splice(id, 1);
            updateFeedHome();
        }
    }
});

// Código para a Aba Group
// Supondo uma lista de amigos do usuário atual
let friendsList = ["Pedro Prestes", "Pedro Dias", "Pedro Lunkes"];

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
    
    if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
    }

    // Busca dos usuários na database
    const results = [];
    for (const [key, user] of usersDatabase) {
        if (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            results.push({key, user});
        }
    }

    displaySearchResults(results);
});

// Função para exibir resultados da busca
function displaySearchResults(results) {
    console.log(results);
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum usuário encontrado</p>';
        resultsContainer.style.display = 'block';
        return;
    }

    results.forEach(({ key, user }) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'friend-result';
        resultDiv.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <button class="accept-btn add-friend" data-id="${key}">Adicionar</button>
        `;
        resultsContainer.appendChild(resultDiv);
    });

    resultsContainer.style.display = 'block';

    // Adiciona interação aos botões de adicionar
    document.querySelectorAll('.add-friend').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const user = usersDatabase.get(Number(userId));
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
///////////////////////////////////////////////////////////////////////////////

// Inicializa o feed
updateFeedHome()

// Inicializa a lista de amigos
updateFriendsList();