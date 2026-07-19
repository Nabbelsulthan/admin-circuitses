import axios from "axios";
import { API_URL } from "../config";

// Get All Departments
export const getDepartments = async () => {

    const response = await axios.get(
        `${API_URL}/api/departments`
    );

    return response.data.data;

};

// Create Department
export const createDepartment = async (department) => {

    const response = await axios.post(
        `${API_URL}/api/departments`,
        department
    );

    return response.data.data;

};

// Update Department
export const updateDepartment = async (id, department) => {

    const response = await axios.put(
        `${API_URL}/api/departments/${id}`,
        department
    );

    return response.data.data;

};

// Delete Department
export const deleteDepartment = async (id) => {

    const response = await axios.delete(
        `${API_URL}/api/departments/${id}`
    );

    return response.data;

};