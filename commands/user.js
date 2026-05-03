const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRobloxInfo } = require("../utils/docksystem");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("User related commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("Shows information about a Discord and Roblox user.")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("The user to get information about.")
                        .setRequired(false))),

    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === "info") {
            const user = interaction.options.getUser("target") || interaction.user;
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            await interaction.deferReply();

            const robloxData = await getRobloxInfo(user.id, interaction, client);

            let robloxInfo = "Not Linked with DockSystem";
            let robloxThumbnail = user.displayAvatarURL({ dynamic: true });

            if (!robloxData.error) {
                const profileLink = `https://www.roblox.com/users/${robloxData.robloxId}/profile`;
                robloxInfo = `**Username:** [${robloxData.username}](${profileLink})\n**ID:** \`${robloxData.robloxId}\``;

                try {
                    const thumbRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxData.robloxId}&size=150x150&format=Png&isCircular=false`);
                    if (thumbRes.data.data[0]?.imageUrl) {
                        robloxThumbnail = thumbRes.data.data[0].imageUrl;
                    }
                } catch (e) {
                    console.error("Error fetching Roblox thumbnail:", e);
                }
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(robloxThumbnail)
                .setColor("#242429")
                .addFields(
                    { name: "<:user:1497813220558110750> Discord Information", value: `**ID:** \`${user.id}\`\n**Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n**Joined:** ${member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Not in server"}`, inline: false },
                    { name: "<:emoji_57:1497817943390814378> Roblox Information", value: robloxInfo, inline: false }
                )
                .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163');

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
