const { EmbedBuilder } = require('discord.js');

// Role ID required to use the command
const requiredRoleId = '1472057214557622355';

module.exports = {
    name: 'tax',
    description: 'Calculate the required Robux price to receive a specific amount after the 30% tax.',

    async execute(message, args) {

        // 1. Permission Check: Check for the specific required Role ID

        // 2. Input Validation: Get the amount from the first argument
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                content: '<:cross:1497799113222262834> Please provide a valid, positive number for the amount you want to receive. Example: `-tax 100`',
                allowedMentions: { repliedUser: false }
            });
        }

        try {
            // 3. Tax Calculation
            // Formula: Gross Price = Net Amount / (1 - Tax Rate) -> Gross Price = amount / 0.7
            const taxed = Math.round(amount / 0.7);

            // 4. Send the result using the specified format
            await message.channel.send({
                content: `<:coins:1497812680810168330> You entered the price of **${amount}** and the total after tax is **${taxed}**`
            });

        } catch (error) {
            console.error('Error executing -tax command:', error);
            message.channel.send(`An error occurred while calculating the tax.`).catch(console.error);
        }
    },
};