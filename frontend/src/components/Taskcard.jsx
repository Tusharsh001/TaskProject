import { useState } from "react";

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEditStart = () => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const handleEditSave = () => {
    if (!editText.trim()) return;
    onEdit(task._id, editText);
    setEditingId(null);
    setEditText("");
  };

  return (
    <li className="bg-white rounded-xl border border-gray-100 px-4 py-4 shadow-sm">
      {editingId === task._id ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={handleEditSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
          >
            Save
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">

          {/* Checkbox */}
          <button
            onClick={() => onToggle(task._id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition
              ${task.status === "done"
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-indigo-400"
              }`}
          >
            {task.status === "done" && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title */}
          <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </span>

          {/* Status Badge */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium
            ${task.status === "done"
              ? "bg-green-50 text-green-600"
              : "bg-yellow-50 text-yellow-600"
            }`}>
            {task.status === "done" ? "Done" : "Pending"}
          </span>

          {/* Edit Button */}
          <button
            onClick={handleEditStart}
            className="text-gray-400 hover:text-indigo-500 transition"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-500 transition"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

        </div>
      )}
    </li>
  );
};

export default TaskCard;