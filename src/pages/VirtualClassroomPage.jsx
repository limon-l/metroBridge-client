import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  createClassroom,
  fetchMyClassrooms,
  joinClassroomByCode,
  cloneClassroom,
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

export default function VirtualClassroomPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classrooms, setClassrooms] = useState([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);

  const [newClassroom, setNewClassroom] = useState({
    name: "",
    description: "",
  });
  const [joinCode, setJoinCode] = useState("");

  const canTeach = role === "mentor" || role === "teacher" || role === "admin";
  const roleBasePath = useMemo(() => {
    if (role === "mentor") {
      return "/mentor";
    }
    if (role === "admin") {
      return "/admin";
    }
    return "/student";
  }, [role]);

  const isStudent = role === "student";

  useEffect(() => {
    const loadClassrooms = async () => {
      setLoadingClassrooms(true);
      try {
        const data = await fetchMyClassrooms();
        setClassrooms(data);
      } catch (error) {
        showToast(error.message || "Failed to load classrooms", "error");
      } finally {
        setLoadingClassrooms(false);
      }
    };

    loadClassrooms();
  }, []);

  const handleCreateClassroom = async (event) => {
    event.preventDefault();
    try {
      const created = await createClassroom(newClassroom);
      setClassrooms((previous) => [created, ...previous]);
      setNewClassroom({ name: "", description: "" });
      navigate(`${roleBasePath}/classroom/${created._id}`);
      showToast("Classroom created successfully");
    } catch (error) {
      showToast(error.message || "Failed to create classroom", "error");
    }
  };

  const handleJoinClassroom = async (event) => {
    event.preventDefault();
    try {
      const joined = await joinClassroomByCode(joinCode);
      setClassrooms((previous) => {
        const exists = previous.some((item) => item._id === joined._id);
        if (exists) {
          return previous;
        }
        return [joined, ...previous];
      });
      setJoinCode("");
      navigate(`${roleBasePath}/classroom/${joined._id}`);
      showToast("Joined classroom successfully");
    } catch (error) {
      showToast(error.message || "Failed to join classroom", "error");
    }
  };

  const handleCloneClassroom = async (classroomId) => {
    try {
      const cloned = await cloneClassroom(classroomId);
      setClassrooms((previous) => [cloned, ...previous]);
      showToast("Classroom cloned successfully");
    } catch (error) {
      showToast(error.message || "Failed to clone classroom", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2>Virtual Classroom</h2>
        <p className="mt-2 text-small text-neutral">
          Create and manage classroom assignments, submissions, and grading.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          {canTeach ? (
            <Card>
              <h3>Create classroom</h3>
              <form className="mt-3 space-y-3" onSubmit={handleCreateClassroom}>
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Classroom name"
                  required
                  value={newClassroom.name}
                  onChange={(event) =>
                    setNewClassroom((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="w-full rounded-card border border-border px-3 py-2 text-small"
                  placeholder="Description"
                  value={newClassroom.description}
                  onChange={(event) =>
                    setNewClassroom((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                />
                <Button className="w-full" type="submit">
                  Create classroom
                </Button>
              </form>
            </Card>
          ) : null}

          {isStudent ? (
            <Card>
              <h3>Join classroom</h3>
              <form className="mt-3 space-y-3" onSubmit={handleJoinClassroom}>
                <input
                  className="w-full rounded-card border border-border px-3 py-2 text-small uppercase"
                  maxLength={6}
                  placeholder="Enter 6-character code"
                  required
                  value={joinCode}
                  onChange={(event) =>
                    setJoinCode(event.target.value.toUpperCase())
                  }
                />
                <Button className="w-full" type="submit">
                  Join
                </Button>
              </form>
            </Card>
          ) : null}

          <Card>
            <h3>My classrooms</h3>
            {loadingClassrooms ? (
              <p className="mt-3 text-small text-neutral">
                Loading classrooms...
              </p>
            ) : classrooms.length === 0 ? (
              <p className="mt-3 text-small text-neutral">No classrooms yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom._id}
                    className="space-y-2 rounded-card border border-border bg-white px-3 py-3 text-small">
                    <p className="font-semibold text-primary">
                      {classroom.name}
                    </p>
                    {canTeach && classroom.joinCode ? (
                      <p className="text-xs text-neutral">
                        Code: {classroom.joinCode}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          navigate(`${roleBasePath}/classroom/${classroom._id}`)
                        }>
                        Open classroom
                      </Button>
                      {canTeach ? (
                        <Button
                          size="sm"
                          onClick={() => handleCloneClassroom(classroom._id)}>
                          Clone classroom
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3>How Classroom Works</h3>
            <p className="mt-2 text-small text-neutral">
              Open a classroom to view details, assignments, uploaded materials,
              and notices. Students can submit each assignment once.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
