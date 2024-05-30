import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthSucceedTest() {
    return (
        <div>Congrats, u logged successfully as Lecture

            <Link className='nav-link' to={'/login'}>
                checkin
            </Link>
        </div>
    )
}
