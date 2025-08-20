import './list.scss'
import Card from"../card/Card"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryString = searchParams.toString(); // type=student&minPrice=100&maxPrice=500
        const res = await axios.get(`/api/posts?${queryString}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, [searchParams]);
}


function List({posts}){
  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} item={item}/>
      ))}
    </div>
  )
}

export default List