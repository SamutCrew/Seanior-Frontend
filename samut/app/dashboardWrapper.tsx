import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const DashboardWrapper = ({ children } : { children: React.ReactNode}) => {
    return (
        <div className='flex min-h-screem w-full bg-gray-50 text-gray-900'>
            {/*sidebar */}<Sidebar/>
            <main className='flex w-full flex-col bg-gray-50 dark:bg-dark-bg md:pl-64'>
                {/*navbar*/}<Navbar/>
                {children}
            </main>
        </div>
    )
}

export default DashboardWrapper
