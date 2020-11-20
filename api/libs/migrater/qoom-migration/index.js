import { downloadAsZip } from './download.js';
import { connectToGithub } from './github.js';
import { uploadZip } from './uploadZip.js';
import { connectToGit, getPastGitConfigs } from './git.js';

const main = async () => {
    const qoomFileDownloadButton = document.getElementById(
        'qoomFileDownloadButton'
    );
    qoomFileDownloadButton.addEventListener('click', downloadAsZip);
    // const connectToGithubButton = document.getElementById('connectToGithubButton');
    // connectToGithubButton.addEventListener('click', connectToGithub);
    const qoomFileUploadButton = document.getElementById(
        'qoomFileUploadButton'
    );
    qoomFileUploadButton.addEventListener('click', uploadZip);
    const pushToGitButton = document.getElementById('pushToGitButton');
    pushToGitButton.addEventListener('click', () => connectToGit('push'));
    const pullFromGitButton = document.getElementById('pullFromGitButton');
    pullFromGitButton.addEventListener('click', () => connectToGit('pull'));
    getPastGitConfigs().then();
};

main().then();
