const fs = require("fs");
const http = require("http");
//const { getegid, abort } = require("process");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

//////////////////FILES///////////////
// const hello = 'HJello worlds';
// console.log(hello);

// //synchronous way ---Blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// fs.writeFileSync('./txt/output.txt', textIn);
// console.log('File Written!');

// //asynchronous way ---Non-Blocking

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {

//     if(err) return console.log('Error🔥');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {

//         console.log(data2);

//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {

//             console.log(data3);

//          fs.writeFile('./txt/final1.txt', `${textIn}`, 'utf-8', err => {
//              console.log('Your file has been writen');
//          })
//         });
//     });
// });
// console.log('Reading file Asynchronously....');

//////////////SERVER////////////

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);

const server = http.createServer((req, res) => {
  //const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);
  
  //overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }
  //productpage
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product); 
    res.end(output);
  }
  //api
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Listining Requests");
});

