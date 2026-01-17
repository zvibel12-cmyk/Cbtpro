'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { ChevronRight, ChevronLeft, MapPin, Video, Plus, Grid, Calendar, List, Clock } from 'lucide-react'
import AppointmentModal from '@/components/AppointmentModal'

export default function SchedulePage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: appts } = await supabase.from('appointments').select('*, profiles:patient_id(full_name)').eq('therapist_id', user?.id)
      const { data: pts } = await supabase.from('patients_mapping').select('patient_id, profiles:patient_id(full_name)').eq('therapist_id', user?.id)
      if (appts) setAppointments(appts)
      if (pts) setPatients(pts)
    }
    fetchData()
  }, [])

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayAppts = appointments.filter(a => a.start_time.startsWith(dateStr)).sort((a,b) => a.start_time.localeCompare(b.start_time))
    setSelectedDate(dateStr)
    setSelectedDayAppointments(dayAppts)
    setIsModalOpen(true)
  }

  const navigate = (direction: 'next' | 'prev') => {
    const multiplier = direction === 'next' ? 1 : -1;
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + 1 * multiplier);
    else if (view === 'week') d.setDate(d.getDate() + 7 * multiplier);
    else d.setDate(d.getDate() + 1 * multiplier);
    setCurrentDate(d);
  }

  // --- תצוגת חודש ---
  const MonthView = () => {
    const year = currentDate.getFullYear(), month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80">
          {['א','ב','ג','ד','ה','ו','ש'].map(d => <div key={d} className="py-3 text-center text-xs font-bold text-slate-400">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-100 gap-px">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="bg-white"></div>)}
          {days.map(day => {
            const dayStr = day.toISOString().split('T')[0];
            const isToday = new Date().toDateString() === day.toDateString();
            const dayAppts = appointments.filter(a => a.start_time.startsWith(dayStr));
            const hasAppts = dayAppts.length > 0;

            return (
              <div key={dayStr} onClick={() => handleDayClick(day)} className={`bg-white p-1 relative cursor-pointer hover:bg-slate-50 transition flex flex-col items-center justify-start py-2 ${hasAppts ? 'bg-blue-50/30' : ''}`}>
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${isToday ? 'bg-slate-800 text-white' : 'text-slate-700'}`}>{day.getDate()}</span>
                {hasAppts && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {dayAppts.slice(0, 4).map(a => (
                      <div key={a.id} className={`w-1.5 h-1.5 rounded-full ${a.location_type === 'zoom' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                    ))}
                  </div>
                )}
                {hasAppts && (
                   <div className="hidden md:block w-full px-1 mt-1 space-y-1">
                      {dayAppts.slice(0, 2).map(a => (
                        <div key={a.id} className="text-[9px] truncate bg-white border border-slate-100 rounded px-1 text-slate-600">
                           {new Date(a.start_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} {a.profiles?.full_name}
                        </div>
                      ))}
                   </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // --- תצוגת שבוע ---
  const WeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full overflow-x-auto">
         <div className="grid grid-cols-7 min-w-[600px] flex-1 divide-x divide-x-reverse divide-slate-100">
            {weekDays.map(day => {
               const dayStr = day.toISOString().split('T')[0];
               const dayAppts = appointments.filter(a => a.start_time.startsWith(dayStr)).sort((a,b) => a.start_time.localeCompare(b.start_time));
               const isToday = new Date().toDateString() === day.toDateString();

               return (
                 <div key={dayStr} className="flex flex-col">
                    <div className={`p-3 text-center border-b border-slate-100 ${isToday ? 'bg-primary-50' : ''}`}>
                       <div className="text-xs text-slate-400">{day.toLocaleDateString('he-IL', {weekday: 'short'})}</div>
                       <div className={`text-lg font-bold ${isToday ? 'text-primary-600' : 'text-slate-800'}`}>{day.getDate()}</div>
                    </div>
                    <div className="flex-1 p-2 space-y-2 relative cursor-pointer" onClick={() => handleDayClick(day)}>
                       {dayAppts.map(a => (
                          <div key={a.id} className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm text-xs group hover:border-primary-200">
                             <div className="font-bold flex justify-between">
                               {new Date(a.start_time).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})}
                               {a.location_type === 'zoom' ? <Video size={10} className="text-blue-500"/> : <MapPin size={10} className="text-orange-500"/>}
                             </div>
                             <div className="truncate text-slate-600">{a.profiles?.full_name}</div>
                          </div>
                       ))}
                       <div className="absolute inset-0 hover:bg-slate-50/30 transition"></div>
                    </div>
                 </div>
               )
            })}
         </div>
      </div>
    )
  }

  // --- תצוגת יום ---
  const DayView = () => {
    const dayStr = currentDate.toISOString().split('T')[0];
    const dayAppts = appointments.filter(a => a.start_time.startsWith(dayStr)).sort((a,b) => a.start_time.localeCompare(b.start_time));

    return (
       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 min-h-[500px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Calendar className="text-primary-500" /> {currentDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <div className="space-y-4">
             {dayAppts.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                   <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                   <p className="text-slate-400">אין פגישות ליום זה</p>
                </div>
             )}
             {dayAppts.map(a => (
                <div key={a.id} className="flex gap-4 items-center p-4 rounded-2xl border border-slate-100 bg-slate-50">
                   <div className="font-bold text-lg text-slate-700 w-20 text-center bg-white rounded-xl py-2 border border-slate-200">
                      {new Date(a.start_time).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})}
                   </div>
                   <div className="flex-1">
                      <div className="font-bold text-lg">{a.profiles?.full_name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                         {a.location_type === 'zoom' ? <Video size={14}/> : <MapPin size={14}/>}
                         {a.location_type === 'zoom' ? 'מפגש זום' : 'מפגש בקליניקה'}
                      </div>
                   </div>
                </div>
             ))}
             <button onClick={() => handleDayClick(currentDate)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:border-primary-200 hover:text-primary-600 transition flex items-center justify-center gap-2">
                <Plus size={20} /> הוסף פגישה חדשה
             </button>
          </div>
       </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-4 gap-4">
         <div className="flex items-center gap-4 w-full md:w-auto justify-between">
           <h1 className="text-xl md:text-2xl font-bold text-slate-800">{currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</h1>
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setView('month')} className={`p-2 rounded-lg transition ${view === 'month' ? 'bg-white shadow text-primary-600' : 'text-slate-400'}`}><Grid size={18} /></button>
             <button onClick={() => setView('week')} className={`p-2 rounded-lg transition ${view === 'week' ? 'bg-white shadow text-primary-600' : 'text-slate-400'}`}><Calendar size={18} /></button>
             <button onClick={() => setView('day')} className={`p-2 rounded-lg transition ${view === 'day' ? 'bg-white shadow text-primary-600' : 'text-slate-400'}`}><List size={18} /></button>
           </div>
         </div>
         <div className="flex gap-2 w-full md:w-auto justify-end">
            <button onClick={() => navigate('prev')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronRight size={20} /></button>
            <button onClick={() => navigate('next')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronLeft size={20} /></button>
         </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'month' && <MonthView />}
        {view === 'week' && <WeekView />}
        {view === 'day' && <DayView />}
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patients={patients} 
        preSelectedDate={selectedDate}
        existingAppointments={selectedDayAppointments}
      />
    </div>
  )
}
