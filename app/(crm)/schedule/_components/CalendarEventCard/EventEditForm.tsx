"use client";

import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { Button } from "@/components/Button";
import { UpdateEventInput } from "@/hooks/useCalendarEvents";

interface EventEditFormProps {
  editForm: UpdateEventInput;
  onFormChange: (form: UpdateEventInput) => void;
  formErrors: Record<string, string>;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function EventEditForm({
  editForm,
  onFormChange,
  formErrors,
  onSave,
  onCancel,
  isSaving,
}: EventEditFormProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-theme-darkest mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={editForm.title || ""}
          onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
          placeholder="Event title"
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
        )}
      </div>

      {/* Date/Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-darkest mb-1">
            Start <span className="text-red-500">*</span>
          </label>
          <Input
            type={editForm.isAllDay ? "date" : "datetime-local"}
            value={editForm.isAllDay 
              ? editForm.startTime?.split('T')[0] || ""
              : editForm.startTime?.slice(0, 16) || ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const newStartTime = editForm.isAllDay 
                ? `${value}T00:00:00`
                : value;
              onFormChange({ ...editForm, startTime: newStartTime });
            }}
          />
          {formErrors.startTime && (
            <p className="text-red-500 text-sm mt-1">{formErrors.startTime}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-darkest mb-1">
            End <span className="text-red-500">*</span>
          </label>
          <Input
            type={editForm.isAllDay ? "date" : "datetime-local"}
            value={editForm.isAllDay 
              ? editForm.endTime?.split('T')[0] || ""
              : editForm.endTime?.slice(0, 16) || ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const newEndTime = editForm.isAllDay 
                ? `${value}T23:59:59`
                : value;
              onFormChange({ ...editForm, endTime: newEndTime });
            }}
          />
          {formErrors.endTime && (
            <p className="text-red-500 text-sm mt-1">{formErrors.endTime}</p>
          )}
        </div>
      </div>

      {/* All-day toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={editForm.isAllDay || false}
          onChange={(e) => onFormChange({ ...editForm, isAllDay: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="isAllDay" className="text-sm font-medium text-theme-darkest">
          All-day event
        </label>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-theme-darkest mb-1">
          Location
        </label>
        <Input
          value={editForm.location || ""}
          onChange={(e) => onFormChange({ ...editForm, location: e.target.value })}
          placeholder="Event location"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-theme-darkest mb-1">
          Description
        </label>
        <Textarea
          value={editForm.description || ""}
          onChange={(e) => onFormChange({ ...editForm, description: e.target.value })}
          placeholder="Event description"
          rows={4}
        />
      </div>

      {/* Attendees */}
      <div>
        <label className="block text-sm font-medium text-theme-darkest mb-1">
          Attendees (one email per line)
        </label>
        <Textarea
          value={editForm.attendees?.join('\n') || ""}
          onChange={(e) => {
            const emails = e.target.value.split('\n').filter(email => email.trim() !== '');
            onFormChange({ ...editForm, attendees: emails });
          }}
          placeholder="email@example.com"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

