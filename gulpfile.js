"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");
var gulpcsso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var makeSprite = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var webp = require("gulp-webp");
var htmlmin = require("gulp-htmlmin");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
      return gulp.src([
          "source/fonts/**/*.{woff,woff2}",
          "source/js/**",
          "source/img/**"
        ], {
          base: "source"
        })
        .pipe(gulp.dest("build"));
});

gulp.task("sprite", function() {
  return gulp.src([
    "source/img/**/icon-fb.svg",
    "source/img/**/icon-insta.svg",
    "source/img/**/icon-vk.svg",
    "source/img/**/htmlacademy.svg",
    "source/img/**/icon-gift.svg",
    "source/img/**/icon-phone.svg",
    "source/img/**/icon-mail.svg"])
  .pipe(makeSprite({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
    ]))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("minImages", function() {
  return gulp.src("build/img/**/*.{jpg, png, svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimisationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
});

gulp.task("createWebp", function() {
  return gulp.src(["source/img/**/fish-*.{png,jpg}",
    "source/img/**/chicken-*.{png,jpg}",
    "source/img/**/rice-*.{png,jpg}",
    "source/img/**/buckwheat-*.{png,jpg}"])
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("css", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpcsso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "minImages",
  "createWebp",
  "sprite",
  "css",
  "html"
  ));
gulp.task("start", gulp.series("build", "server"));
