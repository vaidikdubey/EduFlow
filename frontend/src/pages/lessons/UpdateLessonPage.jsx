import React, { useEffect } from 'react'
import { useLessonStore } from '@/stores/useLessonStore'
import { useParams } from 'react-router-dom';

export const UpdateLessonPage = () => {
  const { id } = useParams();

  const { getLessonById, isGettingLesson, lessonById, updateLesson, isUpdatingLesson, updatedLesson } = useLessonStore();


  useEffect(() => {
    getLessonById(id);
    //eslint-disable-next-line
  }, [])
  
  console.log("Lesson: ", lessonById?.data);

  return (
    <div>UpdateLessonPage</div>
  )
}
