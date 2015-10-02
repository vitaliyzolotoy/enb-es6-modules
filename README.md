# enb-es6-modules

Available technologies:

- es6-modules
- prepend-es6-modules

## Usage

Install the package:

~~~
$ npm instal --save-dev enb-es6-modules
~~~

Add the techs to your project's `make.js`

~~~js
var es6Modules = require('enb-es6-modules/techs/es6-modules');
var prependEs6Modules- require('enb-es6-modules/techs/prepend-es6-modules');

module.exports = function(config) {
    config.node('bundle', function(node) {
        node.addTechs([
            [es6Modules, {
                sourceSuffixes: ['js', 'es6'],
                target : '?.mod.js'
            }],
            [prependEs6Modules, {
                source: '?.mod.js',
                target: '?.js'
            }],
        ]);

        node.addTarget('?.js');
    });
};
~~~

Don't forget to import base module on page:

~~~html
<script>
    System.import('some-module');
</script>
~~~
