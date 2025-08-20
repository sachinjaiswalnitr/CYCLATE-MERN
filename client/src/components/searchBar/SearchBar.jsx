import { useState, useContext } from "react";
import "./searchBar.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function SearchBar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [mode, setMode] = useState("buy");
  const [query, setQuery] = useState({
    type: "student",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBuyClick = () => setMode("buy");

  const handleSellClick = () => {
    setMode("sell");
    navigate("/add");
  };

  if (!currentUser) return null;

  return (
    <div className="searchBar">
      <div className="tabs">
        <button
          onClick={handleBuyClick}
          className={mode === "buy" ? "active" : ""}
        >
          Buy
        </button>
        <button
          onClick={handleSellClick}
          className={mode === "sell" ? "active" : ""}
        >
          Sell
        </button>
      </div>

      {mode === "buy" && (
        <form>
          <div className="item">
            <label htmlFor="type">Source</label>
            <select
              name="type"
              id="type"
              value={query.type}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="shop">Shop</option>
            </select>
          </div>

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            onChange={handleChange}
            value={query.minPrice}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            onChange={handleChange}
            value={query.maxPrice}
          />

          <Link
            to={`/list?type=${query.type}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          >
            <button type="submit" className="searchBtn">
              <img src="/search.png" alt="Search" />
            </button>
          </Link>
        </form>
      )}
    </div>
  );
}

export default SearchBar;
