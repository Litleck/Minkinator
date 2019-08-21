function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: "shutdown",
    description: "Shutdowns the bot.",
    usage: "<delay>",
    async execute(message, args) {
        console.log(`${message.author.name} has ran the command ${message.content}.`);
        
        if (args[0]) {
            message.channel.send(`Shutting down in ${args[0]} seconds.`);
            await timeout(args[0] * 1000);
        }

        await console.log("Shutting down");
        await message.channel.send("Shutting down.");

        process.exit();
    }
}