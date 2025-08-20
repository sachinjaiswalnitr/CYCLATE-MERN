import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [type, setSellerType] = useState("student");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
  postData: {
    title:inputs.title,
    price: parseInt(inputs.price),
    images: images,
    type:type || "student",
    hostel: type === "student" ? inputs.hostel : undefined,
    roomnumber: type === "student" ? inputs.roomnumber : undefined,
    shopname: type === "shop" ? inputs.shopname : undefined,
    shopsector: type === "shop" ? inputs.shopsector : undefined,
    brand: inputs.brand,
    color: inputs.color,
    gear: inputs.gear,
    drivetype: inputs.drivetype,
    contact: inputs.contact,
  },
  postDetail: {
    desc: value,
  },
});

      navigate("/"+res.data.id)
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>

            <div className="item">
  <label htmlFor="type">Seller Type</label>
  <select
    id="type"
    name="type"
    value={type}
    onChange={(e) => setSellerType(e.target.value)}
  >
    <option value="student">Student</option>
    <option value="shop">Shop</option>
  </select>
</div>

{type === "student" && (
  <>
    <div className="item">
      <label htmlFor="hostel">Hostel</label>
      <input id="hostel" name="hostel" type="text" />
    </div>
    <div className="item">
      <label htmlFor="roomnumber">Room Number</label>
      <input id="roomnumber" name="roomnumber" type="text" />
    </div>
  </>
)}

{type === "shop" && (
  <>
    <div className="item">
      <label htmlFor="shopname">Shop Name</label>
      <input id="shopname" name="shopname" type="text" />
    </div>
    <div className="item">
      <label htmlFor="shopsector">Shop Sector</label>
      <input id="shopsector" name="shopsector" type="text" />
    </div>
  </>
)}


            {/* <div className="item">
              <label htmlFor="city">Hostel</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Room Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div> */}
            <div className="item">
              <label htmlFor="brand">Brand</label>
              <input id="brand" name="brand" type="text" />
            </div>
            <div className="item">
              <label htmlFor="color">Color</label>
              <input id="color" name="color" type="text" />
            </div>
            {/* <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div> */}
            <div className="item">
              <label htmlFor="drivetype">Drive Type</label>
              <select name="drivetype">
                <option value="manual" defaultChecked>
                  Manual
                </option>
                <option value="automatic">Automatic(Motor)</option>
              </select>
            </div>
            {/* <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div> */}

            <div className="item">
              <label htmlFor="gear">Gears?</label>
              <select name="gear">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="item">
  <label htmlFor="contact">Contact Number</label>
  <input id="contact" name="contact" type="text" required />
</div>
            {/* <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div> */}
            {/* <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div> */}
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
