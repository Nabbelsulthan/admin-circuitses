import axios from "axios";
import { API_URL } from "../config";

// Get Attendance
export const getAttendance = async () => {

    const response = await axios.get(
        `${API_URL}/api/attendance`
    );

    return response.data.data;

};

// Create Attendance
export const createAttendance = async (attendance) => {

    const response = await axios.post(
        `${API_URL}/api/attendance`,
        attendance
    );

    return response.data.data;

};