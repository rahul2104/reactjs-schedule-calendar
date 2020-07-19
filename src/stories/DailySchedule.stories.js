import React from 'react'
import { action } from '@storybook/addon-actions'

import DailySchedule from '../index'

export default {
  component: DailySchedule,
  title: 'DailySchedule',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
}

export const actionsData = {
  onDrop: action('onDrop')
}

export const Default = () => <DailySchedule {...actionsData} />

export const Formatters = () => (<DailySchedule
  {...actionsData}
  dayFormat={'d MMMM yyyy'}
  timeFormat={'h:mm aaaa'}
  slices={60 * 2}
  timeTDFormatter={(start, end) => `${start} - ${end}`}
  day={new Date(1990, 0, 1)}
/>)

export const HourSchedule = () => <DailySchedule slices={60} {...actionsData} />

/*
*
* start at 9:00
* launch break at 14:00
* start again at 15:00
* end at 18:00
*
*  */
const exclude = [
  { start: 0, end: 540 },
  { start: 1080, end: 1440 },
  { start: 840, end: 900 }
]
export const WorkSchedule = () => <DailySchedule excludeRanges={exclude} {...actionsData} />

const appointments = [
  { start: 540, end: 570, component: () => <div>Appuntamento 1</div> }
]

export const WorkScheduleWithAppointments = () => <DailySchedule excludeRanges={exclude} appointments={appointments} {...actionsData} />

const appointments2 = [
  { id: 1, start: 540, end: 600, component: () => <div>Appuntamento 1</div> },
  { id: 2, start: 660, end: 690, component: () => <div>Appuntamento 2</div> }
]

export const AppointmentsMultiple = () => <DailySchedule excludeRanges={exclude} appointments={appointments2} />

const appointmentsOverlapping = [
  { start: 540, end: 600, component: () => <div>Appuntamento 1</div> },
  { start: 570, end: 600, component: () => <div>Appuntamento 2</div> }
]

export const AppointmentsOverlapping = () => <DailySchedule excludeRanges={exclude} appointments={appointmentsOverlapping} {...actionsData} />

class DailyScheduleWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.onMoveEvent = this.onMoveEvent.bind(this)

    this.state = {
      appointments: [
        { id: 1, start: 540, end: 600, component: () => <div>Appuntamento 1</div> },
        { id: 2, start: 660, end: 690, component: () => <div>Appuntamento 2</div> },
        { id: 3, start: 720, end: 750, component: () => <div>Appuntamento 3</div> },
        { id: 4, start: 780, end: 840, component: () => <div>Appuntamento 4</div> }]
    }
  }

  onMoveEvent(data) {
    this.setState({
      appointments: this.state.appointments.map(appointment => {
        if (appointment.id === data.source.id) {
          const duration = data.source.end - data.source.start
          return { ...appointment, start: data.target.start, end: data.target.start + duration }
        }

        return appointment
      })
    })
  }

  render() {
    return (
      <DailySchedule excludeRanges={exclude} appointments={this.state.appointments} onDrop={this.onMoveEvent} />
    )
  }
}

export const Complete = () => <DailyScheduleWrapper />
