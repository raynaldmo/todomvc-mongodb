/**
 * Created by raynald on 1/20/14.
 */

var app = app || {};

// Todo Model
// --------------------
// Our basic model has 'title' and 'completed' attributes

app.Todo = Backbone.Model.extend( {

    moduleName : '{Todo.js} ',

    idAttribute: '_id',

    // Default attributes ensure that each to-do has 'title' and 'completed' keys
    defaults: {
        title: '',
        completed: false
    },

    initialize: function() {
        console.info(this.moduleName + 'Todo Model initialized...');
        this.on('sync', function(model, resp, options) {
          console.log(this.moduleName + "model sync OK: model -> ', " +
            JSON.stringify(model.toJSON()));
        });

        this.on('error', function(model, resp, options) {
          console.log(this.moduleName + "model sync FAILED: model -> ', " +
            JSON.stringify(model.toJSON()));
        });
    },

    // Toggle the 'completed state of this to-do item
    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    }
});
