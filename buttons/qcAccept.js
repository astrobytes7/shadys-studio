const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    customID: 'accept',
    async execute(interaction) {
        const requiredRoleId = '1472057214733648041'; // Role required to use the button

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: '<:contract:1497813222798004294> You do not have permission to use this button.',
                ephemeral: true
            });
        }

        try {
            const originalEmbed = interaction.message.embeds[0];
            if (!originalEmbed) {
                return interaction.reply({ content: "Original embed not found.", ephemeral: true });
            }

            const updatedEmbed = EmbedBuilder.from(originalEmbed).setTitle('Quality Control Accepted');

            const button = new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Accepted')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)

            const disabledRow = new ActionRowBuilder().addComponents(button)

            if (interaction.channel.isThread()) {
                await interaction.channel.setArchived(true, 'Quality control accepted');
            }

            await interaction.update({
                embeds: [updatedEmbed],
                components: [disabledRow],
            });
        } catch (error) {
            console.error('Error updating QC accept:', error);
            await interaction.reply({ content: 'There was an issue processing the acceptance.', ephemeral: true });
        }
    }
};