import { AbstractSampleAnalyzer } from './AbstractSampleAnalyzer.js';

export class BobCatClassicSampleAnalyzer extends AbstractSampleAnalyzer {
    constructor() {
        super();

        this.name = 'BobCatPrimoClassic';
        this.serviceName = 'bobcat-primo-classic';
    }

    parseTitle() {
        return this.$( 'h3.item-title' ).text().trim();
    }

    parseEresources() {
        const eresources = [];
        // Note that there can one <prm-view-online> element or two.
        // If there are no real links to online eresources, there will be only
        // one <prm-view-online> element containing the "Getit Delivery Options (Legacy Feature)"
        // link (and perhaps others).
        // If there are eresources, there will be two <prm-view-online> elements,
        // with the eresources in the first, and the GetIt generic search link
        // in the second.  We filter the GetIt delivery options links later.
        // It's less complicated than testing the <prm-view-online> elements.
        const eresourceElements = this.$(
            'prm-view-online div[ role="list" ] a.arrow-link'
        );
        if ( eresourceElements.length > 0 ) {
            eresourceElements.each( function( index, element ) {
                const name = element.children[ 0 ].children[ 0 ].children[ 0 ].data.trim();
                // Skip the "Getit Delivery Options (Legacy Feature)" link.
                if ( name === 'Click here for more options' ) {
                    return;
                }
                eresources.push(
                    {
                        name: name,
                        url: element.attribs.href,
                    }
                );
            } );

            eresources.sort();
        }

        return eresources;
    }
}
