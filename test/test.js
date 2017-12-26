const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

var url = 'http://www.laosiji.com/car/spec/config/9305';
let id = 9305;
let reg = new RegExp(`.*\/${id}$`);

