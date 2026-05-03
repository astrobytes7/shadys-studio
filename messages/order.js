const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const requiredRoles = ['1472057214759080030']; // the roles required to use this command
const channelId = '1497711590055739392'; // the channel to send the message to

module.exports = {
	name: 'order',
	description: 'Sends the order panel embed.',
	execute: async function (message, args, client) {
		if (!message.member.roles.cache.some(role => requiredRoles.includes(role.id)))
			return;

		const channel = await client.channels.fetch(channelId).catch(() => null) || client.channels.cache.get(channelId);
		if (!channel || !channel.isSendable())
			return await message.reply('Channel not found or invalid');

		const embed1 = new EmbedBuilder()
			.setColor('#2b2d31')
			.setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076598895771679/dubai_new_banners_32.png?ex=69f869ce&is=69f7184e&hm=a7c970506d10617b568f0d003d7eed6cd2234f6135de8ecf5bd684d08a591121&=&format=webp&quality=lossless&width=2605&height=781');

		const embed2 = new EmbedBuilder()
			.setColor('#2b2d31')
			.setDescription('All your orders in one place. Submit requests quickly and track their progress in real time. Access support whenever you need it, without leaving the panel. Managing your workflow has never been this simple.')
			.addFields(
				{ name: 'Clothing', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
				{ name: 'Livery', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
				{ name: 'Graphics', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
				{ name: 'Discord', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
				{ name: 'Photography', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
				{ name: 'Alting', value: '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>', inline: true },
			)
			.setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163');

		const menu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('order:menu')
				.setPlaceholder('Place an order!')
				.setOptions(
					new StringSelectMenuOptionBuilder()
						.setValue('clothing')
						.setLabel('Clothing'),
					new StringSelectMenuOptionBuilder()
						.setValue('livery')
						.setLabel('Livery'),
					new StringSelectMenuOptionBuilder()
						.setValue('graphics')
						.setLabel('Graphics'),
					new StringSelectMenuOptionBuilder()
						.setValue('discord')
						.setLabel('Discord'),
					new StringSelectMenuOptionBuilder()
						.setValue('photography')
						.setLabel('Photography'),
				)
		);

		await channel.send({
			embeds: [embed1, embed2],
			components: [menu]
		});
		await message.delete();
	}
};