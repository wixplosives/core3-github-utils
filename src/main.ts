import * as core from '@actions/core';
import { checkFilesExistence } from './check-files-existence';
import { readFile } from './read-file';

async function run(): Promise<void> {
    const util = core.getInput('util', { required: true });

    if (util === 'check-files-existence') {
        const files: string = core.getInput('files', { required: true });
        const failure: boolean = (core.getInput('allow_failure') || 'false').toUpperCase() === 'TRUE';
        await checkFilesExistence({ files, failure });
    }

    if (util === 'read-file') {
        const filepath: string = core.getInput('filepath', { required: true });
        const failure: boolean = (core.getInput('allow_failure') || 'false').toUpperCase() === 'TRUE';
        const trim: boolean = (core.getInput('trim') || 'false').toUpperCase() === 'TRUE';
        await readFile({ filepath, failure, trim });
    }
}

// eslint-disable-next-line github/no-then
run().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    core.setFailed(e.message);
});
