import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Compass, 
  Download, 
  FileText, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
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

  // Handle CSV Download
  const downloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Semester,Subject Code,Subject Name,Credits,Grade,Grade Point\n';

    semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        const row = [
          `"${sem.name}"`,
          `"${sub.code}"`,
          `"${sub.name}"`,
          sub.credits,
          `"${sub.grade}"`,
          sub.gradePoint
        ].join(',');
        csvContent += row + '\n';
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${dashboardData?.name || 'Student'}_mark_summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-xl glass-card text-slate-700 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            Download CSV
          </button>
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

        {/* Analytics Details Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Card */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">SGPA Trend Analysis</h3>
            </div>
            <div className="w-full h-72 pdf-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(156,163,175,0.6)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    ticks={[0, 2, 4, 6, 8, 10]} 
                    stroke="rgba(156,163,175,0.6)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="SGPA" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSgpa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Semesters list summary */}
          <div className="glass-card rounded-2xl p-6 flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Term Breakdown</h3>
            <div className="flex-1 overflow-y-auto max-h-72 pr-1 space-y-3">
              {semesters.map((sem) => (
                <div key={sem.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/40 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-800/30">
                  <div>
                    <h5 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{sem.name}</h5>
                    <p className="text-xs text-slate-500">{sem.subjects?.length || 0} Subjects · {sem.totalCredits} Credits</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-base text-indigo-500 dark:text-indigo-400">{sem.sgpa.toFixed(2)}</span>
                    <span className="block text-[10px] text-slate-400">SGPA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Mark Summary Table for PDF */}
        <div className="hidden pdf-only block mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Detailed Academic Record</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 text-xs uppercase">
                <th className="py-2">Semester</th>
                <th className="py-2">Code</th>
                <th className="py-2">Subject</th>
                <th className="py-2 text-center">Credits</th>
                <th className="py-2 text-center">Grade</th>
                <th className="py-2 text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map(sem => 
                sem.subjects.map((sub, idx) => (
                  <tr key={`${sem.id}-${sub.code}`} className="border-b border-slate-100 text-sm text-slate-700">
                    <td className="py-2 font-medium">{idx === 0 ? sem.name : ''}</td>
                    <td className="py-2">{sub.code}</td>
                    <td className="py-2">{sub.name}</td>
                    <td className="py-2 text-center">{sub.credits}</td>
                    <td className="py-2 text-center font-bold">{sub.grade}</td>
                    <td className="py-2 text-center">{sub.gradePoint}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
