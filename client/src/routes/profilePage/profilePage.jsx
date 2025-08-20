import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requestsReceived, setRequestsReceived] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [errorReqs, setErrorReqs] = useState(null);

  useEffect(() => {
    const fetchRequestsReceived = async () => {
      if (!currentUser?.id) return;
      try {
        setLoadingReqs(true);
        const res = await apiRequest.get(`/buy-request/received/${currentUser.id}`);
        setRequestsReceived(res.data || []);
        setErrorReqs(null);
      } catch (err) {
        setErrorReqs("Failed to load requests");
      } finally {
        setLoadingReqs(false);
      }
    };

    fetchRequestsReceived();
  }, [currentUser?.id]);

  const handleAction = async (requestId, action) => {
    try {
      await apiRequest.patch(`/buy-request/${requestId}`, { status: action });

      setRequestsReceived((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: action } : req
        )
      );
      toast.success(
        `Request ${
          action === "ACCEPTED" ? "You have accepted the request." : "You have rejected the request."
        }`
      );
    } catch (err) {
      console.error("Failed to update request", err);
      toast.error("Failed to update request");
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="title">
            <h1>Cycles for Sell</h1>
            <Link to="/add">
              <button>Add new Cycle</button>
            </Link>
          </div>
<Suspense fallback={<p>Loading...</p>}>
  <Await
    resolve={data.postResponse}
    errorElement={<p>Error loading posts!</p>}
  >
    {(postResponse) => {
      const unsoldPosts = postResponse.data.userPosts.filter(
        (post) => !post.sold
      );
      return <List posts={unsoldPosts} />;
    }}
  </Await>
</Suspense>


          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>

          <div className="title">
            <h1>Cycles Sold</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading sold posts!</p>}
            >
              {(postResponse) => {
                const soldPosts = postResponse.data.userPosts.filter(
                  (post) => post.sold === true && post.userId === currentUser?.id
                );
                return soldPosts.length > 0 ? (
                  <List posts={soldPosts} />
                ) : (
                  <p>No cycles sold yet.</p>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <h1>Requests Received</h1>

          {loadingReqs && <p>Loading requests...</p>}
          {errorReqs && <p style={{ color: "yellow" }}>{errorReqs}</p>}

          {!loadingReqs && !errorReqs && (
            <div className="requestsList">
              {requestsReceived.length === 0 ? (
                <p>No requests received yet.</p>
              ) : (
                requestsReceived.map((req) => (
<div className="requestCard" key={req.id}>
  <div className="buyerInfo">
    <img src="/noavatar.jpg"/>
    <div className="buyerText">
      <h4>{req.buyer?.username}</h4>
      <p>{req.buyer?.email}</p>
    </div>
  </div>

  <div className="details">
    <p><span>Brand:</span> {req.post?.brand}</p>
    <p><span>Color:</span> {req.post?.color}</p>
    <p><span>Price:</span> {req.post?.price}</p>
    <p><span>Driving Type:</span> {req.post?.drivetype}</p>
    <p><span>Gear:</span> {req.post?.gear}</p>
    <p className={`status ${req.status.toLowerCase()}`}>
      <span>Status:</span> {req.status}
    </p>
  </div>

  {req.status === "AWAITED" && (
    <div className="actions">
      <button className="accept" onClick={() => handleAction(req.id, "ACCEPTED")}>Accept</button>
      <button className="reject" onClick={() => handleAction(req.id, "REJECTED")}>Reject</button>
    </div>
  )}
</div>

                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
