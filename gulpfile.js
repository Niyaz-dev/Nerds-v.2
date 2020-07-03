let projectFolder = "dist";
let sourceFolder ="src";

let path={
    build:{
        html: projectFolder+"/",
        css: projectFolder+"/css/",
        js: projectFolder+"/js/",
        img: projectFolder+"/img/",
        fonts: projectFolder+"/fonts/",
    },
    src:{
        html: sourceFolder+"/views/*.html",
        css: sourceFolder+"/scss/*.scss",
        js: sourceFolder+"/js/*.js",
        img: sourceFolder+"/img/**/*.{jpg,png,svg}",
        fonts: sourceFolder+"/fonts/*.ttf",
    },
    watch:{
        html: sourceFolder+"/**/*.html",
        css: sourceFolder+"/scss/**/*.scss",
        js: sourceFolder+"/js/**/*.js",
        img: sourceFolder+"/img/**/*.{jpg,png,svg}",
    },
    clean: "./"+projectFolder+"/",
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    sass = require("gulp-sass"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    webphtml = require("gulp-webp-html"),
    webpcss = require("gulp-webpcss"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    autoprefixer = require("gulp-autoprefixer");

function browserSync(params){
    browsersync.init({
        server:{
            baseDir:  "./"+projectFolder+"/"
        },
        port: 3000
    })
}

function fonts(params){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))

}

function html(){
    return src(path.src.html) 
    .pipe(fileinclude()) 
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img) 
    .pipe(
        webp({
            quality: 70
        })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
        imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js) 
    .pipe(fileinclude()) 
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
        extname: ".min.js"
    }
    ))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css) 
    .pipe(sass({
        outputStyle: "expanded"
    })
    )
    .pipe(group_media())
    .pipe(autoprefixer({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true
    }))
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
        extname: ".min.css"
    }
    ))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function watchFiles(params){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean(params){
    return del(path.clean)
}

let build = gulp.series(clean,gulp.parallel(js,css,html,images,fonts));
let watch=gulp.parallel(build,browserSync,watchFiles);

exports.css = css;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.html = html;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;