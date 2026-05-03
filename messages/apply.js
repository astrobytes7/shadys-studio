const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'apply',
    description: 'Sends the application panel.',
    async execute(message, args, client) {
        // Only administrators can use this command
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const targetChannelId = '1497730683760807946';
        const channel = await client.channels.fetch(targetChannelId).catch(() => null);

        if (!channel) {
            return message.reply({ content: "Could not find the target channel. Please check the ID.", ephemeral: true });
        }

        const bannerEmbed = new EmbedBuilder()
            .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076597507326002/dubai_new_banners_31.png?ex=69f869cd&is=69f7184d&hm=8081fed18fcbea7f42aecdb80340f62cf2779a76b81666729e73730176f77646&=&format=webp&quality=lossless&width=2605&height=781')
            .setColor('#242429');

        const mainEmbed = new EmbedBuilder()
            .setTitle('Application Panel')
            .setDescription('Interested in joining our team? Select an application type from the dropdown menu below to get started!')
            .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2834&height=178')
            .setColor('#242429');

        const select = new StringSelectMenuBuilder()
            .setCustomId('application_select')
            .setPlaceholder('Choose an application...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Designer Application')
                    .setDescription('Apply to become a designer.')
                    .setValue('apply_designer'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Support Application')
                    .setDescription('Apply to join the support team.')
                    .setValue('apply_support')
            );

        const row = new ActionRowBuilder().addComponents(select);

        try {
            await channel.send({ embeds: [bannerEmbed, mainEmbed], components: [row] });
            await message.delete().catch(() => {});
        } catch (error) {
            console.error('Error sending application panel:', error);
            await message.reply('An error occurred while sending the application panel.');
        }
    }
};
