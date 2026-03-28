import { useMemo, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Dropdown from "../components/ui/Dropdown";
import EmptyState from "../components/ui/EmptyState";
import InputField from "../components/ui/InputField";
import MotionReveal from "../components/ui/MotionReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../hooks/useToast";
import { departments } from "../utils/constants";
import { mentors } from "../utils/mockData";

export default function MentorSearchPage() {
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
        <Card>
          <h2>Find your mentor</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
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
              <Card className="card-hover p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
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
                <Button
                  className="mt-5 w-full"
                  onClick={() => showToast("Session booking initiated.")}
                  variant="cta">
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
