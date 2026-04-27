const http = require("http");
const fs = require("fs");

const PORT = 3000; 
const DATA_FILE ="./data.json";

const server = http.createServer((req,res) => {
    res.setHeader("Content-type", "application/json");

 if(req.url === "/" && req.method === "GET"){
    res.statusCode= 200;
    res.end(JSON.stringify({message: "Todo API is running"}));
}
else if(req.url === "/todos" && req.method === "GET"){
    const todos = readTodos();
    res.statusCode= 200;
    res.end(JSON.stringify(todos));
}
else if (req.url.startsWith("/todos/") && req.method === "GET") {
    const id = parseInt(req.url.split("/")[2]);
    const todos = readTodos();

    const todo = todos.find(t => t.id === id);

    if (!todo) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Todo not found" }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify(todo));
}
else if (req.url.startsWith("/todos/") && req.method === "PUT") {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const updatedData = JSON.parse(body);
            const todos = readTodos();

            const index = todos.findIndex(t => t.id === id);

            if (index === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ message: "Todo not found" }));
            }

            // Update fields if provided
            if (updatedData.task !== undefined) {
                todos[index].task = updatedData.task;
            }

            if (updatedData.completed !== undefined) {
                todos[index].completed = updatedData.completed;
            }

            writeTodos(todos);

            res.statusCode = 200;
            res.end(JSON.stringify(todos[index]));
        }
        catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
    });
}
else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = parseInt(req.url.split("/")[2]);
    const todos = readTodos();

    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Todo not found" }));
    }

    const deletedTodo = todos.splice(index, 1);
    writeTodos(todos);

    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Todo deleted", deleted: deletedTodo[0] }));
}


else if(req.url === "/todos" && req.method === "POST"){
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try{
            const newTodo = JSON.parse(body);
            if(!newTodo.task){
                res.statusCode = 400;
                return res.end(JSON.stringify({message: "Task is required"}));
            }
            const todos = readTodos();

            const todo = {
                id: todos.length>0 ? todos[todods.length - 1].id+ 1 : 1,
                task: newTodo.task,
                completed:false
            };
            todos.push(todo);
            writeTodos(todos);

            res.statusCode = 201;
            res.end(JSON.stringify(todo));
        }
        catch(err){
            res.statusCode = 400;
            res.end(JSON.stringify({message: "Invalid JSON"}));
        }
    });
}
else{
    res.statusCode = 404;
    res.end(JSON.stringify({error: "Route not found"}));
}
});
function readTodos(){
const data = fs.readFileSync(DATA_FILE, "utf8");
return JSON.parse(data);
}

function writeTodos(todos){
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

server.listen(PORT, () =>{
console.log(`Server running on http://localhost:${PORT}`)
});


