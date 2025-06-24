const conn = global.socket;

exports.color = global.color = (text, color) => {
  const chalk = require('chalk');
  return !color ? chalk.green(text): chalk.keyword(color)(text);
}

exports.bannerText = global.bannerText = (teks) => {
  const cfonts = require('cfonts');
  return cfonts.render((teks), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });
}

exports.time = global.time = () => {
  const moment = require('moment-timezone');
  var horarioAtual = Number(moment.tz('America/Sao_Paulo').format('HH'));
  var test = '';
  switch (horarioAtual) {
    case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8:
      test = false;
      break;
    case 9: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22:
      test = true;
      break;
  }
  return test;
}

exports.messages = global.messages = (pushname) => {
  const mensagens = [
    `Olá ${pushname}, tudo bem?\n\nSou Letícia e estou aqui para mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a checar se há algum débito no Serasa e consultar seu score. Você pode escolher a opção que melhor se encaixa para você abaixo.`,

    `Ei ${pushname}, espero que esteja tudo bem contigo!\n\nMeu nome é Letícia e estou aqui para te apresentar diferentes plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, posso dar uma olhada no Serasa para você e verificar seu score. Fique à vontade para escolher a opção que mais te interessar abaixo.`,

    `Oi ${pushname}, como vai?\n\nSou a Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, posso te ajudar a verificar se há algum débito no Serasa e consultar seu score. Escolha a opção que mais se adequa às suas necessidades abaixo.`,

    `Oi ${pushname}! Tudo bem?\n\nEu sou Letícia e venho até você com algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para ajudar na verificação de débitos no Serasa e na consulta do seu score. Fique à vontade para escolher a opção que melhor lhe convier abaixo.`,

    `Olá ${pushname}, espero que esteja bem!\n\nSou Letícia e estou oferecendo algumas plataformas de streaming para você. Além disso, posso ajudar a verificar sua situação no Serasa e consultar seu score. Abaixo, você pode selecionar uma das opções disponíveis.`,

    `Oi ${pushname}, como vai?\n\nMe chamo Letícia, estou apresentando algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou aqui para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha abaixo a opção que mais se adequa às suas necessidades.`,

    // Mais mensagens aqui...
    `Olá ${pushname}, tudo tranquilo?\n\nEu sou Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para ajudar na verificação de débitos no Serasa e na consulta do seu score. Escolha abaixo a opção que melhor atende às suas necessidades.`,

    `Ei ${pushname}, como está?\n\nMeu nome é Letícia e estou oferecendo algumas opções de plataformas de streaming para você explorar. Além disso, posso te auxiliar na consulta do seu score e verificar possíveis débitos no Serasa. Confira as opções disponíveis abaixo.`,

    `Oi ${pushname}, tudo bem?\n\nEstou aqui para te apresentar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Caso tenha interesse, também posso ajudar a verificar sua situação no Serasa e consultar seu score. Escolha a opção que melhor se adapta às suas necessidades abaixo.`,

    `Oi ${pushname}! Como vai?\n\nSou Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha abaixo a opção que mais lhe interessa.`,

    `Olá ${pushname}, tudo bem por aí?\n\nEu sou Letícia e estou aqui para te apresentar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a verificar sua situação no Serasa e consultar seu score. Fique à vontade para escolher uma opção abaixo.`,

    `Ei ${pushname}, como está?\n\nMeu nome é Letícia e estou oferecendo algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou aqui para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha a opção que melhor se adapta às suas necessidades abaixo.`,

    `Oi ${pushname}, tudo bem contigo?\n\nEstou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, posso te auxiliar na verificação de débitos no Serasa e na consulta do seu score. Escolha a opção que mais lhe interessa abaixo.`,

    `Oi ${pushname}! Como vai?\n\nEu sou Letícia e estou oferecendo algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a verificar sua situação no Serasa e consultar seu score. Confira abaixo as opções disponíveis.`,

    `Olá ${pushname}, tudo bem com você?\n\nSou Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Confira as opções abaixo.`,

    `Ei ${pushname}, como está?\n\nMeu nome é Letícia e estou oferecendo algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a verificar sua situação no Serasa e consultar seu score. Confira abaixo as opções disponíveis.`,

    `Oi ${pushname}, tudo tranquilo?\n\nEstou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha a opção que mais lhe agrada abaixo.`,
    `Oi ${pushname}, tudo bem com você?\n\nSou Letícia e estou aqui para te apresentar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te ajudar na verificação de possíveis débitos no Serasa e na consulta do seu score. Confira as opções abaixo.`,

    `Ei ${pushname}, como está?\n\nMeu nome é Letícia e estou oferecendo algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a verificar sua situação no Serasa e consultar seu score. Confira abaixo as opções disponíveis.`,

    `Olá ${pushname}, tudo tranquilo?\n\nEstou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha a opção que mais lhe agrada abaixo.`,

    `Oi ${pushname}! Como vai?\n\nEu sou Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, posso te auxiliar na verificação de débitos no Serasa e na consulta do seu score. Confira abaixo as opções disponíveis.`,

    `Olá ${pushname}, tudo bem com você?\n\nSou Letícia e estou aqui para te apresentar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te ajudar na verificação de possíveis débitos no Serasa e na consulta do seu score. Confira as opções abaixo.`,

    `Ei ${pushname}, como está?\n\nMeu nome é Letícia e estou oferecendo algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Também posso te ajudar a verificar sua situação no Serasa e consultar seu score. Confira abaixo as opções disponíveis.`,

    `Oi ${pushname}, tudo tranquilo?\n\nEstou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, estou disponível para te auxiliar na verificação de possíveis débitos no Serasa e na consulta do seu score. Escolha a opção que mais lhe agrada abaixo.`,

    `Oi ${pushname}! Como vai?\n\nEu sou Letícia e estou aqui para te mostrar algumas opções de plataformas de streaming (aplicativos de filmes, séries e animes). Além disso, posso te auxiliar na verificação de débitos no Serasa e na consulta do seu score. Confira abaixo as opções disponíveis.`
  ];

  // Função para sortear aleatoriamente uma mensagem do array
  const sortearMensagem = () => {
    const indice = Math.floor(Math.random() * mensagens.length);
    return mensagens[indice];
  };
  return sortearMensagem();
}

exports.dia = global.dia = () => {
  const moment = require('moment-timezone');
  var horarioAtual = Number(moment.tz('America/Sao_Paulo').format('HH'));
  var test = '';
  switch (horarioAtual) {
    case 1: case 2: case 3:
      test = 'boa madrugada';
      break;
    case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
      test = 'bom dia';
      break;
    case 12: case 13: case 14: case 15: case 16: case 17:
      test = 'boa tarde';
      break;
    case 18: case 19: case 20: case 21: case 22: case 23: case 0:
      test = 'boa noite';
      break;
  }
  return test;
}

 global.copyFile = (arquivoOrigem, arquivoDestino) => {
  const fs = require('fs');
  // Copiar o arquivo
  fs.copyFile(arquivoOrigem, arquivoDestino, (err) => {
    if (err) {
      console.error('Erro ao copiar o arquivo:', err);
      return;
    }
    console.log('Arquivo copiado com sucesso!');
});
}