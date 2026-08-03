import { useState, useEffect } from "react";

/* ---------------- Validation Helpers ---------------- */

function validateName(name) {
  if (!name.trim()) return "Full Name is required";
  if (name.trim().length < 3) return "Minimum 3 characters required";
  return "";
}

function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Minimum 6 characters required";
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}

/* ---------------- Component ---------------- */

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  /* ---------- Load Saved Data ---------- */
  useEffect(() => {
    const savedData = localStorage.getItem("settingsData");
    const savedTheme = localStorage.getItem("themeMode");

    if (savedData) setFormData(JSON.parse(savedData));
    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

  /* ---------- Save Theme ---------- */
  useEffect(() => {
    localStorage.setItem("themeMode", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------- Validation ---------- */
  useEffect(() => {
    setErrors({
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    });
  }, [formData]);

  const isFormValid =
    Object.values(errors).every((err) => err === "") &&
    Object.values(formData).every((val) => val !== "");

  const handleChange = (e) => {
    setSuccess("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    localStorage.setItem("settingsData", JSON.stringify(formData));
    setSuccess("✅ Settings saved successfully!");
  };

  /* ---------- Dynamic Classes ---------- */

  const pageBg = darkMode
    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
    : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200 text-gray-800";

  const cardBg = darkMode
    ? "bg-white/5 border border-white/10"
    : "bg-white border border-gray-200";

  const inputBg = darkMode
    ? "bg-white/10 border border-white/20 text-white placeholder-gray-400"
    : "bg-gray-50 border border-gray-300 text-gray-800";

  const buttonActive =
    "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30";

  const buttonDisabled = "bg-gray-400 cursor-not-allowed text-white";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${pageBg}`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-xl transition-all duration-500 ${cardBg}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm mb-1 font-medium"
              >
                {field.label}
              </label>

              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${inputBg}`}
              />

              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isFormValid ? buttonActive : buttonDisabled
            }`}
          >
            Save Settings
          </button>

          {success && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/20 text-green-600 text-sm font-medium text-center border border-green-400/40">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;