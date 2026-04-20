import apiClient from "./apiClient";

const DOCUMENT_CACHE_PREFIX = "metrobridge_documents_cache";
const DOCUMENT_CACHE_TTL_MS = 3 * 60 * 1000;

const normalizeDocument = (doc) => ({
  id: doc?._id || doc?.id,
  title: doc?.title || "",
  description: doc?.description || "",
  category: doc?.category || "resources",
  subject: doc?.subject || "",
  department: doc?.department || "",
  fileUrl: doc?.fileUrl || "",
  fileName: doc?.fileName || "",
  fileType: doc?.fileType || "",
  uploadedBy: {
    id: doc?.uploadedBy?._id || doc?.uploadedBy?.id,
    name: doc?.uploadedBy?.fullName || doc?.uploadedBy?.name || "Unknown",
  },
  downloads: doc?.downloads || 0,
  uploadedAt: doc?.createdAt || doc?.uploadedAt || new Date().toISOString(),
});

const getCacheKey = (params = {}) =>
  JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );

const readCachedDocuments = (cacheKey) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(
      `${DOCUMENT_CACHE_PREFIX}:${cacheKey}`,
    );
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !Array.isArray(parsed?.documents)) {
      return null;
    }

    if (Date.now() - parsed.timestamp > DOCUMENT_CACHE_TTL_MS) {
      return null;
    }

    return parsed.documents;
  } catch {
    return null;
  }
};

const writeCachedDocuments = (cacheKey, documents) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      `${DOCUMENT_CACHE_PREFIX}:${cacheKey}`,
      JSON.stringify({
        timestamp: Date.now(),
        documents,
      }),
    );
  } catch {
    // Ignore cache write failures.
  }
};

export async function fetchDocuments(params = {}, options = {}) {
  const cacheKey = getCacheKey(params);

  if (!options.forceRefresh) {
    const cachedDocuments = readCachedDocuments(cacheKey);
    if (cachedDocuments) {
      return cachedDocuments;
    }
  }

  const response = await apiClient.get("/documents", { params });
  const documents = (response.data?.data || []).map(normalizeDocument);

  writeCachedDocuments(cacheKey, documents);

  return documents;
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
