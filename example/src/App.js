import React, { Component } from 'react'

import DailySchedule from 'reactjs-schedule-calendar'
import 'reactjs-schedule-calendar/dist/index.css'

const exclude = [
  { start: 0, end: 540 },
  { start: 1080, end: 1440 },
  { start: 840, end: 900 }
]
const metaData = {'name': 'demo'}
export default class DailyScheduler extends Component {
  constructor(props) {
    super(props)

    this.onMoveEvent = this.onMoveEvent.bind(this)

    this.state = {
      appointments: [
        { id: 0, start: 540, end: 600 },
        { id: 1, start: 660, end: 690 },
        { id: 2, start: 720, end: 750 },
        { id: 3, start: 780, end: 840 }
      ]
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
    console.log(data)
  }

  addAppointment(data) {
    this.setState({
      appointments: [
        ...this.state.appointments,
        { start: data.start, end:data.end, id: this.state.appointments.length },
      ]
    });
    console.log(data)
  }


  render() {
    return (
      <DailySchedule
        excludeRanges={exclude}
        appointments={this.state.appointments}
        onDrop={this.onMoveEvent}
        BucketComponent={( data ) => <button onClick={() => this.addAppointment(data)}>+</button>}
        EventComponent={({ data }) => <div>Appointment {data}</div>}
        metaData={metaData}
      />
    )
  }
}
