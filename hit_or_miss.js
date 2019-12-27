/* 

    Admirando meu irmão, deixo meu cabelo crescer >:)

*/

const request = require('request'),
      logger = require('logs'),
      fs = require('fs'),
      figlet = require('figlet'),
      colors = require('colors');
      
setInterval( function() {    
      
working = [];

getGiftCode = function ()
{
    let code = '';
    let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(var i = 0; i < 16; i++)
	{
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return code;
}

checkCode = function (code)
{
    request(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, res, body) =>
	{
        if(error)
		{
            logger.error(`[Nitro] Ocorreu um erro: ${error}`);
            return;
        }
        try
		{
            body = JSON.parse(body);
			
			if(body.message === "You are being rate limited.")
			{
				logger.info(`[Nitro] Descansando por 40s por favor aguarde.`);
				return process.exit();
			}
			
            if(body.message != "Unknown Gift Code")
			{
                logger.info(`[Nitro] achei um código funcionando https://discord.gift/${code} !!!`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
                process.exit();
            }
            else {
                logger.info(`[Nitro] Inv?lido ${code}`);
                return;
            }
        }
        catch (error) {
            logger.error(`[Nitro] Ocorreu um erro: ${error}`);
            return;
        }
    });
}


console.log(figlet.textSync("Sariel / 666").green);
setInterval(() => { checkCode(getGiftCode()); }, 1 * 1000);
}, 40000);