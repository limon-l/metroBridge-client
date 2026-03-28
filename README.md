# 🚀 MetroBridge Client

**MetroBridge** is a modern, professional frontend UI for a mentorship and academic collaboration platform designed specifically for **Metropolitan University, Sylhet**.

It enables structured mentorship, resource sharing, and real-time collaboration between students, seniors, and alumni within a secure academic ecosystem.

---

## ✨ Features

### 🌐 Public Pages

- **Landing Page**  
  Hero section, feature highlights, testimonials carousel, team showcase, platform statistics, and strong call-to-actions.

- **Contact Page**  
  Professional contact form with FAQ section and team information cards.

- **Authentication (Login / Signup)**  
  Role-based authentication system with **admin approval workflow** for secure access.

---

### 📊 Dashboard (Role-Based)

- **Student Dashboard**  
  View upcoming mentorship sessions, recommended mentors, learning resources, and performance metrics.

- **Mentor Dashboard**  
  Manage session requests, upload course content, and track ratings/reviews.

- **Admin Dashboard**  
  Handle pending user approvals, moderation queue, and system analytics.

---

### ⚙️ Core Features

- **Mentor Search**  
  Advanced filtering by department, course, and expertise with real-time results.

- **3-Step Booking System**  
  Simple flow: Date Selection → Time Slot → Confirmation.

- **Video Call Interface**  
  Dark-themed UI with chat, file sharing, and interactive controls.

- **Course Library**  
  Structured grid layout with course details, notes, and downloadable materials.

- **Moderation System**  
  Report submission system with admin review and action panel.

- **Profile Management**  
  Edit academic/personal details and view user feedback.

---

## 🎨 Professional UI Components

### 🧩 Core Components

- `Button` – Primary, Secondary, Danger, CTA variants with smooth transitions
- `Card` – Reusable container with shadows and rounded corners
- `InputField` – Form inputs with validation and error states
- `Modal` – Confirmation dialogs and workflows
- `Badge` – Status indicators with color variations
- `DataTable` – Responsive tables for admin dashboards
- `ReviewCarousel` – Auto-playing testimonials with navigation
- `FeatureShowcase` – Icon-based feature grid
- `EmptyState` – Placeholder UI for no data scenarios
- `Skeleton` – Loading animations for better UX
- `ScrollToTopButton` – Smooth scroll helper

---

### 🧭 Navigation Components

- **ProfessionalNavbar** – Sticky header with dropdowns and hover effects
- **SidebarNav** – Active route highlighting with accent borders
- **TopNavbar** – Role badge and notification system

---

### 📦 Sections

- **FeaturesSection** – 6-card feature layout
- **AboutSection** – Team cards with mission statement
- **CTASection** – Gradient-based call-to-action

---

## 🛠 Tech Stack

- **React 19** + Vite
- **Tailwind CSS** – Utility-first styling
- **React Router v7** – Client-side routing
- **Axios** – API communication
- **Firebase Authentication** – Email/password auth and session persistence

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── navigation/      # Navbar & sidebar
│   ├── dashboard/       # Dashboard-specific components
│   └── sections/        # Page sections
├── pages/               # Route pages
├── layouts/             # Public & Dashboard layouts
├── hooks/               # Custom hooks (useToast, useFormValidation)
├── services/            # API clients and services
└── utils/               # Helpers, constants, mock data
```

---

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🎯 Design System

### 🎨 Color Palette

| Role          | Color      | Hex     |
| ------------- | ---------- | ------- |
| Primary       | Navy       | #24204D |
| Primary Light | Indigo     | #3A3570 |
| Primary Dark  | Deep Navy  | #1A1738 |
| Accent        | Red        | #EB2D2E |
| Neutral       | Gray       | #737A7F |
| Background    | Light Gray | #F5F6F7 |

---

### 🔤 Typography

- **Font Family:** Inter, Poppins
- **H1:** 32px Bold
- **H2:** 24px Bold
- **H3:** 20px Semibold
- **Body:** 16px Regular
- **Small:** 14px Regular

---

### 📐 Layout System

- **Grid:** 12-column responsive
- **Spacing:** 8px system (8, 16, 24, 32...)
- **Border Radius:** 12px
- **Max Width:** 1200px

---

## 🎭 Professional UX Enhancements

- Smooth hover & active states
- Accessible focus rings (WCAG compliant)
- Animated testimonials carousel
- Modal confirmations for critical actions
- Toast notifications (success / error)
- Skeleton loading states
- Empty state UI
- Responsive layouts
- Dark theme for video calls
- Scroll-to-top button
- Professional team showcase

---

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimized (`sm: 640px`)
- Desktop layouts (`lg: 1024px`)
- Touch-friendly UI
- Collapsible navigation

---

## 🔐 Security & Moderation

- Role-based access control (RBAC)
- Admin approval for all new accounts
- Reporting & moderation system
- Secure session handling
- Protected routes

---

## 🔥 Firebase Auth Setup

1. Create a Firebase project from the Firebase Console.
2. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
3. In **Project settings → General → Your apps**, create a Web app and copy config values.
4. Create a local `.env` file using `.env.example` and fill the Firebase variables.
5. Set admin and mentor emails:

- `VITE_ADMIN_EMAILS=admin1@domain.com,admin2@domain.com`
- `VITE_MENTOR_EMAILS=mentor1@domain.com,mentor2@domain.com`

6. Restart dev server after updating `.env`.

### Auth Files

- `src/services/firebase.js` – Firebase initialization
- `src/context/AuthContext.jsx` – Auth state + login/signup/logout actions
- `src/components/auth/ProtectedRoute.jsx` – Route guard by role
- `src/pages/LoginPage.jsx` – Firebase user login
- `src/pages/SignupPage.jsx` – Firebase account creation
- `src/pages/AdminLoginPage.jsx` – Firebase admin login

---

## 📝 Developer Notes

- Built using Tailwind CSS utility classes
- `useToast()` hook for notifications
- `useFormValidation` for form handling
- Replace mock data from `utils/mockData.js` with real APIs
- API client setup in `services/apiClient.js`
- Use `cn()` utility for className merging

---

## 🔗 API Integration

Update API base URL:

```js
// src/services/apiClient.js
const apiClient = axios.create({
  baseURL: "https://your-api-endpoint.com",
});
```

Example usage:

```js
apiClient.get();
apiClient.post();
apiClient.put();
apiClient.delete();
```

---

## 🎯 Final Vision

MetroBridge aims to deliver a **clean, scalable, and professional academic platform UI** that combines:

- Structured learning (like Google Classroom)
- Real-time mentorship (like Zoom)
- Professional networking (like LinkedIn)

All tailored specifically for **Metropolitan University students**.

---

## 📌 License

This project is for academic purposes under the MERN Stack course.
