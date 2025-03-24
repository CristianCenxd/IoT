const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Variables globales para último estado
let ultimoPIR = { entrada: 0, salida: 0 };
let ultimaDistancia = { distancia: "-1" };

// Cuando llega POST /datos (Maestro envía PIR)
app.post("/datos", (req, res) => {
  const { entrada, salida } = req.body;
  
  // Guardamos en nuestra variable global
  ultimoPIR = { entrada, salida };

  console.log("=== Datos recibidos del ESP32 Maestro (PIR) ===");
  console.log(`  entrada: ${entrada}`);
  console.log(`  salida : ${salida}`);

  // Interpretamos de forma simple (opcional):
  let interpretacion = "";
  if (entrada === 1 && salida === 0) {
    interpretacion = "PERSONA ENTRO (Entrada=1, Salida=0)";
  } else if (entrada === 0 && salida === 1) {
    interpretacion = "PERSONA SALIO (Entrada=0, Salida=1)";
  } else if (entrada === 1 && salida === 1) {
    interpretacion = "AMBOS SENSORES ACTIVOS (depende la lógica)";
  } else {
    interpretacion = "SIN MOVIMIENTO (0,0)";
  }

  console.log(`  Interpretación: ${interpretacion}`);
  console.log("------------------------------------------------\n");

  res.send("Datos PIR recibidos con éxito");
});

// Cuando llega POST /distancia (Xiao envía su RSSI/dDistancia)
app.post("/distancia", (req, res) => {
  const { distancia } = req.body;
  
  // Guardamos la última distancia
  ultimaDistancia = { distancia };

  console.log("=== Datos recibidos del Xiao (distancia WiFi) ===");
  console.log(`  Distancia = ${distancia}`);
  console.log("------------------------------------------------\n");

  res.send("Distancia recibida con éxito");
});

// Endpoint para que la app consulte el último PIR
app.get("/ultimopir", (req, res) => {
  res.json(ultimoPIR);
});

// Endpoint para que la app consulte la última distancia
app.get("/ultimadistancia", (req, res) => {
  res.json(ultimaDistancia);
});

// Endpoint para verificar funcionamiento
app.get("/", (req, res) => {
  res.send("Servidor arriba y funcionando");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});