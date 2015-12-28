/**
 * Created by nvolf on 22.12.2015.
 */

define(['bower_components/designer/js/diagram/diagram', 'app/entitiesPalette'], function(Diagram, EntitiesPalette) {

    var demoApp = {

        setupContainer: function() {
            this.container = document.createElement("div");
            this.container.setAttribute("class", ".js-graph-container");
            document.body.appendChild(this.container);

            this.htmlSelect = $(this.container);
        },


        showDiagram: function(entites) {
            var diagram = new Diagram();
            diagram.render();

            var entitiesPalette = new EntitiesPalette({ entities: entites });
            entitiesPalette.install(diagram);

            $(window).on("resize", diagram.resize.bind(diagram));
        },

        start: function(entities) {
            $(function() {
                this.showDiagram(entities);
            }.bind(this));

        }
    };

    return demoApp;


});
