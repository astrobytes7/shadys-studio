const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Earning = require('../models/earningSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payout')
        .setDescription('Payout related commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('history')
                .setDescription('View your payout history or another designer\'s.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to check payout history for.')
                        .setRequired(false))),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'history') {
            const target = interaction.options.getUser('user') || interaction.user;
            const requiredRoleId = '1483154250883399765'; // Staff role

            if (!interaction.member.roles.cache.has(requiredRoleId)) {
                return interaction.reply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true
                });
            }

            try {
                const data = await Earning.findOne({ userId: target.id });

                if (!data || !data.payoutRequests.length) {
                    return interaction.reply({
                        content: `No payout history found for **${target.username}**.`,
                        ephemeral: true
                    });
                }

                // Calculate totals
                const totalPaid = data.payoutRequests
                    .filter(r => r.status === 'Paid')
                    .reduce((acc, r) => acc + r.earnings, 0);

                const totalPending = data.payoutRequests
                    .filter(r => r.status === 'Pending')
                    .reduce((acc, r) => acc + r.earnings, 0);

                // Format recent requests (last 10)
                const recentRequests = data.payoutRequests.slice(-10).reverse();
                const historyList = recentRequests.map(r => {
                    const statusEmoji = r.status === 'Paid' ? '<:Click:1497789500175290519>' : '<:contract:1497813222798004294>';
                    return `${statusEmoji} **${r.product}** - ${r.earnings} R$ (${r.status})`;
                }).join('\n');

                const embed = new EmbedBuilder()
                    .setColor("#242429")
                    .setTitle(`${target.username}'s Payout History`)
                    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Total Paid', value: `<:coins:1497812680810168330> ${totalPaid.toLocaleString()} R$`, inline: true },
                        { name: 'Total Pending', value: `<:contract:1497813222798004294> ${totalPending.toLocaleString()} R$`, inline: true },
                        { name: 'Recent Requests', value: historyList || 'No recent requests.' }
                    )
                    .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163');

                await interaction.reply({ embeds: [embed] });

            } catch (error) {
                console.error('Error fetching payout history:', error);
                await interaction.reply({ content: 'There was an error fetching the payout history.', ephemeral: true });
            }
        }
    },
};
