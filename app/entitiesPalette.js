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
                    this.tpl = Handlebars.compile(
                        '<rect class="js-toolbox toolbox-activity-entity" x=5 y=0 width=300 height=24 />' +
                        '<text class="toolbox-activity-entity-text" x="8" y="17" width="290" height="24">{{name}}</text>',
                        entity
                        );
                }
            });
            this.type = entity.id;
            this.name = entity.name;

            this.Activity = function() {
                return Activity.extend({
                    initialize: function(cfg) {

                        this.entity = entity;
                        cfg.model.attributes.size = cfg.model.attributes.size || {};
                        if (!cfg.model.attributes.size.width  || cfg.model.attributes.size.width == 100)
                            cfg.model.attributes.size.width = 200;

                        if (!cfg.model.attributes.size.height || cfg.model.attributes.size.height == 80)
                            cfg.model.attributes.size.height = entity.attributes.length * 30 + 50;

                        behaviors.rectangularResizers.setup(this);
                        behaviors.rectangularShapedConnectorSet.setup(this);
                        _.extend(cfg, {
                            template: '<g transform="{{dimScale}}"  class="js-activity-resize-root">' +
                                '<rect class="diagram-activity-entity js-activity-shape" vector-effect="non-scaling-stroke" x="0" y="0" width="100" height="100"></rect>' +
                                '<g class="js-activity-resize-root-anti js-attribute-list" transform="{{dimScaleA}}" >' +
                                    '<text class="diagram-activity-entity-text no-select" x="10" y="20" width="80" height="25" >' + this.entity.name + '</text>' +
                                '</g>' +
                                '</g>'
                        });
                        Activity.prototype.initialize.apply(this, [cfg]);
                    },

                    appendViewItems: function() {
                        Activity.prototype.appendViewItems.apply(this, arguments);

                        _.each(this.entity.attributes, function(attribute, index) {
                            this.activityG.select(".js-attribute-list")
                                .append("text")
                                .classed({
                                    'diagram-activity-attribute-text': true,
                                    'no-select': true
                                })
                                .attr({
                                    x: 20,
                                    y: 50 + index*25,
                                    width: 80,
                                    height: 20
                                })
                                .text(attribute.name + " : " + attribute.typeName)
                        }.bind(this));

                        this.setupComponentScale(this.activityG);
                        this.setupComponentScale(this.resizersG);
                    },

                    fillFlows: function(norecursive) {
                        _.each(entity.attributes, function(attribute) {


                            var connected = _.filter(this.parent.viewModels, function(f) {
                                if (f == this || !f.entity)
                                    return false;

                                return f.entity.id == attribute.type;
                            }.bind(this));

                            _.each(connected, function(connectedViewModel) {
                                if (this != connectedViewModel)
                                    this.parent.connectNewActivities(this, connectedViewModel).id;
                            }.bind(this));

                        }.bind(this));

                        _.each(this.parent.viewModels, function(f) {
                            if (!f.entity)
                                return;

                            if (_.findWhere(f.entity.attributes, {type: this.entity.id})) {
                                if (this != f)
                                    this.parent.connectNewActivities(f, this);
                            }
                        }.bind(this));


                    },

                    onPlaced: function() {
                        this.fillFlows();
                        Activity.prototype.onPlaced.apply(this, arguments);
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
                this.position = { x: 0, y: 10};

                _.each(this.entities, function(entity, index) {
                    var toolboxElement = new EntityToolboxElement(entity, index);
                    this.elements.push(toolboxElement);
                    modelReference[entity.id] = toolboxElement.Activity();

                }.bind(this));

                this.id = "entitiesGroup";
                this.title = "Entities"
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