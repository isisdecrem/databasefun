const parseCookie = (str) =>
    str
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
            );
            return acc;
        }, {});

const connectToSocket = async (id, callbacks) => {
	const {connectCallback, statusCallback, disconnectCallback} = callbacks;
    const socket = io('/migrate/git-connect-socket/' + id);
    socket.on('connect', () => {
    	connectCallback && connectCallback();
        socket.emit('join');
        socket.emit('execute');
    });
    socket.on('status', (msg) => {
        statusCallback && statusCallback(msg);
    });
    socket.on('disconnect', () => {
        disconnectCallback && disconnectCallback();
    });
};

export const connectToGit = async (command, options, callbacks) => {
    const {gitURL, directory} = options;
    const resp = await fetch('/migrate/pull-from-git', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
            gitURL,
            directory
        }),
    });

    const body = await resp.json();
    const id = body.id;
    connectToSocket(id, callbacks);
};