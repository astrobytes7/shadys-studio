const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quality-control')
        .setDescription('Request quality control')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Image to be reviewed')
                .setRequired(false)
        ),

    async execute(interaction) {
        const requiredRoleId = '1483154250883399765'; // Role required to use the command

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const qualityControlRoleId = '1472057214733648041'; // qc role id for ping
        const channel = await interaction.guild.channels.fetch('1498004000644141238'); // Channel id

        if (!channel) {
            return await interaction.editReply({ content: 'Could not find the promotion log channel.' });
        }

        const user = interaction.user;
        const roleToPing = `<@&${qualityControlRoleId}>`;
        const userToPing = `<@${user.id}>`;
        const imageAttachment = interaction.options.getAttachment('image');

        const embed = new EmbedBuilder()
            .setTitle('Quality Control Request')
            .setColor("#242429")
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`${userToPing} has requested Quality Control`)
            .setImage(imageAttachment ? imageAttachment.url : 'https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2834&height=178') // image url

        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(acceptButton, denyButton);

        try {
            const message = await channel.send({ content: roleToPing, embeds: [embed], components: [row] });

            const thread = await message.startThread({
                name: `QC - ${user.username}`,
                reason: `Quality control for ${user.username}`,
                autoArchiveDuration: 60,
            });

            const threadMessage = `${userToPing} A thread has been created for you to discuss your work with Quality Assurance members.`;
            
            if (imageAttachment) {
                // Just send the URL instead of re-uploading to avoid 40005 "Entity too large"
                await thread.send({ content: `${threadMessage}\n\n**Attachment:** ${imageAttachment.url}` });
            } else {
                await thread.send({ content: threadMessage });
            }

            await interaction.editReply({ content: 'Quality control has been requested.' });

        } catch (error) {
            console.error('Error in quality-control command:', error);
            await interaction.editReply({ content: 'There was an error processing your quality control request.' });
        }
    },
};