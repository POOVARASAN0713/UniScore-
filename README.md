# UniScore | Premium CGPA & SGPA Calculator

UniScore is a premium, modern, responsive full-stack web application designed for college students to track academic milestones, log terms, courses, and dynamically calculate Semestral GPA (SGPA) and Cumulative GPA (CGPA) with high-fidelity analytical diagrams.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v3, Recharts, Lucide Icons, html2pdf.js
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js
- **Database**: MongoDB (Mongoose Object Document Mapper)

---

## 📐 OOP Software Design Architecture

This project strictly adheres to **Object-Oriented Programming (OOP)** principles to handle calculations and domain state validations:

### Domain Classes
1. **`Course` (Base Class)**:
   - Encapsulates properties `code` (string), `name` (string), and `credits` (number).
   - Enforces base level validation using ES6 Class Getters and Setters.
2. **`Subject` (Subclass - Inherits `Course`)**:
   - Extends `Course` with grades (`O`, `A+`, `A`, `B+`, `B`, `C`, `U`).
   - Encapsulates dynamic grade-to-point mappings:
     - `O` = 10, `A+` = 9, `A` = 8, `B+` = 7, `B` = 6, `C` = 5, `U` = 0.
3. **`Semester` (Aggregate Class)**:
   - Holds an array of `Subject` instances.
   - Encapsulates methods: `addSubject()`, `removeSubject()`, and `sgpa` calculation:
     $$\text{SGPA} = \frac{\sum (\text{Credits} \times \text{Grade Points})}{\sum \text{Credits}}$$
4. **`Student` (Aggregate Class)**:
   - Holds credentials and an array of `Semester` instances.
   - Encapsulates calculation methods for overall `cgpa`:
     $$\text{CGPA} = \frac{\sum (\text{Subject Credits} \times \text{Grade Points})}{\sum \text{Total Credits across all semesters}}$$

*Note: These domain models are implemented both on the backend (to structure calculations before storing to MongoDB) and frontend (for immediate UI calculation and validation responsiveness).*

---

## 📂 Folder Structure

```
UniScore/
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Authentication & academic controllers
│       ├── middleware/      # JWT route verification
│       ├── models/          # MongoDB Mongoose schemas
│       ├── oop/             # Domain OOP classes (Student, Semester, Subject)
│       ├── routes/          # API endpoint routes
│       └── app.js           # Express app setup
├── src/                     # React Frontend Source (Vite React)
│   ├── components/          # Sidebar, layout components
│   ├── context/             # Authentication & state context
│   ├── oop/                 # Frontend mirror OOP classes
│   ├── pages/               # Views (Login, Dashboard, Semesters)
│   ├── App.jsx              # Main routing viewport
│   └── index.css            # Tailwind & glassmorphism global styles
├── index.html               # Frontend template mount
├── package.json             # Combined Frontend & Backend package
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json              # Vercel deployment routing configuration
├── server.js                # Root server connection script
└── README.md
```

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or a MongoDB Atlas URI)

### 1. Install Dependencies
Run in the project root:
```bash
npm install
```

### 2. Start Local Development
Start the frontend React developer portal and the backend API concurrently:

- **Run Frontend** (Vite on http://localhost:5173):
  ```bash
  npm run dev
  ```

- **Run Backend** (Express on http://localhost:5000):
  ```bash
  npm run dev:backend
  ```
Open the frontend local server URL in your browser to begin!
Open the frontend URL in your browser, register a new account, and start managing your grades.

---

## 📄 Exporting & Reports
- **PDF Report**: Generates a high-quality academic transcript directly from your dashboard view including SGPA graphs and a course breakdown table.
- **CSV marks download**: Downloads a comma-separated values file representing all semester modules, credits, and grade configurations.
