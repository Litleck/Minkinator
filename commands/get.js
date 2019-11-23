module.exports = {
  name: 'get',
  description: 'Gets a value from a database.',
  usage: '[model] <object>',
  permissions: ['ADMINISTRATOR'],
  args: true,
  async execute (client, message, args) {
    const modelData = new client.discord.MessageEmbed();
    const objectData = new client.discord.MessageEmbed();

    try {
      var model = client.models[message.guild.name].sequelize.model(args[0]);
    } catch (e) {
      return message.channel.send(`Model: ${args[0]}, does not exist.`);
    }

    if (!args[1]) {
      var primaryKey = model.primaryKeyAttributes[0];

      modelData.setTitle(`${args[0]}`);
      modelData.setColor('#34eb3d');

      await model.findAll().map(object => modelData.addField(object[primaryKey], '⠀', true));

      return message.channel.send(modelData);
    }

    try {
      var object = await model.findByPk(args[1]);
    } catch (e) {
      return message.channel.send(`Object: ${args[1]}, does not exist.`);
    }

    objectData.setTitle(`${args[0]}.${args[1]}`);
    objectData.setColor('#34eb3d');

    Object.entries(object.dataValues).map(([key, value]) => objectData.addField(`${key}:`, value, true));

    return message.channel.send(objectData);
  }
};
