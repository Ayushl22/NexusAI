import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const login = async (email, password) => {
    const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email, password }
    );

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );
    }

    return response.data;
};

export const register = async (
    username,
    email,
    password
) => {
    const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
            username,
            email,
            password,
        }
    );

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );
    }

    return response.data;
};

export const getProfile = async () => {
    const response = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE
    );

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        data
    );

    return response.data;
};

export const changePassword = async (
    currentPassword,
    newPassword
) => {
    const response = await axiosInstance.put(
        API_PATHS.AUTH.CHANGE_PASSWORD,
        {
            currentPassword,
            newPassword,
        }
    );

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};