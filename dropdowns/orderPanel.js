const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const AssistanceModel = require('../models/AssistanceModel');
const fs = require('fs');
const path = require('path');

module.exports = {
	customID: 'order:menu',
	execute: async function (interaction, client, args) {
		const type = interaction.values[0];

		// Check if the order type is closed in orderstatus.json
		try {
			const statusPath = path.join(__dirname, '..', 'orderstatus.json');
			const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));

			if (statusData[type] === 'closed') {
				return interaction.reply({
					content: `<:Click:1497789500175290519> Sorry, **${type.charAt(0).toUpperCase() + type.slice(1)}** orders are currently closed. Please check back later!`,
					ephemeral: true
				});
			}
		} catch (error) {
			console.error('Error reading orderstatus.json:', error);
		}

		await interaction.deferReply({ ephemeral: true });

		let categoryId, designerRole;
		switch (type) {
			case 'clothing':
				categoryId = '1497762672127639622'; // replace with your category id
				designerRole = '1472057214670995562'; // replace with your designer role
				break;

			case 'livery':
				categoryId = '1497762606864400539'; // replace with your category id
				designerRole = '1472057214670995564'; // replace with your designer role
				break;

			case 'graphics':
				categoryId = '1407530678962360362'; // replace with your category id
				designerRole = '1371967361464401920'; // replace with your designer role
				break;

			case 'discord':
				categoryId = '1407530678962360362'; // replace with your category id
				designerRole = '1472057214670995565'; // replace with your designer role
				break;

			case 'photography':
				categoryId = '1497762711373611149'; // replace with your category id
				designerRole = '1474515716043575508'; // replace with your designer role
				break;
		}

		const channel = await interaction.guild.channels.create({
			name: `🔴・unclaimed`,
			parent: categoryId,
			type: 0, // text channel
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel]
				},
				{
					id: interaction.user.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles
					]
				},
				{
					id: designerRole,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles
					]
				}
			]
		});

		await AssistanceModel.create({
			userId: interaction.user.id,
			channelId: channel.id,
			type
		});

		const hrRoles = ['1472057214759080030', '1472057214847156438']; // replace with all of your hr roles
		await Promise.all(
			hrRoles.map(roleId =>
				channel.permissionOverwrites.create(roleId, {
					ViewChannel: true,
					SendMessages: true,
					AttachFiles: true
				})
			)
		);

		const name = type.charAt(0).toUpperCase() + type.slice(1);

		await channel.send({
			content: `<@&${designerRole}> | ${interaction.user}`,
			embeds: [
				new EmbedBuilder()
					.setColor('#2b2d31')
					.setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076598895771679/dubai_new_banners_32.png?ex=69f869ce&is=69f7184e&hm=a7c970506d10617b568f0d003d7eed6cd2234f6135de8ecf5bd684d08a591121&=&format=webp&quality=lossless&width=2605&height=781'),
				new EmbedBuilder()
					.setTitle(`${name} - ${interaction.user.username}`)
					.setDescription(`Please provide a detailed description of your ${type} request. Include any references, preferences, or requirements to help our designers fulfill your order.`)
					.setColor('#2b2d31')
					.setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163')
			],
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
		});

		await interaction.editReply(`Your order has been created; ${channel}`);
	}
}