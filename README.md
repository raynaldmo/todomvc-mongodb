# todomvc-mongodb


Todo list application with Backbone.js front-end and Node.js/Express 3.x/MongoDB back-end.

Taken from Todo App as described in [Developing Backbone.js Applications] but replaces
browser Local Storage with mongoDB for persistence.

## Installation

### Get project files
Download ZIP file or clone this repository.

cd to directory where the files are installed on your system.

**Note: This app assumes [node] and [mongoDB] is installed and working
on your system.**

### Install node modules
    $ npm install (may need to run as root)
    
### Start app
    $ node app
    
To launch app, point your browser to: localhost:3001.
Use mongo shell to inspect database. 

#### Database: todos,  Collection: items
    
[Developing Backbone.js Applications]:http://addyosmani.github.io/backbone-fundamentals/
[node]:http://nodejs.org
[mongoDB]:http://www.mongodb.org/