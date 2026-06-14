import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";
import api from "../utils/api";

const Dashboard = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch tasks from DB on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  try {
    const res = await api.get("/api/tasks");
    setTasks(Array.isArray(res.data) ? res.data : []);  // make sure it's always an array
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      const res = await api.post("/api/tasks", { title: task });
      setTasks([res.data, ...tasks]);
      setTask("");
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleToggle = async (id) => {
    const t = tasks.find((t) => t._id === id);
    try {
      const res = await api.put(`/api/tasks/${id}`, {
        status: t.status === "pending" ? "done" : "pending",
      });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleEdit = async (id, newTitle) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, { title: newTitle });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Add Task */}
        <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
          >
            Add
          </button>
        </form>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-3 text-center shadow-sm">
            <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total</p>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-3 text-center shadow-sm">
            <p className="text-2xl font-semibold text-yellow-500">{tasks.filter(t => t.status === "pending").length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Pending</p>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-3 text-center shadow-sm">
            <p className="text-2xl font-semibold text-green-500">{tasks.filter(t => t.status === "done").length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Done</p>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <p className="text-center text-sm text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default Dashboard;