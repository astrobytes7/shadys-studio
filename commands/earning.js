const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Earning = require('../models/earningSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('earnings')
        .setDescription('Check your total earnings or someone else\'s.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check earnings for.')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const requiredRoleId = '1483154250883399765'; // Staff role

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: '<:Click:1497789500175290519> You do not have permission to use this command.',
                ephemeral: true
            });
        }

        try {
            const data = await Earning.findOne({ userId: target.id });

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle(`${target.username}'s Earnings`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Total Robux Earned', value: `<:coins:1497812680810168330> ${data ? data.totalEarnings.toLocaleString() : '0'}`, inline: true },
                    { name: 'Total Orders', value: `<:box:1497811572511477941> ${data ? data.payoutRequests.length : '0'}`, inline: true }
                )
                .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163');

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching earnings:', error);
            await interaction.reply({ content: 'There was an error fetching the earnings data.', ephemeral: true });
        }
    },
};
