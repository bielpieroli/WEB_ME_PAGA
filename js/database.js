// Id do usuário atual, já que não temos login nem valores para armazenar a sessão
const ID_USUARIO_ATUAL = 5;

// Database de usuários
const usersDatabase = [
    { name: "Rudinei Goularte", pic: "", email: "rudinei@email.com"},
    { name: "Cristina Dutra", pic: "https://media.licdn.com/dms/image/v2/C4D03AQGyM7JWrbbVeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1528285696205?e=1755129600&v=beta&t=yaBVUuTFYcwC1MF3Im7rdTc3WtOAbOwkxzydNb40Zs0", email: "cristina@email.com" },
    { name: "Fred Scheffel", pic: "", email: "fred@email.com" },
    { name: "Laura Pazini", pic: "", email: "laura@email.com" },
    { name: "Pedro Prestes", pic: "", email: "pedroprestes@email.com"},

    { name: "Pedro Perez", pic: "https://media.licdn.com/dms/image/v2/D4D03AQEAULPt21WknA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1673557820430?e=1753920000&v=beta&t=5qcA54uefUHfGUqDugRzGo1DZpMbsYieafP_4NxfbOI", email: "pedrodias@email.com",
        post: [
            { id_author: 4, type: "Convite", dinheiro: 30.00, event: "Aniversário do Fred"},
            { id_author: 6, type: "Lembrete", dinheiro: 2.00, event: "Vaquinha da cirurgia"}
        ],
        events: [
            {event: "Blackout", cost: 80.0},
            {event: "Casa do Barbosa", cost: 60.0},
            {event: "Vaquinha da cirurgia", cost: 2.0},    
        ],
        friendship: [4, 6, 7]
    },
    { name: "Pedro Lunkes", pic: "https://media.licdn.com/dms/image/v2/C4E03AQGohCvakI97mA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662724548226?e=1755129600&v=beta&t=pPZV14zEvvChYLeCJQp56nbZ-p1OtbhzBGwQZqRPgi8", email: "pedrolunkes@email.com"},
    { name: "Henrique Vieira Lima", pic: "", email: "henrique@email.com"}
]

const currentUser = usersDatabase[ID_USUARIO_ATUAL];
const postDatabase = currentUser.post;
const eventsDatabase = currentUser.events;
const friendshipDatabase = currentUser.friendship;

