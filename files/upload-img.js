const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
let data = new FormData();

function imgbb(diretorio) {
  return new Promise((resolve, reject) => {
    data.append("source", fs.createReadStream(diretorio));
    data.append("type", "file");
    data.append("action", "upload");
    data.append("timestamp", "1731592665567");
    data.append("auth_token", "056153f50b84d512386eb37c6c02cd06306e671a");
    data.append("expiration", "P2M");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://pt-br.imgbb.com/json",
      headers: {
        accept: "application/json",
        "accept-language":
          "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5",
        cookie: "PHPSESSID=dkcgoaj014vkjo4i96splq697h",
        origin: "https://pt-br.imgbb.com",
        priority: "u=1, i",
        referer: "https://pt-br.imgbb.com/",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status_code === 200) {
            resolve({200: response.data.image.url_viewer})
          } else {
            resolve({404: "Não foi possivel gerar Link da imagem."})
          }
      })
      .catch((error) => {
        resolve({404: "Não foi possivel gerar Link da imagem.", error})
      });
  });
}

module.exports = imgbb