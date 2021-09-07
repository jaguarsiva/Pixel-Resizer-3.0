
// All Imports
const { src, dest, series, watch } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')( require('sass') );
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const purgecss = require('gulp-purgecss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');

// File paths
const paths = {
    // Folders
    sourceFolder: 'src',
    destFolder: 'public',

    // HTML
    htmlFileName: 'public/index.html',

    // CSS
    scssEntryFile: 'src/styles/main.scss',
    scssFiles: 'src/styles/**/*.scss',
    cssOutputFilePath: 'public/css',
    cssOutputFileName: 'style.css',

    // JavaScript
    jsEntryFile: 'src/scripts/index.js',
    jsFiles: 'src/scripts/**/*.js',
    jsOutputFilePath: 'public/js',
    jsOutputFileName: 'app.js'
};

// JavaScript Task
function jsTask() {
    return src( paths.jsEntryFile, { sourcemaps: true })
		// .pipe( babel({ presets: ['@babel/preset-env'] }))
		.pipe( terser() )
        .pipe( rename( paths.jsOutputFileName ) )
		.pipe( dest(paths.jsOutputFilePath, { sourcemaps: '.' }));
}

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
    watch(
        [ paths.htmlFileName, paths.scssFiles, paths.jsFiles ],
        series( jsTask, csstask )
    );
}

// Gulp tasks
exports.default = series(
    jsTask,
    csstask,
    watchTask
);