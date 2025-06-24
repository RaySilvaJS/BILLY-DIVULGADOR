const fs = require("fs");
require("../funcion");

const sleep = async (min, max) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );
};

const metadadosLink = JSON.parse(fs.readFileSync("./tmp/groupsLink.json"));
const saveLinkGroup = (link) => {
  const element = metadadosLink.findIndex((res) => res.includes(link));
  if (element == -1) {
    metadadosLink.push(link);
  } else {
  }
  fs.writeFileSync("./tmp/groupsLink.json", JSON.stringify(metadadosLink));
};

// Dentro de group.js
module.exports = async function (
  conn,
  jid,
  groupMessagesJson,
  mensagemVenda,
  limite,
  mek
) {
  try {
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

    const getAllGpUrls = (str) =>
      str.match(/https?:\/\/?chat\.whatsapp\.com\/.{22}/g) || null;

    if (
      getAllGpUrls(budy)?.length >= 1 &&
      /https?:\/\/?chat\.whatsapp\.com\/.{22}/g.test(budy)
    ) {
      texk = "";
      groupregistered = false;
      for (const item of getAllGpUrls(budy)) {
        const element1 = metadadosLink.findIndex((res) => res.includes(item));
        if (element1 !== -1) groupregistered = true;

        const { subject } = await conn
          .groupGetInviteInfo(item.split("https://chat.whatsapp.com/")[1])
          .catch((error) => error);

        texk += `- ${subject}\n- ${item}\n\n`;
        saveLinkGroup(item);
        /* await sleep(1000, 2000);
        await sleep(3000, 4000);
        await sleep(5000, 6000);
        await sleep(5000, 10000);

        await conn.groupAcceptInvite(item.split('https://chat.whatsapp.com/')[1]).catch((err) => {
          return conn.sendMessage(dump, {
            text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`
          }).catch((err) => {
            console.log('Não foi possível enviar a mensagem de Erro!', err);
          });
        });
        */
      }
      if (groupregistered == false) {
        conn
          .sendMessage(global.dump, {
            text: "Grupo(s) que encontrei:\n\n" + texk.trim(),
          })
          .catch();
      }
    }

    const findGroupJid = groupMessagesJson.findIndex((id) =>
      id.jid.includes(jid)
    );

    var element = limite.findIndex((index) => index);

    numberLimite = 0;
    if (element != -1) {
      numberLimite = limite[element]?.number ?? 0;
    }

    if (
      numberLimite > 0 &&
      findGroupJid != -1 &&
      groupMessagesJson[findGroupJid]?.messages % numberLimite === 0
    ) {
      const indiceAleatorio = Math.floor(Math.random() * mensagemVenda.length);
      const randomMessages = mensagemVenda[indiceAleatorio];
      if (randomMessages) {
        const caminhoMidia = fs
          .readdirSync("./tmp/image")
          .filter((file) => file.includes(randomMessages.type));

        const caminhoArquivo = `tmp/image/${randomMessages.type}.jpg`;

        // Verifica se o arquivo existe
        fs.exists(`./tmp/image/${caminhoMidia[0]}`, (existe) => {
          if (existe) {
            if (caminhoMidia[0].endsWith(".jpg"))
              return conn
                .sendMessage(jid, {
                  image: { url: `./tmp/image/${caminhoMidia[0]}` },
                  caption: randomMessages.text,
                })
                .then(async () => {
                  await conn
                    .groupMetadata(jid)
                    .then((res) => {
                      conn.sendMessage(global.dump, {
                        text: `> Divulgação de *IMAGEM* concluída!\n\n- Grupo: ${res.subject}`,
                      });
                    })
                    .catch();
                })
                .catch();
            if (caminhoMidia[0].endsWith(".mp4"))
              return conn
                .sendMessage(jid, {
                  video: { url: `./tmp/image/${caminhoMidia[0]}` },
                  caption: randomMessages.text,
                })
                .then(async () => {
                  await conn
                    .groupMetadata(jid)
                    .then((res) => {
                      conn.sendMessage(global.dump, {
                        text: `> Divulgação de *VIDEO* concluída!\n\n- Grupo: ${res.subject}`,
                      });
                    })
                    .catch();
                })
                .catch();
          } else {
            conn
              .sendMessage(jid, {
                text: randomMessages.text,
              })
              .then(async () => {
                await conn
                  .groupMetadata(jid)
                  .then((res) => {
                    conn.sendMessage(global.dump, {
                      text: `> Divulgação de *TEXTO* divulgado!\n\n- Grupo: ${res.subject}`,
                    });
                  })
                  .catch();
              })
              .catch();
          }
        });
      }
    }
  } catch (err) {
    console.log({ err });
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
