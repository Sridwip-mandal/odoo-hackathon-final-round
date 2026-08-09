import React, { useState, useRef } from 'react';
import { PlusCircle, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';

interface BulkImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportEmployeesModal: React.FC<BulkImportEmployeesModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [stats, setStats] = useState({ total: 0, valid: 0, errors: 0 });

  if (!isOpen) return null;

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) return [];
    
    // Assume specific columns: Full Name,Corporate Email,Mobile Number,Employee ID,Department,Base Office Hub,Platform Role,Initial Wallet Credit
    const data = [];
    let validCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      // Basic CSV split ignoring commas inside quotes
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
      if (row.length < 4) continue;
      
      const emp = {
        name: row[0] || '',
        email: row[1] || '',
        phone: row[2] || '',
        id: row[3] || '',
        dept: row[4] || 'Engineering',
        hub: row[5] || 'Kolkata Tech Hub',
        role: row[6] || 'employee',
        wallet: parseFloat(row[7]) || 0,
        isValid: true,
        errorMsg: ''
      };
      
      if (!emp.name || !emp.email || !emp.id) {
        emp.isValid = false;
        emp.errorMsg = 'Missing required fields';
      }
      
      if (emp.isValid) validCount++;
      data.push(emp);
    }
    
    setStats({ total: data.length, valid: validCount, errors: data.length - validCount });
    return data;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsParsing(true);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const parsed = parseCSV(text);
        setParsedData(parsed);
        setIsParsing(false);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = async () => {
    const validData = parsedData.filter(d => d.isValid);
    if (validData.length === 0) {
      toast.error('Import Failed', 'No valid records to import.');
      return;
    }
    
    setIsImporting(true);
    
    try {
      const response = await fetch('/api/employees/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Bulk Import Successful', `Successfully imported ${result.count} employees.`);
        
        // Update local storage so the frontend updates immediately
        const currentUsers = storage.getUsers();
        validData.forEach(d => {
           currentUsers.push({
             id: 'emp-import-' + Math.random().toString(36).substr(2, 9),
             name: d.name,
             email: d.email,
             role: 'employee',
             walletBalance: d.wallet,
             platformAccess: 'granted',
             status: 'active',
             department: d.dept,
             mobile: d.phone,
             employeeId: d.id,
             manager: 'Admin',
             officeLocation: d.hub,
             avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=random`,
             rating: 5,
             totalTrips: 0
           });
        });
        storage.setUsers(currentUsers);
        
        onSuccess();
        onClose();
      } else {
        toast.error('Import Failed', result.error || 'Server error during import');
      }
    } catch (err) {
      toast.error('Import Failed', 'Network error or server is unreachable.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              Bulk Import Employees
            </h2>
            <p className="text-sm text-slate-400 mt-1">Upload a CSV file to register multiple employees at once.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!file ? (
            <div 
              className="border-2 border-dashed border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 hover:border-purple-500/50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusCircle className="w-10 h-10 text-slate-500 mb-4" />
              <h3 className="text-lg font-semibold text-white">Click to Upload CSV</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-md">
                Ensure your CSV has columns: Full Name, Corporate Email, Mobile Number, Employee ID, Department, Base Office Hub, Platform Role, Initial Wallet Credit
              </p>
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFile(null); setParsedData([]); }}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                >
                  Remove File
                </button>
              </div>

              {isParsing ? (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Parsing CSV...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Found</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Valid Records</p>
                      <p className="text-2xl font-bold text-emerald-400">{stats.valid}</p>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">Errors</p>
                      <p className="text-2xl font-bold text-rose-400">{stats.errors}</p>
                    </div>
                  </div>

                  <div className="border border-slate-700 rounded-xl overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 font-semibold text-slate-300">Status</th>
                            <th className="px-4 py-2 font-semibold text-slate-300">Name</th>
                            <th className="px-4 py-2 font-semibold text-slate-300">Employee ID</th>
                            <th className="px-4 py-2 font-semibold text-slate-300">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 bg-slate-900/50">
                          {parsedData.slice(0, 100).map((row, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2">
                                {row.isValid ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <div className="flex items-center gap-1 text-rose-400" title={row.errorMsg}>
                                    <AlertCircle className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-2 font-medium text-white">{row.name}</td>
                              <td className="px-4 py-2 text-slate-400 font-mono">{row.id}</td>
                              <td className="px-4 py-2 text-slate-400">{row.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedData.length > 100 && (
                      <div className="bg-slate-800 text-center py-2 text-xs text-slate-400">
                        Showing first 100 records...
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || stats.valid === 0 || isImporting}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {isImporting ? 'Importing...' : `Import ${stats.valid} Valid Records`}
          </button>
        </div>

      </div>
    </div>
  );
};
