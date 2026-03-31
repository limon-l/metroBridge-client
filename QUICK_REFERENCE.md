# Quick Reference Guide - MetroBridge Advanced Features

## 🚀 Quick Start

### For Students

1. Login with student email
2. Dashboard shows quick action cards
3. Click any card to access the feature
4. Or use sidebar navigation

### For Mentors

1. Login with mentor email
2. See mentor-specific features
3. Manage appointments and resources
4. Share knowledge with community

### For Admins

1. Login with admin email
2. Access moderation tools
3. View system-wide analytics
4. Manage all content

---

## 🎯 Feature Quick Links

### Community Feed

📍 **Route:** `/student/feed`, `/mentor/feed`, `/admin/feed`

**Student Can:**

- Create posts with text & images
- React with 6 emoji reactions
- Comment on posts
- Share posts from others
- See posts from all users

**Mentor Can:**

- All student features
- Share expertise with community
- Respond to student questions

**Admin Can:**

- All user features
- Delete inappropriate posts
- Moderate community content

---

### Messages

📍 **Route:** `/student/messages`, `/mentor/messages`, `/admin/messages`

**Student Can:**

- Chat with assigned mentors
- View message history

**Mentor Can:**

- Chat with multiple students
- Manage conversations
- Respond to inquiries

**Admin Can:**

- View all conversations (monitoring)

---

### Appointments

📍 **Route:** `/student/appointments`, `/mentor/appointments`, `/admin/appointments`

**Student Can:**

1. Browse available mentors
2. See mentor expertise & ratings
3. Select time slot
4. Submit booking request
5. Track booking status
6. Join video call when confirmed

**Mentor Can:**

1. View pending requests
2. See student details & topic
3. Approve or decline
4. Manage confirmed appointments
5. Reschedule if needed

**Admin Can:**

- View all appointments
- See system-wide statistics
- Monitor bookings

---

### Documents

📍 **Route:** `/student/documents`, `/mentor/documents`, `/admin/documents`

**Student Can:**

- Browse all documents
- Filter by category (5 types)
- Search by title
- Download resources
- See download count

**Mentor Can:**

- Upload study materials
- Organize by category
- Add descriptions
- View who downloaded
- Delete own documents

**Admin Can:**

- View all documents
- Monitor uploads
- Manage categories

---

## 📊 Document Categories

- 📚 **Resources** - General materials
- 📝 **Assignments** - Homework & projects
- 📖 **Lecture Notes** - Class notes
- 🎯 **Practice Problems** - Exercise sets
- 📚 **Reference Materials** - Textbooks & guides

---

## 🎨 Emoji Reactions Available

| Emoji | Meaning |
| ----- | ------- |
| 👍    | Like    |
| ❤️    | Love    |
| 😂    | Haha    |
| 😮    | Wow     |
| 😢    | Sad     |
| 😠    | Angry   |

---

## 🔄 Navigation Sidebar Updated

All roles now have access to:

```
Dashboard
├── Community Feed
├── Messages
├── Appointments
├── Documents
└── (Role-specific items)
```

---

## 💡 Tips & Tricks

### Community Feed

- 🔐 Only you can edit/delete your posts
- 👥 Share posts to repost to your feed
- 💬 Click "Add a comment..." to discuss
- 😊 Use reactions to show support

### Messages

- 📌 Conversations are persistent
- 📜 Full history is saved
- ⏰ Timestamps show when sent
- 🔔 See online status

### Appointments

- 📅 Book in advance
- ⚠️ Mentor must approve
- ✅ Get notification when approved
- 🎥 Video call link appears when confirmed

### Documents

- 🔍 Use search to find quickly
- 🏷️ Filter by category
- ⬇️ Download anytime
- 📊 See popularity by download count

---

## ⚙️ Settings & Preferences

Coming in next phase:

- [ ] Notification preferences
- [ ] Dark mode
- [ ] Language selection
- [ ] Profile customization
- [ ] Privacy settings
- [ ] Communication preferences

---

## 🆘 Common Tasks

### Create a Community Post

1. Go to Community Feed
2. Click "Create Post" button
3. Write your message
4. Click "📷 Photo" to add images (optional)
5. Click "Post" button
6. Done! Your post is live

### Message a Mentor (Student)

1. Go to Messages
2. Select mentor from list (or start new chat)
3. Type your message
4. Click "Send"
5. Wait for response

### Upload Study Materials (Mentor)

1. Go to Documents
2. Click "⬆️ Upload Document"
3. Enter title and description
4. Select category
5. Upload file
6. Click "Upload"
7. Students can now download

### Book a Session (Student)

1. Go to Appointments
2. Click on mentor you want
3. Select available time slot
4. Fill in date, time, topic
5. Submit request
6. Wait for mentor approval
7. Get notification when approved
8. Click "Join Video Call" when ready

### Manage Appointments (Mentor)

1. Go to Appointments
2. See pending requests on left
3. Click "Approve" or "Decline"
4. Check "Pending Requests" count

### Moderate Feed (Admin)

1. Go to Community Feed
2. See all posts from all users
3. Click "⋮" menu on problematic post
4. Select "Delete Post"
5. Action is applied immediately

---

## 📱 Mobile Access

All features work on:

- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Responsive layouts

Just click menu (☰) on mobile to see sidebar.

---

## 🔐 Privacy & Security

- 🔒 Only authent users can access
- 👤 Can only edit own content
- 🛡️ Admins monitor activity
- 📧 Use real email for recovery
- 🔑 Strong password required

---

## ⚡ Performance Tips

- 💾 Data auto-saves (uses localStorage)
- ⚡ Fast page loads
- 🖼️ Images compress automatically
- 📱 Works offline with localStorage

---

## 🐛 Troubleshooting

**Issue:** Can't see Community Feed

- ✅ Refresh page
- ✅ Check if logged in
- ✅ Check user role is correct

**Issue:** Messages not sending

- ✅ Check internet connection
- ✅ Refresh page
- ✅ Try again

**Issue:** Can't upload document

- ✅ Check file size (under 50MB)
- ✅ Check file format is supported
- ✅ Fill in all required fields

**Issue:** Appointment not showing

- ✅ Refresh page
- ✅ Check if mentor approved
- ✅ Check date is in future

---

## 📞 Getting Help

### For Students

- 💬 Message mentor directly
- 📧 Email support
- 💻 Visit help center
- 🗣️ Community forum

### For Mentors

- 📧 Email admin
- 💬 Admin chat
- 📞 Support hotline
- 📖 Documentation

### For Admins

- 📖 Full documentation available
- 📧 Contact developer
- 🐛 Report bugs on dashboard

---

## 📈 Feature Expansion (Coming Soon)

Phase 2 Features:

- [ ] Video call integration
- [ ] File attachments in messages
- [ ] Schedule batching
- [ ] Advanced analytics
- [ ] Grade tracking
- [ ] Certificate generation
- [ ] Mobile app
- [ ] OAuth login

---

## 📚 Learn More

**Full Documentation:**

- `FEATURES_IMPLEMENTATION.md` - Complete feature guide
- `BACKEND_INTEGRATION_GUIDE.md` - For developers
- `IMPLEMENTATION_SUMMARY.md` - Overview

---

## 🎯 Your Journey

```
Signup / Login
    ↓
Complete Profile
    ↓
Explore Community Feed
    ↓
Find Mentors / Students
    ↓
Send Messages
    ↓
Book Appointments
    ↓
Share Resources
    ↓
Build Knowledge
    ↓
Succeed!
```

---

**Welcome to MetroBridge! Let's learn together! 🎓**

---

Last Updated: March 31, 2026
Version: 1.0
