import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEventsForMonth, getUpcomingEvents, eventTypeColors } from '../../data/calendar';

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, upcoming

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const events = getEventsForMonth(year, month);
  const upcomingEvents = getUpcomingEvents(10);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 bg-gray-50" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border border-gray-200 ${isToday ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event, idx) => {
              const colors = eventTypeColors[event.type] || eventTypeColors.admin;
              return (
                <div
                  key={idx}
                  className={`text-xs p-1 rounded ${colors.bg} ${colors.text} truncate`}
                  title={event.title}
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Academic Calendar
            </h2>
            <p className="text-gray-600 mt-1">Important dates and events</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('month')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'month' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
          }`}
        >
          Month View
        </button>
        <button
          onClick={() => setView('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
          }`}
        >
          Upcoming Events
        </button>
      </div>

      {/* Month View */}
      {view === 'month' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-indigo-700 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-indigo-700 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-100 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {/* Upcoming Events View */}
      {view === 'upcoming' && (
        <div className="space-y-3">
          {upcomingEvents.map(event => {
            const colors = eventTypeColors[event.type] || eventTypeColors.admin;
            return (
              <div key={event.id} className="bg-white border rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {event.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold text-gray-900 mb-3">Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(eventTypeColors).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${colors.bg} border ${colors.border}`} />
              <span className="text-sm text-gray-700 capitalize">{type.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
