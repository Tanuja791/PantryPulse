const express = require("express");
const router = express.Router();

const PantryItem = require("../models/PantryItem");
const recipes = require("../data/recipes");

router.get("/", async (req, res) => {
  try {
    const items = await PantryItem.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableItems = items.filter(item => {
      const expiry = new Date(item.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      return expiry >= today;
    });

    const itemNames = availableItems.map(item =>
      item.name.toLowerCase().trim()
    );

    const recommendations = recipes.map(recipe => {
      const matchedIngredients = recipe.ingredients.filter(ingredient =>
        itemNames.includes(ingredient.toLowerCase())
      );

      return {
        ...recipe,
        matchedIngredients,
        missingIngredients: recipe.ingredients.filter(
          ingredient => !matchedIngredients.includes(ingredient)
        ),
        matchCount: matchedIngredients.length
      };
    })
    .filter(recipe => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;