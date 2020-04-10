const Discord = require('discord.js');
const client = new Discord.Client();
const MongoClient = require('../database/mongo_connection.js');


/* I manually input the values because some people didn't match correctly
   when submitting the survey */
var haveAnswered = [
    'StonedStone',
    'MachineGunShelly',
    'duski',
    'PewPewman',
    'WHITELIGHTNING',
    'Switchgear',
    'Headshot Hero',
    'Mav81',
    'Jiangshi',
    'Twizted Mizfit',
    'tezr',
    'Disturbedshark98',
    'WARLOCKS CANT JUMP',
    'FateProtocolTTV',
    'RedJay',
    'Delbaeth',
    'The Internet',
    'Hunky chunky :3',
    'IsabellaHeart',
    'Hooternut',
    'VaccinesCauseAutism',
    'unknowndragon1099',
    'Grinder299',
    'SNOMAN',
    'VictoryBurrito',
    'ヨアヒムマシュー◦',
    'Mr.Miser',
    'sheatime',
    'wtfkirk',
    'ÄŦŁÄŞ',
    'Millard',
    'erfattack',
    'Scorpz03',
    'apieceofenergy',
    'Pinseeker',
    'aPhantomDolphin'
]


var answeredids = [];
const reminder = `You are receiving this message because a survey was posted a few days ago and ` +
                `you have not yet responded. The link to the survey is https://forms.gle/ufPfBMR5cGvCEK4r7. It ` +
                `will take no longer than 5 minutes and it helps the admins figure out how we can improve the clan experience ` +
                `for everyone. Thanks.\n--If you believe you've received this message in error, you can ignore it.--`;

module.exports.sendDm = function(members, text) {
    members.forEach(member => {
        if (!member.user.bot && (member.id == '153392262171066369' || member.id == '281604755376177154')) {
            member.user.send(text);
        }
    });
}