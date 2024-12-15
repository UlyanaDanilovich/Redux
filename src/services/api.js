import { get, post, put, remove } from "./index";
import { API_URL } from "../constants";

export const getUsers = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await get(`${API_URL}/users?${query}`);
};

export const postUser = async (body) => {
  return await post(`${API_URL}/users`, body);
};

export const getNotes = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await get(`${API_URL}/notes?${query}`);
};

export const postNote = async (body) => {
  return await post(`${API_URL}/notes`, body);
};

export const updateNote = async (id, body) => {
  return await put(`${API_URL}/notes/${id}`, body);
};

export const removeNote = async (id) => {
  return await remove(`${API_URL}/notes/${id}`);
};