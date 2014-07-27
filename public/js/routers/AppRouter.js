/**
 * Created by raynald on 1/21/14.
 */

// Todo Router
//----------------

var Workspace = Backbone.Router.extend( {

    // define a 'splat'. It'll catch all routes!
    routes: {
        '*filter': 'setFilter'
    },

    moduleName: "{AppRouter} ",

    initialize: function() {
        console.info(this.moduleName +  'initialize');
    },

    setFilter: function( param ) {

        // Set the current filter to be used
        if (param) {
            param = param.trim();
        }
        // Note that app object is a global so its in
        // scope here!
        app.TodoFilter = param || '';

        console.info(this.moduleName +  'setFilter -> ' + 'filter, ' +
            app.TodoFilter);

        // Trigger a collection filter event, causing hiding/un-hiding
        // of To-do view items
        // Generate custom event - to AppView; how cool is that!
        app.Todos.trigger('filter');
    }
});

// Instantiate and start router!
app.TodoRouter = new Workspace();
Backbone.history.start();
