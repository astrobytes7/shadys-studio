const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Sends information on total membercount, online members and server boosts."),

    async execute(interaction) {
        const { guild } = interaction;

        await guild.members.fetch();

        const totalMembers = guild.memberCount;

        const onlineMembers = guild.members.cache.filter(
            (member) => member.presence && member.presence.status !== "offline"
        ).size;

        const boostCount = guild.premiumSubscriptionCount || 0;

        const embed = new EmbedBuilder()
            .setTitle("Member Count")
            .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f7c113&is=69f66f93&hm=dc27c45748808bf7af2a3b0f5d78f207502234087fe59028a78ac337dbd16a9a&=&format=webp&quality=lossless&width=2605&height=163')
            .setColor("#242429")
            .addFields(
                { name: "Total Members", value: totalMembers.toString(), inline: true },
                { name: "Online Members", value: onlineMembers.toString(), inline: true },
                { name: "Server Boosts", value: boostCount.toString(), inline: true }
            )

        await interaction.reply({ embeds: [embed] });
    },
};