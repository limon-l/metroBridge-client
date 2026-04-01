import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBullseye,
  faFileArrowDown,
  faFileCirclePlus,
  faFileLines,
  faFolderOpen,
  faGraduationCap,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function DocumentLibraryPage({ role }) {
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "resources",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  const CATEGORIES = [
    { value: "resources", label: "Resources", icon: faFolderOpen },
    { value: "assignments", label: "Assignments", icon: faListCheck },
    { value: "lecture-notes", label: "Lecture Notes", icon: faBook },
    { value: "practice", label: "Practice Problems", icon: faBullseye },
    { value: "reference", label: "Reference Materials", icon: faGraduationCap },
  ];

  // Load documents from localStorage
  useEffect(() => {
    const savedDocuments = localStorage.getItem("documents");
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    } else {
      // Initialize with mock data
      const mockDocuments = [
        {
          id: "1",
          title: "React Hooks Guide",
          description: "Comprehensive guide to React Hooks and their usage",
          category: "lecture-notes",
          uploadedBy: {
            id: "mentor1",
            name: "Dr. Sarah Ahmed",
          },
          size: "2.4 MB",
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          downloads: 45,
        },
        {
          id: "2",
          title: "Data Structures Assignment",
          description: "Week 3 assignment - Binary Trees",
          category: "assignments",
          uploadedBy: {
            id: "mentor2",
            name: "Prof. Sabbir Hasan",
          },
          size: "1.8 MB",
          uploadedAt: new Date(Date.now() - 172800000).toISOString(),
          downloads: 23,
        },
      ];
      setDocuments(mockDocuments);
      localStorage.setItem("documents", JSON.stringify(mockDocuments));
    }
    setIsLoading(false);
  }, []);

  const saveDocuments = (updatedDocuments) => {
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();

    if (!uploadData.title) {
      alert("Please enter a title");
      return;
    }

    const newDocument = {
      id: Date.now().toString(),
      title: uploadData.title,
      description: uploadData.description,
      category: uploadData.category,
      uploadedBy: {
        id: user?.uid,
        name: user?.displayName || user?.email?.split("@")[0],
      },
      size: "Random Size",
      uploadedAt: new Date().toISOString(),
      downloads: 0,
    };

    const updatedDocuments = [newDocument, ...documents];
    saveDocuments(updatedDocuments);

    setIsUploadModalOpen(false);
    setUploadData({ title: "", description: "", category: "resources" });
    alert("Document uploaded successfully!");
  };

  const handleDownloadDocument = (documentId) => {
    // Simulate download
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      alert(`Downloaded: ${doc.title}`);

      // Update download count
      const updatedDocuments = documents.map((d) =>
        d.id === documentId ? { ...d, downloads: d.downloads + 1 } : d,
      );
      saveDocuments(updatedDocuments);
    }
  };

  const handleDeleteDocument = (documentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this document? This cannot be undone.",
      )
    ) {
      const updatedDocuments = documents.filter((d) => d.id !== documentId);
      saveDocuments(updatedDocuments);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.icon || faFileLines;
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.label || "Document";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Document Library
        </p>
        <h2 className="text-white">Resources & Materials</h2>
        <p className="mt-2 text-white/90">
          {role === "mentor"
            ? "Upload and manage learning materials for your students"
            : "Access shared resources and study materials"}
        </p>
      </Card>

      {/* Controls & Search */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {role === "mentor" && (
            <Button
              variant="primary"
              className="inline-flex items-center gap-2"
              onClick={() => setIsUploadModalOpen(true)}>
              <FontAwesomeIcon icon={faFileCirclePlus} /> Upload Document
            </Button>
          )}
        </div>
      </Card>

      {/* Category Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full transition-colors text-small font-semibold ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-neutral-light text-text hover:bg-neutral"
            }`}>
            All Documents
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full transition-colors text-small font-semibold ${
                selectedCategory === cat.value
                  ? "bg-primary text-white"
                  : "bg-neutral-light text-text hover:bg-neutral"
              }`}>
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={cat.icon} /> {cat.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-neutral">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          title="No documents found"
          description={
            searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters"
              : role === "mentor"
                ? "Upload your first document to get started"
                : "No resources available yet"
          }
          action={
            role === "mentor" && !searchTerm && selectedCategory === "all" ? (
              <Button
                variant="primary"
                className="inline-flex items-center gap-2"
                onClick={() => setIsUploadModalOpen(true)}>
                <FontAwesomeIcon icon={faFileCirclePlus} />
                Upload Document
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="flex flex-col hover:shadow-lg transition-shadow">
              {/* Document Icon */}
              <div className="text-3xl mb-3 text-primary">
                <FontAwesomeIcon icon={getCategoryIcon(doc.category)} />
              </div>

              {/* Title & Category */}
              <h4 className="font-semibold mb-2 line-clamp-2">{doc.title}</h4>
              <Badge className="mb-3 w-fit">
                {getCategoryLabel(doc.category)}
              </Badge>

              {/* Description */}
              <p className="text-small text-neutral mb-3 flex-1 line-clamp-2">
                {doc.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-neutral border-t border-border pt-3 mb-3">
                <p>
                  <span className="font-semibold">By:</span>{" "}
                  {doc.uploadedBy.name}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {doc.size}
                </p>
                <p>
                  <span className="font-semibold">Uploaded:</span>{" "}
                  {formatDate(doc.uploadedAt)}
                </p>
                <p>
                  <span className="font-semibold">Downloads:</span>{" "}
                  {doc.downloads}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {role === "mentor" && doc.uploadedBy.id === user?.uid && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="flex-1">
                    Delete
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  className={
                    role === "mentor" && doc.uploadedBy.id === user?.uid
                      ? "flex-1 inline-flex items-center justify-center gap-2"
                      : "w-full inline-flex items-center justify-center gap-2"
                  }
                  onClick={() => handleDownloadDocument(doc.id)}>
                  <FontAwesomeIcon icon={faFileArrowDown} />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document">
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-small font-semibold mb-2">
              Document Title *
            </label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) =>
                setUploadData({ ...uploadData, title: e.target.value })
              }
              placeholder="e.g., React Hooks Guide"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-small font-semibold mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) =>
                setUploadData({ ...uploadData, description: e.target.value })
              }
              placeholder="Brief description of the document"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-small font-semibold mb-2">
              Category
            </label>
            <select
              value={uploadData.category}
              onChange={(e) =>
                setUploadData({ ...uploadData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-primary/5 transition-colors cursor-pointer">
            <input
              type="file"
              className="hidden"
              disabled
              title="File upload simulation"
            />
            <p className="text-small text-neutral">
              📁 Click to select file (or drag and drop)
            </p>
            <p className="text-xs text-neutral/70 mt-1">
              Supported: PDF, DOC, PPT, ZIP (Max 50MB)
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-border">
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
