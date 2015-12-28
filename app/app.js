/**
 * Created by nvolf on 22.12.2015.
 */

define(['bower_components/designer/js/diagram/diagram', 'app/entitiesPalette'], function(Diagram, EntitiesPalette) {

    return Marionette.Object.extend({
        showDiagram: function(entites) {
            this.diagram = new Diagram({ toolboxWidth: 140, size: { width: "1600px", height: "900px" } });
            this.diagram.render();

            var entitiesPalette = new EntitiesPalette({ entities: entites });
            entitiesPalette.install(this.diagram);

            $(window).on("resize", this.diagram.resize.bind(this.diagram));
        },

        start: function(entities) {
            $(function() {
                this.showDiagram(entities);
            }.bind(this));

        }
    });

});
