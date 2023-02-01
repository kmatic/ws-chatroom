import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";

const username = prompt("What is your username");

const socket = io("ws://localhost:5000");

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;

  & > div {
    display: flex;
    gap: 20px;
  }
`;

const ChatBox = styled.div`
  background-color: rgb(51 65 85);
  padding: 20px;
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  input {
    width: 50%;
    padding: 6px;
  }

  button {
    padding: 6px 15px;
  }
`;

const UserBox = styled.div`
  background-color: rgb(51 65 85);
  padding: 20px;
  width: 200px;
`;

const Messages = styled.div`
  background-color: lightgrey;
  width: 100%;bob

  height: 400px;
`;

const App = () => {
  const [messages, SetMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      socket.emit("username-provided", username);
    });

    socket.on("connected", (users) => {
      setUsers(users);
    });

    socket.on("disconnected", (id) => {
      setUsers((users) => {
        return users.filter((user) => user.id !== id);
      });
    });
  }, []);

  return (
    <StyledDiv>
      <div>
        <ChatBox>
          <h1>Messages</h1>
          <Messages></Messages>
          <form>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button>Send</button>
          </form>
        </ChatBox>
        <UserBox>
          <h1>Users</h1>
          <div>
            <ul>
              {users && users.map((user) => <li key={user.id}>{user.name}</li>)}
            </ul>
          </div>
        </UserBox>
      </div>
    </StyledDiv>
  );
};

export default App;
