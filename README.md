# vuex-automator-loader #

This is a webpack loader that include all the applications vuex models to the vuex store automtically, so that the state is automatically generated.
The loader assumes that the code structure is modular rather than based on 
"Socks drawer".

([See explanation here](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript)).


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

Add loader to preloaders with a regexp that matches all vuex models and plugin to plugins. 
This example assumes vuex models are stored like. `src/subpath/model/model.js`, 
and that the modules should be collected in `src/vuexAutomator.js`.

```javascript
var vuexAutomatorPlugin = require('vuex-automator-loader').plugin;
var projectRoot = path.resolve(__dirname, '../');
var srcRoot = path.normalize(path.join(projectRoot, '/src'));
var vuexAutomatorPath = path.normalize(path.join(srcRoot, '/vuexAutomator.js'));

// ...

preloaders: [
  {
    test: /\b(\w+)\/+\1\b\.js$/,
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

The plugin creates and clears `src/vuexAutomator.js` at the start of each build, 
and the loader makes sure it imports modules and exports them as an object.

Here is an example on how to load it from `main.js` with the object spread operator:
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

When modules are deleted, the watch needs to be restarted to clear `src/vuexAutomator.js` again.


## License ##
MIT