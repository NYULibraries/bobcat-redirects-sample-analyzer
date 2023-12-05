import { AbstractSampleAnalyzer } from './AbstractSampleAnalyzer.js';

export class BobCatRedirectsSampleAnalyzer extends AbstractSampleAnalyzer {
    constructor() {
        super();

        this.name = 'BobCatRedirects';
        this.serviceName = 'bobcat-redirects';
    }

    parseTitle() {
        return this.$( 'h3.item-title' ).text().replace( new RegExp( /^;  / ), '' );
    }

    parseEresources() {
        const eresources = [];
        const eresourceElements = this.$(
            'prm-full-view-service-container prm-alma-viewit-items md-list-item a.item-title'
        );
        if ( eresourceElements.length > 0 ) {
            eresourceElements.each( function( index, element ) {
                eresources.push(
                    {
                        name: element.children[ 0 ].data,
                        url: element.attribs.href,
                    }
                );
            } );

            eresources.sort();
        }

        return eresources;
    }
}
