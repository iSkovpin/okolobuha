const configExample = {
    timezone: 'GMT+7',
    dateFormat: 'dd.MM.yyyy',
    tgBotToken: "<token>",
    tgBotChannelId: -123456789,
    tgBotSilentBuffer: 600,
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
};
