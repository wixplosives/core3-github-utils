import { expect } from 'chai';
import { checkFilesExistence } from '../src/check-files-existence';

describe('checkFilesExistence()', () => {
    it('single file - exist', async () => {
        const result = await checkFilesExistence({ files: 'src/main.ts', failure: false });
        expect(result).to.eq(true);
    });

    it('single file - does not exist', async () => {
        const result = await checkFilesExistence({ files: 'src/aaaa.ts', failure: false });
        expect(result).to.eq(false);
    });

    it('multiple files - exist', async () => {
        const result = await checkFilesExistence({
            files: 'src/main.ts, src/check-files-existence.ts',
            failure: false,
        });
        expect(result).to.eq(true);
    });

    it('multiple files - one does not exist', async () => {
        const result = await checkFilesExistence({
            files: 'src/main.ts, bbb.ts',
            failure: false,
        });
        expect(result).to.eq(false);
    });
});
