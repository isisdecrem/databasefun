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

const connectToSocket = async (id) => {
    const textArea = document.getElementById('gitStatusTextArea');
    const pushToGitButton = document.getElementById('pushToGitButton');
    const pullFromGitButton = document.getElementById('pullFromGitButton');
    pushToGitButton.disabled = true;
    pullFromGitButton.disabled = true;
    const socket = io('/migrate/git-connect-socket/' + id);
    socket.on('connect', () => {
        console.log('Socket Connected');
        textArea.value += `\n\n------ ${new Date()} ------\n`;
        textArea.scrollTop = textArea.scrollHeight;
        socket.emit('join');
        socket.emit('auth', parseCookie(document.cookie)['passcode']);
        socket.emit('execute');
    });
    socket.on('status', (msg) => {
        console.log(msg);
        textArea.value += msg + '\n';
        textArea.scrollTop = textArea.scrollHeight;
    });
    socket.on('disconnect', () => {
        console.log('Socket Disconnected');
        textArea.value += `\n\n-----------------------------------------------------------------------\n`;
        textArea.scrollTop = textArea.scrollHeight;
        pushToGitButton.disabled = false;
        pullFromGitButton.disabled = false;
    });
};

export const getPastGitConfigs = async () => {
    const pastGitConfigsList = document.getElementById('pastGitConfigsList');
    pastGitConfigsList.innerHTML = '';

    const resp = await fetch('../past-git-configs', {
        method: 'POST',
    });
    const pastGetConfigs = await resp.json();

    for (const config of pastGetConfigs) {
        const itemBox = document.createElement('div');
        const configItem = document.createElement('ul');
        const fieldsThatMatters = ['token', 'username', 'url'];
        for (const fieldName of fieldsThatMatters) {
            const field = document.createElement('li');
            field.innerText = `${fieldName}: ${config[fieldName]}`;
            configItem.appendChild(field);
        }
        const itemButton = document.createElement('button');
        itemButton.setAttribute('configObject', JSON.stringify(config));
        itemButton.classList.add('pastGitConfigsListItemButton');
        itemButton.innerText = 'Use';
        itemButton.addEventListener('click', (e) => {
            const config = JSON.parse(e.target.getAttribute('configObject'));
            document.getElementById('gitAccessToken').value = config.token;
            document.getElementById('gitURL').value = config.url;
            document.getElementById('gitUserName').value = config.username;
        });
        itemBox.classList.add('pastGitConfigsListItemBox');
        itemBox.appendChild(configItem);
        const listItem = document.createElement('li');
        const bigBox = document.createElement('div');
        bigBox.classList.add('pastGitConfigsListBigBox');
        bigBox.appendChild(itemBox);
        bigBox.appendChild(itemButton);
        listItem.appendChild(bigBox);
        pastGitConfigsList.appendChild(listItem);
    }
};

export const connectToGit = async (command) => {
    console.log(`connectToGit: ${command}`);
    const accessToken = document.getElementById('gitAccessToken').value.trim();
    const gitURL = document.getElementById('gitURL').value.trim();
    const gitUserName = document.getElementById('gitUserName').value.trim();
    // const gitToMaster = document.getElementById('gitToMaster').value;
    const gitToMaster = true;
    // await connectToSocket();
    const pushToGitButton = document.getElementById('pushToGitButton');
    const pullFromGitButton = document.getElementById('pullFromGitButton');
    pushToGitButton.disabled = true;
    pullFromGitButton.disabled = true;
    const resp = await fetch('../connect-to-git', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
            accessToken,
            gitUserName,
            gitURL,
            gitToMaster,
            command,
        }),
    });

    const body = await resp.json();
    const id = body.id;
    connectToSocket(id);
};