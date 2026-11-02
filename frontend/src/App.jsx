import { getToken } from "firebase/messaging";
import { messaging, vapidKey } from "./firebase";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const enableNotifications = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration
    });

    console.log("Notification token:", token);
    await fetch("http://localhost:5000/api/notifications/save-token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ token })
});
    alert("Notifications enabled successfully!");
  } else {
    alert("Notification permission denied.");
  }
};
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [expiryDate, setExpiryDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const API = "http://localhost:5000/api/items";

  useEffect(() => {
    fetchItems();
    fetchRecipes();
  }, []);

  async function fetchItems() {
    const response = await fetch(API);
    const data = await response.json();
    setItems(data);
  }

  async function fetchRecipes() {
  const response = await fetch("http://localhost:5000/api/recipes");
  const data = await response.json();
  setRecipes(data);
}

  function getStatus(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);

    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (days < 0) return "Expired";
    if (days <= 3) return "Expiring Soon";
    return "Fresh";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const item = { name, category, quantity, unit, expiryDate };

    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }

    setName("");
    setCategory("Vegetables");
    setQuantity(1);
    setUnit("pcs");
    setExpiryDate("");
    setEditId(null);
    fetchItems();
  }

  function editItem(item) {
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setExpiryDate(item.expiryDate.split("T")[0]);
    setEditId(item._id);
  }

  async function deleteItem(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchItems();
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(item.expiryDate);
    const matchesFilter = filter === "All" || status === filter;
    return matchesSearch && matchesFilter;
  });

  const fresh = items.filter((item) => getStatus(item.expiryDate) === "Fresh").length;
  const expiring = items.filter((item) => getStatus(item.expiryDate) === "Expiring Soon").length;
  const expired = items.filter((item) => getStatus(item.expiryDate) === "Expired").length;

  return (
    <div className="app">
      <header className="header">
        <h1> PantryPulse</h1>
        <p>Keep a live pulse on what's in your kitchen.</p>
      </header>
      <button onClick={enableNotifications}>
        Enable Notifications
      </button>

      <main className="container">
        <section className="summary">
          <div className="summary-card">
            <h3>Total Items</h3>
            <h2>{items.length}</h2>
          </div>
          <div className="summary-card fresh">
            <h3>Fresh</h3>
            <h2>{fresh}</h2>
          </div>
          <div className="summary-card expiring">
            <h3>Expiring Soon</h3>
            <h2>{expiring}</h2>
          </div>
          <div className="summary-card expired">
            <h3>Expired</h3>
            <h2>{expired}</h2>
          </div>
        </section>

        <section className="form-section">
          <h2>{editId ? "Update Item" : "Add Pantry Item"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Grains</option>
              <option>Snacks</option>
              <option>Other</option>
            </select>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option>pcs</option>
              <option>kg</option>
              <option>g</option>
              <option>litres</option>
              <option>packets</option>
            </select>

            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />

            <button type="submit">{editId ? "Update Item" : "Add Item"}</button>

            {editId && (
              <button type="button" onClick={() => {
                setEditId(null);
                setName("");
                setCategory("Vegetables");
                setQuantity(1);
                setUnit("pcs");
                setExpiryDate("");
              }}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="items-section">
          <h2>Your Pantry</h2>

          <div className="filters">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Fresh</option>
              <option>Expiring Soon</option>
              <option>Expired</option>
            </select>
          </div>

          <div className="item-list">
            {filteredItems.length === 0 ? (
              <p>No pantry items found.</p>
            ) : (
              filteredItems.map((item) => (
                <div className="item-card" key={item._id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.category} | {item.quantity} {item.unit}</p>
                    <p>Expiry: {new Date(item.expiryDate).toLocaleDateString()}</p>
                    <span className={`status ${getStatus(item.expiryDate).replace(" ", "-").toLowerCase()}`}>
                      {getStatus(item.expiryDate)}
                    </span>
                  </div>

                  <div className="actions">
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="recipes-section">
  <h2>🍲 Dish Recommendations</h2>

  {recipes.length === 0 ? (
    <p>No matching recipes found. Add more pantry ingredients!</p>
  ) : (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <div className="recipe-card" key={index}>
          <h3>{recipe.name}</h3>

          <p>
            <strong>Available:</strong>{" "}
            {recipe.matchedIngredients.join(", ")}
          </p>

          <p>
            <strong>Missing:</strong>{" "}
            {recipe.missingIngredients.length === 0
              ? "None"
              : recipe.missingIngredients.join(", ")}
          </p>

          <p>{recipe.instructions}</p>

          {recipe.missingIngredients.length === 0 && (
            <span>Ready to prepare!</span>
          )}
        </div>
      ))}
    </div>
  )}
</section>
      </main>
    </div>
  );
}

export default App;
