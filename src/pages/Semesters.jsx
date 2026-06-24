import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  X,
  GraduationCap,
  BookOpen,
  Info
} from 'lucide-react';

export default function Semesters() {
  const { 
    dashboardData, 
    addSemester, 
    editSemester, 
    deleteSemester, 
    addSubject, 
    editSubject, 
    deleteSubject 
  } = useAuth();

  const semesters = dashboardData?.semesters || [];

  // Expanded semesters state
  const [expandedSem, setExpandedSem] = useState({});

  // Modals state
  const [semModal, setSemModal] = useState({ open: false, mode: 'add', id: null, name: '' });
  const [subModal, setSubModal] = useState({ 
    open: false, 
    mode: 'add', 
    semId: null, 
    id: null, 
    code: '', 
    name: '', 
    credits: '', 
    grade: 'O' 
  });

  const [formError, setFormError] = useState('');

  const toggleExpand = (id) => {
    setExpandedSem(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Semesters CRUD handlers
  const handleSemSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!semModal.name.trim()) {
      setFormError('Semester name is required');
      return;
    }

    try {
      if (semModal.mode === 'add') {
        await addSemester(semModal.name);
      } else {
        await editSemester(semModal.id, semModal.name);
      }
      setSemModal({ open: false, mode: 'add', id: null, name: '' });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSemDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? All subjects inside will be deleted.`)) {
      try {
        await deleteSemester(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Subjects CRUD handlers
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const { mode, semId, id, code, name, credits, grade } = subModal;

    if (!code.trim() || !name.trim() || credits === '') {
      setFormError('All fields are required');
      return;
    }

    const creditsNum = Number(credits);
    if (isNaN(creditsNum) || creditsNum <= 0) {
      setFormError('Credits must be a positive number');
      return;
    }

    try {
      const payload = { code: code.toUpperCase().trim(), name: name.trim(), credits: creditsNum, grade };
      if (mode === 'add') {
        await addSubject(semId, payload);
      } else {
        await editSubject(semId, id, payload);
      }
      setSubModal({ open: false, mode: 'add', semId: null, id: null, code: '', name: '', credits: '', grade: 'O' });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSubDelete = async (semId, subId, subName) => {
    if (window.confirm(`Are you sure you want to delete subject "${subName}"?`)) {
      try {
        await deleteSubject(semId, subId);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Semesters</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add terms, log course modules, and assign grades.</p>
        </div>
        <button
          onClick={() => setSemModal({ open: true, mode: 'add', id: null, name: '' })}
          className="flex items-center gap-2 px-5 py-2.5 font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-102"
        >
          <Plus className="w-5 h-5" />
          Add Semester
        </button>
      </div>

      {/* Semesters list */}
      {semesters.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl text-center min-h-[40vh]">
          <GraduationCap className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-355 mb-1">No Semesters Added</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Begin structuring your curriculum logs by adding a semester block.
          </p>
          <button
            onClick={() => setSemModal({ open: true, mode: 'add', id: null, name: '' })}
            className="px-5 py-2 font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-550/10 hover:bg-indigo-550/20 rounded-xl transition-all"
          >
            Create Term Block
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {semesters.map((sem) => {
            const isExpanded = expandedSem[sem.id];
            return (
              <div key={sem.id} className="overflow-hidden glass-card rounded-2xl transition-all duration-300">
                {/* Semester Summary Header */}
                <div 
                  className="flex flex-wrap items-center justify-between p-6 cursor-pointer select-none gap-4"
                  onClick={() => toggleExpand(sem.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{sem.name}</h3>
                      <p className="text-xs text-slate-500">
                        {sem.subjects?.length || 0} Modules · {sem.totalCredits} Credits
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400">Semester SGPA</span>
                      <span className="text-xl font-extrabold text-indigo-500 dark:text-indigo-400">
                        {sem.sgpa.toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSemModal({ open: true, mode: 'edit', id: sem.id, name: sem.name })}
                        className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                        title="Edit Semester Name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSemDelete(sem.id, sem.name)}
                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpand(sem.id)}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subjects Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-100/15 dark:bg-slate-900/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Subject Details</h4>
                      <button
                        onClick={() => setSubModal({ 
                          open: true, 
                          mode: 'add', 
                          semId: sem.id, 
                          id: null, 
                          code: '', 
                          name: '', 
                          credits: '', 
                          grade: 'O' 
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Subject
                      </button>
                    </div>

                    {/* Subjects Table */}
                    {!sem.subjects || sem.subjects.length === 0 ? (
                      <p className="py-6 text-sm text-center text-slate-500">No subjects logged. Click Add Subject to start.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead>
                            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 uppercase">
                              <th className="py-2.5">Code</th>
                              <th className="py-2.5">Subject Name</th>
                              <th className="py-2.5 text-center">Credits</th>
                              <th className="py-2.5 text-center">Grade</th>
                              <th className="py-2.5 text-center">Points</th>
                              <th className="py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                            {sem.subjects.map((sub) => (
                              <tr key={sub.code} className="text-sm text-slate-700 dark:text-slate-300">
                                <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{sub.code}</td>
                                <td className="py-3 max-w-[200px] truncate">{sub.name}</td>
                                <td className="py-3 text-center">{sub.credits}</td>
                                <td className="py-3 text-center">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                                    sub.grade === 'U' 
                                      ? 'bg-rose-500/10 text-rose-500' 
                                      : sub.grade === 'O' 
                                      ? 'bg-emerald-500/10 text-emerald-500'
                                      : 'bg-indigo-500/10 text-indigo-550 dark:text-indigo-400'
                                  }`}>
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="py-3 text-center">{sub.gradePoint}</td>
                                <td className="py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setSubModal({
                                        open: true,
                                        mode: 'edit',
                                        semId: sem.id,
                                        id: sub._id || sub.id,
                                        code: sub.code,
                                        name: sub.name,
                                        credits: sub.credits,
                                        grade: sub.grade
                                      })}
                                      className="p-1.5 text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-md transition-colors"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleSubDelete(sem.id, sub._id || sub.id, sub.name)}
                                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Semester Modal */}
      {semModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 glass-modal rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setSemModal({ open: false, mode: 'add', id: null, name: '' })}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
              {semModal.mode === 'add' ? 'Create Semester Block' : 'Edit Semester Name'}
            </h3>
            <form onSubmit={handleSemSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Semester Title</label>
                <input
                  type="text"
                  placeholder="e.g. Semester 1, Fall 2026"
                  value={semModal.name}
                  onChange={e => setSemModal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-rose-500 rounded-xl bg-rose-500/10">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSemModal({ open: false, mode: 'add', id: null, name: '' })}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-650/15"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {subModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 glass-modal rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setSubModal({ open: false, mode: 'add', semId: null, id: null, code: '', name: '', credits: '', grade: 'O' })}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
              {subModal.mode === 'add' ? 'Add Subject Log' : 'Edit Subject Log'}
            </h3>
            <form onSubmit={handleSubSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS101"
                    value={subModal.code}
                    onChange={e => setSubModal(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Credits</label>
                  <input
                    type="number"
                    placeholder="e.g. 4"
                    value={subModal.credits}
                    onChange={e => setSubModal(prev => ({ ...prev, credits: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={subModal.name}
                  onChange={e => setSubModal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Select Grade</label>
                <select
                  value={subModal.grade}
                  onChange={e => setSubModal(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="O">O (Outstanding - 10)</option>
                  <option value="A+">A+ (Excellent - 9)</option>
                  <option value="A">A (Very Good - 8)</option>
                  <option value="B+">B+ (Good - 7)</option>
                  <option value="B">B (Above Average - 6)</option>
                  <option value="C">C (Average - 5)</option>
                  <option value="U">U (Re-appear - 0)</option>
                </select>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 text-sm text-rose-500 rounded-xl bg-rose-500/10">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSubModal({ open: false, mode: 'add', semId: null, id: null, code: '', name: '', credits: '', grade: 'O' })}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-650/15"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
