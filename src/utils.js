import {addMinutes, format} from 'date-fns'
import {find} from 'lodash'
import React from 'react'

import {MINUTESINDAY} from './constants'
import Event from './Event'
import Bucket from './Bucket'

export function overlaps(range1, range2) {
  return range1.start < range2.end && range2.start < range1.end
}

export function formatMinutes(dateStart, timeFormat) {
  return minutes => format(addMinutes(dateStart, minutes), timeFormat)
}

export function arrayOverlaps(array, interval) {
  return array.some(other => overlaps(other, interval))
}

export function createTimeSlices(slices, excludeRanges) {
  return new Array(Math.round(MINUTESINDAY / slices))
    .fill(0)
    .map((_, index) => ({ start: slices * index, end: slices * (index + 1) }))
    .filter((range) => !arrayOverlaps(excludeRanges, range))
}

function shift(interval, slices) {
  return { start: interval.start + slices, end: interval.end + slices }
}

function canDrop(appointments, interval, slices) {
  return (data) => {
    const duration = data.end - data.start
    return duration > slices ? appointments.filter(a => a.id !== data.id).filter(a => overlaps(a, shift(interval, slices))).length === 0 : true
  }
}

function filterAppoinment (min, max){
  return function (a) { return a >= min && a <= max; };
}

export function displayAppointment({
  timeSlice,
  appointments,
  slices,
  onDrop,
  EventComponent,
  BucketComponent,
  canDrag,
  ...props
}) {
  let passedData;
  if(props) {
    passedData = props.passedData;
  } else {
    passedData = '';
  }
  const starting = find(appointments, app => app.start === timeSlice.start)
  const ending = find(appointments, app => app.end === timeSlice.end)
  // need to serve data with appointments how many appointment...
 
  const appStartTimeArr = appointments.map(timeres=>timeres.start);
  const appEndTimeArr = appointments.map(timeres=>timeres.end);
  let maxTime = Math.max(...appEndTimeArr);
  let minTime = Math.min(...appStartTimeArr);
  let seArr = appStartTimeArr.concat(appEndTimeArr);
  let slotAppointments = seArr.filter(filterAppoinment(minTime,maxTime));
 
  const counts = {};
  slotAppointments.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });

  let newTimeSlots = [];
  for (const [key, value] of Object.entries(counts)) {
    newTimeSlots.push(value);
  }

  let slotSpan = Math.max(...newTimeSlots);
  slotSpan=(slotSpan!=-Infinity)?slotSpan:'';

  if (!starting && ending) {
    /*
    *   An appointment ends in this interval, but doesn't start right now, render nothing as this will be occupied by a rowSpan
    * */
    return null
  }

  if (!starting) {
    /*
    *   No appointment found nor starting nor ending in this interval, render an empty cell
    * */
    return (
      <td colSpan={slotSpan} className='daily-schedule-bucket-container'>
        <Bucket {...timeSlice} canDrop={canDrop(appointments, timeSlice, slices)}>
          {(data) => {
            return <BucketComponent {...data } {...props}/>
          }}
        </Bucket>
      </td>
    )
  }

  const startSpanning = Math.round((starting.end - starting.start) / slices)

 // console.log('oooooooooo',starting,ending);
  // if ((starting === ending) || (starting && !ending)) {
    const { component: Component = EventComponent, className, ...otherProps } = starting
    return (
        <td rowSpan={startSpanning} className={`daily-schedule__event ${className}`}>
        <Event {...otherProps} onDrop={onDrop} {...props} canDrag={canDrag}>
          {(data) => <Component {...data}/>}
        </Event>
      </td>
    )
  //}

  //throw Error("Appointments can't overlap")
}