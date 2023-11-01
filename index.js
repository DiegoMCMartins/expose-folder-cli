#!/usr/bin/env node

const process = require('node:process');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const mime = require('mime');

const HTMLBuilder = require("./HTMLBuilder.js");
const createServer = require("./server.js");

async function initCLI() {
  const [nodeExec, scriptExec, folder] = process.argv;

  if(!folder) {
    console.log("É necessário informar a pasta para ser exposta");
    process.exit();
  }

  try {
    await fs.access(folder, fs.constants.R_OK);
  } catch(error) {
    console.log("Pasta não existe ou o usuário não ter permissão de leitura");
    process.exit();
  }

  const networkInterfaces = Object.values(os.networkInterfaces());

  const hostnames = networkInterfaces.map(([ipv6, ipv4]) => ipv4?.address);

  const server = createServer(5145, hostnames);

  server.on('request', async (request, response) => {
    const files = await fs.readdir(folder);

    const url = new URL(request.url, `http://${request.headers.host}`);

    if(files.find(file => url.pathname?.includes(file))) {
      const filePath = url.pathname.slice(1);
      const fileStats = await fs.stat(filePath);

      const readableStream = fsSync.createReadStream(filePath);

      response.setHeader('Content-Length', fileStats.size);
      response.setHeader('Content-Type', mime.getType(filePath));

      readableStream.pipe(response);
      return;
    }

    const html = new HTMLBuilder();
    html.addTitle(`Pasta ${folder}`);

    for(const file of files) {
      html.addFileLink(file, path.join('/', folder, file));
    }

    response.writeHead(200);
    response.write(html.buildHTML());
    response.end();
  })
}

initCLI();