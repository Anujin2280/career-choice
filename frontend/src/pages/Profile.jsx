import { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil } from "lucide-react";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    role: user?.role || "User",
    city: user?.city || "Улаанбаатар, Монгол",
    birthDate: user?.birthDate || "2000-01-01",
    phone: user?.phone || "+976 ",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: API PUT хүсэлт илгээх
    console.log("Updated:", form);
  };

  return (
    <div className="min-h-screen bg-[#fff] py-12 px-6 md:px-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Миний профайл
      </h2>

      {/* PROFILE CARD */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8 flex items-center gap-6 border border-orange-100">
        <div className="relative">
          <img
            src={user?.avatar || "/avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-orange-100"
          />
          <label className="absolute bottom-1 right-2 bg-orange-500 text-white rounded-full p-1 cursor-pointer hover:bg-orange-600">
            <input type="file" className="hidden" />
            <Pencil size={14} />
          </label>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {form.firstName} {form.lastName}
          </h3>
          <p className="text-gray-600">{form.role}</p>
          <p className="text-gray-600">{form.city}</p>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white shadow-md rounded-2xl p-8 border border-orange-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Хувийн мэдээлэл
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              <Pencil size={16} /> Засах
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              💾 Хадгалах
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* First Name */}
          <div>
            <p className="text-gray-500 mb-1">Овог</p>
            {isEditing ? (
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">{form.lastName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <p className="text-gray-500 mb-1">Нэр</p>
            {isEditing ? (
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">{form.firstName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <p className="text-gray-500 mb-1">Төрсөн огноо</p>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">{form.birthDate}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-500 mb-1">Имэйл хаяг</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">{form.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <p className="text-gray-500 mb-1">Утасны дугаар</p>
            {isEditing ? (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="font-semibold text-gray-800">{form.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
