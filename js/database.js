// Id do usuário atual, já que não temos login nem valores para armazenar a sessão
const ID_USUARIO_ATUAL = 5;

// Database de usuários
const usersDatabase = [
    { name: "Rudinei Goularte", pic: "https://media.licdn.com/dms/image/v2/C4D03AQGG7zzKge2jNA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1581426381030?e=2147483647&v=beta&t=gvbImzeywcy8eBGWrGok8a4wZhgZR4JwFNgCCfsxKDk", email: "rudinei@email.com"},
    { name: "Cristina Dutra", pic: "https://media.licdn.com/dms/image/v2/C4D03AQGyM7JWrbbVeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1528285696205?e=1755129600&v=beta&t=yaBVUuTFYcwC1MF3Im7rdTc3WtOAbOwkxzydNb40Zs0", email: "cristina@email.com" },
    { name: "Fred Scheffel", pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6GVTw9Z91ViGp6os4tqDD6qLea3ucUo9CWw&s", email: "fred@email.com" },
    { name: "Laura Pazini", pic: "https://media.licdn.com/dms/image/v2/D4D03AQFxEAK6MqdbkQ/profile-displayphoto-shrink_200_200/B4DZceDf5eGgAg-/0/1748555924186?e=2147483647&v=beta&t=ldlF9f_lU4VhiM9tMcqjDKX40a1e5WAxIrXxFr55zGA", email: "laura@email.com" },
    { name: "Pedro Prestes", pic: "https://media.licdn.com/dms/image/v2/D4E03AQHptGf-3HyvmQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1726356826970?e=2147483647&v=beta&t=wVVt7hRlHJtEvzCkbfACoPlmJuS0rO4FKraFuy5OL-Q", email: "pedroprestes@email.com"},

    { name: "Pedro Perez", pic: "https://media.licdn.com/dms/image/v2/D4D03AQEAULPt21WknA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1673557820430?e=1753920000&v=beta&t=5qcA54uefUHfGUqDugRzGo1DZpMbsYieafP_4NxfbOI", email: "pedrodias@email.com",
        post: [
            { id_author: 4, type: "Convite", dinheiro: 30.00, event: "Aniversário do Fred"},
            { id_author: 6, type: "Lembrete", dinheiro: 2.00, event: "Vaquinha da cirurgia"}
        ],
        debtDatabase : {
            owedToMe: [
                { name: "Rudinei Goularte", amount: 50.00, event: "Jantar", date: "2023-05-15" },
                { name: "Cristina Dutra", amount: 30.00, event: "Cinema", date: "2023-06-01" }
            ],
            iOwe: [
                { name: "Fred Scheffel", amount: 25.00, event: "Uber", date: "2023-05-20" },
                { name: "Laura Pazini", amount: 15.00, event: "Café", date: "2023-06-05" }
            ],
            history: [
                { name: "Pedro Prestes", amount: 40.00, event: "Presente", date: "2023-04-10", type: "received" },
                { name: "Henrique Vieira", amount: 20.00, event: "Almoço", date: "2023-05-01", type: "paid" }
            ]
        },
        friendship: [4, 6, 7]
    },
    { name: "Pedro Lunkes", pic: "https://media.licdn.com/dms/image/v2/C4E03AQGohCvakI97mA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662724548226?e=1755129600&v=beta&t=pPZV14zEvvChYLeCJQp56nbZ-p1OtbhzBGwQZqRPgi8", email: "pedrolunkes@email.com"},
    { name: "Henrique Vieira Lima", pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTld6zie7maXyWhmIkcx9HiAqtzL4gYzDxRFg&s", email: "henrique@email.com"}
]


const currentUser = usersDatabase[ID_USUARIO_ATUAL];
const postDatabase = currentUser.post;
const debtDatabase = currentUser.debtDatabase;
const friendshipDatabase = currentUser.friendship;

