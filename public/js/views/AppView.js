/**
 * Created by raynald on 1/20/14.
 */

var app = app || {};
var moduleName = 'Unknown Module ';

// The Application
// -----------------

// Our overall **AppView is the top-level piece of UI
// Note here that app.AppView is a constructor

app.AppView = Backbone.View.extend( {

    moduleName: '{AppView.js} ',

    // Instead of generating a new element, bind to the existing
    // skeleton of the App already present in the HTML
    el: '#todoapp',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template( $('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed
    // ones
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the 'To-dos'
    // collection, when items are added or changed
    // remember that this.$() leverages jQuery and means
    // $(this.el).find(selector)
    initialize: function() {

        console.info(this.moduleName + 'initialize');

        // same as $('#todoapp).find('#toggle-all)
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        // Listen for changes to to-do list
        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        // when a checkbox is checked/unchecked!
        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);

        // Any change to the collection, will trigger render()!
        this.listenTo(app.Todos, 'all', this.render);

        // get to-do list from server/database
        console.info(this.moduleName + 'fetch todo list from server');

        app.Todos.fetch(
          {reset : true,
            success : function(coll, resp, options) {
              console.info('models fetched OK', coll, resp);
            },
            error : function(coll, resp, options) {
              console.info('models fetch FAILED', coll, resp);
            }
          }
        );
    },

    // Re-rendering the App just means refreshing the statistics -- the
    // rest of the app doesn't change.
    render: function() {

        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        console.info(this.moduleName + 'render -> ' +
            'completed ' + completed + ' remaining ' + remaining);

        if(app.Todos.length) {
            this.$main.show(); // jQuery call!
            this.$footer.show(); // jQuery call

            // update stats in footer area
            // here we use statsTemplate() which is the underscore
            // render function for our HTML and pass it an object
            // containing the variables the template code expects!
            // Amazing!
            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (app.TodoFilter || '')  + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    // Add a single to-do item to the list by creating a view for it, and
    // appending its elements to the '<ul>'
    addOne: function(todo) {
        console.info(this.moduleName + 'addOne -> Create new TodoView');

        var view = new app.TodoView({model: todo});
        $('#todo-list').append( view.render().el);
    },

    // Add all items in the **To-dos** collection at once.
    addAll: function() {
        console.info(this.moduleName + 'addAll');

        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    // 'visible' event is a custom event defined in TodoView!
    filterOne: function(todo) {
        console.info(this.moduleName + 'filterOne -> ' +
            (todo instanceof  app.Todo) );

        console.info(this.moduleName + 'filterOne -> ' +
            todo.get('title') + ', ' + todo.get('completed'));

        // trigger TodoView::toggleVisible()
        todo.trigger('visible');
    },

    filterAll: function() {
        console.info(this.moduleName + 'filterAll');

        // Since filterOne is not a method of app.Todos, we should
        // pass context as 'this'
        app.Todos.each(this.filterOne, this);
    },

    // Generate the attributes for a new To-do item
    newAttributes: function() {
        var todo =  {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };

        console.info(this.moduleName + 'newAttributes -> ' +
            todo.title + ', ' + todo.order + ', ' + todo.completed);

        return todo;
    },

    // If you hit return in the main input field, create new To-do model
    // persisting it to localStorage
    createOnEnter: function(event) {
        var key = event.which;

        console.info(this.moduleName + 'createOnEnter -> key ' + key);

        if (key !== ENTER_KEY || !this.$input.val().trim() ) {
            return;
        }

        // create new instance of to-do item and save to local storage
        app.Todos.create(this.newAttributes() );

        // clear input
        this.$input.val('');
    },

    // Clear all completed to-do items, destroying their models
    // Why are we passing in 'destroy' ?
    clearCompleted: function() {
        console.info(this.moduleName + 'clearCompleted');
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    // Allows user to mark all of the items in the to-do list as
    // completed/not completed by clicking the toggle-all checkbox.
    toggleAllComplete: function() {
        console.info(this.moduleName + 'toggleAllComplete');

        var completed = this.allCheckbox.checked;
        app.Todos.each(function(todo) {
            todo.save({'completed': completed});
        });
    }
});
