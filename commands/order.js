const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('order')
        .setDescription('Order management commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Change the status of an order type.')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The service to update.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Clothing', value: 'clothing' },
                            { name: 'Livery', value: 'livery' },
                            { name: 'Graphics', value: 'graphics' },
                            { name: 'Discord', value: 'discord' },
                            { name: 'Photography', value: 'photography' },
                            { name: 'Alting', value: 'alting' },
                        ))
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('The new status.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Open', value: 'opened' },
                            { name: 'Closed', value: 'closed' },
                        ))),

    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'status') {
            const type = interaction.options.getString('type');
            const status = interaction.options.getString('status');

            const statusPath = path.join(__dirname, '..', 'orderstatus.json');
            let statusData = {};
            
            try {
                statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
            } catch (e) {
                console.error("Error reading orderstatus.json, creating new one.");
            }

            statusData[type] = status;
            fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));

            // Update the message
            const channelId = '1497711590055739392';
            const messageId = '1500583065435640039';

            try {
                const channel = await client.channels.fetch(channelId);
                const message = await channel.messages.fetch(messageId);

                const embed1 = message.embeds[0];
                const embed2 = EmbedBuilder.from(message.embeds[1]);
                
                const openEmoji = '<:Opened1:1486167277043847198><:Opened2:1486167389681877043><:Opened3:1486167510104539257>';
                const closedEmoji = '<:Closed1:1486167767735468215><:Closed2:1486167852493967452><:Closed3:1486167942860111882>';

                const fields = embed2.data.fields.map(field => {
                    // Match the field name regardless of emojis or extra text
                    if (field.name.toLowerCase().includes(type.toLowerCase())) {
                        return {
                            ...field,
                            value: status === 'opened' ? openEmoji : closedEmoji
                        };
                    }
                    return field;
                });

                embed2.setFields(fields);

                await message.edit({ embeds: [embed1, embed2] });

                await interaction.reply({ content: `<:Click:1497789500175290519> Successfully set **${type.charAt(0).toUpperCase() + type.slice(1)}** status to **${status}**.`, ephemeral: true });
            } catch (error) {
                console.error('Error updating order status message:', error);
                await interaction.reply({ content: '<:Click:1497789500175290519> Failed to update the order panel message. Make sure the message ID and Channel ID are correct in the code.', ephemeral: true });
            }
        }
    }
};
