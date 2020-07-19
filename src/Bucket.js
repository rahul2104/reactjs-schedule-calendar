import React from 'react'
import {useDrop} from 'react-dnd'
import classnames from 'classnames'

import {ItemTypes} from './constants'

export default function Bucket({ start, end, canDrop, children, ...props }) {
  let passedData;
  if(props) {
    passedData = props;
  } else {
    passedData = '';
  }
  const [{ isOver, canDrop: cd }, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: () => ({ start, end }),
    canDrop,
    hover: (_, monitor) => {
      if (!monitor.canDrop()) {

      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  })

  return (
    <div
      ref={drop}
      className={classnames('daily-schedule-bucket', {
        'daily-schedule-bucket__over': isOver && cd,
        'daily-schedule-bucket__can-drop': !isOver && cd
      })}
    >{children({ start, end, passedData  })}</div>
  )
}
