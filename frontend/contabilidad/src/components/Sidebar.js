// Sidebar.js
import React from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, List, ListItem, useDisclosure, IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton icon={<HamburgerIcon />} onClick={onOpen} aria-label="Open Menu" variant="outline" />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <List spacing={3}>
                            <ListItem>
                                <Link to="/dashboard" onClick={onClose}>Dashboard</Link>
                            </ListItem>
                            <ListItem>
                                <Link to="/list-conts" onClick={onClose}>Cuentas</Link>
                            </ListItem>
                            {/* Agrega más enlaces según sea necesario */}
                        </List>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;
