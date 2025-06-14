
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

///////////////////////////////////////////////////////////////////////////////

updateFeedHome()
updateUserList('friends-list', 'Remover');
updateUserList('connections-list', 'Adicionar ao evento');
updateEventsList()