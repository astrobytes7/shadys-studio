const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const Earning = require('../models/earningSchema');

module.exports = {
    customID: 'paid',
    async execute(interaction) {
        const requiredRoleId = '1472057214759080030'; // Role required to use the button

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have permission to use this button.',
                ephemeral: true
            });
        }

        try {
            const originalEmbed = interaction.message.embeds[0];
            if (!originalEmbed) {
                return interaction.reply({ content: "Original embed not found.", ephemeral: true });
            }

            // Extract data from embed fields
            const fields = originalEmbed.fields;
            const customerId = fields.find(f => f.name === 'Customer:').value.replace(/[<@!>]/g, '');
            const designerId = fields.find(f => f.name === 'Designer:').value.replace(/[<@!>]/g, '');
            const product = fields.find(f => f.name === 'Product:').value;
            const price = parseInt(fields.find(f => f.name === 'Full Price (including tax):').value);
            const earnings = parseInt(fields.find(f => f.name === 'Designer Earnings:').value);

            // Update database: Find by message ID and mark as Paid
            await Earning.findOneAndUpdate(
                { "payoutRequests.messageId": interaction.message.id },
                {
                    $set: { "payoutRequests.$.status": "Paid" },
                    $inc: { totalEarnings: earnings }
                }
            );

            const button = new ButtonBuilder()
                .setCustomId('paid')
                .setLabel('Paid')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)

            const disabledRow = new ActionRowBuilder().addComponents(button)

            await interaction.update({
                components: [disabledRow],
            });

        } catch (error) {
            console.error('Error updating paid:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an issue processing the confirmation.', ephemeral: true });
            }
        }
    }
};