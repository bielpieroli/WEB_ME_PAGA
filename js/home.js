// Dado a database de posts, atualiza o feed da aba Home
function updateFeedHome() {
    const feedHomeElement = document.getElementById('home'); // Pega o bloco de home
    feedHomeElement.innerHTML = ''; // Limpa ele

    // Caso onde o feed não tem publicações, mensagem personalizada
    if (postDatabase.length === 0) {
        const empty_msg = document.createElement('h1')
        empty_msg.innerHTML = "É tudo por hoje :)"
        empty_msg.className = 'empty-msg'
        feedHomeElement.appendChild(empty_msg);

        return;
    }

    // Função para pegar o conteúdo do post baseado no tipo dele
    const getPostContent = (user, element) => {
        const { type, event, dinheiro } = element;
        switch (type) {
            case 'Convite':
                return `<p>${user.name} te convidou para <b>${event}</b> no valor de R$${dinheiro}</p>
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

    // Para todos os posts na postDatabase, cria um elemento dentro da página
    postDatabase.forEach((element, index) => {
        // Pega o responsável pela publicação no user database
        const user = usersDatabase[element.id_author];

        // Cria o elemento de post
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
        `; // O conteúdo é ditado pela função getPostContent

        // Atribui o ID (índice na lista de posts) à div para facilitar a remoção depois
        post.dataset.id = index;
        feedHomeElement.appendChild(post);
    });
}

// Remover o post do feed ao apertar o botão
document.getElementById('home').addEventListener('click', function(event) {
    const button = event.target.closest('button'); // Pega o botão mais próximo do evento de clicar
    const postElement = button.closest('.post'); // Pega o elemento de post mais próximo
    const id = parseInt(postElement.dataset.id); // Pega o índice do post na database para remoção

    // Se o botão for de aceitar, adiciona o evento no post na database de eventos do usuário
    if (button.className === "accept-btn") {
        eventAccepted = postDatabase[id];
        eventsDatabase.push({event: eventAccepted.event, cost: eventAccepted.dinheiro})
        updateEventsList();
    }

    // Remove o post da listas de posts e atualiza o feed
    postDatabase.splice(id, 1);
    updateFeedHome();
});