import apiClient from "./apiClient";

const normalizeDocument = (doc) => ({
  id: doc?._id || doc?.id,
  title: doc?.title || "",
  description: doc?.description || "",
  category: doc?.category || "resources",
  fileUrl: doc?.fileUrl || "",
  uploadedBy: {
    id: doc?.uploadedBy?._id || doc?.uploadedBy?.id,
    name: doc?.uploadedBy?.fullName || doc?.uploadedBy?.name || "Unknown",
  },
  downloads: doc?.downloads || 0,
  uploadedAt: doc?.createdAt || doc?.uploadedAt || new Date().toISOString(),
});

export async function fetchDocuments(params = {}) {
  const response = await apiClient.get("/documents", { params });
  return (response.data?.data || []).map(normalizeDocument);
}

export async function uploadDocument(payload) {
  const response = await apiClient.post("/documents", payload);
  return normalizeDocument(response.data?.data || {});
}

export async function incrementDocumentDownload(documentId) {
  const response = await apiClient.patch(`/documents/${documentId}/download`);
  return normalizeDocument(response.data?.data || {});
}

export async function deleteDocument(documentId) {
  await apiClient.delete(`/documents/${documentId}`);
}
