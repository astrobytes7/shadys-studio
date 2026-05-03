const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customID: 'closeHelp',

  async execute(interaction) {
    const requiredRoleId = "1472057214616473730"; // Replace with your role ID

    if (!interaction.member.roles.cache.has(requiredRoleId)) {
        return interaction.reply({
          content: `You don't have permission to close this ticket.`,
          ephemeral: true
        });
      }

    const modal = new ModalBuilder()
      .setCustomId('closeModal')
      .setTitle('Close Ticket'); // Your custom title

    const reasonInput = new TextInputBuilder()
      .setCustomId('closeReason')
      .setLabel("Closing Reason") // Your custom label
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const actionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }
};