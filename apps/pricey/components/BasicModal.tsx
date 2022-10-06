

import { IconButton, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FC, PropsWithChildren, ReactNode, useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export interface BasicModalProps extends PropsWithChildren {
    icon: ReactNode    
}

const BasicModal: FC<BasicModalProps> = ({ icon, children }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // <HelpOutlineIcon />
    return (
        <Box>
            <IconButton onClick={handleOpen}>{icon}</IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Paper sx={style}>                    
                    {children}                    
                </Paper>
            </Modal>
        </Box>
    );
};
export default BasicModal;