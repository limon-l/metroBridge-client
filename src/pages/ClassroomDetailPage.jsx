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
  fetchAssignmentSubmissions,
  fetchClassroomAssignments,
  fetchClassroomById,
  fetchClassroomMaterials,
  fetchClassroomNotices,
  fetchMyClassroomSubmissions,
  gradeSubmission,
  submitAssignment,
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

export default function ClassroomDetailPage() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showToast } = useToast();

  const canTeach = role === "mentor" || role === "teacher" || role === "admin";
  const isStudent = role === "student";

  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});

  const [reviewAssignmentId, setReviewAssignmentId] = useState("");
  const [reviewSubmissions, setReviewSubmissions] = useState([]);

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
  });
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
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
      });
      showToast("Assignment created");
    } catch (error) {
      showToast(error.message || "Failed to create assignment", "error");
    }
  };

  const handleCreateMaterial = async (event) => {
    event.preventDefault();
    try {
      const created = await createClassroomMaterial(classroomId, materialForm);
      setMaterials((previous) => [created, ...previous]);
      setMaterialForm({ title: "", description: "", fileUrl: "" });
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

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>{classroom?.name || "Classroom"}</h2>
            <p className="mt-2 text-small text-neutral">
              {classroom?.description || "No description provided."}
            </p>
            {canTeach && classroom?.joinCode ? (
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
          <div className="mt-4 space-y-3">
            {assignments.length === 0 ? (
              <p className="text-small text-neutral">No assignments yet.</p>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment._id} className="border-border/80 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-primary">
                        {assignment.title}
                      </h4>
                      <p className="text-small text-neutral">
                        Due: {formatDate(assignment.dueDate)} | Max:{" "}
                        {assignment.maxPoints}
                      </p>
                    </div>
                    {canTeach ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleLoadSubmissions(assignment._id)}>
                        Review submissions
                      </Button>
                    ) : null}
                  </div>
                  <p className="mt-2 text-small text-neutral">
                    {assignment.description}
                  </p>

                  {isStudent ? (
                    <StudentSubmissionForm
                      assignmentId={assignment._id}
                      existingSubmission={mySubmissions[assignment._id]}
                      onSubmit={handleSubmitAssignment}
                    />
                  ) : null}
                </Card>
              ))
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
                  placeholder="File URL"
                  required
                  value={materialForm.fileUrl}
                  onChange={(event) =>
                    setMaterialForm((previous) => ({
                      ...previous,
                      fileUrl: event.target.value,
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
                  <a
                    key={item._id}
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-card border border-border p-3 text-small hover:border-primary">
                    <p className="font-semibold text-primary">{item.title}</p>
                    <p className="text-xs text-neutral">{item.description}</p>
                  </a>
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
                <Button className="w-full" type="submit">
                  Publish assignment
                </Button>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StudentSubmissionForm({ assignmentId, existingSubmission, onSubmit }) {
  const [textSubmission, setTextSubmission] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    setTextSubmission(existingSubmission?.textSubmission || "");
    setFileUrl(existingSubmission?.fileUrl || "");
  }, [existingSubmission]);

  const isSubmitted = Boolean(existingSubmission);

  return (
    <form
      className="mt-3 space-y-2 border-t border-border pt-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (isSubmitted) {
          return;
        }
        onSubmit(assignmentId, { textSubmission, fileUrl });
      }}>
      <textarea
        className="w-full rounded-card border border-border px-3 py-2 text-small"
        placeholder="Write your answer"
        value={textSubmission}
        disabled={isSubmitted}
        onChange={(event) => setTextSubmission(event.target.value)}
      />
      <input
        className="w-full rounded-card border border-border px-3 py-2 text-small"
        placeholder="File link"
        value={fileUrl}
        disabled={isSubmitted}
        onChange={(event) => setFileUrl(event.target.value)}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral">
          {isSubmitted
            ? `Submitted at ${formatDate(existingSubmission.submittedAt)}`
            : "You can submit only once"}
        </p>
        <Button size="sm" type="submit" disabled={isSubmitted}>
          {isSubmitted ? "Submitted" : "Submit"}
        </Button>
      </div>
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
