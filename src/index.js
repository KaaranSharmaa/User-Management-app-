import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/* ------------------ LabelInput ------------------ */
const LabelInput = ({ label, value, onChange, placeholder }) => (
  <div className="field">
    <label>{label}</label>
    <input value={value} onChange={onChange} placeholder={placeholder} />
  </div>
);

/* ------------------ Sidebar Form ------------------ */
const Sidebar = ({ open, onClose, fields, onGet, onPost, onPut, onDelete }) => (
  <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="close-btn">
      <button className="btn btn-delete" style={{ padding: "6px 14px" }} onClick={onClose}>✕</button>
    </div>

    <div className="app-title">
      <span>👤</span> User Manager
    </div>

    <div className="form-card">
      <h3>User Details</h3>
      {fields.map(({ label, value, onChange, placeholder }) => (
        <LabelInput key={label} label={label} value={value} onChange={onChange} placeholder={placeholder} />
      ))}
    </div>

    <div className="actions">
      <button className="btn btn-get" onClick={onGet}>⬇ GET</button>
      <button className="btn btn-post" onClick={onPost}>＋ POST</button>
      <button className="btn btn-put" onClick={onPut}>✎ PUT</button>
      <button className="btn btn-delete" onClick={onDelete}>✕ DELETE</button>
    </div>
  </aside>
);

/* ------------------ User Card ------------------ */
const UserCard = ({ user }) => (
  <div className="user-card">
    <div className="user-card-avatar">{(user.name || "?")[0].toUpperCase()}</div>
    <h4>{user.name}</h4>
    <p className="user-email">{user.email}</p>
    <span className="user-id">ID: {user.id}</span>
  </div>
);

/* ------------------ App ------------------ */
const App = () => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = () => setSidebarOpen(false);

  const getData = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      setUsers(await res.json());
      close();
    } catch (e) { console.error("GET error:", e); }
  };

  const postData = async () => {
    if (!name || !email) return alert("Name and Email are required");
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, name, email }),
      });
      const data = await res.json();
      setUsers([...users, data]);
      alert("User created successfully");
      close();
    } catch (e) { console.error("POST error:", e); }
  };

  const putData = async () => {
    if (!id) return alert("Please enter ID to update");
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, name, email }),
      });
      const data = await res.json();
      setUsers(users.map((u) => (u.id === Number(id) ? data : u)));
      alert("User updated successfully");
      close();
    } catch (e) { console.error("PUT error:", e); }
  };

  const deleteData = async () => {
    if (!id) return alert("Please enter an ID to delete");
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== Number(id)));
        setId("");
        alert(`User ${id} deleted`);
        close();
      } else {
        alert("Delete failed");
      }
    } catch (e) { console.error("DELETE error:", e); }
  };

  const fields = [
    { label: "ID",    value: id,    onChange: (e) => setId(e.target.value),    placeholder: "e.g. 1" },
    { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Mr." },
    { label: "Name",  value: name,  onChange: (e) => setName(e.target.value),  placeholder: "Full name" },
    { label: "Email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "user@email.com" },
  ];

  return (
    <div className="app-wrapper">
      <Sidebar
        open={sidebarOpen}
        onClose={close}
        fields={fields}
        onGet={getData}
        onPost={postData}
        onPut={putData}
        onDelete={deleteData}
      />

      <main className="main">
        <div className="main-header">
          <h2>
            Users
            {users.length > 0 && <span className="badge">{users.length}</span>}
          </h2>
          <p>Manage your users via REST API</p>
        </div>

        <div className="user-grid">
          {users.length > 0 ? (
            users.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No users yet. Hit <strong>GET</strong> to load data.</p>
            </div>
          )}
        </div>
      </main>

      <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
    </div>
  );
};

/* ------------------ Render ------------------ */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
