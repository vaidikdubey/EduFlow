import React from 'react'
import { useModuleStore } from '@/stores/useModuleStore'

export const CreateModulePage = () => {
  const { createModule, isCreatingModule, createdModule } = useModuleStore();
  
  return (
    <div>CreateModulePage</div>
  )
}
