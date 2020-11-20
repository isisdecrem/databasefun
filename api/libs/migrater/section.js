import { showPastGitConfigs } from '/libs/migrater/git.js';

export const main = async () => {
	showPastGitConfigs();
}

main().then();