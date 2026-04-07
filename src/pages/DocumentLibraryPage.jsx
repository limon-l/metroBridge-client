import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { departments } from "../utils/constants";
import {
  fetchDocuments,
  incrementDocumentDownload,
  uploadDocument,
} from "../services/documentService";

const CATEGORIES = [
  { value: "resources", label: "Resources" },
  { value: "assignments", label: "Assignments" },
  { value: "lecture-notes", label: "Lecture Notes" },
  { value: "practice", label: "Practice Problems" },
  { value: "reference", label: "Reference" },
];

export default function DocumentLibraryPage({ role }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "resources",
    subject: "",
    department: "",
    fileUrl: "",
    fileName: "",
    fileType: "",
  });
  const [uploadMode, setUploadMode] = useState("file");
  const [uploadPreview, setUploadPreview] = useState("");

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.q = searchTerm.trim();
      }

      const items = await fetchDocuments(params);
      setDocuments(items);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [documents, searchTerm]);

  const handleUploadDocument = async (event) => {
    event.preventDefault();

    if (
      !uploadData.title ||
      !uploadData.subject ||
      !uploadData.department ||
      !uploadData.fileUrl
    ) {
      alert("Title, subject, department, and a file/link are required.");
      return;
    }

    try {
      const created = await uploadDocument(uploadData);
      setDocuments((prev) => [created, ...prev]);
      setUploadData({
        title: "",
        description: "",
        category: "resources",
        subject: "",
        department: "",
        fileUrl: "",
        fileName: "",
        fileType: "",
      });
      setUploadPreview("");
      setIsUploadModalOpen(false);
    } catch (error) {
      alert(error?.message || "Unable to upload document.");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadData((prev) => ({
        ...prev,
        fileUrl: String(reader.result || ""),
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
      }));
      setUploadPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadDocument = async (doc) => {
    try {
      await incrementDocumentDownload(doc.id);
      if (doc.fileUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = doc.fileUrl;
        link.download = doc.fileName || `${doc.title}.bin`;
        link.click();
      } else {
        window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
      }
      loadDocuments();
    } catch (error) {
      alert(error?.message || "Unable to register download.");
    }
  };

  const handleViewDocument = (doc) => {
    if (!doc?.fileUrl) return;

    window.location.assign(doc.fileUrl);
  };

  return (
    <div className="space-y-6">
      <Card className="banner-surface bg-gradient-to-r from-primary via-primary-light to-accent text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Document Library
        </p>
        <h2 className="text-white">Resources & Materials</h2>
        <p className="mt-2 text-white/90">
          Access shared resources and study materials from the database.
        </p>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="flex-1 rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={loadDocuments}>
              Refresh
            </Button>
            {role === "mentor" && (
              <Button
                variant="primary"
                onClick={() => setIsUploadModalOpen(true)}>
                Upload Document
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-small font-semibold ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-neutral-light text-text"
            }`}>
            All
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedCategory(item.value)}
              className={`rounded-full px-4 py-2 text-small font-semibold ${
                selectedCategory === item.value
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-text"
              }`}>
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {isLoading ? (
        <Card>
          <p className="text-neutral">Loading documents...</p>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Try changing filters or upload a new document."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="card-hover-strong flex flex-col">
              <h4 className="font-semibold">{doc.title}</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="w-fit">{doc.category}</Badge>
                <Badge variant="accent" className="w-fit">
                  {doc.department || "All depts"}
                </Badge>
              </div>
              <p className="mt-2 text-small text-primary">
                Subject: {doc.subject || "General"}
              </p>
              <p className="mt-2 flex-1 text-small text-neutral">
                {doc.description}
              </p>
              <div className="mt-3 space-y-1 text-xs text-neutral">
                <p>By: {doc.uploadedBy.name}</p>
                <p>Downloads: {doc.downloads}</p>
                {doc.fileName ? <p>File: {doc.fileName}</p> : null}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleViewDocument(doc)}
                  className="flex-1">
                  View
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleDownloadDocument(doc)}
                  className="flex-1">
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document">
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={uploadData.title}
            onChange={(event) =>
              setUploadData((prev) => ({ ...prev, title: event.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={uploadData.description}
            onChange={(event) =>
              setUploadData((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2"
            rows="3"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Subject (e.g. Data Structures)"
              value={uploadData.subject}
              onChange={(event) =>
                setUploadData((prev) => ({
                  ...prev,
                  subject: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2"
              required
            />
            <select
              value={uploadData.department}
              onChange={(event) =>
                setUploadData((prev) => ({
                  ...prev,
                  department: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2"
              required>
              <option value="">Select department</option>
              {departments.slice(1).map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <select
            value={uploadData.category}
            onChange={(event) =>
              setUploadData((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2">
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-small font-semibold transition-colors ${
                uploadMode === "file"
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-text"
              }`}
              onClick={() => setUploadMode("file")}>
              Upload file
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-small font-semibold transition-colors ${
                uploadMode === "link"
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-text"
              }`}
              onClick={() => setUploadMode("link")}>
              Add link
            </button>
          </div>
          {uploadMode === "file" ? (
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="w-full rounded-lg border border-border px-3 py-2"
              required
            />
          ) : (
            <input
              type="url"
              placeholder="Public file or link URL (https://...)"
              value={uploadData.fileUrl}
              onChange={(event) =>
                setUploadData((prev) => ({
                  ...prev,
                  fileUrl: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2"
              required
            />
          )}
          {uploadPreview ? (
            <div className="rounded-card border border-border bg-slate-50 p-3 text-small text-neutral">
              {uploadData.fileName || "Selected file"}
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
