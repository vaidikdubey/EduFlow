import React from 'react'
import { useParams } from 'react-router-dom'

export const AttemptQuiz = () => {
  const { id } = useParams();

  return (
    <div>AttemptQuiz</div>
  )
}
