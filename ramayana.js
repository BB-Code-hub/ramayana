const axios = require('axios');
const cheerio = require('cheerio');
const FileSystem = require("fs");

const totalSargas = 77;

const url = "https://www.valmiki.iitk.ac.in/sloka?field_kanda_tid=1&language=dv&field_sarga_value=";

let data = [];

let getData = async (html,index) => {
    let slokaText = '';
    const $ = cheerio.load(html);
    $("div.views-field-body div.field-content").each((i, ele) => {
        let elem = $(ele).clone();
        elem.find("br").replaceWith(" ");
        let text = elem.text().replace(/ +(?= )/g,'');
        slokaText = slokaText + text.replace(/\r?\n?\s\s+|\s+(?=>)|&nbsp;/g, '');;
    });
    let text = slokaText.split(']').splice(1).join();
    return text;
};

async function generateKanda() {
    for (let i = 1; i <= totalSargas; i++) {
        let newUrl = url + i;
        console.log(newUrl);
        await getSargas(newUrl, i).then((dataText) => {
            data.push(dataText);
        });
    }
    FileSystem.writeFile('balakanda-devangiri/Balakanda.txt', JSON.stringify(data.join(), null, 4), (err) => {
        if (err) throw err;
    });
}

 function getSargas(newUrl, index) {
     return new Promise((resolve ,reject)=> {
         axios.get(newUrl).then(async response => {
             let val =  getData(response.data, index);
             resolve(val);
         }).catch(error => {
             console.log(error);
         });
     });
 }



generateKanda();


