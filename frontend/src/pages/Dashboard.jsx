import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { useAuth } from "../context/authContext";
import * as taskService from "../services/taskService";
import { getErrorMessage } from "../services/api";
import "./Auth.css";
import "./Dashboard.css";
import SkeletonList from "../components/SkeletonList";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/toastContext";

// ===== KEEP: paste your FILTERS, SORTS, PRIORITY_ORDER, getToday,
// ===== matchesFilter and sortTasks here, exactly as before.
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
  const { user } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  // Load tasks when the page opens (and again when the user clicks Retry)
  useEffect(() => {
    let cancelled = false;

    taskService
      .getTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setLoadError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retryLoad = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  // These two THROW on failure, so the modal can show the error
  const addTask = async (data) => {
    const created = await taskService.createTask(data);
    setTasks((prev) => [created, ...prev]);
    toast.success("Task added");
  };

  const updateTask = async (id, data) => {
    const updated = await taskService.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    toast.success("Task updated");
  };

  // These two show errors in a banner on the page
  const toggleTask = async (id) => {
    try {
      const updated = await taskService.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(
        updated.status === "COMPLETED"
          ? "Task completed 🎉"
          : "Task moved back to pending"
      );
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
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
          <StatCard label="Total" value={loading ? "–" : total} />
          <StatCard label="Pending" value={loading ? "–" : pending} />
          <StatCard label="Done" value={loading ? "–" : completed} />
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
          {loading ? (
            <SkeletonList />
          ) : loadError ? (
            <EmptyState
              icon="⚠️"
              title="Couldn't load your tasks"
              text={loadError}
              actionLabel="Try again"
              onAction={retryLoad}
            />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No tasks yet"
              text="Add your first task and start getting things done."
              actionLabel="+ Add Task"
              onAction={openAddModal}
            />
          ) : visibleTasks.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No matching tasks"
              text="Try a different search or filter."
              actionLabel="Clear search and filters"
              onAction={clearFilters}
            />
          ) : (
            visibleTasks.map((task) => (
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