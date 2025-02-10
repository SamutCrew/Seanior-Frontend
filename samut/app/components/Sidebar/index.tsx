"use client"
import React , {useState} from 'react'

const Sidebar = () => {
    const [showProject, setShowProject] = useState(true);
    const [showPriority, setShowPriority] = useState(true);

    const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white w-64`
  return (
    <div className={sidebarClassNames}>
        <div className='flex h-[100%] w-full flex-col justify-start'></div>
    </div>
  )
}

export default Sidebar 