"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var ejs = require("gulp-ejs");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");

sass.compiler = require("node-sass");

function makeCss() {
  return gulp
    .src(["./src/base.scss", "./src/**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))

    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./www/css"));
}

function makePage() {
  return gulp.src("./src/pages/*.html").pipe(ejs({})).pipe(gulp.dest("./www"));
}

function makeJs(){
  return gulp
    .src("./src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("app.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./www/js"));

}

function watch() {
  browserSync.init({
    server: "./www",
  });

  gulp.watch("./src/**/*.html", makePage);
  gulp.watch("./src/**/*.scss", makeCss);
  gulp.watch("./src/**/*.js", makeJs);
  gulp.watch("www").on("change", browserSync.reload);
}

module.exports= {
  makeCss,
  watch,
  makeJs
};
