const { SlashCommandBuilder } = require("discord.js");
const queue = require("../music/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Şarkıyı atlar"),

  async execute(interaction) {
    const data = queue.get(interaction.guild.id);
    if (!data) return interaction.reply("❌ Çalan şarkı yok.");

    data.player.stop();
    interaction.reply("⏭️ Şarkı atlandı.");
  }
};
