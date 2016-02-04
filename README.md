facebook-login
================

See the [component page](http://davidwittenbrink.github.io/facebook-login) for more information.


*Make sure you import the right element definition* (`dist/facebook-login.html`)

## Contributing
This Polymer element is written in ECMAScript 15. The repository includes a gulpfile that uses babel and other tools to transcompile the ECMAScript 15 code to ECMAScript 5 code. If you want to contribute, run `gulp` in your terminal to build the `dist` directory and compile the element for browsers that lack support for ES15.

### Note for Contributors
Clone this repository inside a wrapper folder (i.e. `mkdir facebook-login-wrapper && cd $_ && git clone https://github.com/davidwittenbrink/facebook-login.git`) to avoid bower from installing dependencies inside your workspace (the will be installed inside the wrapper folder instead).

#### Installing Dependencies
Run `npm start` to install devDependencies and bower dependencies.
