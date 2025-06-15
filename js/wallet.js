// Atualiza os cards da carteira
function updateWallet() {
    // Calcula totais
    const totalOwedToMe = debtDatabase.owedToMe.reduce((sum, debt) => sum + debt.amount, 0);
    const totalIOwe = debtDatabase.iOwe.reduce((sum, debt) => sum + debt.amount, 0);
    
    // Atualiza os cards
    document.getElementById('owed-to-me-card').innerHTML = `
        <div class="wallet-card-content">
            <h3>ESTÃO ME DEVENDO</h3>
            <p>R$ ${totalOwedToMe.toFixed(2)}</p>
        </div>
    `;
    
    document.getElementById('i-owe-card').innerHTML = `
        <div class="wallet-card-content">
            <h3>ESTOU DEVENDO</h3>
            <p>R$ ${totalIOwe.toFixed(2)}</p>
        </div>
    `;
    
    document.getElementById('history-card').innerHTML = `
        <div class="wallet-card-content">
            <h3>HISTÓRICO</h3>
            <p>${debtDatabase.history.length} transações</p>
        </div>
    `;
}

// Mostra/oculta a lista de dívidas quando um card é clicado
function setupWalletCards() {
    const cards = document.querySelectorAll('.wallet-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const listId = this.id.replace('-card', '-list');
            const list = document.getElementById(listId);
            
            // Oculta todas as listas primeiro
            document.querySelectorAll('.debt-list').forEach(l => {
                if (l.id !== listId) l.style.display = 'none';
            });
            
            // Alterna a lista clicada
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        });
    });
}

// Renderiza as listas de dívidas
function renderDebtLists() {
    // Lista "Estão me devendo"
    const owedToMeList = document.getElementById('owed-to-me-list');
    if (debtDatabase.owedToMe.length === 0) {
        owedToMeList.innerHTML = '<li class="empty-msg">Não há caloteiros! Tudo lhe foi pago!</li>';
    } else {
        owedToMeList.innerHTML = debtDatabase.owedToMe.map(debt => `
            <li class="debt-item">
                <div class="debt-info">
                    <span class="debt-name">${debt.name}</span>
                    <span class="debt-amount">R$ ${debt.amount.toFixed(2)}</span>
                    <span class="debt-event">${debt.event}</span>
                </div>
                <button class="remind-btn">Lembrar</button>
            </li>
        `).join('');
    }

    // Lista "Estou devendo"
    const iOweList = document.getElementById('i-owe-list');
    if (debtDatabase.iOwe.length === 0) {
        iOweList.innerHTML = '<li class="empty-msg">Você não está devendo nada</li>';
    } else {
        iOweList.innerHTML = debtDatabase.iOwe.map(debt => `
            <li class="debt-item">
                <div class="debt-info">
                    <span class="debt-name">${debt.name}</span>
                    <span class="debt-amount">R$ ${debt.amount.toFixed(2)}</span>
                    <span class="debt-event">${debt.event}</span>
                </div>
                <button class="pay-btn">Pagar</button>
            </li>
        `).join('');
    }

    // Lista "Histórico"
    const historyList = document.getElementById('history-list');
    const sortedHistory = [...debtDatabase.history].sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Ordena do mais recente para o mais antigo
    });

    if (sortedHistory.length === 0) {
        historyList.innerHTML = '<li class="empty-msg">Não há histórico de dívidas anteriores</li>';
    } else {
        historyList.innerHTML = sortedHistory.map(transaction => `
            <li class="debt-item ${transaction.type}">
                <div class="debt-info">
                    <span class="debt-name">${transaction.name}</span>
                    <span class="debt-amount">R$ ${transaction.amount.toFixed(2)}</span>
                    <span class="debt-event">${transaction.event}</span>
                    <span class="debt-date">${transaction.date}</span>
                </div>
                <span class="transaction-type">${transaction.type === 'received' ? 'Recebido' : 'Pago'}</span>
            </li>
        `).join('');
    }

    // Evento de relembrar a pessoa do pagamento
    document.querySelectorAll('.remind-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Recebe as infos da dívida
            const debtItem = this.closest('.debt-item');
            const name = debtItem.querySelector('.debt-name').textContent;
            const amount = parseFloat(debtItem.querySelector('.debt-amount').textContent.replace('R$ ', ''));
            const event = debtItem.querySelector('.debt-event').textContent;

            // Notificação de que o lembrete foi enviado
            showNotification(`${name} recebeu um lembrete para pagar R$ ${amount.toFixed(2)} do(a) ${event}`, 'reminder');

            // Simulação de pagamento após 10 segundos
            setTimeout(() => {
                const debtIndex = debtDatabase.owedToMe.findIndex(debt => 
                    debt.name === name && 
                    debt.amount === amount && 
                    debt.event === event
                );
                
                if (debtIndex !== -1) {
                    const paidDebt = debtDatabase.owedToMe.splice(debtIndex, 1)[0];
                    
                    debtDatabase.history.push({
                        name: paidDebt.name,
                        amount: paidDebt.amount,
                        event: paidDebt.event,
                        date: new Date().toISOString().split('T')[0],
                        type: 'received'
                    });
                    
                    updateWallet();
                    renderDebtLists();
                    showNotification(`${name} pagou R$ ${amount.toFixed(2)} do(a) ${event}!`, 'success');
                }
            }, 10000);
        });
    });
    
    // Evento do pagamento, fazendo a confirmação
    document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const debtItem = this.closest('.debt-item');
            const name = debtItem.querySelector('.debt-name').textContent;
            const amount = parseFloat(debtItem.querySelector('.debt-amount').textContent.replace('R$ ', ''));
            const event = debtItem.querySelector('.debt-event').textContent;

            const confirmPayment = await showPaymentModal(name, amount, event);
            
            if (confirmPayment) {
                processPayment(name, amount, event);
            }
        });
    });

    // Exibir o modal na tela
    async function showPaymentModal(name, amount, event) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'payment-modal';
            
            modal.innerHTML = `
                <div class="payment-content">
                    <h3>Confirmar Pagamento</h3>
                    <div class="payment-details">
                        <p><strong>Para:</strong> ${name}</p>
                        <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
                        <p><strong>Evento:</strong> ${event}</p>
                    </div>
                    
                    <div class="payment-options">
                        <button id="cancel-payment" class="payment-btn payment-btn-cancel">Cancelar</button>
                        <button id="confirm-payment" class="payment-btn payment-btn-confirm">
                            <i class="fas fa-check-circle"></i> Confirmar Pagamento
                        </button>
                    </div>
                </div>
            `;
            
            // Coloca o modal
            document.body.appendChild(modal);
            
            // De acordo com o botão clicado, retorna se a pessoa confirmou ou não
            document.getElementById('confirm-payment')?.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });
            
            document.getElementById('cancel-payment')?.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(false);
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

    // Processar o pagamento e atualizar o database
    async function processPayment(name, amount, event) {
        const confirmBtn = document.getElementById('confirm-payment');
        const originalContent = confirmBtn?.innerHTML;
        
        // Simula um delay de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const debtIndex = debtDatabase.iOwe.findIndex(debt => 
            debt.name === name && 
            debt.amount === amount && 
            debt.event === event
        );
        
        if (debtIndex !== -1) {
            const paidDebt = debtDatabase.iOwe.splice(debtIndex, 1)[0];
            
            debtDatabase.history.push({
                name: paidDebt.name,
                amount: paidDebt.amount,
                event: paidDebt.event,
                date: new Date().toISOString().split('T')[0],
                type: 'paid'
            });
            
            updateWallet();
            renderDebtLists();

            showNotification(`Pagamento de R$ ${amount.toFixed(2)} para ${name} registrado!`, 'success');
        }

        if (confirmBtn) {
            confirmBtn.innerHTML = originalContent;
            confirmBtn.disabled = false;
        }
    }
}