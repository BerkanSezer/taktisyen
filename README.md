[taktisyen]: https://taktisyen.vercel.app/

# [taktisyen]
Taktisyen: Syllabication and analysis of Turkish poems written in aruz prosody.

Taktisyen is a project that aims to make writing poems with aruz prosody easier
and more manageable. Taktisyen could also be used in schools to make students
see patterns that may be difficult to notice otherwise.

![Sample screenshot](images/sample_screenshot.png)

## Building

The recommended way to install is via npm and grunt.

```bash
$ git clone git@github.com:EmreOzcan/taktisyen.git
$ cd taktisyen
$ npm install
$ npx grunt
```

*(You can issue `$ npx grunt debug` instead of just `$ npx grunt` to skip the
Babel step.)*

The output files will be put under `/dist`.

## License

taktisyen's source code is provided under the [MIT License](./LICENSE).

Copyright © 2021 Emre Özcan
