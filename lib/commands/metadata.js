import * as fs from 'node:fs';
import * as path from 'node:path';

// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
// See "Option 2: Leverage the CommonJS require function to load JSON files"
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import { RESULTS_DIR, abort } from '../shared.js';

import { BobCatRedirectsSampleAnalyzer } from "../classes/BobCatRedirectsSampleAnalyzer.js";

const INDEX_FILE = 'index.json';
const METADATA_REPORT_FILE = path.join( RESULTS_DIR, 'metadata-report.json' );

function metadataReportCommand( sampleDirectory ) {
    if ( ! ( fs.existsSync( sampleDirectory ) && fs.statSync( sampleDirectory ).isDirectory() ) ){
        abort( `${ sampleDirectory } is not a directory` );
    }

    const indexFile = path.join( sampleDirectory, INDEX_FILE );
    if ( ! ( fs.existsSync( indexFile ) && fs.statSync( indexFile ).isFile() ) ) {
        abort( `${ sampleDirectory } does not contain an index file` );
    }

    const index = require( indexFile )

    const metadataReport = {};

    // For now, we only allow at most two sampleAnalyzers, the reason being that in order
    // to save space, save later computation time, and make the output more readable,
    // we store the metadata in this structure:
    //
    // {
    //      common: [
    //          ...
    //      ],
    //      unique: [
    //          service1: [
    //              ...
    //          ],
    //          service2: [
    //              ...
    //          ],
    //      ]
    // }
    //
    // This structure only really makes sense with two services (raw metadata).
    // With more than two, the `unique` data become a lot more complicated.
    const sampleAnalyzers = [
        new BobCatRedirectsSampleAnalyzer(),
    ];
    // Abort if there are more than two sample analyzers.
    if ( sampleAnalyzers.length > 2 ) {
        abort( 'Only a maximum of two sample analyzers are permitted.' );
    }

    Object.keys( index ).sort().forEach( testCaseUrl => {
        const indexEntry = index[ testCaseUrl ];
        const metadataReportEntry = {
            eresources: {},
            title: {},
        };
        sampleAnalyzers.forEach( sampleAnalyzer => {
            const sampleFile = indexEntry.sampleFiles[ sampleAnalyzer.serviceName ];
            const sampleFilePath = path.join(
                path.dirname( sampleDirectory ), sampleFile
            );
            const html = fs.readFileSync( sampleFilePath, { encoding: 'utf8' } );
            sampleAnalyzer.parseHtml( html );

            metadataReportEntry.eresources[ sampleAnalyzer.serviceName ] =
                sampleAnalyzer.eresources;
            metadataReportEntry.title[ sampleAnalyzer.serviceName ] =
                sampleAnalyzer.title;
        } );

        metadataReport[ testCaseUrl ] = metadataReportEntry;
    } );

    fs.writeFileSync( METADATA_REPORT_FILE, JSON.stringify( metadataReport, null, '   ' ), { encoding : 'utf8' } );
}

// TODO: implement or remove
function normalizeEresource( eresource ) {
    return eresource;
}

export {
    METADATA_REPORT_FILE,
    metadataReportCommand,
}
