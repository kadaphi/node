const { Telegraf } = require("telegraf");
const axios = require("axios");
const app = require("express")();
const { Web3 } = require('web3');
const bot = new Telegraf('6601104327:AAE78jk6bgpE0BuTkoqVae1Jw6JFMf05wWg');
let admin;
admin = "@testimony201";
const btc_time = 2000000 //1000 = 1 secs
const trx_time = 100000 //1000 = 1 secs
const usdt_time = 20000 //1000 = 1 secs
const eth_time = 25000 //1000 = 1 secs
const bnb_time = 17000 //1000 = 1 secs


async function getName(){
  try{
    const result = await axios.get("https://api.randomuser.me/");
  const first_name = result.data.results[0].name.first;
  const last_name = result.data.results[0].name.last;
  const user_id = Math.floor(Math.random() * (9999999999-1000000000+1)) + 1000000000;
    return {
      name: first_name,
      user_id: user_id
      }
  }
  catch (error){
    return null;
  }
}

bot.start(ctx => {
  ctx.replyWithHTML(`
<blockquote><b>Welcome to the Bot</b></blockquote>

<i>This bot will send latest Transactions to your Channel.</i>

<u>Commands</u>
/start - Start the bot
/add - add your channel
/post - post latest transactions
/help - get help

<u>Bot Developed by</u> @Stark_nilx
`,{
    reply_markup: {
      remove_keyboard: true
    }
});
});

bot.command('post', ctx => {
  ctx.replyWithHTML("<blockquote>Select Coin Transaction to Post </blockquote>", {
    reply_markup: {
      keyboard: [
        [
          {text: "BTC"},
          {text: "BNB"}
        ],
        [
          {text: "TRX"},
          {text: "USDT"}
        ],
        [
          {text: "ETH"}
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.hears("TRX",async ctx => {
  ctx.reply("Started on "+trx_time/1000+" seconds interval")
  setInterval(async () => {
    let name,user_id;
      let details = await getName();
      if (!details){
        ctx.reply("An Error Occured, Please Try Again")
      }else{
        name = details.name;
        user_id = details.user_id;
      axios.get("https://trader-frederick-api.kingstarofficia.repl.co/trx")
      .then(async (result) => {
        const data = result.data;
        const txid = data.data[0].transactionHash;
        const amount = data.data[0].amount/1000000;
        const currency = data.data[0].tokenInfo.tokenAbbr.toUpperCase();
        if (currency != "TRX"){
          ctx.reply("Wrong Coin Generated, Please Try Again")
          return;
        }
        if (amount < 1 || amount > 10000){
          ctx.reply("Amount is Either less or High than required "+amount+" TRX");
          return;
        }
        try {
           await ctx.telegram.sendMessage(admin,`
    ✅ NEW DEPOSIT RECEIVED 

    🗣 User: ${name}
    🆔 User_Id: ${user_id}
    💵 Amount: ${amount} ${currency}
    🔗 TXID: <a href="https://tronscan.org/#/transaction/${txid}">${txid}</a>
           `,{
                 parse_mode: "HTML",
                 disable_web_page_preview: true
           });
        } catch (error) {
           ctx.reply("An error occured: "+ error.message);
        }

      })
      .catch((error) => {
        ctx.reply("An error occured: "+ error.message);
      });
      }
  },trx_time);
});

bot.hears("USDT",async ctx => {
  ctx.reply("Started on "+usdt_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get("https://trader-frederick-api.kingstarofficia.repl.co/usdt")
  .then(async (result) => {
    const data = result.data;
    const txid = data.token_transfers[0].transaction_id;
    const amount = data.token_transfers[0].trigger_info.parameter._value/1000000;
    const currency = data.token_transfers[0].tokenInfo.tokenAbbr.toUpperCase()
    if (currency != "USDT"){
      ctx.reply("Wrong Coin Generated, Please Try Again")
      return;
    }
    if (amount < 1 || amount > 10000){
      ctx.reply("Amount is Either less or High than required "+amount+" USDT");
      return;
    }
    try {
       await ctx.telegram.sendMessage(admin,`
✅ NEW DEPOSIT RECEIVED 

🗣 User: ${name}
🆔 User_Id: ${user_id}
💵 Amount: ${amount} ${currency}
🔗 TXID: <a href="https://tronscan.org/#/transaction/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },usdt_time);
});

bot.hears("BTC",async ctx => {
  ctx.reply("Started on "+btc_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get("https://trader-frederick-api.kingstarofficia.repl.co/btc")
  .then(async (result) => {
    const data = result.data.data[0];
    const txid = data.hash;
    const amount = data.output_total/100000000;
    if (amount < 0.00000001 || amount > 1){
      ctx.reply("Amount is Either less or High than required "+amount+" BTC");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
✅ NEW DEPOSIT RECEIVED 

🗣 User: ${name}
🆔 User_Id: ${user_id}
💵 Amount: ${amount} BTC
🔗 TXID: <a href="https://blockchair.com/bitcoin/transaction/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },btc_time);
});

bot.hears("BNB",async ctx => {
  ctx.reply("Started on "+bnb_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get("https://trader-frederick-api.kingstarofficia.repl.co/bnb")
  .then(async (result) => {
    const data = result.data
    const txid = data.hash;
    const amount = data.value;
    if (amount < 0.00000001 || amount > 10){
      ctx.reply("Amount is Either less or High than required "+amount+" BNB");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
✅ NEW DEPOSIT RECEIVED 

🗣 User: ${name}
🆔 User_Id: ${user_id}
💵 Amount: ${amount} BNB
🔗 TXID: <a href="https://bscscan.com/tx/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },bnb_time);
});

bot.hears("ETH",async ctx => {
  ctx.reply("Started on "+eth_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get("https://trader-frederick-api.kingstarofficia.repl.co/eth")
  .then(async (result) => {
    const data = result.data
    const txid = data.hash;
    const amount = data.value;
    if (amount < 0.00000001 || amount > 10){
      ctx.reply("Amount is Either less or High than required "+amount+" eth");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
✅ NEW DEPOSIT RECEIVED 

🗣 User: ${name}
🆔 User_Id: ${user_id}
💵 Amount: ${amount} ETH
🔗 TXID: <a href="https://etherscan.io/tx/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },eth_time);
});


bot.launch();
console.log("Bot developed by @stark_nil");
