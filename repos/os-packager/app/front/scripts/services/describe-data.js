var obeu_types = {
  "accountingRrecord:dimension": {
    "dataType": "string", 
    "dimensionType": "fact", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:code:full": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:code:part": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:description": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "administrative-classification:dimension:label": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "administrative-classification:dimension:label"
  }, 
  "administrative-classification:dimension:level1:code:full": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level1:code:part": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level1:description": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "administrative-classification:dimension:level1:label": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "administrative-classification:dimension:level1:code"
  }, 
  "administrative-classification:dimension:level2:code:full": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level2:code:part": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level2:description": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "administrative-classification:dimension:level2:label": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "administrative-classification:dimension:level2:code"
  }, 
  "administrative-classification:dimension:level3:code:full": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level3:code:part": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level3:description": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "administrative-classification:dimension:level3:label": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "administrative-classification:dimension:level3:code"
  }, 
  "administrative-classification:dimension:level4:code:full": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level4:code:part": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "administrative-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "administrative-classification:dimension:level4:description": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "administrative-classification:dimension:level4:label": {
    "classificationType": "administrative", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "administrative-classification:dimension:level4:code"
  }, 
  "amount:measure": {
    "dataType": "number"
  }, 
  "budgetLine:dimension": {
    "dataType": "string", 
    "dimensionType": "fact", 
    "uniqueIdentifier": true
  }, 
  "budgetPhase:dimension:approved": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "budgetPhase:dimension:draft": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "budgetPhase:dimension:executed": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "budgetPhase:dimension:revised": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "budgetaryUnit:dimension:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "budgetaryUnit:dimension:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "currency:attribute:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "currency:attribute:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "currency:dimension:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "currency:dimension:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "date:dimension:fiscalPeriod": {
    "dataType": "string", 
    "dimensionType": "datetime", 
    "uniqueIdentifier": true
  }, 
  "direction": {
    "dataType": "string", 
    "dimensionType": "other", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level1:code": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level1:description": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "economic-classification:dimension:level1:label": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "economic-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level2:code": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "economic-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level2:description": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "economic-classification:dimension:level2:label": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "economic-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level3:code": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "economic-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level3:description": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "economic-classification:dimension:level3:label": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "economic-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level4:code": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "economic-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "economic-classification:dimension:level4:description": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "economic-classification:dimension:level4:label": {
    "classificationType": "economic", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "economic-classification:dimension:level4:code", 
    "uniqueIdentifier": true
  }, 
  "fiscalPeriod:dimension": {
    "dataType": "string", 
    "dimensionType": "datetime", 
    "uniqueIdentifier": true
  }, 
  "fiscalYear:dimension": {
    "dataType": "date", 
    "dimensionType": "datetime", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:code:full": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:code:part": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:description": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:label": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:level1:code:full": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level1:code:part": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level1:description": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:level1:label": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "functional-classification:dimension:level1:code"
  }, 
  "functional-classification:dimension:level2:code:full": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level2:code:part": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level2:description": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:level2:label": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "functional-classification:dimension:level2:code"
  }, 
  "functional-classification:dimension:level3:code:full": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level3:code:part": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level3:description": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:level3:label": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "functional-classification:dimension:level3:code"
  }, 
  "functional-classification:dimension:level4:code:full": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level4:code:part": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "functional-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "functional-classification:dimension:level4:description": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "functional-classification:dimension:level4:label": {
    "classificationType": "functional", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "functional-classification:dimension:level4:code"
  }, 
  "location:attribute:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "location:attribute:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "operationCharacter:dimension:expenditure": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "operationCharacter:dimension:revenue": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "organization:dimension:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "organization:dimension:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "partner:dimension:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "partner:dimension:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "programm-classification:dimension:code:full": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:code:part": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:description": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:label": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:level1:code:full": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level1:code:part": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level1:description": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:level1:label": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "programm-classification:dimension:level1:code"
  }, 
  "programm-classification:dimension:level2:code:full": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level2:code:part": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level1:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level2:description": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:level2:label": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "programm-classification:dimension:level2:code"
  }, 
  "programm-classification:dimension:level3:code:full": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level3:code:part": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level2:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level3:description": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:level3:label": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "programm-classification:dimension:level3:code"
  }, 
  "programm-classification:dimension:level4:code:full": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level4:code:part": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "parent": "programm-classification:dimension:level3:code", 
    "uniqueIdentifier": true
  }, 
  "programm-classification:dimension:level4:description": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification"
  }, 
  "programm-classification:dimension:level4:label": {
    "classificationType": "programm", 
    "dataType": "string", 
    "dimensionType": "classification", 
    "labelfor": "programm-classification:dimension:level4:code"
  }, 
  "project:dimension:id": {
    "dataType": "string", 
    "dimensionType": "entity", 
    "uniqueIdentifier": true
  }, 
  "project:dimension:name": {
    "dataType": "string", 
    "dimensionType": "entity"
  }, 
  "taxesIncluded:attribute:code": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "taxesIncluded:attribute:id": {
    "dataType": "string", 
    "dimensionType": "other", 
    "uniqueIdentifier": true
  }, 
  "taxesIncluded:dimension:code": {
    "dataType": "string", 
    "dimensionType": "other"
  }, 
  "taxesIncluded:dimension:id": {
    "dataType": "string", 
    "dimensionType": "other", 
    "uniqueIdentifier": true
  }
};

var OBEUTypes = class TypeProcessor {

    constructor() {
        this.types = obeu_types;
    }

    getAllTypes() {
        return Object.keys(this.types);
    }

    autoComplete(prefix) {
        if ( !prefix ) {
            prefix = '';
        }
        var options = _.filter(this.getAllTypes(), (typ) => {
          return _.startsWith(typ, prefix);
        });
    
        var prefixLen = prefix.length;
        var findNextIndex = (typ) => {
            for ( var i = prefixLen ; i < typ.length ; i++ ) {
                if ( typ[i] == ":" ) {
                    break;
                }
            }
            return i;
        }
        options = _.map(options, (typ) => {
            var nextIndex = findNextIndex(typ);
            var ret = typ.slice(0,nextIndex);
            if ( nextIndex < typ.length ) {
                ret += typ[nextIndex];
            }
            return ret;
        });
        return _.uniq(options);
    }

    _checkInput(fields) {
        // Make sure we got an array...
        var valid = _.isArray(fields) || this._generalError("Fields should be an array");
        // ... of objects ...
        valid = valid &&
            _.every(fields, (f) => {
                return _.isObject(f) || this._generalError("Field items should be objects");
            });
        // ... with all the mandatory properties ...
        valid = valid &&
            _.every(fields, (f) => {
                return (_.hasIn(f, 'name') && _.hasIn(f, 'type')) ||
                    this._generalError("Field items should have 'name' and 'type'");
            });
        // ... and no unknown properties ...
        var allowedProperties = [
            'name', 'title', 'type', 'format', 'data', 'options', 'resource'  // common properties
        ];
      /*  valid = valid &&
            _.every(fields, (f) => {
                var diff = _.difference(_.keys(f), allowedProperties);
                return (diff.length == 0) ||
                    this._fieldError(f.name, "Got unknown properties "+diff);
            });
        // ... and all types are valid ...
        valid = valid &&
            _.every(fields, (f) => {
                return !f.type || _.hasIn(this.types, f.type) ||
                    this._fieldError(f.name, "Got unknown type " + f.type);
            });
        // ... and no unknown additional options ...
        valid = valid && 
            _.every(fields, (f) => {
                if ( !f.type ) { return true; }
                var allowedOptions = _.union(
                    _.get(extraOptions, 'dataTypes.'+this.types[f.type].dataType+'.options', []),
                    _.get(extraOptions, 'obeuTypes.'+f.type+'.options', [])
                );
                allowedOptions = _.map(allowedOptions, 'name');
                var options = _.get(f, 'options', {});
                options = _.keys(options);
                var diff = _.difference(options, allowedOptions);
                return (diff.length == 0) ||
                    this._fieldError(f.name, "Got unknown options key "+diff);
            });*/
        return valid;
    }

    _titleToSlug(title, type) {
        var slugRe = new RegExp('[a-zA-Z0-9]+','g');
        var vowelsRe = new RegExp('[aeiou]+','g');
        var slugs = _.deburr(title).match(slugRe);
        if ( slugs == null || slugs.length == 0 ) {
            slugs = _.join(type.split(vowelsRe),'').match(slugRe);
        }
        var slug = _.join(slugs, '_');
        if ( this.allNames.indexOf(slug) >= 0 ) {
            let i = 2;
            while ( true ) {
                let attempt = slug + '_' + i;
                if ( this.allNames.indexOf(attempt) < 0 ) {
                    slug = attempt;
                    break;
                }
                i+=1;
            }
        }
        this.allNames.push(slug)
        return slug;
    }

    _initErrors() {
        this.errors = { general: [], perField: {} };
    }

    _generalError(err) {
        this.errors.general.push(err);
        return false;
    }

    _fieldError(field, err) {
        var fieldErrors = this.errors.perField[field];
        if (!fieldErrors) {
            fieldErrors = [];
            this.errors.perField[field] = fieldErrors;
        }
        fieldErrors.push(err);
        return false;
    }

    /*_embedOptions(target, options, availableOptions) {
        _.forEach(availableOptions, (availableOption) => {
            var n = availableOption.name;
            if (_.hasIn(options, n) && options[n]) {
                target[n] = options[n];
            } else if (_.hasIn(availableOption, 'defaultValue')) {
                target[n] = availableOption.defaultValue;
            }
        });
     
    }*/

    fieldsToModel(fields) {
        // Prepare errors
        this._initErrors();
        // Detect invalid data
        if ( !this._checkInput(fields) ) {
            var ret = {errors: this.errors};
            console.log(JSON.stringify(ret,null,2));
            return ret;
        }
        // Modelling
        var dimensions = {};
        var measures = {};
        var model = { dimensions, measures };
        var schema = {fields:{}, primaryKey:[]};
        this.allNames = [];
        _.forEach(_.filter(fields, (f) => { return !!f.type; }), (f) => {
            var obeuType = this.types[f.type];
            if (!f.title) {
                f.title = f.name;
            }
            f.slug = this._titleToSlug(f.title, f.type);
            var conceptType = _.split(f.type,':')[0];
            schema.fields[f.title] = {
                title: f.title,
                name: f.name,
                slug: f.slug,
                type1: obeuType.dataType,
                format: obeuType.format || f.format || 'default',
                obeuType: f.type,
                conceptType: conceptType,
                resource: f.resource, 
                options: [] /* _.union(
                            _.get(extraOptions, 'dataTypes.'+obeuType.dataType+'.options', []), 
                            _.get(extraOptions, 'obeuTypes.'+f.type+'.options', [])
                ) */
            };
          //  this._embedOptions(schema.fields[f.title], f.options, _.get(extraOptions, 'dataTypes.'+obeuType.dataType+'.options', []));

            if ( conceptType == 'value' ) { //never executed
                // Measure
                var measure = {
                    source: f.name,
                    title: f.title
                	}
                // Extra properties
                if (f.resource)          { measure.resource = f.resource; }
              //  this._embedOptions(measure, f.options, _.get(extraOptions, 'obeuTypes.amount.options', []));
                measures[f.slug] = measure;
            } else {
                let dimension;
                if ( _.hasIn(dimensions, conceptType) ) {
                    dimension = dimensions[conceptType];
                } else {
                    dimension = {
                        dimensionType: obeuType.dimensionType,
                        primaryKey: [],
                        attributes: {},
                    };
                    if ( obeuType.classificationType ) {
                        dimension.classificationType = obeuType.classificationType;
                    }
                    dimensions[conceptType] = dimension;
                }
                var attribute = {
                    source: f.name,
                    title: f.title
                };
                if ( f.resource ) {
                    attribute.resource = f.resource;
                }
                dimension.attributes[f.slug] = attribute;
                if (obeuType.uniqueIdentifier) {
                    dimension.primaryKey.push(f.slug);
                    schema.primaryKey.push(f.name);
                }
            }
        });
        // Process parent, labelfor
        var findAttribute = (field, obeuType) => {
            if ( field ) {
                return {key:field.slug, attr:dimensions[field.conceptType].attributes[field.slug]};
            }
            if ( obeuType ) {
                var field = _.find(_.values(schema.fields), (i) => {
                    return _.startsWith(i.obeuType, obeuType);
                });
                return findAttribute(field);
            }
        };
        _.forEach(_.values(schema.fields), (field) => {
            var obeuType = this.types[field.obeuType];
            var labelfor = obeuType.labelfor;
            var parent = obeuType.parent;
            if ( labelfor || parent ) {
                var attribute = findAttribute(field).attr;
                if ( labelfor ) {
                    var targetAttribute = findAttribute(null, labelfor);
                    if ( targetAttribute ) {
                        attribute.labelfor = targetAttribute.key;
                    }
                }
                if ( parent ) {
                    var targetAttribute = findAttribute(null, parent);
                    if ( targetAttribute ) {
                        attribute.parent = targetAttribute.key;
                    }
                }
            }
        });
        // Fix primary keys in case they're missing
        _.forEach(model.dimensions, (dimension) => {
           if (dimension.primaryKey.length == 0) {
               dimension.primaryKey = _.keys(dimension.attributes);
           }
        });

        var fdp = {model, schema};
        //console.log(JSON.stringify(fdp,null,2));
        return fdp;
    }
};

//var OBEUTypes = require('obeu-types');

var OSTypes = require('os-types');


;(function(angular) {

  angular.module('Application')
    .factory('DescribeDataService', [
      '_', 'PackageService', 'UtilsService', 'ValidationService',
      'PreviewDataService', 'ApplicationState', 'ApplicationLoader',
      function(_, PackageService, UtilsService, ValidationService,
        PreviewDataService, ApplicationState, ApplicationLoader) {
        var result = {};

        var state = null;
        ApplicationLoader.then(function() {
          state = {};
          if (_.isObject(ApplicationState.describeData)) {
            state = ApplicationState.describeData;
          }
          ApplicationState.describeData = state;
          PreviewDataService.update();
        });

        result.resetState = function() {
            state = {};
	    ApplicationState.describeData = state;
	    /*
	      added by TD.
	     */
	    obeuState = {};
	    ApplicationState.describeObeuData = obeuState;
	    
        };
	  //changed by TD.
          result.getState = function(cat) {
	      console.log('DescribeDataService.getState, cat=', cat, '*');
	      if (cat === 'os' || cat === undefined){
		  return state;
	      }
	      if (cat === 'obeu'){
		  return obeuState;
	      }
        };

        result.getSelectedConcepts = function(conceptType) {
          var mapped = [];
          var resources = PackageService.getResources();
          _.each(resources, function(resource) {
            _.each(resource.fields, function(field) {
              if (field.conceptType == conceptType) {
                mapped.push(field);
              }
            });
          });
          return mapped;
        };

        result.updateField = function(field) {
          if (!field) {
            return;
          }
            var fields = PackageService.getResources()[0].fields;
	    console.log('in scripts/services/describe-data.js', fields);
          //TODO: Support more than 1 resource when OSTypes supports it
          _.forEach(fields, function(field) {
            delete field.errors;
            delete field.additionalOptions;
            delete field.slug;
          });
            var fdp = new OSTypes().fieldsToModel(fields);

	    
	    
            if (fdp.errors) {
		//if error, this field should be an obeu field.
		/*  
		  _.forEach(fields, function(field) {
		  var fieldErrors = fdp.errors.perField[field.title];
		  if (fieldErrors) {
                  field.errors = fieldErrors;
		  }
		  });
		*/
		
          } else {
            _.forEach(fields, function(field) {
              var schemaField = fdp.schema.fields[field.title];
              if (schemaField) {
                field.additionalOptions = schemaField.options;
                if (!field.options) {
                  field.options = {};
                }
                _.forEach(field.additionalOptions, function(option) {
                  if (option.name == 'currency') {
                    option.values = _.map(UtilsService.getCurrencies(),
                      function(item) {
                        return {
                          name: item.code + ' ' + item.name,
                          value: item.code
                        };
                      });
                    option.defaultValue =
                      UtilsService.getDefaultCurrency().code;
                  }
                  if (_.has(option,'defaultValue')) {
                    field.options[option.name] = option.defaultValue;
                  }
                });
              } else {
                field.additionalOptions = [];
                field.options = {};
              }
            });
          }
          state.status = ValidationService.validateRequiredConcepts(
            PackageService.getResources());

          PreviewDataService.update();

          return state;
        };

        return result;
      }
    ]);

})(angular);
