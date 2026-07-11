import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "@/firebase";
import { completeStaffProfile } from "@/services/staff.service";
import { upsertUserFromAuth } from "@/services/user.service";

export default function CompleteProfileForm() {
    const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSave() {

  if (!name || !email || !phone || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {

    const staffDocId = sessionStorage.getItem("staffDocId");

    if (!staffDocId) {
      alert("Session expired. Please login again.");
      return;
    }

    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await completeStaffProfile(staffDocId, {
      name,
      email,
      phone,
      firebaseUid: result.user.uid,
    });

    await upsertUserFromAuth(result.user.uid, {
      email,
      phone,
      displayName: name,
      photoURL: null,
    });

    sessionStorage.removeItem("staffDocId");
    sessionStorage.removeItem("staffId");

    alert("Profile completed successfully.");

    navigate("/staff/dashboard");

  } catch (err) {

    console.error(err);

    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Something went wrong.");
    }

  }
}

  return (
    <div className="w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-800 p-8">

      <h1 className="text-3xl font-bold mb-2">
        Complete Your Profile
      </h1>

      <p className="text-gray-400 mb-8">
        Complete your account before accessing the Staff Portal.
      </p>

      <div className="space-y-5">

        <input
          className="w-full rounded-xl bg-gray-800 p-3 outline-none"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full rounded-xl bg-gray-800 p-3 outline-none"
          placeholder="Email Address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-xl bg-gray-800 p-3 outline-none"
          placeholder="Phone Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-xl bg-gray-800 p-3 outline-none"
          placeholder="Create Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-xl bg-gray-800 p-3 outline-none"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          Save & Continue
        </button>

      </div>

    </div>
  );
}