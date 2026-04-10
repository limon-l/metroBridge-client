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
  const response = await apiClient.post(
    `/classrooms/${classroomId}/materials`,
    payload,
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
  const response = await apiClient.post(
    `/classrooms/${classroomId}/assignments`,
    payload,
  );
  return response.data?.data;
}

export async function submitAssignment(assignmentId, payload) {
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
