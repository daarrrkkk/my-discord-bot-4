const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tam-yasakla")
    .setDescription("Seçilen kişiyi botun bulunduğu tüm sunuculardan yasaklar")
    .addUserOption(o =>
      o.setName("kullanıcı")
        .setDescription("Yasaklanacak kişi")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("sebep")
        .setDescription("Yasaklama sebebi")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const hedef = interaction.options.getUser("kullanıcı");
    const sebep = interaction.options.getString("sebep");

    const yasaklanan = [];
    const sorun = [];

    for (const guild of interaction.client.guilds.cache.values()) {
      try {
        const member = await guild.members.fetch(hedef.id).catch(() => null);
        if (!member) {
          sorun.push(guild.id);
          continue;
        }

        await member.ban({ reason: sebep });
        yasaklanan.push(`${guild.name} (${guild.id})`);
      } catch {
        sorun.push(guild.id);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0x1e1f22)
      .setTitle("TAM YASAKLAMA İŞLEMİ")
      .setDescription(
`**${hedef.tag} (${hedef.id})** adlı kişi **${interaction.user.tag} (${interaction.user.id})**
tarafından tüm sunuculardan yasaklandı.

**Sebep:** ${sebep}

__YASAKLANDIĞI SUNUCULAR__
${yasaklanan.length ? yasaklanan.join("\n") : "Yok"}

__SORUN__
${sorun.length ? sorun.join("\n") : "Yok"}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
