import * as path from 'node:path';

import * as cheerio from 'cheerio';

export class AbstractSampleAnalyzer {
    $;
    eresources;
    html;
    name;
    serviceName;
    title;

    constructor() {
        if ( this.constructor === AbstractSampleAnalyzer ) {
            throw new Error( "Cannot instantiate abstract class" );
        }
    }

    parseHtml( html ) {
        this.html = html;
        this.$ = cheerio.load( html );
        this.eresources = this.parseEresources();
        this.title = this.parseTitle();
    }
}
