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

function Dashboard() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [showModal, setShowModal] = useState(false);

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

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const pending = total - completed;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <h1 className="greeting">Good morning! 👋</h1>

        <div className="stats">
          <StatCard label="Total" value={total} />
          <StatCard label="Pending" value={pending} />
          <StatCard label="Done" value={completed} />
        </div>

        <div className="tasks-header">
          <h2>My Tasks</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
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
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddTaskModal onClose={() => setShowModal(false)} onSave={addTask} />
      )}
    </div>
  );
}

export default Dashboard;