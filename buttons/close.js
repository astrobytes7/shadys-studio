const { EmbedBuilder } = require("discord.js");
const AssistanceModel = require("../models/AssistanceModel");
const discordTranscripts = require("discord-html-transcripts");

const transcriptsChannelId = '1472072582021775433';

module.exports = {
	customID: 'close:button',
	execute: async function (interaction, client, args) {
		try {
			await interaction.reply('- Closing ticket...');
			const ticket = await AssistanceModel.findOne({ channelId: interaction.channel.id });
			const channel = await client.channels.fetch(transcriptsChannelId).catch(() => null);

			const transcript = await discordTranscripts.createTranscript(interaction.channel, { poweredBy: false, footerText: `${interaction.guild.name}` });
			const embed = new EmbedBuilder()
				.setTitle(`Ticket Closed - ${ticket.type}`)
				.setDescription(`- **Opened By:** <@${ticket.userId}>\n- **Claimed By:** ${ticket.staffId ? `<@${ticket.staffId}>` : 'N/A'}\n- **Closed By:** ${interaction.user}\n- **Opened On:** <t:${Math.floor(ticket.created / 1000)}>`)
				.setColor('#2b2d31')
				.setThumbnail(interaction.guild.iconURL());

			await channel.send({
				embeds: [embed],
				files: [transcript]
			});

			const user = await client.users.fetch(ticket.userId).catch(() => null);
			if (user) {
				await user.send({
					embeds: [embed]
				}).catch(() => { });
			}

			await AssistanceModel.deleteOne({ channelId: interaction.channel.id });
			await interaction.editReply('- Ticket closed.');
			setTimeout(async () => {
				await interaction.channel.delete();
			}, 1000);
		} catch (error) {
			await interaction.editReply('An error occurred closed the ticket.');
			console.error(error);
		}
	}
}