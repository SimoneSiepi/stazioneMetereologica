const express = require("express");
const app = express();
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const path = require("path");
const { exit } = require("process");
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
    const datiJson = await fs.readFile(path.join(rottaDati, "datiMetereologici.json"),"utf-8");
    return JSON.parse(datiJson);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(path.join(rottaDati, "datiMetereologici.json"),JSON.stringify([], null, 2),"utf-8");
      return [];
    } else {
      console.error("Errore durante la lettura del file:", error);
      return [];
    }
  }
}

// async function write(datiJson) {
//   try {
//     await fs.writeFile(path.join(rottaDati, "datiMetereologici.json"), JSON.stringify(datiJson, null, 2), "utf-8");
//   } catch (error) {
//     console.error("Errore durante la scrittura del file:", error);
//   }
// }

async function write(datiJson) {
  try {
    await fs.writeFile(path.join(rottaDati, "datiMetereologici.json"), JSON.stringify(datiJson, null, 2), 'utf-8');
  } catch (error) {
    console.error("Errore durante la scrittura del file:", error);
  }
}

async function save() {
  await write(datiMeteo);
}

let datiMeteo = read();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/formMeteo", (req, res) => {
  res.render("form");
});

app.post("/inserisciDati", (req, res) => {
  const { stazione, tempMax, tempMin } = req.body;

  if (!Array.isArray(datiMeteo)) {
    datiMeteo = [];
  }
  const stazioneDati = datiMeteo.find((s) => s.nome === stazione);
  if (stazioneDati) {
    stazioneDati.dati.push({
      temperaturaMassima: parseFloat(tempMax),
      temperaturaMinima: parseFloat(tempMin),
    });
  } else {
    datiMeteo.push({
      nome: stazione,
      dati: [
        {
          temperaturaMassima: parseFloat(tempMax),
          temperaturaMinima: parseFloat(tempMin),
        },
      ],
    });
  }
  save();
  res.redirect("/formMeteo");
});

app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
