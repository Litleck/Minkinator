const chalk = require("chalk");

module.exports = {
  description: "Reloads all the bot events and commands.",
  aliases: ["r"],
  async execute (client, message) {
    const { commands, events } = client;

    const reloadEmbed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "Reloading",
      description: `Reloading \`${commands.length}\` commands and \`${events.length}\` events.`
    });

    const reloadMessage = await message.reply(reloadEmbed);

    client.removeAllListeners();

    // Load events
    try {
      await client.loadEvents();
    } catch (error) {
      console.error(chalk`{red ${error}}`);

      return message.reply("An error has occurred while reloading events.");
    }

    // Load commands
    try {
      await client.loadCommands();
    } catch (error) {
      console.error(chalk`{red ${error}}`);

      return message.reply("An error has occurred while reloading commands.");
    }

    await client.emit("ready");

    const ms = Date.now() - reloadMessage.createdTimestamp;

    reloadEmbed.setTitle("Finished reloading");
    reloadEmbed.setDescription(`Reloaded \`${commands.length}\` commands and \`${events.length}\` events in \`${ms}\` ms.`);

    return reloadMessage.edit(reloadEmbed);
  }
};