const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('order-log')
        .setDescription('Log an order with customer, product, and price details.')
        .addUserOption(option =>
            option.setName('customer')
                .setDescription('The customer making the order.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('product')
                .setDescription('Product being ordered.')
                .setRequired(true)
                .addChoices(
                    { name: 'Liveries', value: 'Liveries' },
                    { name: 'Clothing', value: 'Clothing' },
                    { name: 'Graphics', value: 'Graphics' },
                ))
        .addNumberOption(option =>
            option.setName('price')
                .setDescription('Price of the product **WITHOUT** tax.')
                .setRequired(true)),

    async execute(interaction) {
        const requiredRoleId = '1483154250883399765'; // Role required to use the command

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
            });
        }

        try {
            const customer = interaction.options.getUser('customer');
            const product = interaction.options.getString('product');
            const price = interaction.options.getNumber('price');

            const channel = await interaction.guild.channels.fetch('1500548790090731570'); // Channel id
            if (!channel) {
                return await interaction.reply({ content: 'Could not find the order log channel.', ephemeral: true });
            }

            if (isNaN(price) || price <= 0) {
                return await interaction.reply({ content: 'Please enter a valid, positive price.', ephemeral: true });
            }

            const robloxTaxRate = 0.3;
            const fullPrice = Math.round(price / (1 - robloxTaxRate));
            const designerEarnings = Math.round(price * 0.6);

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle(`New Order Logged`)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .addFields(
                    { name: 'Customer:', value: `<@${customer.id}>`, inline: true },
                    { name: 'Designer:', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Product:', value: product, inline: true },
                    { name: 'Full Price (including tax):', value: `${fullPrice}`, inline: true },
                    { name: 'Designer Earnings:', value: `${designerEarnings}`, inline: true },
                )
                .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163') // image url

            const paidButton = new ButtonBuilder()
                .setCustomId('paid')
                .setLabel('Mark Paid')
                .setStyle(ButtonStyle.Secondary)

            const row = new ActionRowBuilder().addComponents(paidButton);

            await channel.send({
                embeds: [embed],
                components: [row]
            });

            await interaction.reply({ content: `Your order has been logged successfully.`, ephemeral: true });

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error logging the order. Please try again later.', ephemeral: true });
        }
    },
};
