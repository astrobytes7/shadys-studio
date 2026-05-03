const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
  const DiscordTranscripts = require('discord-html-transcripts');
  const DashboardHelpTicket = require('../../models/dashboardHelpSchema');
  
  const LOG_CHANNEL_ID = '1472057216336138252'; // Replace with transcript channel id
  
  module.exports = {
    customID: 'closeModal',
  
    async execute(interaction) {
      const channel = interaction.channel;
      const closer = interaction.user;
      const reason = interaction.fields.getTextInputValue('closeReason') || 'No reason provided.';
  
      try {
        await interaction.reply({
          content: 'This ticket is being closed.',
          ephemeral: true,
        });
  
        const ticket = await DashboardHelpTicket.findOne({ channelId: channel.id });
        if (!ticket) {
          return interaction.editReply({ content: 'Ticket not found in database.', ephemeral: true });
        }
  
        await DashboardHelpTicket.findOneAndUpdate(
          { channelId: channel.id },
          {
            status: 'closed',
            closedBy: closer.id,
            closeReason: reason,
          }
        );
  
        const transcript = await DiscordTranscripts.createTranscript(channel, {
          limit: -1,
          returnType: 'buffer',
          filename: `${ticket.username}-${ticket.ticketId}.html`,
          saveImages: true
        });
  
        const transcriptFile = new AttachmentBuilder(transcript, {
          name: `${ticket.username}-${ticket.ticketId}.html`,
        });
  
        const dmEmbed = new EmbedBuilder()
          .setTitle('Ticket Closed') // Your Title
          .setColor('#292929') // Your custom hex color
          .setDescription(`Your ticket has been closed. You can find the details below. Thank you for reaching out to **Shady's Studio**.`) // Your description
          .addFields(
            { name: 'Closure Reason', value: reason, inline: true },
            { name: 'Closed By', value: `<@${closer.id}>`, inline: true }
          )
          .setFooter({ text: `Ticket ID: ${ticket.ticketId}` })
          .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2834&height=178') // Your image url
          .setTimestamp();
  
        const logEmbed = new EmbedBuilder()
          .setTitle('Ticket Transcript') // Your Title
          .setColor('#292929') // Your custom hex color
          .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2834&height=178') // Your image url
          .addFields(
            { name: 'Closure Reason', value: reason, inline: true },
            { name: 'Closed By', value: `<@${closer.id}>`, inline: true },
          )
          .setFooter({ text: `User ID: ${ticket.userId} | Ticket ID: ${ticket.ticketId}` })
          .setTimestamp();
  
        const logChannel = await interaction.client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

        if (logChannel?.isTextBased()) {
          await logChannel.send({
            embeds: [logEmbed],
            files: [transcriptFile]
          });
        }
  
        const user = await interaction.client.users.fetch(ticket.userId).catch(() => null);
        if (user) {
          await user.send({ embeds: [dmEmbed] }).catch(() => null);
        }
  
        await channel.delete();
  
      } catch (error) {
        console.error('Error closing ticket:', error);
      }
    }
  };
  