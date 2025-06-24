const fs = require("fs");
const { request } = require("http");
require("../funcion");

const sleep = async (min, max) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );
};

module.exports = async (conn, mek, mensagemVenda, limite, mensagensPrivado) => {
  try {
    const from = mek.key.remoteJid;
    const pushname = mek?.pushName || "";
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

    // comandos
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

    // Enviar Mensagem
    const enviar = (text) => {
      return conn.sendMessage(
        from,
        {
          text,
        },
        {
          quoted: mek,
        }
      );
    };

    const toErro = (error) => {
      const util = require("util");
      if (typeof error == "string") {
        return enviar(error);
      } else enviar(util.inspect(error));
    };

    const sleep = async (min, max) => {
      return new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
      );
    };

    const react = (emoji) => {
      return conn.sendMessage(from, {
        react: {
          text: emoji,
          key: mek.key,
        },
      });
    };

    switch (comando) {
      case "menu":
        await react("🚀");
        enviar(
          "> *Comandos...*\n\n- /add tipo da mensagem|mensagem para divulgação\n*(Utilize | Para seprar o tipo da mensagem com o Texto de divugação)*\n- /remover tipo da mensagem\n- /add-img tipo da mensageem (Após marca uma imagem com um tipo da mensagem, a imagem vai ser divulgada com o Texto.)\n- /types (Verifique as mensagens de divulgação salvas)\n- /grupos (Verifique todos os grupos que o Bot está.)\n- /divulgar (Marque uma mensagem e começará a fazer uma divulgação em massa em todos os Grupos.)\n\n- /limite [Numero]\n*(No campo [Numero], você pode atribuir um número que o Bot vai usar para divulgar.)*"
        );
        break;

      case "limite":
        var text = args.join(" ");
        var element = limite.findIndex((index) => index);

        if (element != -1) limite[element].number = Number(text);
        enviar(
          `*Sucesso!* Agora as divulgações ocorrerá em ${limite[element].number} mensagens.`
        );

        fs.writeFileSync("./config.json", JSON.stringify(limite, null, 3));
        break;

      case "add-grupo":
        var text = args.join(" ");
        var element = limite.findIndex((index) => index);

        if (element != -1) limite[element].groupJid = text;
        enviar(`*Sucesso!*`);

        fs.writeFileSync("./config.json", JSON.stringify(limite, null, 3));
        break;

      case "types":
        if (mensagemVenda.length < 1)
          return enviar("No momento não há nenhuma divulgação salva!");
        types = `TOTAL SALVOS: ${mensagemVenda.length}\n\n`;
        for (let i of mensagemVenda) types += `${i.type}\n`;
        enviar(types.trim());
        break;

      case "grupos":
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        text = `*Total grupos:* ${arrayListGroups.length}\n\n`;
        for (const i of arrayListGroups) text += `${i.subject}\n`;
        enviar(text.trim());
        break;

      case "divulgar":
        var textDivulgacao = args.join(" ");
        // enviar("Estou começando a divulgação...");
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

        enviar("Grupos encontrados: " + arrayListGroups.length);

        var element = mek.message?.extendedTextMessage.hasOwnProperty(
          "contextInfo"
        )
          ? mek.message?.extendedTextMessage.contextInfo.quotedMessage
          : null ?? null;

        if (!element) return enviar("Nada encontrado.");
        for (const i of arrayListGroups) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          conn.relayMessage(i.id, element, {
            messageId: mek.key.id,
          });
        }

        return enviar("Acabou a Divulgação!");
        break;

      case "clientes":
        var textDivulgacao = args.join(" ");
        // enviar("Estou começando a divulgação...");

        const clientesTotal = mensagensPrivado.map((item) => item.jid);

        enviar(`📊 *Total de clientes encontrados no banco de dados:* *${clientesTotal.length}* ✅  

🚀 Enviando mensagens para todos os clientes... 📩✨`);

        var element = mek.message?.extendedTextMessage.hasOwnProperty(
          "contextInfo"
        )
          ? mek.message?.extendedTextMessage.contextInfo.quotedMessage
          : null ?? null;

        async function randomSleep(min, max) {
          const delay = Math.floor(Math.random() * (max - min + 1)) + min;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        if (!element) return enviar("Nada encontrado.");
        for (const i of clientesTotal) {
          // Criando delays progressivos e aleatórios
          await randomSleep(2000, 4000);
          await randomSleep(6000, 9000);
          await randomSleep(12000, 15000);
          await randomSleep(16000, 20000);
          await randomSleep(20000, 25000);

          conn.relayMessage(i, element, {
            messageId: mek.key.id,
          });
        }

        return enviar("Acabou a Divulgação!");
        break;

      // case "divulgar2":
      //   (async () => {
      //     var objectListGroups = await conn.groupFetchAllParticipating();
      //     var arrayListGroups = Object.values(objectListGroups);
      //     arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

      //     const a = arrayListGroups.filter((res) => {
      //       // Verifica se o bot não é administrador
      //       const isBotNotAdmin = res.participants.some(
      //         (line) =>
      //           line.id === "5511961044199@s.whatsapp.net" &&
      //           line.admin !== null
      //       );

      //       // Verifica se o outro ID está no grupo
      //       const hasSpecificUser = res.participants.some(
      //         (line) => line.id === "5511961044813@s.whatsapp.net"
      //       );

      //       return isBotNotAdmin && hasSpecificUser;
      //     });

      //     for (let i of a) {
      //       await sleep(1000, 3000);
      //       await sleep(5000, 7000);
      //       await sleep(9000, 11000);
      //       await sleep(10000, 15000);
      //       // id & people to add to the group (will throw error if it fails)
      //       const response = await sock.groupParticipantsUpdate(
      //         a.id,
      //         ["5511961044813@s.whatsapp.net"],
      //         "add" // replace this parameter with "remove", "demote" or "promote"
      //       );
      //     }
      //   })();
      //   break;

      case "verificar-grupos-sem-eu":
        (async () => {
          var objectListGroups = await conn.groupFetchAllParticipating();
          var arrayListGroups = Object.values(objectListGroups);
          arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

          const a = arrayListGroups.filter((res) => {
            const nameGroup = res.subject.includes("🔍");
            // Verifica se o bot não é administrador
            const isBotNotAdmin = res.participants.some(
              (line) =>
                line.id === "5511961044199@s.whatsapp.net" && line.admin != null
            );

            // Verifica se o outro ID está no grupo
            const hasSpecificUser = res.participants.some(
              (line) => line.id === "559491008866@s.whatsapp.net"
            );

            return isBotNotAdmin && !hasSpecificUser;
          });

          enviar(`Começando: ${a.length}`);

          for (const i of a) {
            await sleep(1000, 3000);
            await sleep(5000, 7000);
            const code = await conn.groupInviteCode(i.id);
            enviar(
              `*NAME:* ${i.subject}\n*LINK:* https://chat.whatsapp.com/${code}\n\n`
            );
          }
        })();

        break;

      case "adicionarcomoadmintrador":
        (async () => {
          var objectListGroups = await conn.groupFetchAllParticipating();
          var arrayListGroups = Object.values(objectListGroups);
          arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

          const a = arrayListGroups.filter((res) => {
            const nameGroup = res.subject.includes("🔍");
            // Verifica se o bot não é administrador
            const isBotNotAdmin = res.participants.some(
              (line) =>
                line.id === "5511961044199@s.whatsapp.net" && line.admin != null
            );

            // Verifica se o outro ID está no grupo
            const hasSpecificUser = res.participants.some(
              (line) =>
                line.id === "559491008866@s.whatsapp.net" && line.admin === null
            );

            return isBotNotAdmin && hasSpecificUser && nameGroup;
          });

          enviar(`Começando: ${a.length},\n\n${a}`);

          for (let i of a) {
            await sleep(1000, 3000);
            await sleep(5000, 7000);
            await sleep(9000, 11000);
            await sleep(10000, 15000);

            await conn
              .groupParticipantsUpdate(
                i.id,
                ["559491008866@s.whatsapp.net"],
                "promote"
              )
              .catch((error) => {
                enviar(`Error ocorrido: ${error.toString()}`);
              });
          }

          return enviar("Acabou");
        })();
        break;

      case "removerpessoasdegrupos":
        (async () => {
          var objectListGroups = await conn.groupFetchAllParticipating();
          var arrayListGroups = Object.values(objectListGroups);
          arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

          const a = arrayListGroups.filter((res) => {
            const nameGroup = res.subject.includes("🔍");
            // Verifica se o bot não é administrador
            const isBotNotAdmin = res.participants.some(
              (line) =>
                line.id === "5511961044199@s.whatsapp.net" && line.admin != null
            );

            // Verifica se o outro ID está no grupo
            const hasSpecificUser = res.participants.some(
              (line) => line.id === "558198487452@s.whatsapp.net"
            );

            return isBotNotAdmin && hasSpecificUser && nameGroup;
          });

          enviar(`Começando: ${a.length}`);

          for (let i of a) {
            await sleep(1000, 3000);
            await sleep(5000, 7000);
            await sleep(9000, 11000);
            await sleep(10000, 15000);

            await conn
              .groupParticipantsUpdate(
                i.id,
                ["558198487452@s.whatsapp.net"],
                "remove"
              )
              .catch((error) => {
                enviar(`Error ocorrido: ${error.toString()}`);
              });
          }

          return enviar("Acabou");
        })();
        break;

      case "divulgar-text":
        var textDivulgacao = args.join(" ");
        if (!textDivulgacao) return enviar("Mensagem de divulgação?");
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);
        enviar("Grupos encontrados: " + arrayListGroups.length);

        for (const i of arrayListGroups) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          await sleep(20000, 25000);
          var element = {
            extendedTextMessage: {
              text: textDivulgacao,
              contextInfo: {
                mentionedJid: i.participants.map((pessoa) => pessoa.id),
              },
              inviteLinkGroupTypeV2: "DEFAULT",
            },
          };

          conn.relayMessage(i.id, element, { messageId: mek.key.id });
        }
        return enviar("Acabou...");
        break;

      case "divulgar-video":
        var elementVideo =
          mek.message.extendedTextMessage.contextInfo.quotedMessage
            .videoMessage;

        // if (!textDivulgacao) return enviar("Mensagem de divulgação?");
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);
        enviar("Grupos encontrados: " + arrayListGroups.length);

        for (const i of arrayListGroups) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          await sleep(20000, 25000);
          conn.relayMessage(
            i.id,
            {
              videoMessage: {
                mimetype: elementVideo.mimetype,
                fileSha256: elementVideo.fileSha256,
                fileLength: elementVideo.fileLength,
                mediaKey: elementVideo.mediaKey,
                caption: elementVideo.caption,
                contextInfo: {
                  mentionedJid: i.participants.map((pessoa) => pessoa.id),
                },
              },
            },
            { messageId: mek.key.id }
          );
        }
        return enviar("Acabou...");
        break;

      case "divulgar-link":
        var elementlink =
          mek.message.extendedTextMessage.contextInfo.quotedMessage
            .extendedTextMessage;

        // if (!textDivulgacao) return enviar("Mensagem de divulgação?");
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);
        enviar("Grupos encontrados: " + arrayListGroups.length);

        for (const i of arrayListGroups) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          await sleep(20000, 25000);

          conn.relayMessage(
            i.id,
            {
              extendedTextMessage: {
                text: elementlink.text,
                matchedText: elementlink.matchedText,
                canonicalUrl: elementlink.canonicalUrl,
                description: elementlink.description,
                title: elementlink.title,
                previewType: elementlink.previewType,
                jpegThumbnail: elementlink.jpegThumbnail,
                contextInfo: {
                  mentionedJid: i.participants.map((pessoa) => pessoa.id),
                },
                thumbnailDirectPath: elementlink.thumbnailDirectPath,
                thumbnailSha256: elementlink.thumbnailSha256,
                thumbnailEncSha256: elementlink.thumbnailEncSha256,
                mediaKey: elementlink.mediaKey,
                mediaKeyTimestamp: elementlink.mediaKeyTimestamp,
                thumbnailHeight: elementlink.thumbnailHeight,
                thumbnailWidth: elementlink.thumbnailWidth,
                inviteLinkGroupTypeV2: elementlink.inviteLinkGroupTypeV2,
              },
            },
            { messageId: mek.key.id }
          );
        }
        return enviar("Acabou...");
        break;

      case "divulgar-img":
        var elementImage =
          mek.message.extendedTextMessage.contextInfo.quotedMessage
            .imageMessage;

        // if (!textDivulgacao) return enviar("Mensagem de divulgação?");
        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);
        enviar("Grupos encontrados: " + arrayListGroups.length);

        for (const i of arrayListGroups) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          await sleep(20000, 25000);

          conn.relayMessage(
            i.id,
            {
              imageMessage: {
                url: elementImage.url,
                mimetype: elementImage.mimetype,
                caption: elementImage.caption,
                fileSha256: elementImage.fileSha256,
                fileLength: elementImage.fileLength,
                height: elementImage.height,
                width: elementImage.width,
                mediaKey: elementImage.mediaKey,
                fileEncSha256: elementImage.fileEncSha256,
                directPath: elementImage.directPath,
                mediaKeyTimestamp: elementImage.mediaKeyTimestamp,
                jpegThumbnail: elementImage.jpegThumbnail,
                contextInfo: {
                  mentionedJid: i.participants.map((pessoa) => pessoa.id),
                },
              },
            },
            { messageId: mek.key.id }
          );
        }
        return enviar("Acabou...");
        break;

      case "divulgarprivado":
        var textDivulgacao = args.join(" ");
        var element = mek.message?.extendedTextMessage.hasOwnProperty(
          "contextInfo"
        )
          ? mek.message?.extendedTextMessage.contextInfo.quotedMessage
          : null ?? null;

        var objectListGroups = await conn.groupFetchAllParticipating();
        var arrayListGroups = Object.values(objectListGroups);
        arrayListGroups = arrayListGroups.filter((a) => a.restrict === true);

        enviar("Grupos encontrados: " + arrayListGroups.length);

        let list = await Promise.all(
          arrayListGroups.map(async (i) => {
            await sleep(1000, 3000);
            return i.participants.filter((number) =>
              number.id.includes(textDivulgacao)
            ).length > 1
              ? i.participants
                  .filter((number) => number.id.includes(textDivulgacao))
                  .map((line) => line.id)
              : [];
          })
        ).then((results) => results.flat());

        enviar("Començando... " + list.length);

        if (!element) return enviar("Nada encontrado.");
        for (const i of list) {
          await sleep(1000, 3000);
          await sleep(5000, 7000);
          await sleep(9000, 11000);
          await sleep(10000, 15000);
          await sleep(20000, 25000);
          conn.relayMessage(i, element, {
            messageId: mek.key.id,
          });
        }

        return enviar("Acabou a Divulgação!");
        break;

      case "image":
        const isBuffImage = mek.message[type]?.contextInfo ?? null;
        const buffImage =
          mek.message[type]?.contextInfo?.quotedMessage?.imageMessage;
        if (!isBuffImage) return enviar("Marque uma Imagem valida!");
        enviar("Aguarde, coroa está furando...");

        // var buff = await conn.getFileBuffer(buffImage);

        // await fs.writeFileSync("./lixeira/comprovante.jpg", buff);

        conn
          .getFileBuffer(buffImage)
          .then(async (res) => {
            fs.writeFileSync("./lixeira/comprovante.jpg", res, (err) => {
              if (err) {
                console.error("Erro ao salvar o arquivo:", err.message);
              } else {
                const uploadImagem = require("../../files/upload-img");
                return uploadImagem("./lixeira/comprovante.jpg")
                  .then(async (res) => {
                    if (res[200]) {
                      conn.sendMessage(from, { text: res[200] }).then((res) => {
                        fs.unlinkSync("./lixeira/comprovante.jpg");
                      });
                    }
                    if (res[404]) {
                      await fs.unlinkSync("./lixeira/comprovante.jpg");
                      return toErro(res);
                    }
                  })
                  .catch((error) => {
                    fs.unlinkSync("./lixeira/comprovante.jpg");
                  });
              }
            });
          })
          .catch(toErro);
        break;

      case "ping":
        try {
          const startTime = Date.now();
          await react("🚀");
          const latencyTime = Date.now() - startTime;
          enviar(`${latencyTime}ms`);
        } catch (error) {
          console.error("Erro ao reagir:", error);
          enviar("Ocorreu um erro ao calcular o ping.");
        }
        break;

      case "add":
        var toText = args.join(" ");
        if (!toText)
          return enviar(
            `Oi ${pushname}, você deve usar: ${prefix + comando} TIPO|MENSAGEM`
          );
        var typeMessage = toText.split("|")[0].toLowerCase() || null;
        var textMessage = toText.split("|")[1] || null;
        if ((toText.length > 1 && !typeMessage) || !textMessage)
          return enviar(
            `Querido ${pushname}, está faltando separar usando | ☝🏻`
          );
        var element = mensagemVenda.findIndex((res) =>
          res.type.includes(typeMessage)
        );
        if (element == -1) {
          react("✅");
          mensagemVenda.push({
            type: typeMessage,
            text: textMessage,
          });
        } else {
          if (mensagemVenda[element].type.includes(typeMessage)) react("🔃");
          mensagemVenda[element].text = textMessage;
        }
        fs.writeFileSync(
          "./tmp/messagesSales.json",
          JSON.stringify(mensagemVenda, null, 2)
        );
        break;

      case "rem":
      case "remover":
        var toText = args.join(" ");
        if (!toText) return enviar(`Oi ${pushname}, cadê o Texto amigão?`);
        var element = mensagemVenda.findIndex((res) => res.type == toText);
        console.log(mensagemVenda[element]);
        if (element == -1) {
          enviar("Mensagem de Divulgação *não existe*!");
        } else {
          mensagemVenda.splice(element, 1);
          enviar("Mensagem de Divulgação deletada com sucesso.");
        }
        fs.writeFileSync(
          "./tmp/messagesSales.json",
          JSON.stringify(mensagemVenda, null, 2)
        );
        break;

      case "add-img":
        var element =
          mek.message[type]?.contextInfo !== undefined
            ? mek.message[type].contextInfo?.quotedMessage.imageMessage
            : null;
        var typeMess = args.join(" ");
        if (!typeMess) return enviar("Cadê o TIPO de mensagem da divulgação?");

        conn
          .getFileBuffer(element)
          .then((res) => {
            enviar(`> Sucesso! Imagem salva.`);

            fs.writeFileSync(`./tmp/image/${typeMess}.jpg`, res);
          })
          .catch((err) => {
            return conn
              .sendMessage(global.dump, {
                text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`,
              })
              .catch((err) => {
                console.log("Não foi possível enviar a mensagem de Erro!", err);
              });
          });
        break;

      case "add-vid":
        var element =
          mek.message[type]?.contextInfo !== undefined
            ? mek.message[type].contextInfo?.quotedMessage.videoMessage
            : null;
        var typeMess = args.join(" ");
        if (!typeMess) return enviar("Cadê o TIPO de mensagem da divulgação?");

        conn
          .getFileBuffer(element)
          .then((res) => {
            enviar(`> Sucesso!`);

            fs.writeFileSync(`./tmp/image/${typeMess}.mp4`, res);
          })
          .catch((err) => {
            return conn
              .sendMessage(global.dump, {
                text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`,
              })
              .catch((err) => {
                console.log("Não foi possível enviar a mensagem de Erro!", err);
              });
          });
        break;

      case "entrar":
        const textLink = args.join(" ");
        if (!textLink) return enviar("...");

        const getAllGpUrls = (str) =>
          str.match(/https?:\/\/?chat\.whatsapp\.com\/.{22}/g) || null;

        if (
          getAllGpUrls(textLink)?.length >= 1 &&
          /https?:\/\/?chat\.whatsapp\.com\/.{22}/g.test(textLink)
        ) {
          for (const item of getAllGpUrls(budy)) {
            await sleep(1000, 2000);
            await sleep(3000, 4000);
            await sleep(5000, 6000);
            await sleep(5000, 10000);

            await conn
              .groupAcceptInvite(item.split("https://chat.whatsapp.com/")[1])
              .then((res) => {
                if (res?.includes("@g.us"))
                  return conn.sendMessage(dump, {
                    text: `SUCESSO!`,
                  });
              })
              .catch((err) => {
                return conn
                  .sendMessage(dump, {
                    text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${err}`,
                  })
                  .catch((err) => {
                    console.log(
                      "Não foi possível enviar a mensagem de Erro!",
                      err
                    );
                  });
              });
          }
        }
        break;

      case "eval":
        try {
          eval(`(async () => {
            try {
            ${budy.slice(5)};
            } catch(err) {
            toErro(err);
            }
            })();`);
        } catch (err) {
          toErro(err);
        }
        break;

      case "bash":
        const { exec } = require("child_process");
        var text = args.join(" ");
        exec(text, (erro, stdoutk) => {
          if (erro) return enviar(`Ocorreu um erro, ${erro}`);
          if (stdoutk) {
            return enviar(stdoutk.trim());
          }
        });
        break;

      default:
        if (isCmd)
          return enviar(
            "Comando não encontrado. Revise esse comando e tente novamente!"
          );
        break;
    }
  } catch (error) {
    console.log({ error });

    const util = require("util");
    if (typeof error === "string") {
      return conn.sendMessage(global.dump, {
        text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${error}`,
      });
    } else if (typeof error === "object") {
      return conn.sendMessage(global.dump, {
        text: `*NOTIFICAÇÃO!*\n\n- Ocorreu um Erro no Arquivo: ${__filename}\n\n- Erro capturado: ${util.inspect(
          error
        )}`,
      });
    } else {
      return conn.sendMessage(global.dump, {
        text: JSON.stringify(error, null, 2),
      });
    }
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(global.bannerText(`Update file: ${__filename}`).string);
  delete require.cache[file];
  process.exit();
  require(file);
});
