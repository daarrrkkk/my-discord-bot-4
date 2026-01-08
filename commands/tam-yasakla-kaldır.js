const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tam-yasak-ac")
    .setDescription("Bir kullanıcının tüm sunuculardaki yasaklarını kaldırır")
    .addStringOption(option =>
      option
        .setName("kullanici")
        .setDescription("Kullanıcı ID veya mention")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Yasağın kaldırılma sebebi")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const input = interaction.options.getString("kullanici");
    const sebep = interaction.options.getString("sebep");

    const userId = input.replace(/[<@!>]/g, "");

    const basarili = [];
    const basarisiz = [];

    await interaction.reply({
      content: "Tam yasak açma işlemi başlatıldı...",
      ephemeral: true
    });

    for (const guild of interaction.client.guilds.cache.values()) {
      try {
        await guild.bans.fetch(userId);
        await guild.bans.remove(userId, sebep);
        basarili.push(guild.name);
      } catch {
        basarisiz.push(guild.name);
      }
    }

    const rapor =
`==============================
TAM YASAK AÇMA RAPORU
==============================

Yasağı Açılan Kullanıcı:
${userId}

İşlemi Yapan Yetkili:
${interaction.user.username} (${interaction.user.id})

Sebep:
${sebep}

--------------------------------
Yasağı Açılan Sunucular
--------------------------------
${basarili.length ? basarili.map(s => `- ${s}`).join("\n") : "Yok"}

--------------------------------
Açılamayan Sunucular
--------------------------------
${basarisiz.length ? basarisiz.map(s => `- ${s}`).join("\n") : "Yok"}

THO | Sunucu Yöneticiliği Sistemi`;

    await interaction.followUp({ content: rapor });
  }
};
