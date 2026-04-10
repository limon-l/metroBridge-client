import apiClient from "./apiClient";

export async function createClassroom(payload) {
  const response = await apiClient.post("/classrooms", payload);
  return response.data?.data;
}

export async function fetchMyClassrooms() {
  const response = await apiClient.get("/classrooms/my");
  return response.data?.data || [];
}

export async function fetchClassroomById(classroomId) {
  const response = await apiClient.get(`/classrooms/${classroomId}`);
  return response.data?.data || null;
}

export async function cloneClassroom(classroomId) {
  const response = await apiClient.post(`/classrooms/${classroomId}/clone`);
  return response.data?.data;
}

export async function joinClassroomByCode(joinCode) {
  const response = await apiClient.post("/classrooms/join", { joinCode });
  return response.data?.data;
}

export async function fetchClassroomAssignments(classroomId) {
  const response = await apiClient.get(
    `/classrooms/${classroomId}/assignments`,
  );
  return response.data?.data || [];
}

export async function fetchClassroomMaterials(classroomId) {
  const response = await apiClient.get(`/classrooms/${classroomId}/materials`);
  return response.data?.data || [];
}

export async function createClassroomMaterial(classroomId, payload) {
  const formData = new FormData();
  formData.append("title", payload.title || "");
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.file) {
    formData.append("file", payload.file);
  }
  if (payload.fileUrl) {
    formData.append("fileUrl", payload.fileUrl);
  }

  const response = await apiClient.post(
    `/classrooms/${classroomId}/materials`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data?.data;
}

export async function fetchClassroomNotices(classroomId) {
  const response = await apiClient.get(`/classrooms/${classroomId}/notices`);
  return response.data?.data || [];
}

export async function createClassroomNotice(classroomId, payload) {
  const response = await apiClient.post(
    `/classrooms/${classroomId}/notices`,
    payload,
  );
  return response.data?.data;
}

export async function fetchMyClassroomSubmissions(classroomId) {
  const response = await apiClient.get(
    `/classrooms/${classroomId}/submissions/me`,
  );
  return response.data?.data || [];
}

export async function createAssignment(classroomId, payload) {
  // If there's a file, use FormData for multipart request
  if (payload.file) {
    const formData = new FormData();
    formData.append("title", payload.title || "");
    if (payload.description) {
      formData.append("description", payload.description);
    }
    formData.append("dueDate", payload.dueDate);
    if (payload.maxPoints) {
      formData.append("maxPoints", payload.maxPoints);
    }
    formData.append("file", payload.file);

    const response = await apiClient.post(
      `/classrooms/${classroomId}/assignments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data?.data;
  }

  // Regular JSON request if no file
  const response = await apiClient.post(
    `/classrooms/${classroomId}/assignments`,
    payload,
  );
  return response.data?.data;
}

export async function submitAssignment(assignmentId, payload) {
  // If there's a file, use FormData for multipart request
  if (payload.file) {
    const formData = new FormData();
    if (payload.textSubmission) {
      formData.append("textSubmission", payload.textSubmission);
    }
    formData.append("file", payload.file);

    const response = await apiClient.post(
      `/assignments/${assignmentId}/submission`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data?.data;
  }

  // Regular JSON request if no file
  const response = await apiClient.post(
    `/assignments/${assignmentId}/submission`,
    payload,
  );
  return response.data?.data;
}

export async function fetchMySubmission(assignmentId) {
  const response = await apiClient.get(
    `/assignments/${assignmentId}/submission/me`,
  );
  return response.data?.data || null;
}

export async function withdrawMySubmission(assignmentId) {
  const response = await apiClient.delete(
    `/assignments/${assignmentId}/submission/me`,
  );
  return response.data?.data || null;
}

export async function fetchAssignmentSubmissions(assignmentId) {
  const response = await apiClient.get(
    `/assignments/${assignmentId}/submissions`,
  );
  return response.data?.data || [];
}

export async function gradeSubmission(submissionId, payload) {
  const response = await apiClient.patch(
    `/submissions/${submissionId}/grade`,
    payload,
  );
  return response.data?.data;
}

export async function updateAssignment(assignmentId, payload) {
  // If there's a file, use FormData for multipart request
  if (payload.file) {
    const formData = new FormData();
    if (payload.title) {
      formData.append("title", payload.title);
    }
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.dueDate) {
      formData.append("dueDate", payload.dueDate);
    }
    if (payload.maxPoints) {
      formData.append("maxPoints", payload.maxPoints);
    }
    formData.append("file", payload.file);

    const response = await apiClient.patch(
      `/assignments/${assignmentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data?.data;
  }

  // Regular JSON request if no file
  const response = await apiClient.patch(
    `/assignments/${assignmentId}`,
    payload,
  );
  return response.data?.data;
}

export async function deleteAssignment(assignmentId) {
  const response = await apiClient.delete(`/assignments/${assignmentId}`);
  return response.data;
}

export async function deleteClassroomMaterial(classroomId, materialId) {
  const response = await apiClient.delete(
    `/classrooms/${classroomId}/materials/${materialId}`,
  );
  return response.data;
}
