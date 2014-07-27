/**
 * Created by raynald on 1/20/14.
 */

var app = app || {};

// Todo Collection
// ---------------

// The collection of todos is backed by 'localStorage' instead of a
// remote server.
var TodoList = Backbone.Collection.extend( {
    moduleName: '{Todos.js} ',

    url : '/items',

    // This is important as it ties in the data (model) to this
    // collection!!!!
    model: app.Todo,


    initialize: function() {
      console.info(this.moduleName + 'initialize');
    },

    // Filter down the list of all to-do items that are finished
    // Note that filter() is proxied from underscore.js
    completed: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        })
    },

    // I actually understand the return statement
    // without is from the underscore.js library
    // From the docs without is proxied from underscore, so
    // we shouldn't need to call the apply method
    // Filter down the list to only to-do items that are still not
    // finished
    remaining: function() {
        return this.without.apply(this, this.completed());
    },

    // We keep the To-dos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new
    // items
    nextOrder: function() {
        if ( !this.length) {
            return 1;
        }
        return this.last().get('order') + 1;
    },

    // To-dos are sorted by their original insertion order.
    comparator: function(todo) {
        return todo.get('order');
    }
});

// Create our global collection of **To-dos**
app.Todos = new TodoList();
