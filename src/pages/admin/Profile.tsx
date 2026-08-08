import { useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "@/services/profile.service";

export default function Profile() {
  const { user, refreshProfile } = useAuthContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  if (!user) {
    return null;
  }

  // TypeScript now knows user can never be null below this line
  const currentUser = user;

  const photo =
    (currentUser as any).profilePhoto ||
    currentUser.photoURL ||
    "";

  async function handleUpload(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      await uploadProfilePhoto({
        role: currentUser.role as "admin" | "staff",
        documentId: currentUser.uid,
        profileId: currentUser.entityId || currentUser.uid,
        file,
      });

      await refreshProfile();

      alert("Profile photo updated.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Remove profile photo?")) return;

    setUploading(true);

    try {
      await deleteProfilePhoto(
        currentUser.role as "admin" | "staff",
        currentUser.uid,
        currentUser.entityId || currentUser.uid
      );

      await refreshProfile();

      alert("Photo removed.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <h1 className="text-4xl font-bold text-white mb-10">
        My Profile
      </h1>

      <div className="rounded-3xl bg-[#111827] border border-[#4C8DFF]/20 p-10">

        <div className="flex flex-col items-center">

          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-[#4C8DFF]"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-[#1F2937] flex items-center justify-center border-4 border-[#4C8DFF]">
              <User size={60} className="text-gray-400" />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />

          <div className="flex gap-4 mt-8">

            <button
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4C8DFF] text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Camera size={18} />
              {uploading ? "Uploading..." : "Change Photo"}
            </button>

            {photo && (
              <button
                disabled={uploading}
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                <Trash2 size={18} />
                Remove
              </button>
            )}

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">

          <div className="rounded-2xl bg-[#0B1220] p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-[#4C8DFF]" />
              <span className="text-gray-400">Name</span>
            </div>

            <h2 className="text-xl text-white font-semibold">
              {currentUser.displayName || "-"}
            </h2>
          </div>

          <div className="rounded-2xl bg-[#0B1220] p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="text-[#4C8DFF]" />
              <span className="text-gray-400">Email</span>
            </div>

            <h2 className="text-xl text-white font-semibold">
              {currentUser.email || "-"}
            </h2>
          </div>

          <div className="rounded-2xl bg-[#0B1220] p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="text-[#4C8DFF]" />
              <span className="text-gray-400">Phone</span>
            </div>

            <h2 className="text-xl text-white font-semibold">
              {currentUser.phone || "-"}
            </h2>
          </div>

          <div className="rounded-2xl bg-[#0B1220] p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-[#4C8DFF]" />
              <span className="text-gray-400">Role</span>
            </div>

            <h2 className="text-xl text-white font-semibold capitalize">
              {currentUser.role}
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}