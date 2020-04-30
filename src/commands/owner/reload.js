module.exports = {
  description: 'Reloads the bot commands.',
  aliases: ['restart', 'reboot', 'r'],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const time = client.moment().format('HH:mm M/D/Y');

    const commands = client.commands;
    const events = client.events;

    const reloadEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Reloading')
      .setDescription(`Reloading \`${commands.size}\` commands and \`${events.size}\` events`)
      .setTimestamp();

    const reloadMessage = await message.channel.send(reloadEmbed);

    client.removeAllListeners();
    client.commands.clear();

    try {
      await client.loadEvents();
      await client.loadCommands();
    } catch (error) {
      console.error(error);

      return message.channel.send('An error has occurred reloading. Please check console.');
    }

    reloadEmbed.setTitle('Finished reloading');
    reloadEmbed.setDescription(`Reloaded \`${commands.size}\` commands and \`${events.size}\` events in \`${reloadMessage.createdTimestamp - message.createdTimestamp}\` ms`);

    reloadMessage.edit(reloadEmbed);

    return console.log(`${`(${time})`.green} Finished reloading commands and events`);
  }
};