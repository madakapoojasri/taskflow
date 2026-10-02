import { useAuth } from "../context/authContext";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import "./Auth.css";
import "./Dashboard.css";

const dummyTasks = [
  {
    id: 1,
    title: "Complete React project",
    description: "Finish the dashboard UI",
    category: "Coding",
    priority: "HIGH",
    dueDate: "2026-10-05",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Finish CN assignment",
    description: "Routing algorithms",
    category: "College",
    priority: "MEDIUM",
    dueDate: "2026-10-03",
    status: "COMPLETED",
  },
  {
    id: 3,
    title: "Buy groceries",
    description: "",
    category: "Shopping",
    priority: "LOW",
    dueDate: "2026-10-02",
    status: "PENDING",
  },
];

const FILTERS = [
  "All",
  "Pending",
  "Completed",
  "Overdue",
  "Today",
  "High Priority",
];

const SORTS = ["Newest", "Oldest", "Due Date", "Priority"];

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

// Today's date as "YYYY-MM-DD" in the user's local time zone
const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const matchesFilter = (task, filter, today) => {
  switch (filter) {
    case "Pending":
      return task.status === "PENDING";
    case "Completed":
      return task.status === "COMPLETED";
    case "Overdue":
      return (
        task.status === "PENDING" && task.dueDate && task.dueDate < today
      );
    case "Today":
      return task.dueDate === today;
    case "High Priority":
      return task.priority === "HIGH";
    default:
      return true; // "All"
  }
};

const sortTasks = (list, sort) => {
  const sorted = [...list]; // copy, so we never change the original array

  switch (sort) {
    case "Oldest":
      return sorted.sort((a, b) => a.id - b.id);
    case "Due Date":
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1; // tasks without a date go last
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "Priority":
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    default: // "Newest"
      return sorted.sort((a, b) => b.id - a.id);
  }
};

function Dashboard() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); 
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const { user } = useAuth();

  const addTask = (formData) => {
    const newTask = {
      ...formData,
      id: Date.now(), // temporary unique id; the database will create real ids later
      status: "PENDING",
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };
  const updateTask = (id, formData) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...formData } : task))
    );
  };

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const today = getToday();
  const query = search.trim().toLowerCase();

  const visibleTasks = sortTasks(
    tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query);
      return matchesSearch && matchesFilter(task, filter, today);
    }),
    sort
  );

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pending = total - completed;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <h1 className="greeting">Hello, {user?.name}! 👋</h1>

        <div className="stats">
          <StatCard label="Total" value={total} />
          <StatCard label="Pending" value={pending} />
          <StatCard label="Done" value={completed} />
        </div>

        <div className="tasks-header">
          <h2>My Tasks</h2>
          <button className="btn-add" onClick={openAddModal}>
            + Add Task
          </button>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="toolbar-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort tasks"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                Sort: {s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={f === filter ? "chip active" : "chip"}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Click "+ Add Task" to create one.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={openEditModal}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddTaskModal
          task={editingTask}
          onClose={closeModal}
          onSave={addTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

export default Dashboard;