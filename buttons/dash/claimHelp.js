const { 
  EmbedBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ActionRowBuilder 
} = require('discord.js');
const DashboardHelpTicket = require('../../models/dashboardHelpSchema');

module.exports = {
  customID: 'claimHelp',
  async execute(interaction) {
    try {
      const requiredRoleId = ""; // Replace with the actual role ID

      if (!interaction.member.roles.cache.has(requiredRoleId)) {
        return interaction.reply({
          content: `You don't have permission to claim this ticket.`,
          ephemeral: true
        });
      }

      const user = interaction.user;
      const channel = interaction.channel;

      const ticket = await DashboardHelpTicket.findOne({ channelId: channel.id });
      if (!ticket) {
        return interaction.reply({
          content: 'No ticket data found for this channel.',
          ephemeral: true
        });
      }

      if (ticket.claimedBy) {
        return interaction.reply({
          content: `This ticket is already claimed by <@${ticket.claimedBy}>.`,
          ephemeral: true
        });
      }

      ticket.claimedBy = user.id;
      await ticket.save();

      const embed = new EmbedBuilder()
        .setDescription(`This ticket has been claimed by <@${user.id}>.`)
        .setColor('#242429');

      const unclaimButton = new ButtonBuilder()
        .setCustomId('unclaimHelp')
        .setLabel('Unclaim')
        .setStyle(ButtonStyle.Secondary);

      const closeButton = new ButtonBuilder()
        .setCustomId('closeHelp')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(unclaimButton, closeButton);

      await interaction.update({ components: [row] });
      await channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Error claiming ticket:', error);
      await interaction.reply({ content: 'An error occurred while claiming the ticket.', ephemeral: true });
    }
  }
};