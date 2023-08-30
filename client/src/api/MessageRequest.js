import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const getMessages = (chatId) => axios.get(`/message/${chatId}`);

export const addMessage = (msg) => API.post('/message', msg)