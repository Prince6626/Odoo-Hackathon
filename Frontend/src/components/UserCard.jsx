/* eslint-disable no-unused-vars */
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, preview = false }) => {
  const { _id, firstName, lastName, age, gender, skills, about, profileUrl } =
    user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  const skillArr =
    typeof skills === "string"
      ? skills.split(",").map((s) => s.trim())
      : skills;

  return (
    <div className="bg-[#1e1f26] rounded-lg shadow-sm border border-gray-700 p-6 flex justify-between items-center mb-6">
      {/* LEFT ‑‑ avatar + info */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
          <img
            src={profileUrl || "/default-avatar.png"}
            alt={firstName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-xs">
          <h3 className="font-semibold text-lg text-white">
            {firstName} {lastName}
          </h3>

          {/* age + gender */}
          {age && gender && (
            <p className="text-sm text-gray-400">
              {age} • {gender}
            </p>
          )}

          {/* bio */}
          {about && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{about}</p>
          )}

          {/* skills */}
          {skillArr?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skillArr.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT ‑‑ single request button */}
      {!preview && (
        <button
          onClick={() => handleSendRequest("interested", _id)}
          className="bg-[#ff5e5e] hover:bg-[#ff4242] text-white text-sm font-medium px-5 py-2 rounded-md"
        >
          Request
        </button>
      )}
    </div>
  );
};

export default UserCard;
