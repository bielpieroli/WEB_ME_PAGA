// ========== SISTEMA DE ABAS ==========
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

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa TODAS as abas de uma vez
    initializeAllTabs();
    
    // Configura os event listeners para mudança de aba e atualização das informações
    setupTabSwitching();
});

function initializeAllTabs() {
    // Home
    updateFeedHome();
    
    // Wallet
    updateWallet();
    setupWalletCards();
    renderDebtLists();
    
    // Add
    setupEventCreation();
    
    // Group e Add (listas de amigos)
    updateFriendsList();
    updateConnectionsList();
    
}

function setupTabSwitching() {
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.tab-link')) return;
        
        const tabName = e.target.dataset.tab;
        
        // De acordo com a aba, atualiza as informações, garantindo que esteja tudo certo
        setTimeout(() => {
            switch(tabName) {
                case 'home':
                   updateFeedHome();
                    break;
                    
                case 'wallet':
                    updateWallet();
                    renderDebtLists();
                    break;
                    
                case 'group':
                    updateFriendsList();
                    break;
                    
                case 'add':
                    updateConnectionsList();
                    break;
                    
                case 'profile':
                    break;
            }
        }, 50);
    });
}