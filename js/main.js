
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

// Inicializa a wallet quando a aba é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na aba wallet
    if (document.getElementById('wallet')) {
        updateWallet();
        setupWalletCards();
        renderDebtLists();
    }
});

// Atualiza as listas quando muda para as respectivas abas
document.addEventListener('click', function(e) {
    if (e.target.matches('.tab-link[data-tab="group"]')) {
        setTimeout(updateFriendsList, 100);
    }
    if (e.target.matches('.tab-link[data-tab="add"]')) {
        setTimeout(updateConnectionsList, 100);
    }
});


// Atualiza a wallet quando a aba é clicada
document.querySelector('.tab-link[data-tab="wallet"]').addEventListener('click', function() {
    updateWallet();
    renderDebtLists();
});

///////////////////////////////////////////////////////////////////////////////

updateFeedHome()
updateFriendsList();
updateConnectionsList();