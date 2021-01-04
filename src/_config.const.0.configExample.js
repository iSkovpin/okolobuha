const configExample = {
    timezone: 'GMT+7',
    dateFormat: 'dd.MM.yyyy',
    telegramNotifications: true,
    telegramBot: {
        token: '<token>',
        channelId: -123456789,
        silentBuffer: 600, // seconds
        lastCallTimePropName: 'TG_BOT_LAST_CALL_TIME',
    },
    sheets: {
        expenses: {
            name: 'Expenses',
            rows: {
                tableHeader: 2,
                sampleData: 3,
                firstData: 4,
            },
            columns: {
                date: 1,
                sum: 2,
                sumDebt: 3,
                payer: 4,
                info: 5,
                debtors: [
                    {
                        name: 6,
                        sum: 6,
                        check: 7,
                        participant: 15,
                    },
                    {
                        name: 8,
                        sum: 8,
                        check: 9,
                        participant: 16,
                    },
                    {
                        name: 10,
                        sum: 10,
                        check: 11,
                        participant: 17,
                    },
                    {
                        name: 12,
                        sum: 12,
                        check: 13,
                        participant: 18,
                    }
                ]
            },

        },
        debts: {
            name: 'Debts',
            rows: {
                sumDebt: [17, 18, 19, 20],
                sumDebtDebtors: 16,
            },
            columns: {
                sumDebt: [2, 3, 4, 5],
                sumDebtPayers: 1,
            },
        }
    },
    dict: {
        verbs: [
            ['заплатить', 'заплатил', 'заплатила', 'заплатило'],
            ['добавить', 'добавил', 'добавила', 'добавило'],
        ],
        nouns: [
            ['кто-то', 'кого-то', 'кому-то', 'кого-то', 'кем-то', 'о ком-то', 'm'],
            ['Иван', 'Ивана', 'Ивану', 'Ивана', 'Иваном', 'об Иване', 'm'],
            ['Арсения', 'Арсении', 'Арсении', 'Арсению', 'Арсенией', 'об Арсении', 'f'],
            ['Александр', 'Александра', 'Александру', 'Александра', 'Александром', 'об Александре', 'm'],
            ['Яна', 'Яны', 'Яне', 'Яну', 'Яной', 'о Яне', 'f'],
        ]
    }
};
