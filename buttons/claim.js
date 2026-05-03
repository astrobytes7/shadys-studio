const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const AssistanceModel = require("../models/AssistanceModel")

module.exports = {
	customID: 'claim:button',
	execute: async function (interaction, client, args) {
		const requiredRoles = ['1483154250883399765'];
		if (!interaction.member.roles.cache.some(role => requiredRoles.includes(role.id))) {
			return await interaction.reply({
				content: '<:Click:1497789500175290519> You do not have permissions to use this!',
				flags: 64
			});
		}

		const { channel, user } = interaction;
		const ticket = await AssistanceModel.findOne({ channelId: channel.id });

		if (ticket.staffId) {
			if (user.id !== ticket.staffId) {
				return await interaction.reply({
					content: '<:Click:1497789500175290519> You did not claim this ticket.',
					flags: 64
				});
			}

			ticket.staffId = null;

			await Promise.all([
				ticket.save(),
				channel.edit({ name: '🔴・unclaimed' }),
				channel.send({
					embeds: [
						new EmbedBuilder()
							.setDescription(`- This ticket has been unclaimed by ${user}.`)
							.setColor('#2b2d31')
					]
				}),
				interaction.update({
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId('claim:button')
								.setLabel('Claim')
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setCustomId('close:button')
								.setLabel('Close')
								.setStyle(ButtonStyle.Danger)
						)
					]
				})
			]);
		} else {
			ticket.staffId = user.id;

			await Promise.all([
				ticket.save(),
				channel.edit({ name: `🟢・${user.username}` }),
				channel.send({
					embeds: [
						new EmbedBuilder()
							.setDescription(`- This ticket has been claimed by ${user}.`)
							.setColor('#2b2d31')
					]
				}),
				interaction.update({
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setCustomId('claim:button')
								.setLabel('Unclaim')
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setCustomId('close:button')
								.setLabel('Close')
								.setStyle(ButtonStyle.Danger)
						)
					]
				})
			]);
		}
	}
}