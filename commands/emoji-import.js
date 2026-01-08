const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-import")
    .setDescription("Başka sunucudan emoji ekler")
    .addStringOption(opt =>
      opt.setName("emoji")
        .setDescription("Emoji (örn: <:test:123456789>)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),

  async execute(interaction) {
    const emojiInput = interaction.options.getString("emoji");

    const match = emojiInput.match(/<(a?):(\w+):(\d+)>/);
    if (!match) {
      return interaction.reply({
        content: "❌ Geçerli bir emoji gir.",
        ephemeral: true
      });
    }

    const animated = match[1];
    const name = match[2];
    const id = match[3];

    const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;

    try {
      const emoji = await interaction.guild.emojis.create({
        attachment: url,
        name: name
      });

      await interaction.reply({
        content: `✅ Emoji eklendi: ${emoji}`,
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: "❌ Emoji eklenemedi (limit dolu olabilir).",
        ephemeral: true
      });
    }
  }
};
