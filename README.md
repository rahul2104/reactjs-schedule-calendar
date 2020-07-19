# Reactjs-schedule-calendar

> react package to handle daily calendar schedules

## Quick Start

### 1. Import reactjs-schedule-calendar into your react.js project.

(You should import react first,The version of react must be more than 16.x)

Using build tools:

```bash
npm install --save reactjs-schedule-calendar
```
Using scheduler in Project:
```js
import DailySchedule from 'reactjs-schedule-calendar'
import 'reactjs-schedule-calendar/dist/index.css'
```

### 2. Now you have it. The simplest usage:

```js
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
        { id: 3, start: 780, end: 840 },
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
        slices={10}
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
```

####  Props in Reactjs-schedule-calendar

<table>
        <tr>
            <th>Props name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
        <tr>
            <th>slices</th>
            <th>number</th>
            <th>schedule time interval</th>
        </tr>
        <tr>
            <th>excludeRanges</th>
            <th>object of array</th>
            <th>exclude from the ranges</th>
        </tr>
        <tr>
            <th>appointments</th>
            <th>object of array</th>
            <th>appointment slots</th>
        </tr>
        <tr>
            <th>onDrop</th>
            <th>function</th>
            <th>on mouse drag </th>
        </tr>
        <tr>
            <th>BucketComponent</th>
            <th></th>
            <th>it will return start & end time of slot and metaData</th>
        </tr>
        <tr>
            <th>EventComponent</th>
            <th></th>
            <th>it will create slots interval</th>
        </tr>
        <tr>
            <th>metaData</th>
            <th>object</th>
            <th>this object will return in bucket component</th>
        </tr>
    </table>
