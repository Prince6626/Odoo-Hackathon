import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || "");
  const [profileUrl, setProfileUrl] = useState(user.profileUrl);
  const [location, setLocation] = useState(user.location || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skillsOffered, setSkillsOffered] = useState(user.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user.skillsWanted || []);
  const [availability, setAvailability] = useState(user.availability || "");
  const [isPublic, setIsPublic] = useState(user.isPublic || false);

  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          profileUrl,
          location,
          about,
          age,
          gender,
          skillsOffered,
          skillsWanted,
          availability,
          profileVisibility: isPublic ? "public" : "private",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log("Edit profile error:", err);
    }
  };

  const addSkill = (type) => {
    if (type === "offered" && newSkillOffered.trim()) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
    }
    if (type === "wanted" && newSkillWanted.trim()) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
    }
  };

  const removeSkill = (type, index) => {
    if (type === "offered") {
      const updated = [...skillsOffered];
      updated.splice(index, 1);
      setSkillsOffered(updated);
    } else {
      const updated = [...skillsWanted];
      updated.splice(index, 1);
      setSkillsWanted(updated);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center gap-10 my-10 px-4">
        {/* === FORM SECTION === */}
        <div className="bg-base-200 p-6 rounded-xl shadow-md w-full max-w-2xl text-white">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <div className="flex gap-3 flex-wrap">
              <button onClick={saveProfile} className="btn btn-primary">
                Save
              </button>
              <button className="btn btn-outline btn-error">Discard</button>
            </div>
          </div>

          {/* === Profile Photo Input === */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Profile Photo URL</label>
            <input
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* === Name + Location === */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* === Skills Offered === */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Skills Offered</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsOffered.map((skill, i) => (
                <span
                  key={i}
                  className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  <button onClick={() => removeSkill("offered", i)} className="font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                placeholder="Add skill"
                className="input input-bordered w-60 text-sm"
              />
              <button
                onClick={() => addSkill("offered")}
                className="btn btn-sm btn-outline btn-success"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* === Skills Wanted === */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Skills Wanted</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsWanted.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  <button onClick={() => removeSkill("wanted", i)} className="font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                placeholder="Add skill"
                className="input input-bordered w-60 text-sm"
              />
              <button
                onClick={() => addSkill("wanted")}
                className="btn btn-sm btn-outline btn-info"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* === Availability & Visibility === */}
          <div className="flex flex-col sm:flex-row gap-6 mt-6">
            <div className="flex-1">
              <label className="block text-sm mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Profile Visibility</label>
              <div className="flex items-center gap-3">
                <span className="text-sm">Public</span>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* === LIVE PREVIEW === */}
        <div className="w-full max-w-sm">
          <UserCard
            user={{
              firstName,
              lastName,
              profileUrl,
              age,
              gender,
              about,
            }}
            preview={true}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Updated Successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
