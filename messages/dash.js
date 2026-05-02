const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  name: "dash",
  cooldown: 5,
  async execute(message) {
    await message.delete()
    const requiredRoleId = ""; // Replace with the actual role ID

    if (!message.member.roles.cache.has(requiredRoleId)) {
      return;
    }

    const imageEmbed = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076597792673812/image.png?ex=69f1298d&is=69efd80d&hm=6a001ef894af774d06b94b7622b67cffdc8e9a67ec6ef86b9ab08669c6ad7458&=&format=webp&quality=lossless&width=2605&height=781'); // Replace with your image URL

    const dashboardEmbed = new EmbedBuilder() // Replace with your color hex
      .setDescription(`Access all essential resources for navigating **secret studios** with ease — including our information, guidelines. If you have any inquiries or issues feel free to request for assistance below.`)
      .setFields(
        { name: 'Roblox Group', value: '[Join Here]()', inline: true }, // Put your roblox group link in the paranthesis
        { name: 'Services', value: '[Order Here]()', inline: true } // Put your channel message link in the paranthesis
      )
      .setImage('https://media.discordapp.net/attachments/1465184567970496532/1498076620907352205/Shady_Banners.png?ex=69f12993&is=69efd813&hm=ced60559f8faccf85b7020fc3990e3d167f3cac5618d63a988ece0497297126d&=&format=webp&quality=lossless&width=2605&height=163') // Replace with your image URL

    const dashboardHelp = new ButtonBuilder()
      .setCustomId("dashboardHelp")
      .setLabel("Help")
      .setStyle(ButtonStyle.Secondary);

    const dropdownMenu = new StringSelectMenuBuilder()
      .setCustomId("dashboardDropdown")
      .setPlaceholder("Learn More")
      .addOptions([
        {
          label: "Rules",
          emoji: '', // Replace with your emoji name and id
          description: '', // Replace with your description
          value: "dashboardGuidelines",
        },
        {
          label: "About us",
          emoji: '', // Replace with your emoji name and id
          description: '', // Replace with your description
          value: "dashboardAboutUs",
        },
      ]);

    const row1 = new ActionRowBuilder().addComponents(dropdownMenu);
    const row2 = new ActionRowBuilder().addComponents(dashboardHelp);
    try {
      await message.channel.send({
        embeds: [imageEmbed, dashboardEmbed],
        components: [row1, row2],
      });

    } catch (error) {
      console.error("Error sending dashboard:", error);
    }
  },
};
