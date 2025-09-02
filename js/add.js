function setupEventCreation() {
    // Adiciona o listener do button
    const createEventBtn = document.querySelector('.create-event-btn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', createEvent);
    }

    // Adiciona o evento de Enter no campo de valor
    const valueInput = document.getElementById('value-event');
    if (valueInput) {
        valueInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                createEvent();
            }
        });
    }
}

async function createEvent() {
    const description = document.getElementById('description-event')?.value.trim();
    const valueInput = document.getElementById('value-event')?.value.trim();
    const value = parseFloat(valueInput?.replace(',', '.') || '0'); 

    // Validações de campos existentes
    if (!description) {
        showNotification('Por favor, preencha a descrição do evento.', 'error');
        return;
    }
    
    if (isNaN(value) || value <= 0) {
        showNotification('Por favor, insira um valor válido maior que zero.', 'error');
        return;
    }

    const checkboxes = document.querySelectorAll('#connections-list input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        showNotification('Selecione pelo menos um participante para o evento.', 'error');
        return;
    }

    // Pergunta se o usuário quer se incluir no rateio
    const includeSelf = await askIncludeSelf();

    // Coleta os participantes selecionados
    const participants = [];
    checkboxes.forEach(checkbox => {
        const friendId = parseInt(checkbox.dataset.id);
        const friend = usersDatabase.find(user => user.id === friendId);
        if (friend) {
            participants.push({
                id: friendId,
                name: friend.name
            });
        }
    });

    // Se o usuário quiser se incluir, adiciona ele mesmo como participante
    if (includeSelf) {
        participants.push({
            id: ID_USUARIO_ATUAL,
            name: 'Você'
        });
    }

    // Calcula o valor por pessoa
    const valuePerPerson = value / participants.length;

    // Cria o evento na carteira (owed-to-me)
    participants.forEach(participant => {
        // Não adiciona dívida para o próprio usuário se ele estiver incluído
        if (participant.id === ID_USUARIO_ATUAL) return;

        const newDebt = {
            name: participant.name,
            amount: valuePerPerson,
            event: description,
            date: new Date().toISOString().split('T')[0]
        };

        // Adiciona à lista "Estão me devendo"
        debtDatabase.owedToMe.push(newDebt);
    });

    // Atualiza a interface
    updateWallet();
    renderDebtLists();

    // Mostra notificação de sucesso
    showNotification(`Evento "${description}" criado com sucesso! Valor por pessoa: R$ ${valuePerPerson.toFixed(2)}`, 'success');

    // Limpa os campos
    const descInput = document.getElementById('description-event');
    const valInput = document.getElementById('value-event');
    if (descInput) descInput.value = '';
    if (valInput) valInput.value = '';

    // Desmarca todos os checkboxes
    document.querySelectorAll('#connections-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Função para quando o usuário clica na aba Add
document.querySelector('.tab-link[data-tab="add"]')?.addEventListener('click', function() {
    // Usa a nova função
    updateConnectionsList();

});

async function askIncludeSelf() {
    return new Promise((resolve) => {
        // Verifica se já existe uma modal aberta
        if (document.querySelector('.rateio-modal')) {
            resolve(false);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'rateio-modal';
        
        modal.innerHTML = `
            <div class="rateio-content">
                <h3>Participar do Rateio?</h3>
                <p>Deseja incluir você mesmo na divisão do valor?</p>
                
                <div class="rateio-toggle-container">
                    <label class="switch">
                        <input type="checkbox" id="include-toggle" checked>
                        <span class="slider"></span>
                    </label>
                    <span id="toggle-label" class="toggle-label">Sim</span>
                </div>
                
                <div class="rateio-options">
                    <button id="confirm-rateio" class="rateio-btn rateio-btn-yes">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const toggle = document.getElementById('include-toggle');
        const toggleLabel = document.getElementById('toggle-label');
        
        toggle?.addEventListener('change', () => {
            if (toggleLabel) {
                toggleLabel.textContent = toggle.checked ? 'Sim' : 'Não';
            }
        });
        
        document.getElementById('confirm-rateio')?.addEventListener('click', () => {
            const isIncluded = toggle ? toggle.checked : false;
            document.body.removeChild(modal);
            resolve(isIncluded);
        });

        // Fecha ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve(false);
            }
        });
    });
}

// Função específica para atualizar lista de conexões na aba Add
function updateConnectionsList() {
    const listElement = document.getElementById('connections-list');
    if (!listElement) return;

    listElement.innerHTML = '';
    
    // Imprime uma mensagem para quem é sozinho #devlove
    if (friendshipDatabase.length === 0) {
        listElement.innerHTML = '<li class="empty-msg">Nenhum amigo adicionado ainda</li>';
        return;
    }

    // Procura pelos amigos na lista de conecções e adiciona uma checkbox para cada nome
    friendshipDatabase.forEach(friendId => {
        const friend = usersDatabase.find(user => user.id === friendId);
        if (!friend) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <label class="connection-item">
                <input type="checkbox" data-id="${friend.id}">
                <img src="${friend.pic}" alt="Foto de ${friend.name}" class="post-avatar">
                <span>${friend.name}</span>
            </label>
        `;
        listElement.appendChild(li);
    });
}