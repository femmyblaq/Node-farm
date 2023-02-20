// const express = require("express");
// const bodyParser = require("body-parser");
// app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// app.post("/", (req, res) => {
//   const numb1 = parseInt(req.body.numb1);
//   const numb2 = parseInt(req.body.numb2);
//   const result = numb1 + numb2;
//   res.send("the sum of the two number is " + result);
// });

// app.listen(3000, () => {
//   console.log("app is running at port 3000");
// });
const fs = require("fs");
const http = require("http");
const { dirname } = require("path");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/temp");
// const textIn = fs.readFileSync(__dirname + "/input.txt", "utf-8");

// const textOut = `This is the output: ${textIn} \n Currently released at ${Date.now}`;
// fs.writeFileSync(__dirname + "/output.txt", textOut, "utf-8");
// console.log(textIn);

// // non-blocking code
// fs.readFile(__dirname + "/input.txt", (err, data) => {
//   console.log(data);
// });

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);
const server = http.createServer((req, res) => {
  // res.end("Server have been created...");

  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  // const pathname = req.url;
  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    // } else if (pathname === "/api") {
    const htmlCards = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", htmlCards);
    // console.log(htmlCards);
    res.end(output);

    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    // console.log("From my product url", product);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello word",
    });
    res.end("<h1>Page not found..</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("server running at port 3000");
});
