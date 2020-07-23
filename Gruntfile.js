module.exports = function(grunt) {
    const sass = require("sass");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: ["app/**/*.js"],
                dest: "dist/script.js",
            }
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd.mm.yyyy') %> */"
            },
            dist: {
                files: {
                    "dist/script.js": ["dist/**/*.js"]
                }
            }
        },
        jshint: {
            files: ["Gruntfile.js", "app/**/*.js"],
            options: {
                esversion: 9,
                browser: true,
                globals: {
                    _: false,
                    escape: false
                }
            }
        },
        babel: {
            options: {
                presets: [
                    ["@babel/preset-env", {"targets": "> 0%"}]
                ],
            },
            dist: {
                files: {
                    "dist/script.js": "dist/script.js"
                }
            }
        },
        sass: {
            options: {
                implementation: sass,
                noSourceMap: true,
                style: "compressed"
            },
            dist: {
                files: {
                    "dist/style.css": "app/css/style.scss"
                }
            }
        },
        htmlmin: {
            dev: {
                options: {
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    removeComments: true
                },
                files: {
                    "dist/index.html": "app/index.html"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");

    grunt.registerTask("default", ["jshint", "concat", "babel", "uglify", "sass", "htmlmin"]);
};
