import * as core from '@actions/core';
import fs from 'fs';

interface IReadFile {
    filepath: string;
    failure: boolean;
    trim: boolean;
}

export const readFile = async ({ filepath, failure, trim }: IReadFile): Promise<void> => {
    try {
        let content = await fs.promises.readFile(filepath, 'utf8');
        if (trim) {
            content = content.trim();
        }

        core.setOutput('content', content);
    } catch (err) {
        if (failure) {
            core.setFailed(`Can't find file: ${filepath}`);
        } else {
            core.info(`Can't find file: ${filepath}`);
        }
    }
};
