define(['jquery', 
		'underscore', 
		'backbone'], 
function($, _, Backbone) {
	var Todo = Backbone.Model.extend({
		defaults: {
			name: "new empty todo",
			list_id: 1,
			parent_id: 0,
			position: 0,
			status: 0
		},
		
		initialize: function() {
			if (!this.get("name")) {
			  this.set({"name": this.defaults.name});
			}
		},

		done: function() {
			if (this.get("status") == 0) {
				this.save({status: 1});
			} else {
				this.save({status: 0});
			}
			
		}

	});

	return Todo;
});