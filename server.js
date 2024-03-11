const express = require("express");
const app = express();
const fs = require("fs").promises; 
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;

const rottaAsset = path.join(__dirname, "public", "asset");
const rottaJs = path.join(__dirname, "public", "asset","bootstrap-5.3.2-dist", "js");

app.set("view engine", "pug");
app.set("views", "./view");

 
app.use(bodyParser.urlencoded({ extended: true }));

async function read() {
    try {
      const datiJson = await fs.readFile("dati.json", 'utf-8');
      return JSON.parse(datiJson);
    } catch (error) {
      console.error("Errore durante la lettura del file:", error);
      return [];
    }
  }
  
  async function write(datiJson) {
    try {
      await fs.writeFile("dati.json", JSON.stringify(datiJson, null, 1), 'utf-8');
    } catch (error) {
      console.error("Errore durante la scrittura del file:", error);
    }
  }
  
function save() {
    write(dati);
}

app.get("/", (req,res)=>{
    res.render("index");
});

app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
  });
  
  