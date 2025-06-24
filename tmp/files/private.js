const fs = require("fs");
require("../funcion");

function includesCaseInsensitive(string, substring) {
  return string.toLowerCase().includes(substring.toLowerCase());
}

const sleep = async (min, max) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );
};

module.exports = async (conn, mek, jid, messages, addMessageJson) => {
  try {
    const from = jid;
    const pushname = mek?.pushName || "";

    // Enviar Mensagem
    const enviar = (text) => {
      conn.sendMessage(
        from,
        {
          text,
        },
        {
          quoted: mek,
        }
      );
    };

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
    const firstMessage = messages.find((i) => i.user == from)?.messages === 1;
    if (
      (type == "conversation" || type == "extendedTextMessage") &&
      budy.length > 1
    )
      addMessageJson(jid, mek.pushName, budy);

    const arrayPoll = [
      "➜ Netflix",
      "➜ Consultar SPC",
      "➜ Consultar Score",
      "⊙ Suporte",
    ];

    if (time() == true && firstMessage) {
      await conn.sendPresenceUpdate("composing", from);
      await sleep(1000, 2000);
      await sleep(3000, 5000);
      await sleep(3000, 10000);

      return conn.sendMessage(from, {
        poll: {
          name: `Olá ${pushname}! Tudo bem?\n\n*Selecione alguma das opções abaixo.*`,
          values: arrayPoll,
          selectableCount: 1,
        },
      });
    } else if (
      includesCaseInsensitive(budy, "Ola") ||
      includesCaseInsensitive(budy, "Olá") ||
      includesCaseInsensitive(budy, "Oi") ||
      includesCaseInsensitive(budy, "Bom Dia") ||
      includesCaseInsensitive(budy, "Boa Tarde") ||
      includesCaseInsensitive(budy, "Boa Noite") ||
      includesCaseInsensitive(budy, "Como vai?") ||
      includesCaseInsensitive(budy, "Tudo bem") ||
      includesCaseInsensitive(budy, "Ajuda") ||
      includesCaseInsensitive(budy, "Suporte") ||
      includesCaseInsensitive(budy, "Atendimento") ||
      includesCaseInsensitive(budy, "Urgente")
    ) {
      await conn.sendPresenceUpdate("composing", from);
      await sleep(1000, 2000);
      await sleep(3000, 5000);
      return conn.sendMessage(from, {
        poll: {
          name: global.messages(pushname),
          values: arrayPoll,
          selectableCount: 1,
        },
      });
    }
  } catch (err) {
    return conn
      .sendMessage(global.dump, {
        text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`,
      })
      .catch((err) => {
        console.log("Não foi possível enviar a mensagem de Erro!", err);
      });
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(global.bannerText(`Update file: ${__filename}`).string);
  delete require.cache[file];
  require(file);
});
