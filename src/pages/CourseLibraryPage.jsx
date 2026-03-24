import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { courses } from "../utils/mockData";

export default function CourseLibraryPage() {
  return (
    <div className="space-y-6">
      <Card>
        <h2>Course Library</h2>
        <p className="mt-2">
          Access curated videos, notes, and downloadable academic resources.
        </p>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="card-hover p-5">
            <h3 className="text-body font-semibold text-primary">
              {course.title}
            </h3>
            <p className="mt-2 text-small text-neutral">
              Instructor: {course.instructor}
            </p>
            <p className="mt-1 text-small text-neutral">
              Category: {course.category}
            </p>
            <Link to={`/student/library/${course.id}`}>
              <Button className="mt-4 w-full" variant="primary">
                Open Course
              </Button>
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
