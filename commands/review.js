const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Leave a review for a employee')
        .addUserOption(option =>
            option.setName('employee')
                .setDescription('The employee you are reviewing')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('product')
                .setDescription('Product developed')
                .setRequired(true)
                .addChoices(
                    { name: 'Liveries', value: 'Liveries' },
                    { name: 'Clothing', value: 'Clothing' },
                    { name: 'Graphics', value: 'Graphics' },
                    { name: 'Bot Development', value: 'Bot Development' },
                    { name: 'Other', value: 'Other' },
                ))
        .addStringOption(option =>
            option.setName('review')
                .setDescription('Star rating of the service')
                .setRequired(true)
                .addChoices(
                    { name: '⭐', value: '1' },
                    { name: '⭐⭐', value: '2' },
                    { name: '⭐⭐⭐', value: '3' },
                    { name: '⭐⭐⭐⭐', value: '4' },
                    { name: '⭐⭐⭐⭐⭐', value: '5' },
                ))
        .addStringOption(option =>
            option.setName('feedback')
                .setDescription('Feedback about the service')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const requiredRoleId = '1474207328726290607'; // Role required to use the command

            if (!interaction.member.roles.cache.has(requiredRoleId)) {
                return interaction.editReply({
                    content: 'You do not have permission to use this command.',
                });
            }

            const developer = interaction.options.getUser('developer');
            const product = interaction.options.getString('product');
            const ratingInput = interaction.options.getString('review');
            const starMap = {
                "1": '<:star:1497790448993960036>', // replace emoji with emoji codes
                "2": '<:star:1497790448993960036>'.repeat(2), // replace emoji with emoji codes
                "3": '<:star:1497790448993960036>'.repeat(3), // replace emoji with emoji codes
                "4": '<:star:1497790448993960036>'.repeat(4), // replace emoji with emoji codes
                "5": '<:star:1497790448993960036>'.repeat(5), // replace emoji with emoji codes
            };
            const review = starMap[ratingInput];
            const feedback = interaction.options.getString('feedback');

            const reviewChannel = await interaction.guild.channels.fetch('1497716961101221969'); // Channel id
            if (!reviewChannel) {
                return await interaction.reply({ content: 'Could not find the review channel.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#242429')
                .setTitle('New Review')
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .addFields(
                    { name: 'Employee', value: `<@${developer.id}>`, inline: true },
                    { name: 'Product', value: product, inline: true },
                    { name: 'Rating', value: review, inline: true },
                    { name: 'Feedback', value: feedback },
                )
                .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163') // image url

            await reviewChannel.send({ embeds: [embed] });

            await interaction.reply({ content: `Your review has been submitted successfully!`, ephemeral: true });

        } catch (err) {
            console.error('Error submitting review:', err);
            await interaction.reply({ content: 'There was an error submitting the review. Please try again later.', ephemeral: true });
        }
    }
};
