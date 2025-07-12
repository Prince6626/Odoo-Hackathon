import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    availability: "",
    category: "",
    location: "",
    rating: "",
  });

  const getFeed = async () => {
    if (feed && Array.isArray(feed) && feed.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 🛡️ Safe fallback if feed is undefined or not array
  const currentFeed = Array.isArray(feed) ? feed : [];

  const filteredFeed = currentFeed.filter((user) => {
    const skillMatch =
      filters.search === "" ||
      user.skills?.toLowerCase().includes(filters.search.toLowerCase());

    const availMatch =
      filters.availability === "" || user.availability === filters.availability;

    const catMatch =
      filters.category === "" ||
      user.skills?.toLowerCase().includes(filters.category.toLowerCase());

    const locMatch =
      filters.location === "" || user.location === filters.location;

    const ratingMatch =
      filters.rating === "" ||
      (user.rating && user.rating >= Number(filters.rating));

    return skillMatch && availMatch && catMatch && locMatch && ratingMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-80 h-96 rounded-2xl bg-gradient-to-br from-rose-200/20 to-purple-200/10 animate-pulse shadow-lg shadow-rose-500/10" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 animate-fade-in">
      {/* 🔍 Search Bar at top */}
      <div className="mb-6">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by skill (e.g., React, Figma)"
          className="w-full sm:w-96 px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
      </div>

      {/* 👥 User Cards */}
      <div className="flex flex-col gap-6 items-center">
        {filteredFeed.length > 0 ? (
          filteredFeed.map((user) => (
            <div
              key={user._id}
              className="transition-transform duration-300 ease-in-out hover:scale-[1.02] w-full max-w-3xl"
            >
              <UserCard user={user} />
            </div>
          ))
        ) : (
          <p className="text-center text-rose-400 text-lg mt-20">
            No matching users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
