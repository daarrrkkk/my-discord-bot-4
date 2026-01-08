const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-export")
    .setDescription("Sunucudaki tüm emojileri dışa aktarır")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;

    if (!emojis.size) {
      return interaction.reply({
        content: "❌ Bu sunucuda emoji yok.",
        ephemeral: true
      });
    }

    const list = emojis.map(e =>
      `${e.animated ? "GIF" : "PNG"} | ${e.name} → ${e.url}`
    ).join("\n");

    await interaction.reply({
      content: `📦 **Emoji Export**\n\n${list}`,
      ephemeral: true
    });
  }
};
