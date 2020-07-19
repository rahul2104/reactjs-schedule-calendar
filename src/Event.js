import React from 'react'
import {useDrag} from 'react-dnd'
import {ItemTypes} from './constants'

export default function Event({
  children,
  onDrop,
  canDrag = true,
  ...props
}) {
  let passedData;
  if(props) {
    passedData = props.passedData;
  } else {
    passedData = '';
  }
  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.EVENT, ...props },
    end: (_, monitor) => {
      if (!monitor.didDrop()) return
      const result = monitor.getDropResult()
      if (onDrop) onDrop({ target: result, source: props })
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag,
  });

  return (
    <div ref={drag}>
      {children({ props, isDragging, passedData })}
    </div>
  )
}
