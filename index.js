const fs = require("fs");
const limite = JSON.parse(fs.readFileSync("./config.json"));

const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
require("./tmp/funcion");
require("qrcode-terminal");

async function startIndex() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      "./tmp/connection/auth"
    );

    const { version } = await fetchLatestBaileysVersion();

    const conn = (global.socket = makeWASocket({
      printQRInTerminal: true,
      logger: pino({
        level: "silent",
      }),
      browser: ["NS Multi Device", "Chrome", "3.0"],
      version,
      auth: state,
    }));

    const botNumber = conn.user?.id.split(":")[0] + "@s.whatsapp.net";
    var element = limite.findIndex((index) => index);
    const dump = (global.dump = limite[element].groupJid.includes("@")
      ? limite[element]?.groupJid
      : botNumber);

    conn.ev.on("creds.update", () => saveCreds());

    const path = require("path");

    const directoryPath = "./tmp/connection/auth";

    function deleteNonCredsJsonFiles() {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Erro ao ler o diretório", err);
          return;
        }

        files.forEach((file) => {
          if (path.extname(file) === ".json" && file !== "creds.json") {
            fs.unlink(path.join(directoryPath, file), (err) => {
              if (err) {
                console.error("Erro ao apagar o arquivo", file, err);
              } else {
                console.log("Arquivo apagado:", file);
              }
            });
          }
        });
      });
    }

    const filesLength = () => {
      return new Promise((resolve, reject) => {
        let jsonFiles = 0;

        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error("Erro ao ler a pasta", err);
            reject(err);
          } else {
            files.forEach((file) => {
              if (file.endsWith(".json")) {
                jsonFiles++;
              }
            });
            resolve(jsonFiles);
          }
        });
      });
    };

    const messages = JSON.parse(fs.readFileSync("./tmp/messages.json"));

    function addMessageJson(jid, pushname, score) {
      const element = messages.findIndex((i) => i.user.includes(jid));

      if (element == -1) {
        messages.push({
          user: jid,
          pushname,
          messages: 1,
          mensagens: [score], // Inicia o array de mensagens com a primeira mensagem
        });
      } else {
        if (messages[element].user.includes(jid))
          messages[element].messages += 1;
        // Adiciona a nova mensagem ao array de mensagens do usuário
        messages[element].mensagens.push(score);
      }

      fs.writeFileSync(
        "./tmp/messages.json",
        JSON.stringify(messages, null, "\t")
      );
    }

    const groupMessagesJson = JSON.parse(fs.readFileSync("./tmp/groups.json"));
    function groupMessages(jid) {
      const element1 = groupMessagesJson.findIndex((i) => i.jid.includes(jid));
      if (element1 == -1) {
        groupMessagesJson.push({
          jid,
          messages: 1,
        });
      } else {
        if (groupMessagesJson[element1].jid.includes(jid))
          groupMessagesJson[element1].messages += 1;
      }
      fs.writeFileSync(
        "./tmp/groups.json",
        JSON.stringify(groupMessagesJson, null, "\t")
      );
    }

    const mensagensPrivado = JSON.parse(
      fs.readFileSync("./tmp/mensagens-privado.json")
    );
    function savePrivateMessages(jid) {
      const element1 = mensagensPrivado.findIndex((i) => i.jid.includes(jid));
      if (element1 == -1) {
        mensagensPrivado.push({
          jid,
          messages: 1,
        });
      } else {
        if (mensagensPrivado[element1].jid.includes(jid))
          mensagensPrivado[element1].messages += 1;
      }
      fs.writeFileSync(
        "./tmp/mensagens-privado.json",
        JSON.stringify(mensagensPrivado, null, "\t")
      );
    }

    const mensagemVenda = JSON.parse(
      fs.readFileSync("./tmp/messagesSales.json")
    );

    conn.ev.on("messages.upsert", async (m) => {
      try {
        if (!m.messages) return;
        const mek = m.messages[0];
        if (!mek.message) return;
        if (mek.key.fromMe) return;
        if (mek.key && mek.key.remoteJid === "status@broadcast") return;

        const jid = mek.key.remoteJid;

        // Gerenciador de Comandos de admin
        if (jid.includes("@") && jid.includes(dump))
          require("./tmp/files/commands.js")(
            conn,
            mek,
            mensagemVenda,
            limite,
            mensagensPrivado
          );

        // Grupos de Divulgação
        if (jid.endsWith("@g.us")) {
          groupMessages(jid);

          // conn.readMessages([mek.key]);

          // await conn.chatModify({ archive: true, lastMessages: [mek] }, sender);
          require("./tmp/files/group.js")(
            conn,
            jid,
            groupMessagesJson,
            mensagemVenda,
            limite,
            mek
          );
        }

        // if (jid.endsWith("@s.whatsapp.net")) {
        //   savePrivateMessages(jid);

        //   require("./files/privado.js")(conn, mek, mensagensPrivado);
        // }
      } catch (err) {
        console.log(global.color("...Error: ", "red"), err);
        return conn
          .sendMessage(dump, {
            text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`,
          })
          .catch((err) => {
            console.log("Não foi possível enviar a mensagem de Erro!", err);
          });
      }
    });

    const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

    conn.getFileBuffer = async (mediakey) => {
      const stream = await downloadContentFromMessage(
        mediakey,
        mediakey.mimetype.split("/")[0]
      );
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    };

    conn.ev.on("connection.update", (update) => {
      try {
        const numberConnect = conn.user?.id.split(":")[0] || 0;
        console.log("...Loading:", global.color(numberConnect, "red"), update);

        if (numberConnect === 0) {
          var caminhoArquivo = "backup/creds.json";

          fs.exists(caminhoArquivo, (existe) => {
            if (existe) {
              fs.readFile(caminhoArquivo, "utf8", (err, data) => {
                if (data.length > 0) {
                  copyFile(caminhoArquivo, "./tmp/connection/auth/creds.json");
                  startIndex();
                }
              });
            }
          });
        }
        if (update.connection == "close") {
          if (
            update.lastDisconnect.error.hasOwnProperty("output")
              ? update.lastDisconnect.error.output.statusCode !=
                DisconnectReason.loggedOut
              : true
          ) {
            console.log(
              global.bannerText("conexao fechada, reconectando...").string
            );

            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.connectionLost
          ) {
            console.log(
              global.bannerText(
                "conexao com a internet foi perdida, reconectando..."
              ).string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.connectionReplaced
          ) {
            console.log(
              global.bannerText("conexao substituida, reconectando...").string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.timedOut
          ) {
            console.log(
              global.bannerText("tempo de conexao esgotado, reconectando...")
                .string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.loggedOut
          ) {
            console.log(
              global.bannerText("usuario desconectado, reconectando...").string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.badSession
          ) {
            console.log(
              global.bannerText("sessao ruim, reconectando...").string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.restartRequired
          ) {
            console.log(
              global.bannerText("reiniciamento exigido, reiniciando...").string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.multideviceMismatch
          ) {
            console.log(
              global.bannerText(
                "icompatibilidade com varios dispositivos, reconectando..."
              ).string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.multideviceMismatch
          ) {
            console.log(
              global.bannerText(
                "icompatibilidade com varios dispositivos, reconectando..."
              ).string
            );
            startIndex();
          } else if (
            update.lastDisconnect.error.output.statusCode ==
            DisconnectReason.multideviceMismatch
          ) {
            console.log(
              global.bannerText(
                "icompatibilidade com varios dispositivos, reconectando..."
              ).string
            );
            startIndex();
          }
        } else if (update.connection == "open") {
          console.log(
            global.color("...", "red", "Online: Bot rodando normal.")
          );
          global.socket
            .sendMessage(dump, {
              text: "> Conectado com Sucesso!",
            })
            .finally(() => {
              var caminhoArquivo = "tmp/connection/auth/creds.json";

              fs.exists(caminhoArquivo, (existe) => {
                if (existe) {
                  fs.readFile(caminhoArquivo, "utf8", (err, data) => {
                    if (data.length > 0) {
                      copyFile(
                        "./tmp/connection/auth/creds.json",
                        "./backup/creds.json"
                      );
                    }
                  });
                }
              });
            });
        }
      } catch (err) {
        console.log(global.color("...Error: ", "red"), err);
      }
    });
  } catch (err) {
    console.log(global.color("...Error: ", "red"), err);
  }
}

startIndex();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(global.bannerText(`Update file: ${__filename}`).string);
  delete require.cache[file];
  require(file);
  process.exit();
});
