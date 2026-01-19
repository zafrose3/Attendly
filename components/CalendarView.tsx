import React, { useState } from 'react';
import { Subject, AttendanceStatus } from '../types';
import { Icons } from '../constants';
import { getMonthDays, formatDate } from '../utils/attendance';

interface CalendarViewProps {
  subject: Subject;
  onUpdateDate: (date: string, status: AttendanceStatus) => void;
  onClose: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ subject, onUpdateDate, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const { firstDay, daysInMonth } = getMonthDays(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getStatusColor = (status: AttendanceStatus, isSunday: boolean) => {
    if (status === 'PRESENT') return 'bg-emerald-500 text-white';
    if (status === 'ABSENT') return isSunday ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : 'bg-red-500 text-white';
    if (status === 'OD') return 'bg-blue-500 text-white';
    if (status === 'HOLIDAY') return 'bg-amber-400 text-white';
    if (isSunday) return 'bg-slate-50 dark:bg-slate-800/50 text-slate-400';
    return 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800';
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    const currentStatus = subject.history[dateStr] || 'NONE';
    const statuses: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'OD', 'HOLIDAY', 'NONE'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    onUpdateDate(dateStr, statuses[nextIndex]);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden glass-card">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-primary text-white">
          <div>
            <h3 className="text-xl font-black">{subject.name}</h3>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Attendance History</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <Icons.X />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg">{monthName} {year}</h4>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <Icons.ChevronLeft />
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <Icons.ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const dateObj = new Date(year, month, day);
              const dateStr = formatDate(dateObj);
              const isSunday = dateObj.getDay() === 0;
              const status = subject.history[dateStr] || (isSunday ? 'NONE' : 'NONE');
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all hover:scale-105 ${getStatusColor(status as AttendanceStatus, isSunday)}`}
                >
                  {day}
                  {status !== 'NONE' && <div className="w-1 h-1 rounded-full mt-0.5 bg-white/40" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-6 text-[10px] font-black uppercase tracking-wider border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-3 h-3 rounded bg-emerald-500" /> Present
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 rounded bg-red-500" /> Absent
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-3 h-3 rounded bg-blue-500" /> On Duty (OD)
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-3 h-3 rounded bg-amber-400" /> Holiday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
