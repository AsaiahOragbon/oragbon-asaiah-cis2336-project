const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, "..", "frontend");

const artworks = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendPath));

app.get("/api/status", (req, res) => {
  res.json({ message: "ArtConnect server is running." });
});

app.get("/api/artworks", (req, res) => {
  res.json({ count: artworks.length, artworks });
});

app.post("/api/artworks", (req, res) => {
  const artistName = String(req.body.artistName || "").trim();
  const email = String(req.body.email || "").trim();
  const artworkTitle = String(req.body.artworkTitle || "").trim();
  const category = String(req.body.category || "").trim();
  const priceInput = String(req.body.price || "").trim();
  const imageUrl = String(req.body.imageUrl || "").trim();
  const description = String(req.body.description || "").trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = [];

  if (!artistName) errors.push("Artist name is required.");
  if (!emailPattern.test(email)) errors.push("A valid email address is required.");
  if (!artworkTitle) errors.push("Artwork title is required.");
  if (!category) errors.push("Category is required.");
  if (description.length < 20) errors.push("Description must be at least 20 characters.");

  let price = null;
  if (priceInput !== "") {
    price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0) {
      errors.push("Price must be a number that is zero or greater.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const artwork = {
    id: artworks.length + 1,
    artistName,
    email,
    artworkTitle,
    category,
    price,
    imageUrl,
    description,
    submittedAt: new Date().toISOString()
  };

  artworks.push(artwork);

  return res.status(201).json({
    success: true,
    message: `Thank you, ${artistName}. ${artworkTitle} was submitted successfully.`,
    artwork
  });
});

app.get("/submissions", (req, res) => {
  res.json({ count: artworks.length, artworks });
});

app.use((req, res) => {
  res.status(404).json({ message: "Page or route not found." });
});

app.listen(PORT, () => {
  console.log(`ArtConnect server running at http://localhost:${PORT}`);
});
