# compass-plugin

> Boilerplate template for developing new Compass plugins with React components
and Reflux stores and actions.

## Installation

This installation guide assumes you have [installed node v7.4 and npm](https://github.com/mongodb-js/mongodb-js/blob/master/docs/setup.md).

This module is a [khaos][khaos] template. If you don't have khaos installed yet, first install it globally with:

```
npm install -g khaos
```

Now create a new plugin `<myplugin>` based on this template with:

```
khaos create mongodb-js/compass-plugin ./<myplugin>
```

You are prompted to fill out some template variables:

- `name`: short name of `<myplugin>`, e.g. `query-bar` or `db-stats`. **Do not use spaces!** [kebab-case](https://stackoverflow.com/questions/11273282/whats-the-name-for-hyphen-separated-case) is recommended. 
- `description`: a one sentence description of the plugin.
- `role`: the role of the component. Use `Collection.Tab` for collection level scope (e.g. a view
  on the collection level), and `Instance.Tab` for global application scope. More on scopes TBD.

Once the plugin is created, install the dependencies with:

```
cd <myplugin>
npm install
```

You're now ready to implement your Compass plugin.

## Features

#### Storybook

Develop and prototype your component with [react-storybook][react-storybook] in a standalone browser view, with linked stories and hot reloading.

To run storybook mode, type `npm run storybook`, then open
[http://localhost:9001](http://localhost:9001) in a browser. You can now edit the source code and hit _save_, and changes will immediately show in the browser, while maintaining the state of the component(s).

#### Electron

Validate and test your component in an Electron window, styles included. The source automatically compiles and the window content reloads when any file under `./src` changes.

To start Electron and render your component, type `npm start`.

If you edit the source code and hit _save_, the source will rebuild and the window reload automatically. State is not maintained throughout reloads (to maintain application state, use _storybook_ instead).

#### Enzyme

The test environment is configured to test components with [Enzyme][enzyme] (including full `mount` mode through [jsdom][jsdom]) and [enzyme-chai][enzyme-chai]. See the test folder for examples. Run `npm test` to execute the test suite.

## Developing

Almost all of your development will happen in the `./src` directory. Add new components
to `./src/components`, actions to `./src/actions/index.js` and if you need additional stores, add them to `./src/stores`.

#### Directory Structure

For completeness, below is a list of directories present in this module:

- `.storybook` react-storybook and webpack configuration. You usually don't need to touch this.
- `electron` code to start electron, open a browser window and load the source. You don't usually need to touch this, unless you want to render something other than the main component in Electron.
- `lib` compiled version of your components (plain javascript instead of `jsx`) and styles (`css` instead of `less`). Never change anything here as this entire folder gets automatically created and overwritten.
- `src` components, actions and stores source code, as well as style files. This is the place to implement your own components. `npm run compile` will use `./src` as input and create `./lib`.
- `stories` stories for react-storybook. You can add as many story files as you like, they are automatically added to storybook.
- `test` implement your tests here, and name the files `*.test.js`.


## License

Apache 2.0

[react-storybook]: https://github.com/kadirahq/react-storybook
[khaos]: http://khaos.io/
[enzyme]: http://airbnb.io/enzyme/
[enzyme-chai]: https://github.com/producthunt/chai-enzyme
[jsdom]: https://github.com/tmpvar/jsdom
