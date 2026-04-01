import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { fetchDocuments } from "../services/documentService";

export default function CourseLibraryPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await fetchDocuments({ category: "lecture-notes" });
        setCourses(docs);
      } catch {
        setCourses([]);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2>Course Library</h2>
        <p className="mt-2">
          Access curated videos, notes, and downloadable academic resources.
        </p>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <Card>
            <p className="text-small text-neutral">
              No course materials uploaded yet.
            </p>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="card-hover p-5">
              <h3 className="text-body font-semibold text-primary">
                {course.title}
              </h3>
              <p className="mt-2 text-small text-neutral">
                Instructor: {course.uploadedBy.name}
              </p>
              <p className="mt-1 text-small text-neutral">
                Category: {course.category}
              </p>
              <a href={course.fileUrl} rel="noreferrer" target="_blank">
                <Button className="mt-4 w-full" variant="primary">
                  Open Material
                </Button>
              </a>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
