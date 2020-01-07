module.exports = {
  name: 'inventory',
  description: 'Shows a members inventory.',
  parameters: [
    {
      name: 'member',
      type: String
    }
  ],
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user);
    const inventory = (await client.models[message.guild.name].members.findByPk(user.id)).inventory;

    const inventoryEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`Inventory of ${member.displayName}`);

    inventory.map(item => {
      inventoryEmbed.addField(item.name, item.amount);
    });

    return message.channel.send(inventoryEmbed);
  }
};