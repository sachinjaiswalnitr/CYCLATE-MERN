import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Need a Cycle?..Selling a Cycle?..Start Here.</h1>
          <p>
            -Verified listings. Student-friendly prices.<br></br>
            -List in seconds. Reach interested buyers instantly.<br></br>
            -Browse by price, type, or location. Easy buying starts here.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>10+</h1>
              <h2>Cycle Sellers</h2>
            </div>
            <div className="box">
              <h1>9</h1>
              <h2>Rated 9 out of 10 by students</h2>
            </div>
            <div className="box">
              <h1>55+</h1>
              <h2>Already Sold</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;