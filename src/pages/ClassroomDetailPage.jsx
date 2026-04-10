import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  createAssignment,
  createClassroomMaterial,
  createClassroomNotice,
  deleteAssignment,
  deleteClassroomMaterial,
  fetchAssignmentSubmissions,
  fetchClassroomAssignments,
  fetchClassroomById,
  fetchClassroomMaterials,
  fetchClassroomNotices,
  fetchMyClassroomSubmissions,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
  withdrawMySubmission,
} from "../services/classroomService";

function formatDate(value) {
  if (!value) {
    return "N/A";
  }
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function calculateCountdown(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOverdue: false };
}

function getAssignmentStatus(dueDate, existingSubmission) {
  const now = new Date();
  const due = new Date(dueDate);

  if (existingSubmission?.gradeStatus === "graded") {
    return { label: "Graded", color: "bg-green-100 text-green-700" };
  }

  if (existingSubmission) {
    return { label: "Submitted", color: "bg-blue-100 text-blue-700" };
  }

  if (now > due) {
    return { label: "Overdue", color: "bg-red-100 text-red-700" };
  }

  const hoursLeft = (due - now) / (1000 * 60 * 60);
  if (hoursLeft < 24) {
    return { label: "Due soon", color: "bg-yellow-100 text-yellow-700" };
  }

  return { label: "Active", color: "bg-blue-100 text-blue-700" };
}

export default function ClassroomDetailPage() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showToast } = useToast();

  const canTeach = role === "mentor" || role === "teacher" || role === "admin";
  const canViewJoinCode = role === "mentor";
  const isStudent = role === "student";

  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});

  const [reviewAssignmentId, setReviewAssignmentId] = useState("");
  const [reviewSubmissions, setReviewSubmissions] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editAssignmentForm, setEditAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    file: null,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    file: null,
  });
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
  });

  const roleBasePath = useMemo(() => {
    if (role === "mentor") {
      return "/mentor";
    }
    if (role === "admin") {
      return "/admin";
    }
    return "/student";
  }, [role]);

  useEffect(() => {
    const loadClassroom = async () => {
      try {
        const data = await fetchClassroomById(classroomId);
        setClassroom(data);
      } catch (error) {
        showToast(error.message || "Failed to load classroom", "error");
      }
    };

    loadClassroom();
  }, [classroomId]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const [assignmentItems, materialItems, noticeItems] = await Promise.all(
          [
            fetchClassroomAssignments(classroomId),
            fetchClassroomMaterials(classroomId),
            fetchClassroomNotices(classroomId),
          ],
        );

        setAssignments(assignmentItems);
        setMaterials(materialItems);
        setNotices(noticeItems);
      } catch (error) {
        showToast(
          error.message || "Failed to load classroom resources",
          "error",
        );
      }
    };

    loadCollections();
  }, [classroomId]);

  useEffect(() => {
    const loadMySubmissions = async () => {
      if (!isStudent) {
        setMySubmissions({});
        return;
      }

      try {
        const items = await fetchMyClassroomSubmissions(classroomId);
        const mapped = items.reduce((accumulator, item) => {
          const assignmentId = item?.assignment?._id || item?.assignment;
          if (assignmentId) {
            accumulator[assignmentId] = item;
          }
          return accumulator;
        }, {});
        setMySubmissions(mapped);
      } catch {
        setMySubmissions({});
      }
    };

    loadMySubmissions();
  }, [classroomId, isStudent]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      assignments.forEach((assignment) => {
        newCountdowns[assignment._id] = calculateCountdown(assignment.dueDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [assignments]);

  const handleCreateAssignment = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...assignmentForm,
        dueDate: new Date(assignmentForm.dueDate).toISOString(),
      };
      const created = await createAssignment(classroomId, payload);
      setAssignments((previous) => [created, ...previous]);
      setAssignmentForm({
        title: "",
        description: "",
        dueDate: "",
        maxPoints: 100,
        file: null,
      });
      showToast("Assignment created");
    } catch (error) {
      showToast(error.message || "Failed to create assignment", "error");
    }
  };

  const handleCreateMaterial = async (event) => {
    event.preventDefault();
    if (!materialForm.file) {
      showToast("Please choose a file to upload", "error");
      return;
    }

    try {
      const created = await createClassroomMaterial(classroomId, materialForm);
      setMaterials((previous) => [created, ...previous]);
      setMaterialForm({ title: "", description: "", file: null });
      showToast("Material uploaded");
    } catch (error) {
      showToast(error.message || "Failed to upload material", "error");
    }
  };

  const handleCreateNotice = async (event) => {
    event.preventDefault();
    try {
      const created = await createClassroomNotice(classroomId, noticeForm);
      setNotices((previous) => [created, ...previous]);
      setNoticeForm({ title: "", content: "" });
      showToast("Notice published");
    } catch (error) {
      showToast(error.message || "Failed to post notice", "error");
    }
  };

  const handleSubmitAssignment = async (assignmentId, payload) => {
    try {
      const created = await submitAssignment(assignmentId, payload);
      setMySubmissions((previous) => ({
        ...previous,
        [assignmentId]: created,
      }));
      showToast("Assignment submitted");
    } catch (error) {
      showToast(error.message || "Submission failed", "error");
    }
  };

  const handleWithdrawAssignment = async (assignmentId) => {
    try {
      await withdrawMySubmission(assignmentId);
      setMySubmissions((previous) => {
        const next = { ...previous };
        delete next[assignmentId];
        return next;
      });
      showToast("Submission withdrawn");
    } catch (error) {
      showToast(error.message || "Withdraw failed", "error");
    }
  };

  const handleLoadSubmissions = async (assignmentId) => {
    setReviewAssignmentId(assignmentId);
    try {
      const items = await fetchAssignmentSubmissions(assignmentId);
      setReviewSubmissions(items);
    } catch (error) {
      showToast(error.message || "Failed to load submissions", "error");
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      const updated = await gradeSubmission(submissionId, {
        grade: Number(grade),
        feedback,
      });
      setReviewSubmissions((previous) =>
        previous.map((item) => (item._id === updated._id ? updated : item)),
      );
      showToast("Grade saved");
    } catch (error) {
      showToast(error.message || "Failed to grade", "error");
    }
  };

  const handleEditAssignmentOpen = (assignment) => {
    setEditingAssignmentId(assignment._id);
    setEditAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
      maxPoints: assignment.maxPoints,
    });
  };

  const handleUpdateAssignment = async (event) => {
    event.preventDefault();
    if (!editingAssignmentId) return;

    try {
      const payload = {
        ...editAssignmentForm,
        dueDate: new Date(editAssignmentForm.dueDate).toISOString(),
      };
      const updated = await updateAssignment(editingAssignmentId, payload);
      setAssignments((previous) =>
        previous.map((item) => (item._id === updated._id ? updated : item)),
      );
      setEditingAssignmentId(null);
      setEditAssignmentForm({
        title: "",
        description: "",
        dueDate: "",
        maxPoints: 100,
        file: null,
      });
      showToast("Assignment updated");
    } catch (error) {
      showToast(error.message || "Failed to update assignment", "error");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssignment(assignmentId);
      setAssignments((previous) =>
        previous.filter((item) => item._id !== assignmentId),
      );
      showToast("Assignment deleted");
    } catch (error) {
      showToast(error.message || "Failed to delete assignment", "error");
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteClassroomMaterial(classroomId, materialId);
      setMaterials((previous) =>
        previous.filter((item) => item._id !== materialId),
      );
      showToast("Material deleted");
    } catch (error) {
      showToast(error.message || "Failed to delete material", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>{classroom?.name || "Classroom"}</h2>
            <p className="mt-2 text-small text-neutral">
              {classroom?.description || "No description provided."}
            </p>
            {canViewJoinCode && classroom?.joinCode ? (
              <p className="mt-2 text-small font-semibold text-primary">
                Join code: {classroom.joinCode}
              </p>
            ) : null}
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate(`${roleBasePath}/classroom`)}>
            Back to classrooms
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h3>Assignments</h3>
          <div className="mt-4 space-y-4">
            {assignments.length === 0 ? (
              <p className="text-small text-neutral">No assignments yet.</p>
            ) : (
              assignments.map((assignment) => {
                const countdown = countdowns[assignment._id];
                const submission = mySubmissions[assignment._id];
                const status = getAssignmentStatus(
                  assignment.dueDate,
                  submission,
                );

                return (
                  <Card
                    key={assignment._id}
                    className="assignment-card relative border-border/80 bg-gradient-to-br from-transparent to-blue-50/30 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50">
                    {/* Mark Badge - Top Right Corner */}
                    {submission?.gradeStatus === "graded" ? (
                      <div className="absolute right-4 top-4 flex flex-col items-center gap-1">
                        <div className="grade-badge flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                          <span className="text-xl font-bold text-white">
                            {submission.grade}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-green-700">
                          {submission.grade}/{assignment.maxPoints}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute right-4 top-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold transition-all ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="pr-24">
                      <h4 className="font-semibold text-primary">
                        {assignment.title}
                      </h4>
                      <p className="mt-1 text-small text-neutral">
                        {assignment.description}
                      </p>

                      {/* Attachment Link */}
                      {assignment.attachmentUrl && (
                        <div className="mt-2">
                          <a
                            href={assignment.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                            <span>📎</span>
                            <span>
                              {assignment.attachmentName ||
                                "Download attachment"}
                            </span>
                          </a>
                        </div>
                      )}

                      {/* Deadline and Countdown */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border/30 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-neutral">
                            Due:
                          </span>
                          <span className="font-semibold text-primary">
                            {new Date(assignment.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        {/* Countdown Timer */}
                        {countdown && !countdown.isOverdue ? (
                          <div className="flex gap-2">
                            {countdown.days > 0 && (
                              <div className="flex flex-col items-center gap-0.5 rounded-lg bg-blue-100 px-2 py-1">
                                <span className="text-xs font-bold text-blue-700">
                                  {countdown.days}
                                </span>
                                <span className="text-xs text-blue-600">d</span>
                              </div>
                            )}
                            {countdown.hours > 0 && (
                              <div className="flex flex-col items-center gap-0.5 rounded-lg bg-blue-100 px-2 py-1">
                                <span className="text-xs font-bold text-blue-700">
                                  {countdown.hours}
                                </span>
                                <span className="text-xs text-blue-600">h</span>
                              </div>
                            )}
                            {(countdown.days > 0 || countdown.hours > 0) && (
                              <div className="flex flex-col items-center gap-0.5 rounded-lg bg-blue-100 px-2 py-1">
                                <span className="text-xs font-bold text-blue-700">
                                  {countdown.minutes}
                                </span>
                                <span className="text-xs text-blue-600">m</span>
                              </div>
                            )}
                            {countdown.days === 0 &&
                              countdown.hours === 0 &&
                              countdown.minutes < 60 && (
                                <div className="countdown-last flex flex-col items-center gap-0.5 rounded-lg bg-red-100 px-2 py-1">
                                  <span className="text-xs font-bold text-red-700">
                                    {countdown.minutes}:
                                    {String(countdown.seconds).padStart(2, "0")}
                                  </span>
                                  <span className="text-xs text-red-600">
                                    last
                                  </span>
                                </div>
                              )}
                          </div>
                        ) : countdown?.isOverdue ? (
                          <div className="rounded-lg bg-red-100 px-3 py-1">
                            <span className="text-xs font-bold text-red-700">
                              OVERDUE
                            </span>
                          </div>
                        ) : null}

                        <span className="text-xs text-neutral">
                          Max: {assignment.maxPoints} points
                        </span>
                      </div>
                    </div>

                    {/* Submission Form */}
                    {isStudent ? (
                      <StudentSubmissionForm
                        assignmentId={assignment._id}
                        assignmentDueDate={assignment.dueDate}
                        existingSubmission={submission}
                        onSubmit={handleSubmitAssignment}
                        onWithdraw={handleWithdrawAssignment}
                      />
                    ) : null}

                    {/* Teacher Review Button */}
                    {canTeach ? (
                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleLoadSubmissions(assignment._id)}>
                          Review submissions
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditAssignmentOpen(assignment)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleDeleteAssignment(assignment._id)
                          }>
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </Card>
                );
              })
            )}
          </div>

          {canTeach && reviewAssignmentId ? (
            <div className="mt-6 space-y-3 border-t border-border pt-4">
              <h4 className="font-semibold text-primary">Submission review</h4>
              {reviewSubmissions.length === 0 ? (
                <p className="text-small text-neutral">No submissions yet.</p>
              ) : (
                reviewSubmissions.map((submission) => (
                  <TeacherSubmissionReview
                    key={submission._id}
                    submission={submission}
                    onGrade={handleGradeSubmission}
                  />
                ))
              )}
            </div>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <h3>Materials</h3>
            {canTeach ? (
              <form className="mt-3 space-y-2" onSubmit={handleCreateMaterial}>
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Material title"
                  required
                  value={materialForm.title}
                  onChange={(event) =>
                    setMaterialForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                />
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  required
                  onChange={(event) =>
                    setMaterialForm((previous) => ({
                      ...previous,
                      file: event.target.files?.[0] || null,
                    }))
                  }
                />
                <textarea
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Description"
                  value={materialForm.description}
                  onChange={(event) =>
                    setMaterialForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                />
                <Button className="w-full" type="submit">
                  Upload material
                </Button>
              </form>
            ) : null}

            <div className="mt-4 space-y-2">
              {materials.length === 0 ? (
                <p className="text-small text-neutral">No materials yet.</p>
              ) : (
                materials.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between gap-3 rounded-card border border-border p-3">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1">
                      <p className="font-semibold text-primary hover:underline">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral">{item.description}</p>
                      {item.fileName ? (
                        <p className="text-xs text-neutral">
                          File: {item.fileName}
                        </p>
                      ) : null}
                    </a>
                    {canTeach ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDeleteMaterial(item._id)}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3>Notices</h3>
            {canTeach ? (
              <form className="mt-3 space-y-2" onSubmit={handleCreateNotice}>
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Notice title"
                  required
                  value={noticeForm.title}
                  onChange={(event) =>
                    setNoticeForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Write notice"
                  required
                  value={noticeForm.content}
                  onChange={(event) =>
                    setNoticeForm((previous) => ({
                      ...previous,
                      content: event.target.value,
                    }))
                  }
                />
                <Button className="w-full" type="submit">
                  Post notice
                </Button>
              </form>
            ) : null}

            <div className="mt-4 space-y-2">
              {notices.length === 0 ? (
                <p className="text-small text-neutral">No notices yet.</p>
              ) : (
                notices.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-card border border-border p-3 text-small">
                    <p className="font-semibold text-primary">{item.title}</p>
                    <p className="mt-1 text-neutral">{item.content}</p>
                    <p className="mt-1 text-xs text-neutral">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {canTeach ? (
            <Card>
              <h3>Create assignment</h3>
              <form
                className="mt-3 space-y-2"
                onSubmit={handleCreateAssignment}>
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Title"
                  required
                  value={assignmentForm.title}
                  onChange={(event) =>
                    setAssignmentForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Description"
                  value={assignmentForm.description}
                  onChange={(event) =>
                    setAssignmentForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                />
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  type="datetime-local"
                  required
                  value={assignmentForm.dueDate}
                  onChange={(event) =>
                    setAssignmentForm((previous) => ({
                      ...previous,
                      dueDate: event.target.value,
                    }))
                  }
                />
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  type="number"
                  min={1}
                  value={assignmentForm.maxPoints}
                  onChange={(event) =>
                    setAssignmentForm((previous) => ({
                      ...previous,
                      maxPoints: Number(event.target.value),
                    }))
                  }
                />
                <div className="space-y-1">
                  <label className="text-xs text-neutral">
                    Attachment (optional)
                  </label>
                  <input
                    className="w-full rounded-card border border-border px-3 py-2 text-small"
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(event) =>
                      setAssignmentForm((previous) => ({
                        ...previous,
                        file: event.target.files?.[0] || null,
                      }))
                    }
                  />
                  {assignmentForm.file && (
                    <p className="text-xs text-neutral">
                      Selected: {assignmentForm.file.name}
                    </p>
                  )}
                </div>
                <Button className="w-full" type="submit">
                  Publish assignment
                </Button>
              </form>
            </Card>
          ) : null}

          {/* Edit Assignment Modal */}
          {editingAssignmentId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Card className="w-full max-w-md">
                <h3>Edit assignment</h3>
                <form
                  className="mt-3 space-y-2"
                  onSubmit={handleUpdateAssignment}>
                  <input
                    className="w-full rounded-card border border-border px-3 py-2 text-small"
                    placeholder="Title"
                    required
                    value={editAssignmentForm.title}
                    onChange={(event) =>
                      setEditAssignmentForm((previous) => ({
                        ...previous,
                        title: event.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="w-full rounded-card border border-border px-3 py-2 text-small"
                    placeholder="Description"
                    value={editAssignmentForm.description}
                    onChange={(event) =>
                      setEditAssignmentForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-card border border-border px-3 py-2 text-small"
                    type="datetime-local"
                    required
                    value={editAssignmentForm.dueDate}
                    onChange={(event) =>
                      setEditAssignmentForm((previous) => ({
                        ...previous,
                        dueDate: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-card border border-border px-3 py-2 text-small"
                    type="number"
                    min={1}
                    value={editAssignmentForm.maxPoints}
                    onChange={(event) =>
                      setEditAssignmentForm((previous) => ({
                        ...previous,
                        maxPoints: Number(event.target.value),
                      }))
                    }
                  />
                  <div className="space-y-1">
                    <label className="text-xs text-neutral">
                      Attachment (optional)
                    </label>
                    <input
                      className="w-full rounded-card border border-border px-3 py-2 text-small"
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(event) =>
                        setEditAssignmentForm((previous) => ({
                          ...previous,
                          file: event.target.files?.[0] || null,
                        }))
                      }
                    />
                    {editAssignmentForm.file && (
                      <p className="text-xs text-neutral">
                        Selected: {editAssignmentForm.file.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" type="submit">
                      Save changes
                    </Button>
                    <Button
                      className="flex-1"
                      variant="secondary"
                      type="button"
                      onClick={() => setEditingAssignmentId(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentSubmissionForm({
  assignmentId,
  assignmentDueDate,
  existingSubmission,
  onSubmit,
  onWithdraw,
}) {
  const [textSubmission, setTextSubmission] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setTextSubmission(existingSubmission?.textSubmission || "");
    setSubmissionFile(null);
  }, [existingSubmission]);

  const isSubmitted = Boolean(existingSubmission);
  const beforeDeadline = new Date() <= new Date(assignmentDueDate);
  const canWithdraw = isSubmitted && beforeDeadline;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isSubmitted && beforeDeadline) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSubmitted && beforeDeadline) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        setSubmissionFile(files[0]);
      }
    }
  };

  return (
    <form
      className="mt-3 space-y-2 border-t border-border pt-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (isSubmitted) {
          return;
        }
        if (!beforeDeadline) {
          return;
        }
        onSubmit(assignmentId, { textSubmission, file: submissionFile });
      }}>
      <div className="space-y-2">
        <textarea
          className="w-full rounded-card border border-border px-3 py-2 text-small"
          placeholder="Write your answer (optional)"
          value={textSubmission}
          disabled={isSubmitted || !beforeDeadline}
          onChange={(event) => setTextSubmission(event.target.value)}
        />

        {/* File Upload Input with Drag & Drop */}
        <div
          className={`rounded-card border-2 border-dashed px-4 py-6 text-center transition-all ${
            isSubmitted || !beforeDeadline
              ? "border-border/50 bg-neutral/5 cursor-not-allowed"
              : isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            type="file"
            id={`file-input-${assignmentId}`}
            className="hidden"
            disabled={isSubmitted || !beforeDeadline}
            onChange={(event) =>
              setSubmissionFile(event.target.files?.[0] || null)
            }
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mp3"
          />
          <label
            htmlFor={`file-input-${assignmentId}`}
            className={`block ${
              isSubmitted || !beforeDeadline ? "opacity-50" : ""
            }`}>
            <div className="mb-3 flex justify-center">
              <div className="text-4xl">{isDragging ? "⬇️" : "☁️"}</div>
            </div>
            <p className="text-small font-semibold text-primary">
              {isDragging ? "Drop here" : "Upload your submission"}
            </p>
            <p className="mt-2 text-xs text-neutral">
              {isDragging
                ? "Release to upload"
                : "Drag files here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-neutral">
              Documents (PDF, DOC, DOCX), Spreadsheets (XLS, XLSX),
              Presentations (PPT, PPTX)
            </p>
            <p className="text-xs text-neutral">
              Archives (ZIP), Images, Videos (MP4), Audio (MP3)
            </p>
            <p className="mt-2 text-xs text-neutral/70">Max 50MB</p>
            {submissionFile && (
              <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                ✓ {submissionFile.name} (
                {(submissionFile.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </label>
        </div>
      </div>

      {/* Submission Status */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral">
          {isSubmitted
            ? `Submitted at ${formatDate(existingSubmission.submittedAt)}`
            : beforeDeadline
              ? "You can submit once before deadline"
              : "Deadline passed"}
        </p>
        <Button
          size="sm"
          type="submit"
          disabled={
            isSubmitted ||
            !beforeDeadline ||
            (!textSubmission && !submissionFile)
          }>
          {isSubmitted ? "Submitted" : "Submit"}
        </Button>
      </div>

      {/* Withdraw Option */}
      {canWithdraw ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => onWithdraw(assignmentId)}>
            Withdraw submission
          </Button>
        </div>
      ) : null}

      {/* Submitted File Preview */}
      {existingSubmission?.fileUrl && (
        <div className="rounded-card border border-border bg-blue-50/50 p-3">
          <p className="text-xs font-semibold text-blue-700">
            📎 Submitted File:
          </p>
          <a
            href={existingSubmission.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-2 text-small font-semibold text-primary hover:underline">
            {existingSubmission.fileName || "View submission"}
            {existingSubmission.fileSize && (
              <span className="text-xs text-neutral">
                ({(existingSubmission.fileSize / 1024 / 1024).toFixed(2)}MB)
              </span>
            )}
          </a>
        </div>
      )}

      {/* Feedback */}
      {existingSubmission?.feedback ? (
        <p className="text-xs text-neutral">
          Feedback: {existingSubmission.feedback}
        </p>
      ) : null}
    </form>
  );
}

function TeacherSubmissionReview({ submission, onGrade }) {
  const [grade, setGrade] = useState(submission?.grade ?? "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");

  useEffect(() => {
    setGrade(submission?.grade ?? "");
    setFeedback(submission?.feedback || "");
  }, [submission]);

  return (
    <div className="rounded-card border border-border p-3">
      <p className="font-semibold text-primary">
        {submission.student?.fullName || "Student"}
      </p>
      <p className="text-xs text-neutral">
        Submitted: {formatDate(submission.submittedAt)}
      </p>
      {submission.textSubmission ? (
        <p className="mt-2 text-small text-neutral">
          {submission.textSubmission}
        </p>
      ) : null}
      {submission.fileUrl ? (
        <a
          className="mt-2 inline-block text-small font-semibold text-primary underline"
          href={submission.fileUrl}
          target="_blank"
          rel="noreferrer">
          Open file
        </a>
      ) : null}
      <form
        className="mt-3 grid gap-2 md:grid-cols-[140px_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onGrade(submission._id, grade, feedback);
        }}>
        <input
          className="rounded-card border border-border px-3 py-2 text-small"
          type="number"
          min={0}
          step="0.01"
          required
          value={grade}
          onChange={(event) => setGrade(event.target.value)}
        />
        <input
          className="rounded-card border border-border px-3 py-2 text-small"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Feedback"
        />
        <Button size="sm" type="submit">
          Save grade
        </Button>
      </form>
    </div>
  );
}
