const http = require("http");
const PORT = 3000; 
const server = http.createServer((req,res) => {
    res.writeHead(200, {"content-type": "application/json"});
    res.end(JSON.stringify({message: "Todo API is running"}));
});

server.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
});