import React from 'react';

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App';
import { ErrorPage } from './component/index.ts';
import { MenuType } from './types/index.ts';
import { Settings } from './Pages/index.ts';

function PageLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}


export const routersPath: MenuType = [
    {
        name: 'menu.all',
        path: "/",
    },
    {
        name: 'menu.create',
        path: "/create",
    },
    {
        name: 'menu.settings',
        path: "/settings",
    }
]


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        id: "root",
        children: [
            {
                path: "/",
                element: <PageLayout />,
                children: [
                    {
                        index: true,
                        element: <div>All</div>
                    }
                ]
            },
            {
                path: "/observer/:observerId",
                element: <div>Observer</div>
            },
            {
                path: "/observer/:observerId/edit",
                element: <div>Observer edit</div>
            },
            {
                path: "create",
                element: <PageLayout />,
                children: [
                    {
                        index: true,
                        element: <div>Create</div>
                    }
                ]
            },
            {
                path: "settings",
                element: <PageLayout />,
                children: [
                    {
                        index: true,
                        element: <Settings />
                    }
                ]
            }
        ]
    }
]);

export default router;
