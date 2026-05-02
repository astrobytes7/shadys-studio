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
    async execute(message) {
        await message.delete();

        const components = [
            new ContainerBuilder()
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://images-ext-1.discordapp.net/external/OsksxyV8ZrGxO4PqD2SFoLY5WgG34Vy0GH1TNJrxFoc/https/api.docksys.xyz/images/banners/header/verification.png?format=webp&quality=lossless&width=1320&height=422"
                        )
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Verification Panel")
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "At **<:visionlogo_white:1483881372031652023> Vision**, we use **Dock Systems** to verify users. In order to gain access to the rest of the server, you must verify your Roblox account. Please click the **verification** button below this message to get started in the verification process."
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
