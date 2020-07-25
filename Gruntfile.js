module.exports = function(grunt) {
    const sass = require("sass");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: ["app/js/*.js"],
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
            files: ["Gruntfile.js", "app/js/*.js"],
            options: {
                esversion: 9,
                browser: true,
                globals: {
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
        },
        zip: {
            dist: {
                cwd: "dist",
                src: ["dist/**"],
                dest: "dist/.dist.zip",
                compression: "DEFLATE"
            }
        },
        clean: {
            dist: ["dist"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["jshint", "clean:dist", "concat", "babel", "uglify", "sass", "htmlmin", "zip:dist"]);
};
