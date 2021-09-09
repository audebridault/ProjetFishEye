"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var ejs = require("gulp-ejs");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");

sass.compiler = require("node-sass");

function makeCss() {
  return gulp
    .src(["./src/scss/base.scss", "./src/**/*.scss"])
    .pipe(concat("style.css"))
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./www/css"));
}

function makePage() {
  return gulp.src("./src/pages/*.html").pipe(ejs({})).pipe(gulp.dest("./www"));
}

function watch() {
  browserSync.init({
    server: "./www",
  });

  gulp.watch("./src/**/*.html", makePage);
  gulp.watch("./src/**/*.scss", makeCss);
  gulp.watch("www").on("change", browserSync.reload);
}

module.exports.makeCss = makeCss;
module.exports.watch = watch;
