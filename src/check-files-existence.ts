import * as core from '@actions/core';
import fs from 'fs';

async function checkFile(path: string): Promise<boolean> {
    try {
        await fs.promises.access(path);
    } catch (error) {
        return false;
    }
    return true;
}

interface ICheckFilesExistence {
    files: string;
    failure: boolean;
}

export const checkFilesExistence = async ({ files, failure }: ICheckFilesExistence): Promise<boolean> => {
    const fileList = files.split(',').map((item: string) => item.trim());
    const missingFiles: string[] = [];

    await Promise.all(
        fileList.map(async (file: string) => {
            const isPresent = await checkFile(file);
            if (!isPresent) missingFiles.push(file);
        })
    );

    if (missingFiles.length > 0) {
        if (failure) {
            core.setFailed(`These files doesn't exist: ${missingFiles.join(', ')}`);
        } else {
            core.info(`These files doesn't exist: ${missingFiles.join(', ')}`);
        }
        core.setOutput('files_exists', 'false');
        return false;
    } else {
        core.info('🎉 All files exists');
        core.setOutput('files_exists', 'true');
        return true;
    }
};
