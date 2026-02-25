import React from 'react'
import { useLessonStore } from '@/stores/useLessonStore'
import { useParams } from 'react-router-dom';

export const UpdateLessonPage = () => {
  const { id } = useParams();

  const { getLessonById, isGettingLesson, lessonById, updateLesson, isUpdatingLesson, updatedLesson } = useLessonStore();


  return (
    <div>UpdateLessonPage</div>
  )
}
