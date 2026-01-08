const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duyuru")
    .setDescription("Sunucu yönetimi duyurusu")
    .addStringOption(option =>
      option
        .setName("metin")
        .setDescription("Duyuru metni")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("etiket")
        .setDescription("Atılacak etiket")
        .addChoices(
          { name: "@everyone", value: "everyone" },
          { name: "@here", value: "here" },
          { name: "Etiket yok", value: "none" }
        )
        .setRequired(false)
    )
    .addRoleOption(option =>
      option
        .setName("rol")
        .setDescription("Rol etiketle")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const metin = interaction.options.getString("metin");
    const etiket = interaction.options.getString("etiket");
    const rol = interaction.options.getRole("rol");
    const member = interaction.member;

    // 🔰 RÜTBE ÖNCELİĞİ
    const rütbeler = [
      "Baş Sunucu Yöneticisi",
      "Kıdemli Sunucu Yöneticisi",
      "Sunucu Yöneticisi"
    ];

    let rütbe = "Sunucu Yetkilisi";
    for (const r of rütbeler) {
      if (member.roles.cache.some(role => role.name === r)) {
        rütbe = r;
        break;
      }
    }

    // 📣 ETİKET
    let mention = "";
    if (etiket === "everyone") mention = "@everyone\n";
    else if (etiket === "here") mention = "@here\n";
    else if (rol) mention = `<@&${rol.id}>\n`;

    const mesaj =
`${mention}__**Sunucu Yöneticiliği duyuru**__

Değerli THO personelleri,

${metin}

(${interaction.user.username} – ${interaction.user.id})
__${rütbe}__`;

    await interaction.reply({
      content: mesaj,
      allowedMentions: {
        parse: etiket === "none" ? [] : ["everyone", "roles"]
      }
    });
  }
};
