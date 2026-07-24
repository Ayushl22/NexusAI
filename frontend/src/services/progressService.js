// src/services/progressService.js

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

/**
 * Get dashboard statistics and analytics
 * GET /api/progress/dashboard
 */
export const getDashboard = async () => {
    const response = await axiosInstance.get(
        API_PATHS.PROGRESS.DASHBOARD
    );

    return response.data;
};

const progressService = {
    getDashboard,
};

export default progressService;