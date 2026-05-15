import api from "../api";

export const getAllTickets = () => api.get("/api/tickets/");

export const getTicketById = (id) => api.get(`/api/tickets/${id}`);

export const createTicket = (data) => api.post("/api/tickets/", data);

export const updateTicket = (id, data) => api.put(`/api/tickets/${id}`, data);

export const getTicketActivities = (id) => api.get(`/api/tickets/${id}/activities`);

export const deleteTicket = (id) => api.delete(`/api/tickets/${id}`);

export const searchTickets = ({ keyword, category, status }) => {
  const params = new URLSearchParams();
  if (keyword)  params.append("keyword", keyword);
  if (category) params.append("category", category);
  if (status)   params.append("status", status);
  return api.get(`/api/search?${params.toString()}`);
};
