import { IData } from "../scraper/events";
import { IQuery, IQueryOptions } from "../scraper/query";
import { killChromium } from "../utils/browser";
import {
    LinkedinScraper,
    timeFilter,
    relevanceFilter,
    experienceLevelFilter,
    onSiteOrRemoteFilter,
    events,
} from "../index";

describe('[TEST]', () => {
    jest.setTimeout(240000);

    const onDataFn = (data: IData): void => {
        expect(data.query).toBeDefined();
        expect(data.location).toBeDefined();
        expect(data.jobId).toBeDefined();
        expect(data.title).toBeDefined();
        expect(data.company).toBeDefined();
        expect(data.place).toBeDefined();
        expect(data.date).toBeDefined();
        expect(data.description).toBeDefined();
        expect(data.descriptionHTML).toBeDefined();
        expect(data.link).toBeDefined();

        expect(data.location.length).toBeGreaterThan(0);
        expect(data.jobId.length).toBeGreaterThan(0);
        expect(data.title.length).toBeGreaterThan(0);
        expect(data.place.length).toBeGreaterThan(0);
        expect(data.description.length).toBeGreaterThan(0);
        expect(data.descriptionHTML.length).toBeGreaterThan(0);

        if (data.insights) {
            expect(Array.isArray(data.insights)).toBe(true);
        }

        if (data.skills) {
            expect(Array.isArray(data.skills)).toBe(true);
        }

        expect(() => new URL(data.link)).not.toThrow();

        if (data.applyLink) {
            expect(() => new URL(data.applyLink!)).not.toThrow();
        }

        if (data.companyLink) {
            expect(() => new URL(data.companyLink!)).not.toThrow();
        }

        if (data.companyImgLink) {
            expect(() => new URL(data.companyImgLink!)).not.toThrow();
        }
    };

    const scraper = new LinkedinScraper({
        headless: true,
        args: [
            "--remote-debugging-address=0.0.0.0",
            "--remote-debugging-port=9222",
        ],
        slowMo: 250,
    });

    const queries: IQuery[] = [
        {
            query: "Software Engineer",
            options: {
                locations: ['United States'],
                limit: 5,
                filters: {
                    time: timeFilter.WEEK,
                    experience: experienceLevelFilter.ENTRY_LEVEL,
                }
            },
        },
    ];

    const globalOptions: IQueryOptions = {
        limit: 5,
        filters: {
            relevance: relevanceFilter.RECENT,
        },
    };

    it('Anonymous strategy', async () => {
        scraper.on(events.scraper.data, onDataFn);
        scraper.on(events.scraper.error, (err) => { console.error(err) });
        scraper.on(events.scraper.end, () => console.log("\nE N D (ツ)_.\\m/"));

        await scraper.run(queries, globalOptions);
        await scraper.close();
        await killChromium();
    });
}); 