'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Code, List } from 'lucide-react';
import { Input } from '@/components/atoms/Input.jsx';
import { Button } from '@/components/atoms/Button.jsx';

export function JsonFieldEditor({
  value = '',
  onChange,
  placeholderKey = 'Header Name (e.g. apikey)',
  placeholderValue = 'Header Value',
  defaultKeys = [],
}) {
  const [mode, setMode] = useState('builder'); // 'builder' | 'raw'
  const [pairs, setPairs] = useState([{ key: '', value: '' }]);
  const [rawJson, setRawJson] = useState(value);

  // Parse raw JSON value into key-value pairs
  useEffect(() => {
    setRawJson(value || '');
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          const newPairs = Object.entries(parsed).map(([k, v]) => ({
            key: k,
            value: typeof v === 'object' ? JSON.stringify(v) : String(v),
          }));
          if (newPairs.length > 0) {
            setPairs(newPairs);
            return;
          }
        }
      } catch (e) {
        // Raw value is not valid JSON object, keep raw mode
      }
    }
  }, [value]);

  // Sync pairs to parent JSON string
  const updatePairs = (newPairs) => {
    setPairs(newPairs);
    const obj = {};
    newPairs.forEach(({ key, value }) => {
      if (key.trim()) {
        obj[key.trim()] = value;
      }
    });
    const jsonStr = Object.keys(obj).length > 0 ? JSON.stringify(obj, null, 2) : '';
    setRawJson(jsonStr);
    if (onChange) onChange(jsonStr);
  };

  const handlePairChange = (index, field, val) => {
    const next = [...pairs];
    next[index][field] = val;
    updatePairs(next);
  };

  const handleAddPair = (keyName = '', valName = '') => {
    updatePairs([...pairs, { key: keyName, value: valName }]);
  };

  const handleRemovePair = (index) => {
    const next = pairs.filter((_, i) => i !== index);
    updatePairs(next.length > 0 ? next : [{ key: '', value: '' }]);
  };

  const handleRawChange = (e) => {
    const str = e.target.value;
    setRawJson(str);
    if (onChange) onChange(str);

    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === 'object' && parsed !== null) {
        const newPairs = Object.entries(parsed).map(([k, v]) => ({
          key: k,
          value: typeof v === 'object' ? JSON.stringify(v) : String(v),
        }));
        if (newPairs.length > 0) setPairs(newPairs);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {defaultKeys.map((defKey) => (
            <button
              key={defKey}
              type="button"
              onClick={() => handleAddPair(defKey, '')}
              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
            >
              + {defKey}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMode(mode === 'builder' ? 'raw' : 'builder')}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {mode === 'builder' ? (
            <>
              <Code className="w-3.5 h-3.5" /> Edit Raw JSON
            </>
          ) : (
            <>
              <List className="w-3.5 h-3.5" /> Key-Value Builder
            </>
          )}
        </button>
      </div>

      {mode === 'builder' ? (
        <div className="space-y-2">
          {pairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder={placeholderKey}
                value={pair.key}
                onChange={(e) => handlePairChange(idx, 'key', e.target.value)}
                className="flex-1 text-xs"
              />
              <Input
                placeholder={placeholderValue}
                value={pair.value}
                onChange={(e) => handlePairChange(idx, 'value', e.target.value)}
                className="flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => handleRemovePair(idx)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => handleAddPair('', '')}
            className="text-xs py-1"
          >
            Add Key-Value Pair
          </Button>
        </div>
      ) : (
        <textarea
          rows={3}
          value={rawJson}
          onChange={handleRawChange}
          placeholder='{"key": "value"}'
          className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}
