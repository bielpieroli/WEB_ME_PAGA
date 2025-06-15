function updateWallet() {
    // Calcula totais
    const totalOwedToMe = debtDatabase.owedToMe.reduce((sum, debt) => sum + debt.amount, 0);
    const totalIOwe = debtDatabase.iOwe.reduce((sum, debt) => sum + debt.amount, 0);
    
    // Atualiza os cards
    document.getElementById('owed-to-me-card').innerHTML = `
        <h3>Estão me devendo</h3>
        <p>R$ ${totalOwedToMe.toFixed(2)}</p>
    `;
    
    document.getElementById('i-owe-card').innerHTML = `
        <h3>Estou devendo</h3>
        <p>R$ ${totalIOwe.toFixed(2)}</p>
    `;
    
    document.getElementById('history-card').innerHTML = `
        <h3>Histórico</h3>
        <p>${debtDatabase.history.length} transações</p>
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
    
    // Lista "Estou devendo"
    const iOweList = document.getElementById('i-owe-list');
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
    
    // Lista "Histórico"
    const historyList = document.getElementById('history-list');
    const sortedHistory = [...debtDatabase.history].sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Ordena do mais recente para o mais antigo
    });

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
    
    // Adiciona eventos aos botões
    document.querySelectorAll('.remind-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Lembrete enviado!');
        });
    });
    
    document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const debtItem = this.closest('.debt-item');
            const name = debtItem.querySelector('.debt-name').textContent;
            const amount = parseFloat(debtItem.querySelector('.debt-amount').textContent.replace('R$ ', ''));
            const event = debtItem.querySelector('.debt-event').textContent;
            
            if (confirm(`Confirmar pagamento de R$ ${amount.toFixed(2)} para ${name} (${event})?`)) {
                // Remove a dívida de `iOwe`
                const debtIndex = debtDatabase.iOwe.findIndex(debt => 
                    debt.name === name && 
                    debt.amount === amount && 
                    debt.event === event
                );
                
                if (debtIndex !== -1) {
                    const paidDebt = debtDatabase.iOwe.splice(debtIndex, 1)[0];
                    
                    // Adiciona ao histórico como "paid"
                    debtDatabase.history.push({
                        name: paidDebt.name,
                        amount: paidDebt.amount,
                        event: paidDebt.event,
                        date: new Date().toISOString().split('T')[0], // Data atual
                        type: 'paid'
                    });
                    
                    // Atualiza a interface
                    updateWallet();
                    renderDebtLists();
                    alert('Pagamento registrado com sucesso!');
                }
            }
        });
    });
}

// Inicializa a wallet quando a aba é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na aba wallet
    if (document.getElementById('wallet')) {
        updateWallet();
        setupWalletCards();
        renderDebtLists();
    }
});

// Atualiza a wallet quando a aba é clicada
document.querySelector('.tab-link[data-tab="wallet"]').addEventListener('click', function() {
    updateWallet();
    renderDebtLists();
    setupWalletCards();
});