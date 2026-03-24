import { useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { courses } from "../utils/mockData";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId) || courses[0];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>{course.title}</h2>
            <p className="mt-2 text-small text-neutral">
              Instructor: {course.instructor}
            </p>
          </div>
          <Badge variant="accent">{course.category}</Badge>
        </div>
      </Card>

      <Card>
        <h3>Video player</h3>
        <div className="mt-4 flex h-72 items-center justify-center rounded-card bg-primary-dark text-slate-200">
          Lecture video area
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3>Notes section</h3>
          <p className="mt-3 text-small text-neutral">
            Structured notes and key points from this course module.
          </p>
        </Card>
        <Card>
          <h3>Download files</h3>
          <Button className="mt-4" variant="primary">
            Download PDF
          </Button>
        </Card>
      </div>
    </div>
  );
}
