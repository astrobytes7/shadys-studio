const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
  } = require('discord.js');
  
  module.exports = {
    customID: 'dashboardHelp',
  
    async execute(interaction) {
      try {
  
        const modal = new ModalBuilder()
          .setCustomId('dashboardHelpModal')
          .setTitle('Support Ticket'); // Replace with your text
  
        const questionInput = new TextInputBuilder()
          .setCustomId('dashboardInquiryReason')
          .setLabel('What do you need help with?')  // Replace with your text
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('')  // Replace with your placeholder
          .setRequired(true);
  
        const row = new ActionRowBuilder().addComponents(questionInput);
  
        modal.addComponents(row);
  
        await interaction.showModal(modal);
      } catch (error) {
        console.error('Error showing dashboard help modal:', error);
      }
    }
  };
  