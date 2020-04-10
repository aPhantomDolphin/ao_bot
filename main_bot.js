const Discord = require('discord.js');
const client = new Discord.Client();
const Welcome = require('./src/bot_functions/welcome.js');
const ActiveMembers = require('./src/bot_functions/active_members.js');
const Lore = require('./src/bot_functions/lore.js');
const Rolls = require('./src/bot_functions/keep_or_shard/shardit.js');
const DM = require('./src/bot_functions/dm.js');
const Update = require('./src/misc/write_id_to_file.js');
const MongoClient = require('./src/database/mongo_connection.js');
const fs = require('fs');
const compile = require('es6-template-strings/compile');
var info = require('./src/resources/info.json');
var data;
var messageDefault = info.messageDefault;


/* Read in welcome message. If there is an error, reset it to default */
try {
    data = fs.readFileSync("./src/resources/welcomeMessage.txt", "utf8");
} catch (err) {
    console.log(err);
    data = messageDefault;
}

var compiled = compile(data);

var allids = [];

/* Heroku needs to auth from environment variable.
   Testing is the binary variable acting as the switch */
const testing = false;
var auth;
if (testing) {
    auth = require('./auth.json');
} else {
    auth = process.env.BOT_TOKEN;
}

/* Notify when the bot is up and running */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* Call function whenever someone joins the server */
client.on('guildMemberAdd', (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    Welcome.welcome(member);
});

/**
 * Determine which functionality is being requested
 */
client.on('message', (msg) => {
    /* Only enter switch if first character matches the indicator */
    if (msg.content.substring(0, 1) == '?' && msg.content.length > 1) {
        var command = msg.content.substring(1).split(' ');
        var sendChannel = msg.channel;
        switch (command[0]) {
            case 'active':
                ActiveMembers.activeMembers(msg.guild, sendChannel);
                break;
            case 'lore':
                Lore.getLore(msg.content.substring(6), sendChannel);
                break;
            case 'rolls':
                Rolls.getRolls(msg, sendChannel);
                break;
            case 'best':
                Rolls.bestInCategory(msg, sendChannel);
                break;
            case 'dm':
                if (!info.adminIds.includes(msg.author.id)) {
                    break;
                }
                var members = msg.guild.members;
                var text = msg.content.substring(4);
                DM.sendDm(members, text);
                break;
            case 'updateid':
                var guild = msg.guild;
                if (Update.updateIds(guild)) {
                    sendChannel.send("ID's updated");
                } else {
                    sendChannel.send("Failed to update ID's");
                }
                break;
            case 'welcome':
                var cmd = msg.content.substring(9);
                var cmdArr = cmd.split(' ');
                switch (cmdArr[0]) {
                    case "view":
                        Welcome.viewMessage(data, sendChannel);
                        break;
                    case "set":
                        var stringToSet = "";
                        if (cmdArr[1] == "--default") {
                            stringToSet = messageDefault;
                        } else {
                            stringToSet = cmd.substring(4);
                        }
                        if (Welcome.setMessage(stringToSet, sendChannel)) {
                            data = stringToSet;
                            compiled = compile(data);
                        }
                        break;
                }
        }
    }
})

if (testing) {
    client.login(auth.token);
} else {
    client.login(auth);
}

/* Read in clan member ids from file */
fs.readFile('./src/misc/αlpha_ωmega_ids.txt', (err, data) => {
    if (err) throw err;
    allids = data.toString().split('\n');
});

MongoClient.get().then((client) => {
    console.log("mongo client established");
}).catch(e => {
    console.log(e);
});


/* Initialize the weapon arrays needed for the rolls */
Rolls.initWeaponsApi();