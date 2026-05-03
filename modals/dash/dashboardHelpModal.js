const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');
const Ticket = require('../../models/dashboardHelpSchema');
const { getRobloxInfo } = require('../../utils/docksystem');

module.exports = {
  customID: 'dashboardHelpModal',

  async execute(interaction, client) {
    try {
      const reason = interaction.fields.getTextInputValue('dashboardInquiryReason');

      await interaction.reply({ content: 'Your ticket is being created.', ephemeral: true });
      const robloxData = await getRobloxInfo(interaction.user.id, interaction, client);
      const robloxDisplay = robloxData.error ? 'No Linked Account' : `**[${robloxData.username}](https://www.roblox.com/users/${robloxData.robloxId}/profile)**`;

      const guild = interaction.guild;
      const opener = interaction.user;
      const supportRoleId = '1472057214616473730'; // Replace with your support role ID
      const ticketCategoryId = '1472075854359167136'; // Replace with your ticket category ID
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
        .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076599579316396/dubai_new_banners_34.png?ex=69f869ce&is=69f7184e&hm=c839e3f4550613c0ef4280c4907d2ee3fbe69d476fa928b61f5847f2b26633f9&=&format=webp&quality=lossless&width=2605&height=781') // Replace with your image URL
        .setColor('#292929') // Replace with your color hex

      const helpEmbed = new EmbedBuilder()
        .setDescription(`Thank you for choosing **<:emoji_57:1497817943390814378> Shady's Studio**! We'll get back to you as soon as possible. During this time, please do not ping any of the staff members as they have already been notified.`) // Replace with your description
        .addFields(
          { name: 'Inquiry', value: reason, inline: true },
          { name: 'Roblox Information', value: robloxDisplay, inline: true }
        )
        .setColor('#292929') // Replace with your color hex
        .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2834&height=178'); // Replace with your image URL

      const claimButton = new ButtonBuilder()
        .setLabel('Claim')
        .setCustomId('claimHelp')
        .setStyle(ButtonStyle.Secondary);

      const closeButton = new ButtonBuilder()
        .setLabel('Close')
        .setCustomId('closeHelp')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(claimButton, closeButton);

      await ticketChannel.send({ content: `<@${opener.id}> | <@&1472057214616473730>`, embeds: [imageEmbed, helpEmbed], components: [row] });

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