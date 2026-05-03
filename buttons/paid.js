const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    customID: 'paid',
    async execute(interaction) {
        const requiredRoleId = '1472057214759080030'; // Role required to use the button

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.editReply({
                content: 'You do not have permission to use this button.',
            });
        }

        try {
            const originalEmbed = interaction.message.embeds[0];
            if (!originalEmbed) {
                return interaction.reply({ content: "Original embed not found.", ephemeral: true });
            }

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
            await interaction.reply({ content: 'There was an issue processing the confirmation.', ephemeral: true });
        }
    }
};