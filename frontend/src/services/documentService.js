import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const uploadDocument = async (
    file,
    title
) => {
    const formData = new FormData();

    formData.append("file", file);

    if (title) {
        formData.append("title", title);
    }

    const response = await axiosInstance.post(
        API_PATHS.DOCUMENTS.UPLOAD,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getDocuments = async () => {
    const response = await axiosInstance.get(
        API_PATHS.DOCUMENTS.GET_DOCUMENTS
    );

    return response.data;
};

export const getDocumentById = async (
    id
) => {
    const response = await axiosInstance.get(
        API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(
            id
        )
    );

    return response.data;
};

export const updateDocument = async (
    id,
    data
) => {
    const response = await axiosInstance.put(
        API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(
            id
        ),
        data
    );

    return response.data;
};

export const deleteDocument = async (
    id
) => {
    const response =
        await axiosInstance.delete(
            API_PATHS.DOCUMENTS.DELETE_DOCUMENT(
                id
            )
        );

    return response.data;
};