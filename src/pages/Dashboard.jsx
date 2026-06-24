import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Compass, 
  FileText, 
  AlertCircle
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function Dashboard({ setCurrentPage }) {
  const { dashboardData } = useAuth();
  const pdfContentRef = useRef();

  const semesters = dashboardData?.semesters || [];
  const cgpa = dashboardData?.cgpa || 0;
  const totalCredits = dashboardData?.totalCredits || 0;

  // Calculate other stats
  const totalSubjects = semesters.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0);
  const chartData = semesters.map(sem => ({
    name: sem.name,
    SGPA: sem.sgpa,
    Credits: sem.totalCredits
  }));

  // Handle PDF Export
  const exportPDF = () => {
    const element = pdfContentRef.current;
    const opt = {
      margin: 10,
      filename: `${dashboardData.name || 'Student'}_Academic_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Temporarily add a class for PDF generation to adjust styling
    element.classList.add('pdf-mode');
    html2pdf().from(element).set(opt).save().then(() => {
      element.classList.remove('pdf-mode');
    });
  };



  if (semesters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-indigo-500/10 text-indigo-500 animate-bounce">
          <BookOpen className="w-10 h-10" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to UniScore!</h2>
        <p className="max-w-md mb-8 text-slate-500 dark:text-slate-400">
          It looks like you haven't added any academic records yet. Let's get started by creating your first semester.
        </p>
        <button
          onClick={() => setCurrentPage('semesters')}
          className="px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
        >
          Add First Semester
        </button>
      </div>
    );
  }

  // Determine CGPA status text/color
  const getCgpaStatus = (val) => {
    if (val >= 9) return { label: 'Excellent', color: 'from-emerald-500 to-teal-500', text: 'text-emerald-500' };
    if (val >= 8) return { label: 'Very Good', color: 'from-blue-500 to-indigo-500', text: 'text-indigo-500' };
    if (val >= 7) return { label: 'Good', color: 'from-amber-500 to-orange-500', text: 'text-amber-500' };
    if (val >= 5) return { label: 'Satisfactory', color: 'from-orange-500 to-rose-500', text: 'text-orange-500' };
    return { label: 'Needs Improvement', color: 'from-rose-600 to-red-500', text: 'text-rose-500' };
  };

  const status = getCgpaStatus(cgpa);

  return (
    <div className="space-y-6">
      {/* Top Banner Control Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Academic Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time performance tracking and reports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-500 hover:shadow-indigo-600/20"
          >
            <FileText className="w-4 h-4" />
            Export Report PDF
          </button>
        </div>
      </div>

      {/* Main Stats and Graphs Container for PDF */}
      <div ref={pdfContentRef} className="space-y-6 p-1 rounded-xl">
        {/* PDF Only Header */}
        <div className="hidden pdf-only flex-row justify-between items-center border-b pb-4 mb-6 border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">UniScore CGPA Report</h1>
            <p className="text-xs text-slate-500">Student: {dashboardData?.name} ({dashboardData?.email})</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* CGPA Card */}
          <div className="relative overflow-hidden glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 rounded-full bg-gradient-to-br ${status.color} opacity-10 blur-xl`} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Cumulative CGPA</span>
              <div className={`p-2 rounded-xl bg-gradient-to-tr ${status.color} text-white`}>
                <Award className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-1 tracking-tight text-slate-800 dark:text-slate-100">{cgpa.toFixed(2)}</h2>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 ${status.text}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Semesters Card */}
          <div className="relative overflow-hidden glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 opacity-10 blur-xl" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Semesters Completed</span>
              <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-1 tracking-tight text-slate-800 dark:text-slate-100">{semesters.length}</h2>
            <span className="text-xs text-slate-400">Total college terms</span>
          </div>

          {/* Credits Card */}
          <div className="relative overflow-hidden glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-10 blur-xl" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Credits Earned</span>
              <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-1 tracking-tight text-slate-800 dark:text-slate-100">{totalCredits}</h2>
            <span className="text-xs text-slate-400">Cumulative weight</span>
          </div>

          {/* Subjects Card */}
          <div className="relative overflow-hidden glass-card rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-4 -mt-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 opacity-10 blur-xl" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Total Subjects</span>
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-1 tracking-tight text-slate-800 dark:text-slate-100">{totalSubjects}</h2>
            <span className="text-xs text-slate-400">Evaluated courses</span>
          </div>
        </div>

        {/* Semester-wise SGPA Breakdown Table */}
        <div className="glass-card rounded-2xl p-6 mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">Semester Performance Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">Semester</th>
                  <th className="py-3 px-2 text-center">Subjects Completed</th>
                  <th className="py-3 px-2 text-center">Total Credits</th>
                  <th className="py-3 px-2 text-right">SGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                {semesters.map((sem) => (
                  <tr key={sem.id} className="text-sm text-slate-700 dark:text-slate-300">
                    <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">{sem.name}</td>
                    <td className="py-3 px-2 text-center">{sem.subjects?.length || 0}</td>
                    <td className="py-3 px-2 text-center">{sem.totalCredits}</td>
                    <td className="py-3 px-2 text-right font-bold text-indigo-500 dark:text-indigo-400 text-lg">
                      {sem.sgpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Mark Summary Table */}
        <div className="glass-card rounded-2xl p-6 mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">Detailed Academic Record</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-400 uppercase bg-slate-100/30 dark:bg-slate-800/30">
                  <th className="py-3 px-2">Semester</th>
                  <th className="py-3 px-2">Code</th>
                  <th className="py-3 px-2">Subject Name</th>
                  <th className="py-3 px-2 text-center">Credits</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-2 text-center">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                {semesters.map(sem => 
                  sem.subjects.map((sub, idx) => (
                    <tr key={`${sem.id}-${sub.code}`} className="text-sm text-slate-700 dark:text-slate-300">
                      <td className="py-3 px-2 font-bold text-slate-800 dark:text-slate-200">{idx === 0 ? sem.name : ''}</td>
                      <td className="py-3 px-2 font-mono text-xs">{sub.code}</td>
                      <td className="py-3 px-2">{sub.name}</td>
                      <td className="py-3 px-2 text-center">{sub.credits}</td>
                      <td className="py-3 px-2 text-center font-bold text-indigo-600 dark:text-indigo-400">{sub.grade}</td>
                      <td className="py-3 px-2 text-center font-semibold">{sub.gradePoint}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
