import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/* ------------------ Constants ------------------ */
const Heading = ["User Management App"];

/* ------------------ Label Input ------------------ */
const LabelInput = ({ labeltext, value, onChange }) => {
  return (
    <div className="label-row">
      <label className="Label_text">{labeltext}</label>
      <input
        type="text"
        className="input_field"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

/* ------------------ Labels Component ------------------ */
const Labels = ({
  id,
  setId,
  title,
  setTitle,
  name,
  setName,
  email,
  setEmail,
}) => {
  return (
    <div className="labels-container">
      <h2 className="heading">{Heading[0]}</h2>

      <LabelInput labeltext="Id" value={id} onChange={(e) => setId(e.target.value)} />
      <LabelInput labeltext="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <LabelInput labeltext="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <LabelInput labeltext="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
  );
};

/* ------------------ Button Component ------------------ */
const Button = ({ text, className, onClick }) => {
  return (
    <button className={`common_css ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

/* ------------------ Buttons Component ------------------ */
const Buttons = ({ getData, postData, putData, deleteData }) => {
  return (
    <div className="buttons-container">
      <Button text="GET Data" className="get_data_css" onClick={getData} />
      <Button text="POST Data" className="get_data_css" onClick={postData} />
      <Button text="PUT Data" className="get_data_css" onClick={putData} />
      <Button text="DELETE Data" className="get_data_css" onClick={deleteData} />
    </div>
  );
};

/* ------------------ App Component ------------------ */
const App = () => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /* GET API */
  const getData = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("GET error:", error);
    }
  };

  /* POST API */
  const postData = async () => {
    if (!name || !email) {
      alert("Name and Email are required");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, name, email }),
        }
      );

      const data = await response.json();
      alert("User created successfully");
      setUsers([...users, data]);
    } catch (error) {
      console.error("POST error:", error);
    }
  };

  /* PUT API */
  const putData = async () => {
    if (!id) {
      alert("Please enter ID to update");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, name, email }),
        }
      );

      const data = await response.json();
      alert("User updated successfully");

  setUsers(users.map((u) => (u.id === Number(id) ? data : u)));
    } catch (error) {
      console.error("PUT error:", error);
    }
  };

  /* DELETE API */
  const deleteData = async () => {
    if (!id) {
      alert("Please enter an ID to delete");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert(`User with ID ${id} deleted`);
setUsers(users.filter((u) => u.id !== Number(id)));        setId("");
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("DELETE error:", error);
    }
  };

  return (
    <div className="app-container">
      <Labels
        id={id}
        setId={setId}
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
      />

      <Buttons
        getData={getData}
        postData={postData}
        putData={putData}
        deleteData={deleteData}
      />

      <div className="data-container">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <p><strong>Id:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ))
        ) : (
          <p>No data loaded. Click "GET Data".</p>
        )}
      </div>
    </div>
  );
};

/* ------------------ Render ------------------ */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
