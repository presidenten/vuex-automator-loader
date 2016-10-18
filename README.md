# vuex-automator-loader #

This is a webpack loader that populates the vuex store automtically with all the applications vuex models.
The loader assumes that the code structure is modular where components have everything they need in their folders (view.vue, model.js, test.spec.js etc in same folder), rather than based on "Socks drawer" where files are grouped by their types (./actions/action1.js, ./getters/getter1.js etc).

([See explanation here](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript)).

Having the file structure split up into modules makes the vuex.store constructor a bit messy where you need to include all models into main and add them in the constructor. This loader takes care of that hurdle so you can have a nice folder structure and still have maximum coding pleasure.

## Usage ##

This loader assumes that the vuex models exports an object that can be inserted into the modules property in the vuex store.

Example module export from some `module.js` file:
```javascript
export default {
  state: initialState,
  getters,
  mutations,
  actions,
};
```

Add the `vuex-automator-loader` to preloaders with a regexp that matches all vuex models, and then add the `vuex-automator-loader` plugin to plugins.
This example assumes vuex models are stored so that the module foldername and modules model filename have the same name - `src/subpath/module1/module1.js`. But the regexp could ofcourse match anything.
This example also specifies that all the found models should be collected in `src/vuexAutomator.js`.

The plugin creates and clears `src/vuexAutomator.js` at the start of each build so that there is always something for `main.js` to import, which avoids build error at an early stage in the development.

```javascript
var vuexAutomatorPlugin = require('vuex-automator-loader').plugin;
var projectRoot = path.resolve(__dirname, '../');
var srcRoot = path.normalize(path.join(projectRoot, '/src'));
var vuexAutomatorPath = path.normalize(path.join(srcRoot, '/vuexAutomator.js'));

// ...

preloaders: [
  {
    test: /\b(\w+)(\/|\\)+\1\b\.js$/,
    loader: 'vuex-automator',
    query: {
      srcRoot:   srcRoot,
      collector: vuexAutomatorPath,
    },
    include: srcRoot,
    exclude: /node_modules/,
  },
],
plugins: [
  new vuexAutomatorPlugin(vuexAutomatorPath),
],
```

Here is an example on how to load the resulting object from `main.js` by using the object spread operator:
```javascript
import * as vuexModules from './vuexAutomator.js';

new Vue({
  el: '#app',
  store: new Vuex.Store({
    modules: {
      ...vuexModules,
      // Third parties vuex models goes here
    },
  }),
  render: h => h(app),
});
```

## Known issues ##

Even though the the vuex modules wont be added multiple times, there is no check if a module is deleted.

When modules are deleted the module should either be removed from `vuexAutomator.js` manually, or the watch needs to be restarted..


## License ##
MIT
