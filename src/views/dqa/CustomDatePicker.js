import React from 'react';
import ReactDatePicker from 'react-datepicker';

const CustomDatePicker = ({ value, onChange, placeholder = "Select Date" }) => {
  return (
    <ReactDatePicker
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : "")}
      dateFormat="yyyy-MM-dd"
      className="form-control"
      placeholderText={placeholder}
    />
  );
};

export default CustomDatePicker;