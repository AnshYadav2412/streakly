import React, { useState, useRef, useEffect } from 'react';

const TimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('9');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const dropdownRef = useRef(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        setSelectedHour(match[1]);
        setSelectedMinute(match[2]);
        setSelectedPeriod(match[3].toUpperCase());
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ['00', '15', '30', '45'];

  const handleApply = () => {
    const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const handleQuickSelect = (hour, minute, period) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
    const timeString = `${hour}:${minute} ${period}`;
    onChange(timeString);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {value || 'Select time'}
        </span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          {/* Quick Select Buttons */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect('6', '00', 'AM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                6:00 AM
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('9', '00', 'AM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                9:00 AM
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('12', '00', 'PM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                12:00 PM
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('3', '00', 'PM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                3:00 PM
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('6', '00', 'PM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                6:00 PM
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('9', '00', 'PM')}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
              >
                9:00 PM
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Custom Time</label>
            
            {/* Time Selectors */}
            <div className="flex items-center gap-2 mb-4">
              {/* Hour */}
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>

              <span className="text-xl font-bold text-gray-400">:</span>

              {/* Minute */}
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="w-full btn-primary btn-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
