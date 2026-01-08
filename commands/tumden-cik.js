const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tumden-cik")
    .setDescription("Bot, bulunduğu tüm sunuculardan çıkar"),

  async execute(interaction) {
    // Yönetici kontrolü
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "Bunu yapmak için yönetici yetkin olmalı!", ephemeral: true });
    }

    await interaction.reply({ content: "Bot tüm sunuculardan ayrılmaya başlıyor...", ephemeral: true });

    let success = 0;
    let fail = 0;

    for (const [guildId, guild] of interaction.client.guilds.cache) {
      try {
        await guild.leave();
        success++;
      } catch (err) {
        console.error(`Sunucu: ${guild.name}, Hata: ${err}`);
        fail++;
      }
    }

    console.log(`Bot tüm sunuculardan ayrıldı. Başarılı: ${success}, Başarısız: ${fail}`);
  }
};
