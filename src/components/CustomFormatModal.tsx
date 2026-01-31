import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Modal } from './Modal';
import { NumberInput } from './NumberInput';
import {
  addCustomFormatAtom,
  updateCustomFormatAtom,
  deleteCustomFormatAtom,
} from '@/atoms';
import { VALIDATION } from '@/calc';
import type { Format } from '@/calc';

interface CustomFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formatId: string) => void;
  editFormat?: Format | null;
}

interface FormProps {
  editFormat: Format | null;
  onClose: () => void;
  onSave: (formatId: string) => void;
}

function CustomFormatForm({ editFormat, onClose, onSave }: FormProps) {
  const addFormat = useSetAtom(addCustomFormatAtom);
  const updateFormat = useSetAtom(updateCustomFormatAtom);
  const deleteFormat = useSetAtom(deleteCustomFormatAtom);

  const [name, setName] = useState(editFormat?.name ?? '');
  const [width, setWidth] = useState<number | null>(editFormat?.width ?? null);
  const [height, setHeight] = useState<number | null>(
    editFormat?.height ?? null
  );

  const isEditMode = !!editFormat;

  const isValid =
    width !== null &&
    width >= VALIDATION.formatDimension.min &&
    height !== null &&
    height >= VALIDATION.formatDimension.min;

  const handleSave = () => {
    if (!isValid || width === null || height === null) return;

    const formatName = name.trim() || `${width}x${height}mm`;

    if (isEditMode && editFormat) {
      updateFormat({
        id: editFormat.id,
        name: formatName,
        width,
        height,
      });
      onSave(editFormat.id);
    } else {
      const newId = addFormat({
        name: formatName,
        width,
        height,
      });
      onSave(newId);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editFormat) return;
    deleteFormat(editFormat.id);
    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Name field */}
      <div>
        <label
          htmlFor="format-name"
          className="block text-label text-text-secondary uppercase tracking-wider mb-1"
        >
          Name
        </label>
        <input
          id="format-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
          className="
            w-full bg-surface border border-border rounded-md px-3 py-2
            text-body text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0
          "
        />
      </div>

      {/* Width field */}
      <div>
        <label
          htmlFor="format-width"
          className="block text-label text-text-secondary uppercase tracking-wider mb-1"
        >
          Width
        </label>
        <NumberInput
          id="format-width"
          value={width}
          onChange={setWidth}
          min={VALIDATION.formatDimension.min}
          step={0.1}
          placeholder="Enter width"
          suffix="mm"
        />
      </div>

      {/* Height field */}
      <div>
        <label
          htmlFor="format-height"
          className="block text-label text-text-secondary uppercase tracking-wider mb-1"
        >
          Height
        </label>
        <NumberInput
          id="format-height"
          value={height}
          onChange={setHeight}
          min={VALIDATION.formatDimension.min}
          step={0.1}
          placeholder="Enter height"
          suffix="mm"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2">
        {isEditMode && (
          <button
            onClick={handleDelete}
            className="
              px-3 py-2 rounded-md text-body
              text-error hover:bg-error/10
              focus:outline-none focus:ring-2 focus:ring-error
            "
          >
            Delete
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="
            px-3 py-2 rounded-md text-body
            text-text-secondary hover:text-text-primary
            focus:outline-none focus:ring-2 focus:ring-accent
          "
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="
            px-3 py-2 rounded-md text-body
            bg-accent text-white
            hover:bg-accent/90
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface
          "
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function CustomFormatModal({
  isOpen,
  onClose,
  onSave,
  editFormat,
}: CustomFormatModalProps) {
  const isEditMode = !!editFormat;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Custom Format' : 'New Custom Format'}
    >
      {isOpen && (
        <CustomFormatForm
          editFormat={editFormat ?? null}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}
