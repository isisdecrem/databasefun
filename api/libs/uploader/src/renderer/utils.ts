import { remote } from 'electron';

export const handleMouseEnter = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true });
};

export const handleMouseLeave = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true);
};
