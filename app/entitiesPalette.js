/**
 * Created by nvolf on 28.12.2015.
 */
/**
 * Created by nvolf on 17.12.2015.
 */
define([
        'bower_components/designer/js/diagram/toolboxGroup',
        'bower_components/designer/js/diagram/toolboxElement',
        'bower_components/designer/js/activity/activity',
        'bower_components/designer/js/activity/flow',
        'bower_components/designer/js/behaviors/api'
    ],

    function(ToolboxGroup, ToolboxElement, Activity, FlowView, behaviors) {

        var EntityToolboxElement = function(entity, index) {
            this.offset = { left: 0, top: index * 30 };
            this.view = ToolboxElement.extend({
                initialize: function() {
                    ToolboxElement.prototype.initialize.apply(this, arguments);
                    this.tpl = Handlebars.compile("<rect class='js-toolbox toolbox-rectangle-primitive' x=0 y=0 width=90 height=15 />")
                }
            });
            this.type = entity.id;
            this.name = entity.name;

            this.Activity = function() {
                return Activity.extend({
                    initialize: function(cfg) {
                        cfg.model.attributes.entity = entity;
                        behaviors.rectangularResizers.setup(this);
                        behaviors.rectangularShapedConnectorSet.setup(this);
                        _.extend(cfg, {
                            template: '<g transform="{{dimScale}}"  class="js-activity-resize-root">' +
                                '<rect class="diagram-activity-entity" vector-effect="non-scaling-stroke" x="0" y="0" width="100" height="100"></rect>' +
                                '<text class="diagram-activity-entity-text" x="20" y="20">{{entity.name}}</text>' +
                                '</g>'
                        });
                        Activity.prototype.initialize.apply(this, [cfg]);
                    }
                });
            }
        };

        var modelReference = {
            'Flow': FlowView,

            matchModel: function(model) {
                return this[model.attributes.type]
            }
        };

        var EntitiesGroup = ToolboxGroup.extend({
            initialize: function(options) {
                ToolboxGroup.prototype.initialize.apply(this, arguments);

                this.entities = options.entities;

                _.each(this.entities, function(entity, index) {
                    var toolboxElement = new EntityToolboxElement(entity, index);
                    this.elements.push(toolboxElement);
                    modelReference[entity.id] = toolboxElement.Activity();

                }.bind(this));

                this.id = "primitivesGroup";
                this.title = "Primitives"
            }
        });

        return Marionette.Object.extend({

            initialize: function(options) {
                this.entities = options.entities;
            },

            install: function(diagram) {
                diagram.toolboxView.pushGroup((new EntitiesGroup({ container: diagram.toolboxView, entities: this.entities })));
                diagram.modelMapper.addMapper(modelReference);
            }
        });

    });