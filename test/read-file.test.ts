import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { parseFailureReport } from '../src/read-file';

describe('checkFilesExistence()', () => {
    // eslint-disable-next-line no-only-tests/no-only-tests
    it.only('parseFailureReport', async () => {
        const content = await fs.promises.readFile(path.resolve(__dirname, './fixtures/read-file-input.json'), 'utf8');
        const parsingResult = parseFailureReport(content);

        const resultFileContent = await fs.promises.readFile(
            path.resolve(__dirname, './fixtures/read-file-result.md'),
            'utf8'
        );
        expect(parsingResult).to.eq(resultFileContent);
    });
});
