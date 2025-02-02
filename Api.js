const express = require("express");
const bodyParser = require("body-parser");
const compiler = require("compilex");
const path = require("path");

// "nodemon Api.js" for start: -------

const app = express();
const options = { stats: true };

compiler.init(options);
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files for CodeMirror
app.use("/codemirror-5.65.18", express.static(path.join(__dirname, "codemirror-5.65.18")));

// Route to serve the main HTML file
app.get("/", function (req, res) {
    compiler.flush(function(){
        console.log("deleted!");
    })
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route to handle code compilation
app.post("/compile", function (req, res) {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;

    if (!lang || !code) {
        return res.status(400)
        .send({ output: "error", error: "Language or code is missing" });
    }

    try {
        if (lang === "Cpp") {
            const envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

            if (!input) {
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else if (lang === "Java") {
            const envData = { OS: "windows" };
           

            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else if (lang === "Python") {
            const envData = { OS: "windows" };

            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else {
            res.status(400).send({ output: "error", error: "Unsupported language" });
        }
    } catch (e) {
        console.error("Compilation error:", e);
        res.status(500).send({ output: "error", error: e.message });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
