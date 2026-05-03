const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roblox")
        .setDescription("Roblox related commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("group")
                .setDescription("Shows information about our Roblox group.")),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === "group") {
            const groupId = "1064621742";
            const groupUrl = `https://groups.roblox.com/v1/groups/${groupId}`;

            try {
                const [groupResponse, iconResponse] = await Promise.all([
                    axios.get(groupUrl),
                    axios.get(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png&isCircular=false`)
                ]);

                const groupData = groupResponse.data;
                const iconUrl = iconResponse.data.data[0]?.imageUrl || "";

                const embed = new EmbedBuilder()
                    .setTitle(`${groupData.name}`)
                    .setURL(`https://www.roblox.com/groups/${groupId}`)
                    .setDescription(`Check out our official Roblox group!`)
                    .setColor("#242429")
                    .setThumbnail(iconUrl)
                    .addFields(
                        { name: "Group Members", value: groupData.memberCount.toLocaleString(), inline: true },
                        { name: "Public Entry", value: groupData.isPublicEntryAllowed ? "Yes" : "No", inline: true }
                    )
                    .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f869d3&is=69f71853&hm=794dffa170d7cb7b2599328adc4666d4fb223eada0d878738ab85f9cf497de71&=&format=webp&quality=lossless&width=2605&height=163');

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error("Error fetching Roblox group info:", error);
                await interaction.reply({
                    content: "An error occurred while fetching group information. Please try again later.",
                    ephemeral: true
                });
            }
        }
    },
};
