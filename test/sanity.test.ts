import playwright from 'playwright-core';
import * as core from '@actions/core';

const selectors = {
    SIMULATION_LIST_ITEM: '[data-list-view-item-id]',
    SIMULATION_IFRAME_INSIDE_CONTENT: '.simulationRoot .simulationCanvas',
    SIMULATION_IFRAME_HTML_TAG: '[prevented-links-opening="true"]',
    PROPS_PANEL_SEARCH_INPUT: 'input[placeholder="Search for properties"]',
    IFRAME: 'iframe',
};

interface ISanityCheckOptions {
    url: string;
    failure: boolean;
    checkString?: string;
    image?: boolean;
}

it('asd', async () => {
    const wcsSanity = async ({ url, checkString, image, failure }: ISanityCheckOptions) => {
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
        const page = await context.newPage();
        try {
            const res = await page.goto(url);

            if (!res) throw new Error('Url is not available');

            await page.click(selectors.SIMULATION_LIST_ITEM, { timeout: 25_000 });

            const simGridFrame = await page.waitForSelector(selectors.IFRAME);
            const simGridContentFrame = await simGridFrame.contentFrame();
            if (!simGridContentFrame) {
                throw new Error('Could not find simulatiom grid frame');
            }
            await simGridContentFrame.waitForSelector(selectors.SIMULATION_IFRAME_INSIDE_CONTENT);

            const firstSimFrame = await simGridContentFrame.waitForSelector(selectors.SIMULATION_IFRAME_HTML_TAG);
            await firstSimFrame.click();

            // Only available after simulation is loaded
            await page.waitForSelector(selectors.PROPS_PANEL_SEARCH_INPUT);

            if (checkString) {
                const simPanelFrame = await page.waitForSelector(selectors.IFRAME);
                const simPanelContentFrame = await simPanelFrame.contentFrame();

                if (!simPanelContentFrame) {
                    throw new Error('Could not find simulation iframe on stage');
                }

                if (!(await simPanelContentFrame.waitForSelector(`text=${checkString}`))) {
                    throw new Error('Could not find string');
                }
            }
        } catch (error) {
            if (failure) {
                core.setFailed(`Error while running sanity script: ${error}`);
            } else {
                core.info(`Error while running sanity script: ${error}`);
            }
        } finally {
            if (image) await page.screenshot({ path: 'screenshot.png' });
            await browser.close();
        }
    };

    await wcsSanity({
        url: 'https://wixplosives.github.io/static-sites/wcs-example-project/index.html',
        checkString: 'Swim Swim Swim',
        image: false,
        failure: false,
    });
});
