import express from "express";
import cors from "cors";


const app = express()
app.use(express.json())

app.use(cors({
  origin: process.env.BASE_URL ?? "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}))

let mesBouquets = [
  {
    id: 1,
    nom: "Bouquet de Tunis",
    desc:
      "Un dosage parfait de jasmins et de tulipes, des couleurs éclatantes et du soleil toute l’année chez vous.",
    image: "/bouquetTunis.jpg",
    prix: 1500.0,
    liked: false,
  },
  {
    id: 2,
    nom: "Bouquet d’Alger",
    desc:
      "Un mélange merveilleux de jasmins et de senteurs méditerranéennes, des odeurs éclatantes pour égayer votre bureau.",
    image: "/bouquetAlger.webp",
    prix: 2000.0,
    liked: false,
  },
  {
    id: 3,
    nom: "Bouquet d’Oran",
    desc:
      "Un mélange merveilleux de roses et de lys, des odeurs et des couleurs.",
    image: "/bouquetOran.jpg",
    prix: 2000.0,
    liked: false,
  },
];

app.get('/api/bouquets', (req, res) => {
  res.json(mesBouquets);
});

const PORT = process.env.PORT ?? 5000
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`)
})