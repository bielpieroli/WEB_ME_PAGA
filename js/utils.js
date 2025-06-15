// Função auxiliar para mostrar notificações
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'reminder' ? 'fa-bell' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}"></i>
        ${message}
    `;
    notification.className = `notification-${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}