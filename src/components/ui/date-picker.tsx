import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
  selected?: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function CustomDatePicker({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className,
  disabled = false,
  error = false,
}: CustomDatePickerProps) {
  return (
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        placeholderText={placeholder}
        dateFormat="MMM dd, yyyy"
        showPopperArrow={false}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        wrapperClassName="w-full"
        calendarClassName="rounded-lg border shadow-lg"
        dayClassName={date => {
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isSelected =
            selected && date.toDateString() === selected.toDateString();

          return cn(
            'hover:bg-brand-light hover:text-brand-primary rounded-md p-2 text-center text-sm transition-colors',
            isToday &&
              'bg-brand-light text-brand-primary font-semibold border border-brand-primary',
            isSelected && 'bg-brand-primary text-white font-semibold',
            date < today && 'text-muted-foreground opacity-50'
          );
        }}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between p-3 border-b">
            <button
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="p-2 hover:bg-accent rounded-md disabled:opacity-50"
            >
              ←
            </button>
            <span className="font-semibold text-lg">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="p-2 hover:bg-accent rounded-md disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-primary pointer-events-none" />
    </div>
  );
}
