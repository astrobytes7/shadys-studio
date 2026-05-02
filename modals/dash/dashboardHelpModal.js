const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
  } = require('discord.js');
  const Ticket = require('../../models/dashboardHelpSchema');
  const { getRobloxAccount } = require('../utils/BloxlinkApi');
  
  module.exports = {
    customID: 'dashboardHelpModal',
  
    async execute(interaction) {
      try {
        const reason = interaction.fields.getTextInputValue('dashboardInquiryReason');

        await interaction.reply({ content: 'Your ticket is being created.', ephemeral: true });
        const roblox = await getRobloxAccount(interaction.guild.id, interaction.user.id) || 'No Linked Account';
  
        const guild = interaction.guild;
        const opener = interaction.user;
        const supportRoleId = ''; // Replace with your support role ID
        const ticketCategoryId = ''; // Replace with your ticket category ID
        const channelName = `${opener.username}-ticket`;
  
        const ticketChannel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: ticketCategoryId,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: opener.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            },
            {
              id: supportRoleId,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            }
          ]
        });
  
        const ticketId = ticketChannel.id;
  
        const imageEmbed = new EmbedBuilder()
          .setImage('') // Replace with your image URL
          .setColor('#') // Replace with your color hex
  
        const helpEmbed = new EmbedBuilder()
          .setDescription(``) // Replace with your description
          .addFields(
            { name: 'Inquiry', value: reason, inline: true },
            { name: 'Roblox Information', value: roblox.format, inline: true } 
          )
          .setColor('#') // Replace with your color hex
          .setThumbnail('') // Replace with your thumbnail URL
          .setImage('') // Replace with your image URL
          .setTimestamp();
  
        const claimButton = new ButtonBuilder()
          .setLabel('Claim')
          .setCustomId('claimHelp')
          .setStyle(ButtonStyle.Secondary);
  
        const closeButton = new ButtonBuilder()
          .setLabel('Close')
          .setCustomId('closeHelp')
          .setStyle(ButtonStyle.Danger);
  
        const row = new ActionRowBuilder().addComponents(claimButton, closeButton);
  
        await ticketChannel.send({ content: `<@${opener.id}> | @here`, embeds: [imageEmbed, helpEmbed], components: [row] });
  
        await Ticket.create({
          userId: opener.id,
          username: opener.username,
          channelId: ticketChannel.id,
          reason,
          status: 'open',
          createdAt: new Date(),
          claimedBy: null,
          closedBy: null,
          ticketId
        });
  
        await interaction.editReply({ content: `Your ticket has been successfully created - <#${ticketChannel.id}>` });

    } catch (error) {
      console.error('Error creating ticket from modal:', error);
      await interaction.editReply({ content: 'An error occurred while creating the ticket.', ephemeral: true });
    }
  }
};