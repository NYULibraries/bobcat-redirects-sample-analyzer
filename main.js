import * as path from 'node:path';
import process from 'process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

import { metadataReportCommand } from './lib/commands/metadata.js';

function parseArgs() {
    return yargs( hideBin( process.argv ) )
        .scriptName( "bobcat-redirects-sample-analyzer" )
        .usage( '$0 <cmd> [args]' )
        .command( 'metadata [directory]', 'Generate metadata report JSON file',
            ( yargs ) => {
                yargs.positional( 'directory', {
                    type     : 'string',
                    describe : 'Directory containing the sample'
                } );
            },
            function ( argv ) {
                const sampleDirectory = path.resolve( argv.directory );

                metadataReportCommand( sampleDirectory );
            } )
        .help()
        .argv;
}

async function main() {
    const argv = parseArgs();
}

main();
