const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const dbConfig = require("./app/config/db.config.js");
const { json } = require("body-parser");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Falha ao sincronizar db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao aplicativo bezkoder." });
});


app.get("/ilhas", async (req, res) => {
  try {
    const ilhas = await sequelize.query("SELECT id, nome FROM ilhas", {
      type: Sequelize.QueryTypes.SELECT
    });
    res.json(ilhas);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro ao recuperar ilhas."
    });
  }
});

app.post("/ilhas", async (req, res) => {
  try {
    const ilha = req.body.nome; 
    await sequelize.query("INSERT INTO ilhas (nome) VALUES (:ilha)", {
      replacements: { ilha }, 
      type: Sequelize.QueryTypes.INSERT 
    });
    res.status(201).send({ message: "Ilha inserida com sucesso!" }); 
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro ao inserir ilha"
    });
  }
});


app.post("/conselhos", async (req, res) => {
  const id_ilha = req.body.id_ilha
  try {
    const ilhas = await sequelize.query ("Select id, nome from conselhos where id_ilha = :id_ilha", {
      replacements: {"id_ilha" : id_ilha },
      type: Sequelize.QueryTypes.SELECT
      }
    );
      res.status(201).send({
      message: ilhas
    });
  } catch (err) {
      res.status(500).send({
      message: err.message || "Erro durante a criação do concelho."
    });
  }
});

app.patch("/conselhos", async (req, res) => {
  const nome = req.body.nome
  const id_ilha = req.body.id_ilha
  try {
    await sequelize.query("INSERT INTO conselhos (nome, id_ilha) VALUES (:nome, :id_ilha)", {
    replacements: { "nome": nome, "id_ilha": id_ilha },
    type: Sequelize.QueryTypes.INSERT
    }
  );
    res.status(201).send({
    message: "Concelho criado com Sucesso"
  });
  } catch (err) {
    res.status(500).send({
    message: err.message || "Erro durante a criação do concelho."
  });
}
});


app.post("/freguesias", async (req, res) => {
  const id_conselho = req.body.id_conselho
  try {
    const conselhos = await sequelize.query ("SELECT id, nome FROM freguesias where id_conselho =:id_conselho", {
      replacements: { "id_conselho" : id_conselho },
      type: Sequelize.QueryTypes.SELECT
    });
    res.status(201).send({
      message: conselhos,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação da freguesia."
    });
  }
});

app.patch("/freguesias", async (req, res) => {
  const id_conselho = req.body.id_conselho
  const nome = req.body.nome
  try {
    await sequelize.query("INSERT INTO freguesias (nome, id_conselho) VALUES (:nome, :id_conselho)", {
      replacements: { "nome": nome, "id_conselho": id_conselho },
      type: Sequelize.QueryTypes.INSERT
      }
    );
      res.status(201).send({
      message: "Freguesia criado com Sucesso"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação da freguesia."
    });
  }
});


app.post("/zonas", async (req, res) => {
  const id_freguesia = req.body.id_freguesia
  try {
    const freguesia = await sequelize.query ("SELECT id, nome FROM zonas where id_freguesia =:id_freguesia", {
      replacements: { "id_freguesia" : id_freguesia },
      type: Sequelize.QueryTypes.SELECT
    });
    res.status(201).send({
      message: freguesia,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação da zona."
    });
  }
});

app.patch("/zonas", async (req, res) => {
  const id_freguesia = req.body.id_freguesia
  const nome = req.body.nome
  try {
    await sequelize.query("INSERT INTO zonas (nome, id_freguesia) VALUES (:nome, :id_freguesia)", {
      replacements: { "nome": nome, "id_freguesia": id_freguesia },
      type: Sequelize.QueryTypes.INSERT
      }
    );
      res.status(201).send({
      message: "Zona criado com sucesso"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação da freguesia."
    });
  }
});


app.post("/lugares", async (req, res) => {
  const id_zona = req.body.id_zona
  try {
    const lugar = await sequelize.query ("SELECT id, nome FROM lugares where id_zona =:id_zona", {
      replacements: { "id_zona" : id_zona },
      type: Sequelize.QueryTypes.SELECT
    });
    res.status(201).send({
      message: lugar,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação da lugares."
    });
  }
});

app.patch("/lugares", async (req, res) => {
  const nome = req.body.nome
  const id_zona = req.body.id_zona
  try {
    await sequelize.query("INSERT INTO lugares (nome, id_zona) VALUES (:nome, :id_zona)", {
      replacements: { "nome": nome, "id_zona": id_zona },
      type: Sequelize.QueryTypes.INSERT
      }
    );
      res.status(201).send({
      message: "Lugares criado com Sucesso"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erro durante a criação do lugar."
    });
  }
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

