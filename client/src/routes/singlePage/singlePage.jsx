import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { toast } from "react-toastify";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [status, setStatus] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
      toast.success(saved ? "Removed from saved list" : "Place saved");
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
      toast.error("Failed to save place");
    }
  };

  const handleRequest = async () => {
    console.log(post.id,currentUser.id);
    try {
      if (!currentUser) return navigate("/login");
      if (status===null) {
        await apiRequest.post("/buy-request",{
          postId: post.id,
          buyerId: currentUser.id,
        });
        setStatus("AWAITED");
        toast.success("Buy request sent to the owner");
      } else if (status==="AWAITED") {
        await apiRequest.delete(`/buy-request/${post.id}/${currentUser.id}`);
        setStatus(null);
        toast.info("Buy request cancelled");
      }
    }
    catch (err) {
      console.error("Request failed", err);
      toast.error("Failed to update request");
    }
  };

const getStatus = async () => {
  try {
    const res = await apiRequest.get(`/buy-request/status/${post.id}/${currentUser.id}`);
    if (res?.data?.status) {
      setStatus(res.data.status);
    } else {
      setStatus(null);
    }
  } catch (err) {
    if (err.response?.status === 404) {
      setStatus(null); // No request yet
    } else {
      console.error("Failed to fetch status", err);
    }
    setStatus(null);
  }
};


  useEffect(() => {
  if (currentUser && currentUser.id!==post.userId) {
    getStatus();
  }
}, [currentUser, post.userId]);

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="price">{post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Brand</span>
                <p>{post.brand}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Color</span>
                <p>{post.color}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Gears</span>
                <p>{post.gear}</p>
              </div>
            </div>
          </div>

          <p className="title">Features</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.drivetype === "manual" ? "Manual" : "Automatic"}</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.drivetype === "manual" ? "Normal Brake" : "Disc Brake"}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>
                {post.drivetype === "automatic" || post.gear === "Yes"
                  ? "Front Suspension"
                  : "No Suspension"}
              </span>
            </div>
          </div>

          <p className="title">Personal Information</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>{post.type === "student" ? "Hostel" : "Shop Name"}</span>
                <p>{post.type === "student" ? post.hostel : post.shopname}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>{post.type === "student" ? "Room Number" : "Sector"}</span>
                <p>{post.type === "student" ? post.roomnumber : post.shopsector}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Contact</span>
                <p>{post.contact}</p>
              </div>
            </div>
          </div>

          {currentUser?.id !== post.userId && (
            <div className="buttons">
              <button onClick={handleRequest}>
                {status==="ACCEPTED"
                  ? "Accepted"
                  : status ==="REJECTED"
                  ? "Rejected"
                  : status==="AWAITED"
                  ? "Cancel Request"
                  : "Send Request for Buying"}
              </button>
              <button
                onClick={handleSave}
                style={{ backgroundColor: saved ? "#fece51" : "white" }}
              >
                <img src="/save.png" alt="" />
                {saved ? "Place Saved" : "Save the Place"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
