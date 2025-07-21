import axios from "axios";

const baseUrl = "http://localhost:8000/herramientas";

export const GetTool = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}`);
        return response.data;
    } catch (error) {
        console.error('Error al cargar las herramientas:', error);
    }
};

export const UpdateTool = async (id, data) => {
    try {
        const response = await axios.put(`${baseUrl}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la herramienta:', error);
    }
};

export const CreateTool = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al crear la herramienta:', error);
    }
};

export const DeleteTool = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la herramienta:', error);
    }
};

