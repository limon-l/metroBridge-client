import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Dropdown from "../components/ui/Dropdown";
import EmptyState from "../components/ui/EmptyState";
import InputField from "../components/ui/InputField";
import MotionReveal from "../components/ui/MotionReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../hooks/useToast";
import { departments } from "../utils/constants";
import { mentors } from "../utils/mockData";

export default function MentorSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [course, setCourse] = useState("All");
  const [expertise, setExpertise] = useState("All");
  const { showToast } = useToast();

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const byQuery =
        !query || mentor.name.toLowerCase().includes(query.toLowerCase());
      const byDept = department === "All" || mentor.department === department;
      const byCourse =
        course === "All" ||
        mentor.expertise.toLowerCase().includes(course.toLowerCase());
      const byExpertise =
        expertise === "All" ||
        mentor.expertise.toLowerCase().includes(expertise.toLowerCase());
      return byQuery && byDept && byCourse && byExpertise;
    });
  }, [course, department, expertise, query]);

  return (
    <div className="space-y-6">
      <MotionReveal y={16}>
        <Card className="border-primary/10 bg-gradient-to-br from-white via-white to-primary/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-small font-semibold uppercase tracking-wide text-primary">
                Registered mentors
              </p>
              <h2 className="mt-1">Find the right mentor for your session</h2>
              <p className="mt-2 max-w-2xl text-small text-neutral">
                Browse every registered mentor, refine by department or skill,
                and book a modern, guided session in one flow.
              </p>
            </div>
            <Badge variant="accent" className="w-fit">
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              {mentors.length} mentors available
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <InputField
              label="Search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              value={query}
            />
            <Dropdown
              label="Department"
              onChange={(event) => setDepartment(event.target.value)}
              options={departments.map((item) => ({
                label: item,
                value: item,
              }))}
              value={department}
            />
            <Dropdown
              label="Course"
              onChange={(event) => setCourse(event.target.value)}
              options={[
                { label: "All", value: "All" },
                { label: "Data Structures", value: "Data" },
                { label: "Circuits", value: "Circuit" },
              ]}
              value={course}
            />
            <Dropdown
              label="Expertise"
              onChange={(event) => setExpertise(event.target.value)}
              options={[
                { label: "All", value: "All" },
                { label: "Career", value: "Career" },
                { label: "React", value: "React" },
              ]}
              value={expertise}
            />
          </div>
        </Card>
      </MotionReveal>

      {filteredMentors.length === 0 ? (
        <EmptyState
          description="Try changing filters to discover more mentors."
          title="No mentors found"
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMentors.map((mentor, index) => (
            <MotionReveal delay={index * 70} key={mentor.id} y={16}>
              <Card className="card-hover flex h-full flex-col border-border/80 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary-light to-accent text-sm font-semibold text-white shadow-sm">
                      {mentor.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-body font-semibold text-primary">
                        {mentor.name}
                      </h3>
                      <p className="text-small text-neutral">
                        {mentor.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    {mentor.rating}
                  </Badge>
                </div>
                <p className="mt-4 text-small text-neutral">
                  {mentor.expertise}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="accent">Available today</Badge>
                  <Badge>Video call</Badge>
                </div>
                <Button
                  className="mt-5 w-full"
                  onClick={() =>
                    navigate("/student/booking", {
                      state: { mentor },
                    })
                  }
                  variant="cta">
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  Book Session
                </Button>
              </Card>
            </MotionReveal>
          ))}
        </section>
      )}
    </div>
  );
}
