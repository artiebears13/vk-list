import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';

const Header: React.FC = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <header className={styles.header}>
            <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 24 }} />}
                onClick={showDrawer}
            />

            <Drawer
                title="Меню"
                placement="left"
                onClose={onClose}
                open={open}
            >
                <nav className={styles.drawerNav}>
                    <Link to="/" onClick={onClose} className={styles.navItem}>
                        Главная
                    </Link>
                    <Link to="/favorites" onClick={onClose} className={styles.navItem}>
                        Любимые
                    </Link>
                </nav>
            </Drawer>
        </header>
    );
};

export default Header;
