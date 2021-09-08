// All Imports
const { src, dest, series, watch } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')( require('sass') );
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const purgecss = require('gulp-purgecss');

// File paths
const paths = {
    // HTML
    htmlFileName: 'public/index.html',

    // CSS
    scssEntryFile: 'src/styles/main.scss',
    scssFiles: 'src/styles/**/*.scss',
    cssOutputFilePath: 'public/css',
    cssOutputFileName: 'style.css',

    // JavaScript
    jsFiles: 'src/scripts/**/*.ts',
};

// CSS Task
function csstask() {

    const purgeOptions = {
        content: [
            paths.htmlFileName,
            paths.jsFiles
        ]
    };

    return src( paths.scssEntryFile, { sourcemaps: true } )
        .pipe( sass() )
        .pipe( autoprefixer() )
        .pipe( cssnano() )
        .pipe( purgecss( purgeOptions ) )
        .pipe( rename( paths.cssOutputFileName ) )
        .pipe( dest( paths.cssOutputFilePath, { sourcemaps: '.' } ) );
}

// Watch Task
function watchTask() {
    watch( [ paths.htmlFileName, paths.scssFiles ], csstask );
}

// Gulp tasks
exports.default = series(
    csstask,
    watchTask
);

exports.watch = series(
    csstask,
    watchTask
);
exports.build = csstask;