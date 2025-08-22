import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelectRole = async (role) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch("/api/users/update-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userRole", role);
        localStorage.setItem("onboardingComplete", "true");

        if (role === "organizer") {
          return navigate("/settings?tab=profile");
        }

        return navigate("/dashboard");
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <h2 className="text-3xl font-bold mb-6">Choose Your Role</h2>
      <p className="text-gray-700 mb-8 text-center">
        Please select whether you want to be an Organizer or a Cheerleader.
      </p>
      <div className="flex gap-8">
        <div className="p-6 rounded-lg shadow-md text-center bg-teal-800 p-20 text-white">
          <h3 className="text-xl font-semibold mb-2">Organizer</h3>
          <p>Create and manage exciting contests</p>
          <button
            className="mt-4 bg-white text-teal-800 font-semibold py-2 px-4 rounded hover:bg-teal-100"
            onClick={() => handleSelectRole("organizer")}
          >
            Create Account
          </button>
        </div>
        <div className="p-6 rounded-lg shadow-md text-center bg-orange-500 p-20 text-white">
          <h3 className="text-xl font-semibold mb-2">Cheerleader</h3>
          <p>Cast your votes and participate in the action</p>
          <button
            className="mt-4 bg-white text-orange-500 font-semibold py-2 px-4 rounded hover:bg-orange-100"
            onClick={() => handleSelectRole("cheerleader")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
