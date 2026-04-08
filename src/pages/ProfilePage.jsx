import { useEffect, useMemo, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import apiClient from "../services/apiClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.displayName || "",
    universityId: "",
    department: "",
    batch: "",
    section: "",
    shift: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    gender: "",
    homeAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    guardianName: "",
    guardianPhone: "",
    bio: "",
    profilePhoto: "",
    expertise: [],
    projects: [],
    thesis: "",
    jobDetails: "",
    educationDetails: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const { showToast } = useToast();

  const onChange = (field) => (event) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));

  const formatUniversityId = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 9),
    ].filter(Boolean);
    return parts.join("-");
  };

  const onUniversityIdChange = (event) => {
    setProfile((prev) => ({
      ...prev,
      universityId: formatUniversityId(event.target.value),
    }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiClient.get("/users/me");
        const data = response.data?.data || {};

        const profileData = {
          fullName: data.fullName || "",
          universityId: data.universityId || "",
          department: data.department || "",
          batch: data.batch || "",
          section: data.section || "",
          shift: data.shift || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
            : "",
          bloodGroup: data.bloodGroup || "",
          gender: data.gender || "",
          homeAddress: data.homeAddress || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
          guardianName: data.guardianName || "",
          guardianPhone: data.guardianPhone || "",
          bio: data.bio || "",
          profilePhoto: data.profilePhoto || "",
          expertise: data.expertise || [],
          projects: data.projects || [],
          thesis: data.thesis || "",
          jobDetails: data.jobDetails || "",
          educationDetails: data.educationDetails || "",
        };

        setProfile(profileData);

        if (data.profilePhoto) {
          setPhotoPreview(data.profilePhoto);
        }
      } catch {
        showToast("Failed to load profile data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [showToast, user?.email]);

  const displayName = useMemo(
    () => profile.fullName || "User Name",
    [profile.fullName],
  );

  const onPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString() || "";
      setPhotoPreview(base64);
      setProfile((prev) => ({ ...prev, profilePhoto: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    try {
      const payload = {
        fullName: profile.fullName,
        department: profile.department,
        bio: profile.bio,
        projects: profile.projects,
        thesis: profile.thesis,
        jobDetails: profile.jobDetails,
        educationDetails: profile.educationDetails,
      };

      // Add role-specific fields
      if (user?.role === "student") {
        payload.batch = profile.batch;
        payload.section = profile.section;
        payload.shift = profile.shift;
        payload.dateOfBirth = profile.dateOfBirth || null;
        payload.bloodGroup = profile.bloodGroup;
        payload.gender = profile.gender;
        payload.emergencyContactName = profile.emergencyContactName;
        payload.emergencyContactPhone = profile.emergencyContactPhone;
        payload.guardianName = profile.guardianName;
        payload.guardianPhone = profile.guardianPhone;
      } else if (user?.role === "mentor") {
        payload.expertise = profile.expertise;
      }

      // Always include profilePhoto if present
      if (profile.profilePhoto) {
        payload.profilePhoto = profile.profilePhoto;
      }

      await apiClient.patch("/users/me", payload);
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(error?.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <p className="text-neutral">Loading profile...</p>
      </Card>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-white to-accent/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2>Profile</h2>
            <p className="mt-2">
              {user?.role === "mentor"
                ? "Manage your professional and expertise details."
                : "Manage your personal, academic, and emergency details."}
            </p>
          </div>
          <Badge variant="success">Verified Account</Badge>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
        <Card>
          <h3>
            {user?.role === "mentor"
              ? "Professional Identity"
              : "Student Identity"}
          </h3>
          <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-border bg-slate-50 p-5 text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-soft">
              {photoPreview ? (
                <img
                  alt="Profile photo"
                  className="h-full w-full object-cover"
                  src={photoPreview}
                />
              ) : (
                <span className="text-h3 font-bold text-slate-600">
                  {displayName
                    .split(" ")
                    .slice(0, 2)
                    .map((item) => item?.[0] || "")
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <p className="mt-3 text-small text-neutral">
              Upload and save your profile photo.
            </p>
            <label
              className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-card border border-border bg-white px-4 py-2 text-small font-semibold text-primary transition hover:bg-slate-100"
              htmlFor="profilePhoto">
              Upload Photo
            </label>
            <input
              accept="image/*"
              className="hidden"
              id="profilePhoto"
              onChange={onPhotoChange}
              type="file"
            />
          </div>

          <div className="mt-4 grid gap-3">
            <InputField
              label="Full Name"
              onChange={onChange("fullName")}
              required
              value={profile.fullName}
            />
            <InputField
              hint="Format: XXX-XXX-XXX"
              label="University ID"
              maxLength={11}
              onChange={onUniversityIdChange}
              pattern="\\d{3}-\\d{3}-\\d{3}"
              readOnly
              value={profile.universityId}
            />
            <InputField
              label="Email"
              onChange={onChange("email")}
              readOnly
              type="email"
              value={profile.email}
            />
            <InputField
              label="Phone Number"
              onChange={onChange("phone")}
              readOnly
              value={profile.phone}
            />

            {user?.role === "student" && (
              <>
                <InputField
                  label="Date of Birth"
                  onChange={onChange("dateOfBirth")}
                  required
                  type="date"
                  value={profile.dateOfBirth}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="section">
                      Section
                    </label>
                    <select
                      className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="section"
                      onChange={onChange("section")}
                      required
                      value={profile.section}>
                      <option value="">Select section</option>
                      {"ABCDEFGHIJ".split("").map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="shift">
                      Shift
                    </label>
                    <select
                      className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="shift"
                      onChange={onChange("shift")}
                      required
                      value={profile.shift}>
                      <option value="">Select shift</option>
                      <option value="Day">Day</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="bloodGroup">
                      Blood Group
                      <span className="text-accent"> *</span>
                    </label>
                    <select
                      className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="bloodGroup"
                      onChange={onChange("bloodGroup")}
                      required
                      value={profile.bloodGroup}>
                      <option value="">Select blood group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="gender">
                      Gender
                      <span className="text-accent"> *</span>
                    </label>
                    <select
                      className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="gender"
                      onChange={onChange("gender")}
                      required
                      value={profile.gender}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          {user?.role === "student" ? (
            <>
              <h3>Academic and contact details</h3>
              <div className="mt-4 grid gap-3">
                <InputField
                  label="Department"
                  onChange={onChange("department")}
                  required
                  value={profile.department}
                />
                <InputField
                  label="Batch"
                  onChange={onChange("batch")}
                  required
                  value={profile.batch}
                />
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="homeAddress">
                    Home Address
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="homeAddress"
                    onChange={onChange("homeAddress")}
                    placeholder="Village/Road, Area, District"
                    required
                    readOnly
                    value={profile.homeAddress}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="bio">
                    Short Bio / About
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="bio"
                    onChange={onChange("bio")}
                    placeholder="Share your interests, goals, or extra details"
                    required
                    value={profile.bio}
                  />
                </div>
                <InputField
                  label="Thesis/Research Title"
                  onChange={onChange("thesis")}
                  placeholder="Your thesis or research topic"
                  value={profile.thesis}
                />
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="projects">
                    Projects
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="projects"
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        projects: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="List your key projects separated by commas"
                    value={profile.projects.join(", ")}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="jobDetails">
                    Job Details
                  </label>
                  <textarea
                    className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="jobDetails"
                    onChange={onChange("jobDetails")}
                    placeholder="Your current or previous job details"
                    value={profile.jobDetails}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="educationDetails">
                    Previous Education Details
                  </label>
                  <textarea
                    className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="educationDetails"
                    onChange={onChange("educationDetails")}
                    placeholder="Your previous education details"
                    value={profile.educationDetails}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-card border border-border bg-slate-50 p-4">
                <h3>Emergency contact</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <InputField
                    label="Contact Person Name"
                    onChange={onChange("emergencyContactName")}
                    required
                    value={profile.emergencyContactName}
                  />
                  <InputField
                    label="Contact Person Phone"
                    onChange={onChange("emergencyContactPhone")}
                    required
                    value={profile.emergencyContactPhone}
                  />
                  <InputField
                    label="Guardian Name"
                    onChange={onChange("guardianName")}
                    required
                    value={profile.guardianName}
                  />
                  <InputField
                    label="Guardian Phone"
                    onChange={onChange("guardianPhone")}
                    required
                    value={profile.guardianPhone}
                  />
                </div>
              </div>
            </>
          ) : user?.role === "mentor" ? (
            <>
              <h3>Professional details and expertise</h3>
              <div className="mt-4 grid gap-3">
                <InputField
                  label="Department"
                  onChange={onChange("department")}
                  required
                  value={profile.department}
                />
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="expertise">
                    Areas of Expertise
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="expertise"
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        expertise: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Enter expertise areas separated by commas (e.g., Python, Web Development, AI/ML)"
                    value={profile.expertise.join(", ")}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="projects">
                    Projects
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="projects"
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        projects: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="List your key projects separated by commas"
                    value={profile.projects.join(", ")}
                  />
                </div>
                <InputField
                  label="Thesis/Research Title"
                  onChange={onChange("thesis")}
                  placeholder="Your thesis or research topic"
                  value={profile.thesis}
                />
              </div>

              <div className="mt-6 rounded-card border border-border bg-slate-50 p-4">
                <h3>Career and education information</h3>
                <div className="mt-4 grid gap-3">
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="jobDetails">
                      Current Job/Position
                    </label>
                    <textarea
                      className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="jobDetails"
                      onChange={onChange("jobDetails")}
                      placeholder="Your current job title, company, and responsibilities"
                      value={profile.jobDetails}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="educationDetails">
                      Educational Background
                    </label>
                    <textarea
                      className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="educationDetails"
                      onChange={onChange("educationDetails")}
                      placeholder="Your qualifications, degrees, and educational institutions"
                      value={profile.educationDetails}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-small font-medium text-gray-700"
                      htmlFor="bio">
                      About Me
                    </label>
                    <textarea
                      className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                      id="bio"
                      onChange={onChange("bio")}
                      placeholder="Tell students about yourself, your teaching approach, and mentoring philosophy"
                      value={profile.bio}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>Profile details</h3>
              <div className="mt-4 grid gap-3">
                <InputField
                  label="Department"
                  onChange={onChange("department")}
                  required
                  value={profile.department}
                />
                <InputField
                  label="Thesis/Research Title"
                  onChange={onChange("thesis")}
                  placeholder="Your thesis or research topic"
                  value={profile.thesis}
                />
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="projects">
                    Projects
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="projects"
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        projects: e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="List your key projects separated by commas"
                    value={profile.projects.join(", ")}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="jobDetails">
                    Job Details
                  </label>
                  <textarea
                    className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="jobDetails"
                    onChange={onChange("jobDetails")}
                    placeholder="Your current or previous job details"
                    value={profile.jobDetails}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="educationDetails">
                    Previous Education Details
                  </label>
                  <textarea
                    className="min-h-20 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="educationDetails"
                    onChange={onChange("educationDetails")}
                    placeholder="Your previous education details"
                    value={profile.educationDetails}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-small font-medium text-gray-700"
                    htmlFor="bio">
                    Short Bio / About
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                    id="bio"
                    onChange={onChange("bio")}
                    placeholder="Share your interests, goals, or extra details"
                    value={profile.bio}
                  />
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3>Profile completion</h3>
          <p className="mt-3 text-small text-neutral">
            {user?.role === "mentor"
              ? "Complete all fields to keep your mentor profile updated for students and administration."
              : "Complete all fields to keep your student profile updated for mentors and administration."}
          </p>
        </Card>
        <Card>
          <h3>Photo and documents</h3>
          <p className="mt-3 text-small text-neutral">
            Profile photo is saved to your account and displayed across the
            platform.
          </p>
        </Card>
        <Card>
          <h3>Privacy note</h3>
          <p className="mt-3 text-small text-neutral">
            {user?.role === "mentor"
              ? "Your professional details are visible to students and authorized administrators."
              : "Sensitive data like blood group and emergency contacts should be visible only to authorized roles."}
          </p>
        </Card>
      </div>

      <Button disabled={isSaving} type="submit" variant="primary">
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
