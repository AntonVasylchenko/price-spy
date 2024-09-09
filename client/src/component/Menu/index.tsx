import React from 'react'
import { MenuType } from '../../types';
import { NavLink } from 'react-router-dom';
import { routersPath } from "../../router"
import { useTranslation } from 'react-i18next';
import { Navigation } from './styled';

const Menu: React.FC = () => {
    const { t } = useTranslation();

    const handleCreateMenu = (arrayMenu: MenuType): JSX.Element[] => {
        const menu = arrayMenu.map(elementMenu => {
            const id = React.useId();
            const { path, name } = elementMenu;

            const translateName = t(`${name}`)
            return (
                <li key={id}>
                    <NavLink
                        className={({ isActive }) => isActive ? "active" : ""}
                        to={path}
                    >
                        {translateName}
                    </NavLink>
                </li>
            );
        });
        return menu;
    }

    return (
        <Navigation>
            <ul>
                {handleCreateMenu(routersPath)}
            </ul>
        </Navigation>
    )
}

export default Menu