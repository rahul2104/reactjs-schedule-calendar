import React from 'react'
import { startOfDay, format } from 'date-fns'
import './style.css'
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import {createTimeSlices, formatMinutes, displayAppointment} from './utils'

function DailySchedule({
  slices = 30,
  day = new Date(),
  excludeRanges = [],
  appointments = [],
  onDrop,
  dayFormat = 'dd/MM/yyyy',
  timeFormat = 'HH:mm',
  timeTDFormatter = (start, end) => `${start} ${end}`,
  EventComponent = () => null,
  thead = null,
  BucketComponent = () => null,
  dragEnable = true,
  ...props
}) {
  let passedData;
  if(props && props.metaData) {
    passedData = props.metaData;
  } else {
    passedData = '';
  }
  const timeSlices = createTimeSlices(slices, excludeRanges)
  const formatHours = formatMinutes(startOfDay(day), timeFormat)
  const THeadComponent = thead || (
      <tr>
        <td />
        <td>{format(day, dayFormat)}</td>
      </tr>
  )
  return (
    <DndProvider backend={Backend}>
      <table className='daily-schedule'>
        <thead>
          {THeadComponent}
        </thead>
        <tbody>
          {timeSlices.map(ts => (
            <tr key={ts.start}>
              <td width="10">{timeTDFormatter(formatHours(ts.start), formatHours(ts.end))}</td>
              {displayAppointment({
                timeSlice: ts,
                appointments,
                canDrag: dragEnable,
                slices,
                onDrop,
                EventComponent,
                BucketComponent,
                passedData
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </DndProvider>
  )
}

export default DailySchedule
