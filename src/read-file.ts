import fs from 'fs';
import { EOL } from 'os';
import * as core from '@actions/core';

interface IReadFile {
    filepath: string;
    failure: boolean;
    trim: boolean;
    parse: string;
}

export const readFile = async ({ filepath, failure, trim, parse }: IReadFile): Promise<void> => {
    try {
        let content = await fs.promises.readFile(filepath, 'utf8');
        if (trim) {
            content = content.trim();
        }

        if (parse === 'mocha-failure-report') {
            content = parseFailureReport(content);
        }

        if (parse === 'json-array') {
            content = parseJsonArray(content);
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

const parseFailureReport = (content: string) => {
    const parsedContent = JSON.parse(content);

    let parsedTable = `| Suite & Test name |  Retries |  Duration | Error
|-------------------|--------|--------| ---|`;

    for (const failTest of parsedContent['failures']) {
        parsedTable = parsedTable.concat(
            `${failTest.fullTitle}|${failTest.currentRetry}|${failTest.duration}|${failTest.err.stack}|${EOL}`
        );
    }

    return parsedTable;
};

const parseJsonArray = (content: string) => {
    const parsedContent = JSON.parse(content);
    return parsedContent.map((element: string) => `${element}${EOL}`);
};
