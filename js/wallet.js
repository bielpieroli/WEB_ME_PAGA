// Cria evento
document.getElementById('create-event-btn').addEventListener('click', function(e) {
    descricao = document.getElementById('description-event').value
    valor = document.getElementById('value-event').value
    eventsDatabase.push({event: descricao, cost: valor})
    document.getElementById('description-event').value = ''
    document.getElementById('value-event').value = ''
    updateEventsList()
});

function updateEventsList() {
    const listElement = document.getElementById('events-list');

    listElement.innerHTML = '';
    for(const event of eventsDatabase) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${event.event} R$ ${event.cost}
        `;
        listElement.appendChild(li);
    }
}