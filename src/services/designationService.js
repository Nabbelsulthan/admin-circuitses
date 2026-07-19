import axios from "axios";
import { API_URL } from "../config";

// Get All Designations
export const getDesignations = async () => {

    const response = await axios.get(
        `${API_URL}/api/designations`
    );

    return response.data.data;

};

// Get Designations By Department
export const getDesignationsByDepartment = async (departmentId) => {

    const response = await axios.get(
        `${API_URL}/api/designations/department/${departmentId}`
    );

    return response.data.data;

};

// Create Designation
export const createDesignation = async (designation) => {

    const response = await axios.post(
        `${API_URL}/api/designations`,
        designation
    );

    return response.data.data;

};