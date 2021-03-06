module.exports = {
  description: "Deletes all of a guilds web hooks.",
  permissions: ["MANAGE_WEBHOOKS"],
  aliases: ["delete-webhooks", "del-webhooks"],
  async execute (client, message) {
    const webhooks = await message.guild.fetchWebhooks();

    // Delete all webhooks
    webhooks.map(async webhook => {
      await global.fetchWebhook(webhook.id).then(webhook => webhook.delete());
    });

    return message.reply(`Deleted \`${webhooks.size}\` webhooks from the guild.`);
  }
};