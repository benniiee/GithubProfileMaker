import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Primitives';

/**
 * Color input that isolates high-frequency drag events
 * Local state provides instant 60fps UI feedback, while onCommit fires on settled change or blur.
 */
export const ColorInput = ({
  value = '000000',
  onChange,
  className = '',
  showHexInput = true,
  placeholder = 'HEX',
}) => {
  const cleanHex = (val) => (val ? String(val).replace('#', '') : '000000');
  const [liveValue, setLiveValue] = useState(() => cleanHex(value));
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLiveValue(cleanHex(value));
  }, [value]);

  const handleColorChange = (e) => {
    const nextHex = cleanHex(e.target.value);
    setLiveValue(nextHex);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(nextHex);
    }, 80);
  };

  const handleHexInputChange = (e) => {
    const nextHex = cleanHex(e.target.value);
    setLiveValue(nextHex);
    onChange(nextHex);
  };

  const handleBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onChange(liveValue);
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <input
        type="color"
        value={`#${liveValue}`}
        onChange={handleColorChange}
        onBlur={handleBlur}
        className="w-7 h-8 rounded border border-border cursor-pointer p-0.5 bg-background shrink-0"
        title="Pick color"
      />
      {showHexInput && (
        <Input
          value={liveValue}
          onChange={handleHexInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="h-8 text-xs font-mono flex-1"
        />
      )}
    </div>
  );
};

/**
 * Range slider with local live feedback to decouple 60fps drag from global re-renders
 */
export const DebouncedSlider = ({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = '',
}) => {
  const [liveValue, setLiveValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    setLiveValue(value);
  }, [value]);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setLiveValue(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 60);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onChange(liveValue);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={liveValue}
      onChange={handleChange}
      onPointerUp={handlePointerUp}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      className={`w-full h-2 bg-secondary rounded-lg cursor-pointer ${className}`}
    />
  );
};

