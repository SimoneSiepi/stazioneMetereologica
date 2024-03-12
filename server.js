const express = require("express");
const app = express();
const fs = require("fs").promises; 
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;

const rottaAsset = path.join(__dirname, "public/");
const rottaDati = path.join(__dirname, "public", "dati");

app.set("view engine", "pug");
app.set("views", "./view");

 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(rottaAsset));
app.use("/dati", express.static(rottaDati));

async function read() {
    try {
      const datiJson = await fs.readFile("datiMetereologici.json", 'utf-8');
      return JSON.parse(datiJson);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(rottaDati,"datiMetereologici.json", JSON.stringify({}, null, 2), 'utf-8');
        console.log("File datiMetereologici.json creato.");
        return {}; // Ritorna un oggetto vuoto
      } else {
        console.error("Errore durante la lettura del file:", error);
        return [];
      }
    }
  }
  
  async function write(datiJson) {
    try {
      await fs.writeFile("datiMetereologici.json", JSON.stringify(datiJson, null, 2), 'utf-8');
    } catch (error) {
      console.error("Errore durante la scrittura del file:", error);
    }
  }
  
async function save() {
    await write(datiMeteo);
}

let datiMeteo = read();

app.get("/", (req,res)=>{
    res.render("index");
});

app.get("/formMeteo",(req,res)=>{
  res.render("form");
});

app.post("/inserisciDati", async (req, res) => {
  let tempMax = -Infinity;
  let tempMin = Infinity;
  let tempAlte = [];
  let tempBasse = [];
  datiMeteo.forEach(stazione => {
    stazione.dati.forEach(dato => {
      if (dato.temperaturaMassima > tempMax) tempMax = dato.temperaturaMassima;
      if (dato.temperaturaMinima < tempMin) tempMin = dato.temperaturaMinima;
      tempAlte.push(dato.temperaturaMassima);
      tempBasse.push(dato.temperaturaMinima);
    });
  });
 
  let mediaTempAlte = tempAlte.reduce((a, b) => a + b, 0) / tempAlte.length;
  let mediaTempBasse = tempBasse.reduce((a, b) => a + b, 0) / tempBasse.length;

  

  save();
});



app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
  });
  
  
