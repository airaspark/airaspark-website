import { useState } from "react";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "@/firebase";
import { completeStaffProfile, updateStaff } from "@/services/staff.service";
import { createOrUpdateStaffUserProfile } from "@/services/user.service";
import { useAuthContext } from "@/contexts/AuthContext";

export default function CompleteProfileForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const staffDocId = sessionStorage.getItem("staffDocId");
    const staffId = sessionStorage.getItem("staffId");

    if (!staffDocId || !staffId) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    let authUser = null;
    let staffUpdated = false;

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      authUser = result.user;

      await completeStaffProfile(staffDocId, {
        name,
        email,
        phone,
        firebaseUid: authUser.uid,
        googleLinked: false,
      });
      staffUpdated = true;

      const profile = await createOrUpdateStaffUserProfile(authUser.uid, {
        email,
        phone,
        displayName: name,
        photoURL: null,
        staffId,
      });

      sessionStorage.removeItem("staffDocId");
      sessionStorage.removeItem("staffId");

      setUser(profile);
      navigate("/staff/dashboard");
    } catch (err) {
      console.error("Complete profile failed:", err);

      if (authUser) {
        try {
          await deleteUser(authUser);
        } catch (rollbackError) {
          console.error("Failed to rollback Firebase Auth user:", rollbackError);
        }
      }

      if (staffUpdated) {
        try {
          await updateStaff(staffDocId, {
            firebaseUid: null,
            profileCompleted: false,
          });
        } catch (rollbackError) {
          console.error("Failed to rollback staff document:", rollbackError);
        }
      }

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while completing your profile.");
      }
    } finally {
      setLoading(false);
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

      {error ? (
        <p className="text-red-400 mb-4">{error}</p>
      ) : null}

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
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

      </div>

    </div>
  );
}