import axios from "axios";
import { API_URL } from "../config";

export const getEmployees = async () => {

    const response = await axios.get(
        `${API_URL}/api/employees`
    );

    return response.data.data;
};

export const createEmployee = async (employee) => {

    const response = await axios.post(
        `${API_URL}/api/employees`,
        employee
    );

    return response.data.data;
};

export const updateEmployee = async (id, employee) => {

    const response = await axios.put(
        `${API_URL}/api/employees/${id}`,
        employee
    );

    return response.data.data;
};

export const deleteEmployee = async (id) => {

    const response = await axios.delete(
        `${API_URL}/api/employees/${id}`
    );

    return response.data;
};