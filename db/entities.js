/**
 * Created by nvolf on 28.12.2015.
 */

var exports = module.exports = {};

var primitiveTypes = ["string", "double", "bool", "dateTime", "timeSpan", "int"];

var _ = require("underscore");

var entities = [
    {
        id: "recordType",
        name: "Record Type",

        attributes: [
            {
                id: "name",
                type: "string",
                isMultiValue: "false"
            },
            {
                id: "properties",
                type: "objectProperty",
                isMultiValue: "true"
            }
        ]
    },
    {
        id: "objectProperty",
        name: "Object Property",

        attributes: [
            {
                id: "name",
                type: "string",
                isMultiValue: "false"
            }
        ]
    }
]

exports.listEntities = function(callback) {
    var selectedEntities = _.uniq(entities);
    callback(selectedEntities);
};

exports.listEntityAttributes = function(entityId, callback) {
    var entity = _.findWhere(entities, { id: entityId });
    callback(_.uniq(entity.attributes));
}