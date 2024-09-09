import React from 'react'
import Menu from '../Menu/index'
import { Outlet } from 'react-router-dom'
import { PageWidth } from './styled'
const Loyaut: React.FC = () => {
    return (
        <PageWidth>
            <aside>
                <Menu />
            </aside>
            <main>
                <Outlet />
            </main>
        </PageWidth>
    )
}

export default Loyaut