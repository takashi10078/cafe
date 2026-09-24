const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.jpg':'image/jpeg', '.png':'image/png', '.mp3':'audio/mpeg', '.svg':'image/svg+xml' };
const server = http.createServer(async (req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405);return res.end();}
  let pathname=decodeURIComponent(url.pathname); if(pathname==='/') pathname='/index.html';
  const file=path.resolve(root, `.${pathname}`); if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,bytes)=>{ if(err){res.writeHead(404);return res.end('Not found');} res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}); res.end(req.method==='HEAD'?undefined:bytes); });
});
server.listen(Number(process.env.PORT)||3000,()=>console.log(`CAFE COMPASS listening on http://localhost:${Number(process.env.PORT)||3000}`));
