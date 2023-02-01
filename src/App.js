import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import moment from "moment";

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

    ul {
        list-style: none;
        padding: 0;

        li {
            margin: 10px 0px;
        }
    }
`;

const Messages = styled.div`
    background-color: lightgrey;
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    color: black;

    > div {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        > div {
            display: flex;
            gap: 20px;
        }
    }

    p {
        margin: 10px 0px;
    }
`;

const App = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    const submitMessage = (e) => {
        e.preventDefault();
        socket.emit("message-sent", message);
        setMessage("");
    };

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

        socket.on("message-received", (message) => {
            setMessages((messages) => {
                return [...messages, message];
            });
        });
    }, []);

    return (
        <StyledDiv>
            <div>
                <ChatBox>
                    <h1>Messages</h1>
                    <Messages>
                        <div>
                            {messages &&
                                messages.map((message, idx) => (
                                    <div key={idx}>
                                        <p>
                                            {moment(message.date).format(
                                                "h:mm:ss a"
                                            )}
                                        </p>
                                        <p>{message.user.name}</p>
                                        <p>{message.message}</p>
                                    </div>
                                ))}
                        </div>
                    </Messages>
                    <form onSubmit={(e) => submitMessage(e)}>
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
                            {users &&
                                users.map((user) => (
                                    <li key={user.id}>{user.name}</li>
                                ))}
                        </ul>
                    </div>
                </UserBox>
            </div>
        </StyledDiv>
    );
};

export default App;
