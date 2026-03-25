import { useState, useRef, useEffect } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { Input } from '@/components/ui/input';

interface Student {
  name: string;
  class: string;
  division: string;
}

interface StudentAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (student: Student) => void;
}

export default function StudentAutocomplete({ value, onChange, onSelect }: StudentAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data: students } = useStudents(value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        placeholder="Student name"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.length > 0 && setOpen(true)}
      />
      {open && students && students.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto animate-scale-in">
          {students.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors text-sm"
              onClick={() => {
                onSelect({ name: s.name, class: s.class, division: s.division });
                setOpen(false);
              }}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground ml-2">
                Class {s.class} {s.division}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
