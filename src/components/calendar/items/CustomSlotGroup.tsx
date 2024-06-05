import React from 'react';
import { TimeSlotGroupProps } from 'react-big-calendar';
import moment from 'moment';

const CustomSlotGroup: React.FC<TimeSlotGroupProps> = ({ renderTimeSlot, group }) => {
  const slots = [
    { start: moment(group).hour(7).minute(0), end: moment(group).hour(9).minute(15) },
    { start: moment(group).hour(9).minute(15), end: moment(group).hour(11).minute(30) },
    { start: moment(group).hour(12).minute(30), end: moment(group).hour(14).minute(45) },
    { start: moment(group).hour(14).minute(45), end: moment(group).hour(17).minute(0) },
    { start: moment(group).hour(17).minute(0), end: moment(group).hour(19).minute(15) },
    { start: moment(group).hour(19).minute(15), end: moment(group).hour(21).minute(30) },
    { start: moment(group).hour(21).minute(30), end: moment(group).hour(23).minute(45) },
  ];

  return (
    <div className="rbc-timeslot-group custom-timeslot-group">
      {slots.map((slot, idx) => (
        <div key={idx} className="rbc-time-slot" style={{ height: '130px' }}>
          {renderTimeSlot({ key: idx, group, idx, value: slot.start })}
          {renderTimeSlot({ key: idx + '-end', group, idx, value: slot.end })}
        </div>
      ))}
    </div>
  );
};

export default CustomSlotGroup;