$(document).ready(function() {
    
    window.Todo = Backbone.Model.extend({
        //Default Attributes
        defaults: {
            content: "new empty todo",
            parent: "0",
            indent: "0",
            order: "0",
            done: false
        },
        
        initialize: function() {
            if (!this.get("content")) {
              this.set({"content": this.defaults.content});
            }
        },

		done: function() {
			this.save({done: !this.get("done")});
		}
    });
    
    window.TodoList = Backbone.Collection.extend({
        model: Todo,
        localStorage: new Store("forgetmenot"),
        
        nextOrder: function() {
            if (this.length === 0) {
                return 1;
            } else {
                return this.last().get('order') + 1;
            }
        },
        
        comparator: function(todo) {
          return todo.get('order');
        }
    });
    
    window.Todos = new TodoList;


    // Each Individual Todo Item View
    window.TodoView = Backbone.View.extend({
        tagName: "li",
        id: "todo-",
        className: "todo",
        template: _.template($('#item-template').html()),
        
        events: {
            "dblclick .display .content"        :      	"edit",
            "keypress .edit input"              :      	"updateOnEnter",
			"click input.done"  			    : 		"toggleDone",
            "click .display .delete"					   : 	    "deleteTodo",
            "keydown input"         :       "reOrderOnTab"
        },
        
        initialize: function() {
            _.bindAll(this, 'render', 'deleteTodo', 'save', 'updateOnEnter');
            this.model.bind('change', this.render);
            this.el.id += this.model.get("id");
            // Give reverse access to a model's view by setting its 'this' 
            // to a new attribute on the model
            this.model.view = this;
        },
        
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.input = this.$(".input");
            this.input.bind('blur', this.save);
            return this;
        },
        
        edit: function() {
            var content = this.model.get('content');
            $(this.el).addClass("editing");
            this.input.val(content);
            this.input.focus();
            //return false;
        },
        
        save: function() {
            this.model.save({ content: this.input.val() });
            $(this.el).removeClass("editing");
        },
        
        deleteTodo: function() {
            this.model.destroy();
            this.remove();
        },
        
        updateOnEnter: function(e) {
          if (e.keyCode == 13) {
              this.save();
          }
        },

		toggleDone: function() {
			this.model.done();
		},
        
        reOrderOnTab: function(e) {
          if (e.keyCode == 9) {
              console.log('tab4');
              $(this.el).css('left', function(index) {
                  return index + 50;
              });
              e.preventDefault();
          }
        }
    });

    window.TodoApp = Backbone.View.extend({
        el: $("#todoApp"),
        
        events: {
            //"dblclick"          :       "test",
            "click #createNew"  :       "createNew"
        },
        
        initialize: function() {
            _.bindAll(this, 'createNew', 'addOne', 'addAll');
            Todos.bind('refresh', this.addAll);
            Todos.bind('refresh', this.resetOrder);
            Todos.fetch();
        },
        
        createNew: function() {
            var todo = Todos.create({
				content: ''
			});
            this.addOne(todo, "prepend").edit();
        },
        
        addOne: function(todo, order) {
            var view = new TodoView({model:todo});
			if (order == 'prepend') {
				this.$("#todoItemsList").prepend(view.render().el);
			} else {
				this.$("#todoItemsList").append(view.render().el);
			}
            return view;
        },
        
        addAll: function() {
            Todos.each(this.addOne);
        },

        resetOrder: function(todo) {
            var order = 0;
            _.each(Todos.models, function(todo) {
                order++;
                todo.set({ order: order});
                todo.save();
            });
            //Todos.refresh();
        },
        
        test: function() {
            alert('test');
        }
    });

    window.todoapp = new TodoApp;

});