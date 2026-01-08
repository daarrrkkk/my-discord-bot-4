const LIMIT = 3; // kaç işlem
const TIME = 60 * 1000; // 60 saniye

const WHITELIST = [
  "1436804873084600371"
];

const actions = new Map();

function hit(executorId) {
  const now = Date.now();

  if (!actions.has(executorId)) {
    actions.set(executorId, []);
  }

  const logs = actions.get(executorId).filter(t => now - t < TIME);
  logs.push(now);
  actions.set(executorId, logs);

  return logs.length >= LIMIT;
}

module.exports = {
  name: "guildAuditLogEntryCreate",
  async execute(entry, guild) {
    if (!entry.executorId) return;
    if (WHITELIST.includes(entry.executorId)) return;

    const member = await guild.members.fetch(entry.executorId).catch(() => null);
    if (!member) return;

    const dangerousActions = [
      12, // kanal silme
      32, // rol silme
      22, // ban
      20, // kick
      28, // bot ekleme
      25  // yetki verme
    ];

    if (!dangerousActions.includes(entry.action)) return;

    const exceeded = hit(entry.executorId);

    if (exceeded) {
      await member.ban({
        reason: "Ultra Guard | Limit Aşıldı (3 işlem / 60 saniye)"
      }).catch(() => {});
    }
  }
};
