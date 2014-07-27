/**
 * Created by raynald on 1/21/14.
 */

var app =  app || {};

// To-do Item View
// ----------------

// The DOM element for a to-do item....

app.TodoView = Backbone.View.extend( {
    moduleName: '{TodoView.js} ',

    urlRoot: '/items',

    // A new <li> element will be created each time we call render()!
    tagName: 'li',

    // Cache the template function for a single item.
    template: _.template( $('#item-template').html()),


    // The DOM events specific to a single to-do item.
    events: {
        'click .toggle' : 'togglecompleted',
        'dblclick label': 'edit',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'blur .edit'    : 'close'
    },

    initialize: function() {
        console.info(this.moduleName + 'initialize -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    // Re-renders the titles of the to-do item
    render: function() {
        console.info(this.moduleName + 'render -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        // Wow! This next statement is awesome!
        this.$el.html( this.template( this.model.toJSON() ) );

        // add/remove call 'completed' using jQuery toggleClass()!
        this.$el.toggleClass('completed', this.model.get('completed') );
        this.toggleVisible();

        // cache the input field
        this.$input = this.$('.edit');

        return this;
    },

    // Toggles visibility of a to-do item
    toggleVisible: function() {
        this.$el.toggleClass( 'hidden', this.isHidden());
    },

    // Determines if item should be hidden
    isHidden: function() {
        var isCompleted = this.model.get('completed');
        return (
            (!isCompleted && app.TodoFilter === 'completed')
            || (isCompleted && app.TodoFilter === 'active')
        )
    },

    // Toggle the 'completed' state of the model
    togglecompleted: function() {
        console.info(this.moduleName + 'togglecompleted -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        this.model.toggle();
    },

    // Switch this view into "editing" mode, displaying the input field
    edit: function() {
        console.info(this.moduleName + 'edit -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        this.$el.addClass('editing');
        this.$input.focus();
    },

    // Close the "editing" mode, saving changes to the to-do
    close: function() {
        console.info(this.moduleName + 'close -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        var value = this.$input.val().trim();

        if (value) {
            console.log(moduleName + 'save model ->', JSON.stringify())
            this.model.save({title: value}); // saves to database
        } else {
            this.clear();
        }

        this.$el.removeClass('editing');
    },

    // If you hit 'enter', we're through editing the item.
    updateOnEnter: function(e) {
        console.info(this.moduleName + 'updateOnEnter');

        if (e.which === ENTER_KEY) {
            this.close();
        }
    },

    // Remove the to-do item, destroy model from database and delete
    // its view
    clear: function() {
        console.info(this.moduleName + 'clear -> '
            + this.model.get('title') + ': ' + this.model.get('completed'));

        this.model.destroy();
    }
});

