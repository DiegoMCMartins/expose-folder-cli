const http = require('http');

function createServer(port = 5145, hostnames) {
  const httpServer = http.createServer();

  httpServer.listen(port, () => {
    console.log(
      `Servidor escutando na porta ${port}\n\nAcesse em: \n${hostnames?.map(hostname => (`http://${hostname}:${port}`)).join('\n')}`
    )
  });
  
  return httpServer;
}

module.exports = createServer;