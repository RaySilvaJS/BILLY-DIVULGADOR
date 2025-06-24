require("../config.json");
const fs = require("fs");

module.exports = async function (conn, mek, mensagensPrivado) {
  try {
    const from = mek.key.remoteJid;
    const type = Object.keys(mek.message).find(
      (key) =>
        !["senderKeyDistributionMessage", "messageContextInfo"].includes(key)
    );
    const budy =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : "";

    // Parte de Comandos
    const prefix = "/";
    const body =
      type === "conversation" && mek.message.conversation.startsWith(prefix)
        ? mek.message.conversation
        : type == "extendedTextMessage" &&
          mek.message[type].text.startsWith(prefix)
        ? mek.message[type].text
        : "";

    var comando = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/gi, "");

    const isCmd = body.startsWith(prefix);
    const args = body.trim().split(/ +/).slice(1);

    const isGroup = from.endsWith("@g.us");
    const sender = isGroup
      ? mek.key.participant
        ? mek.key.participant
        : mek.participant
      : mek.key.remoteJid;

    const enviar = (text) => {
      return conn
        .sendMessage(from, {
          text,
        })
        .catch();
    };

    const toErro = (error) => {
      const util = require("util");
      if (typeof error == "string") {
        return enviar(error);
      } else enviar(util.inspect(error));
    };

    const result = mensagensPrivado.find((line) => line.jid === from);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function obterMensagemAleatoria() {
      const mensagens = [
        "Olá! 😊 Como posso te ajudar a encontrar o que procura hoje?",
        "Oi! 🌸 Estou aqui para te ajudar! Quer dar uma olhada no nosso catálogo ou prefere que eu te indique algo especial?",
        "Oi! ❤️ Tudo bem? Temos novidades incríveis no catálogo! O que você está procurando para apimentar sua relação?",
        "Olá! 😊 Seja bem-vinda(o)! Aqui na [Nome da Loja], temos produtos para todos os gostos e ocasiões. Me conta: o que você está buscando?",
        "Oi! 🌷 Tudo bem? Estou aqui para te ajudar com discrição e carinho. Me diz: o que você precisa?",
        "Olá! 💝 Boas notícias: temos promoções imperdíveis no catálogo! 😍 Quer conferir ou prefere que eu te indique algo específico?",
        "Oi! 😉 Tudo bem? Aqui é o lugar certo para descobrir produtos que vão deixar tudo mais interessante! 😏 O que você está pensando?",
        "Olá! 🌟 Tudo bem? Se precisar de ajuda para escolher ou quiser conhecer nossos lançamentos, é só me dizer!",
      ];
      const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
      return mensagens[indiceAleatorio];
    }

    function getSaudacao() {
      const hora = new Date().toLocaleTimeString("pt-BR", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      });

      if (hora >= 5 && hora < 12) return "Bom dia";
      if (hora >= 12 && hora < 18) return "Boa tarde";
      if (hora >= 18 && hora < 24) return "Boa noite";
      return "Boa madrugada";
    }

    if (result.messages === 1) {
      // 1
      await conn.sendPresenceUpdate("composing", from);
      await sleep(3000);
      await conn.sendPresenceUpdate("composing", from);
      await sleep(3000);
      await conn.sendPresenceUpdate("composing", from);
      await sleep(3000);
      await conn.sendPresenceUpdate("composing", from);
      await sleep(3000);
      enviar(obterMensagemAleatoria());

      // await enviar(`Olá, ${getSaudacao()}! Tudo bem? Como posso ajudar?`);

      // 2
      //       await conn.sendPresenceUpdate("composing", from);
      //       await sleep(3000);
      //       await conn.sendPresenceUpdate("composing", from);
      //       await sleep(3000);
      //       await conn.sendPresenceUpdate("composing", from);
      //       await sleep(3000);
      //       await conn.sendPresenceUpdate("composing", from);
      //       await sleep(3000);

      //       await enviar(
      //         `📢 *Nosso catálogo está disponível!*

      // 🔗 *Clique aqui para conferir:* https://drive.google.com/file/d/1VdQDmw11OJ0e1irwc0c6ACgjJfWGItx4/view?usp=sharing

      // Se não conseguir acessar, me avise! 📲 Entregamos *de segunda a domingo*. 🚚✨`
      //       );

      // require("../tmp/image/Meu Paraiso Secreto.pdf")

      // await sleep(3000);
      // await sleep(3000);
      // return conn.sendMessage(from, {
      //   document: fs.readFileSync("./tmp/image/Meu Paraiso Secreto.pdf"),
      //   mimetype: "application/pdf",
      //   fileName: "Meu Paraiso Secreto.pdf",
      //   caption:
      //     "Confira nosso catálogo e escolha seu produto favorito! Assim que decidir, me envie uma mensagem para finalizar seu pedido. 😊",
      // });
    }

    return conn.sendMessage(dump, {
      text: `MENSAGEM NO PRIVADO!\n\n- ${result.jid.split("@")[0]}`,
    });
  } catch (err) {
    return console.log(
      global.color("ERRO OCORRIDO!!\n", "red"),
      `${global.color(__filename, "green")}\n`,
      err
    );
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(global.bannerText(`Update file: ${__filename}`).string);
  delete require.cache[file];
  require(file);
});
