const {
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    SectionBuilder,
} = require("discord.js");

module.exports = {
    name: "verify",
    description: "Sends the verification panel.",
    async execute(message, args, client) {
        await message.delete();

        const components = [
            new ContainerBuilder()
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://media.discordapp.net/ephemeral-attachments/1498659810508279878/1498660082127208549/dubai_new_banners_36.png?ex=69f88ef7&is=69f73d77&hm=3b3f103ca59bad88399853c61004f1a8a65ad5d3bf8dcf01b6e4a03e55397a60&=&format=webp&quality=lossless&width=2834&height=849"
                        )
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Verification Panel")
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "At **<:emoji_57:1497817943390814378> Shadys Studio**, we use **Dock Systems** to verify users. In order to gain access to the rest of the server, you must verify your Roblox account. Please click the **verification** button below this message to get started in the verification process."
                    )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "Verify using the button here:"
                            )
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId("start-verify")
                                .setLabel("Begin Verification")
                                .setStyle(ButtonStyle.Secondary)
                        )
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(client.config.FOOTER_BANNER)
                    )
                ),
        ];

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components,
        });
    },
};
