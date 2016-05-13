;(function(angular) {

  angular.module('Application', [
    'ngRoute',
    'ngAnimate',
    'authClient.services'
  ]);

})(angular);

/**
 * Import some modules - required for other stuff like Bootstrap and Angular
 */
(function(globals, require) {
  globals.$ = globals.jQuery = require('jquery');
  require('isomorphic-fetch/fetch-npm-browserify'); // fetch() polyfill
})(window, require);

;(function(angular) {

  angular.module('Application')
    .animation('.fade-animation', [
      function() {
        return {
          enter: function(element, doneFn) {
            $(element).hide().fadeIn(100, doneFn);
          },
          leave: function(element, doneFn) {
            $(element).fadeOut(100, doneFn);
          }
        };
      }
    ]);

})(angular);

;(function(angular) {

  var events = {
    MODAL_OPEN: 'bootstrap-modal.open',
    MODAL_CLOSE: 'bootstrap-modal.close'
  };

  angular.module('Application')
    .directive('bootstrapModal', [
      function() {
        return {
          restrict: 'A',
          link: function($scope, element) {
            $scope.$on(events.MODAL_OPEN, function(event, modalId) {
              if (element.attr('id') == modalId) {
                element.modal('show');
              }
            });
            $scope.$on(events.MODAL_CLOSE, function(event, modalId) {
              if (element.attr('id') == modalId) {
                element.modal('hide');
              }
            });
          }
        };
      }
    ])
    .run([
      '$rootScope',
      function($rootScope) {
        $rootScope.bootstrapModal = function() {
          var $scope = this;
          return {
            show: function(modalId) {
              $scope.$broadcast(events.MODAL_OPEN, [modalId]);
            },
            hide: function(modalId) {
              $scope.$broadcast(events.MODAL_CLOSE, [modalId]);
            }
          };
        };
      }
    ]);

})(angular);

;(function(angular, undefined) {

  angular.module('Application')
    .directive('ngFileSelected', [
      '$timeout', '$compile',
      function($timeout, $compile) {
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            var localScope = scope.$new();
            element.on('change', function() {
              localScope.files = this.files;
              element.replaceWith($compile(element.clone())(scope));
              $timeout(function() {
                localScope.$eval(attr.ngFileSelected);
                localScope.files = undefined;
              });
            });
          }
        };
      }
    ]);

})(angular);


//
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
        valid = valid &&
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
        valid = valid ; /*&& 
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
                type: obeuType.dataType,
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
var _ = require('lodash');

;(function(angular) {

  angular.module('Application')
    .directive('obeuDatatype', [
      function() {
        return {
          restrict: 'E',
          templateUrl: 'templates/directives/obeu-datatype.html',
          replace: true,
          controller: ['$scope',
            function($scope) {
              var sugg = '';
              return {
                setSugg: function(_sugg) {
                  sugg = _sugg;
                  $scope.$applyAsync();
                },
                getSugg: function() {
                  return sugg;
                },
                isIncomplete: function() {
                  return _.endsWith(sugg, ':');
                },
                setVal: function(val, clear) {
                  this.field.type = val;
                  if (clear) {
                    this.field.options = {};
                  }
                  this.onChanged();
                  $scope.$applyAsync();
                }
              };
            }
          ],
          controllerAs: 'ctrl',
          bindToController: {
            field: '=',
            onChanged: '&'
          },
          link: function($scope, element, attr, ctrl) {
            var input = element.find('.typeahead')[0];
            var clear = element.find('.clear')[0];
            var ot = new OBEUTypes();
            var sep = ' ❯ ';
            $(input).typeahead({
              minLength: 0,
              highlight: true
            }, {
              limit: 100,
              source: function(query, sync) {
                query = query.replace(new RegExp(sep,'g'),':');
                sync(_.map(ot.autoComplete(query), function(sugg) {
                  return {
                    val: sugg,
                    text: _.trimEnd(sugg, ':').replace(/:/g,sep),
                    leaf: _.last(sugg) != ':'
                  };
                }));
              },
              display: function(sugg) {
                return sugg.text;
              },
              templates: {
                suggestion: function(sugg) {
                  var suffix;
                  if (!sugg.leaf) {
                    suffix = ' ❯ ';
                  } else {
                    suffix = '';
                  }
                  var ret = _.last(_.split(sugg.text, sep)) + suffix;
                  return '<div>' + ret + '</div>';
                }
              }
            });
            if (ctrl.field.type) {
              ctrl.setSugg(ctrl.field.type);
              $(input).typeahead('val', ctrl.field.type.replace(/:/g,sep));
              ctrl.setVal(ctrl.field.type, false);
            }
            $(input).bind('typeahead:select', function(ev, sugg) {
              ctrl.setSugg(sugg.val);
              if (!sugg.leaf) {
                window.setTimeout(function() {
                  $(input).typeahead('val', sugg.text + sep);
                  $(input).typeahead('open');
                }, 100);
                $scope.$applyAsync();
              } else {
                ctrl.setVal(sugg.val, true);
                $scope.$applyAsync();
              }
            });
            $(clear).bind('click', function() {
              $(input).typeahead('val','');
              ctrl.setSugg('');
              ctrl.setVal('', true);
            });
          }
        };
      }
    ]);

})(angular);


var OSTypes = require('os-types');
var _ = require('lodash');

;(function(angular) {

  angular.module('Application')
    .directive('osDatatype', [
      function() {
        return {
          restrict: 'E',
          templateUrl: 'templates/directives/os-datatype.html',
          replace: true,
          controller: ['$scope',
            function($scope) {
              var sugg = '';
              return {
                setSugg: function(_sugg) {
                  sugg = _sugg;
                  $scope.$applyAsync();
                },
                getSugg: function() {
                  return sugg;
                },
                isIncomplete: function() {
                  return _.endsWith(sugg, ':');
                },
                setVal: function(val, clear) {
                  this.field.type = val;
                  if (clear) {
                    this.field.options = {};
                  }
                  this.onChanged();
                  $scope.$applyAsync();
                }
              };
            }
          ],
          controllerAs: 'ctrl',
          bindToController: {
            field: '=',
            onChanged: '&'
          },
          link: function($scope, element, attr, ctrl) {
            var input = element.find('.typeahead')[0];
            var clear = element.find('.clear')[0];
            var ot = new OSTypes();
            var sep = ' ❯ ';
            $(input).typeahead({
              minLength: 0,
              highlight: true
            }, {
              limit: 100,
              source: function(query, sync) {
                query = query.replace(new RegExp(sep,'g'),':');
                sync(_.map(ot.autoComplete(query), function(sugg) {
                  return {
                    val: sugg,
                    text: _.trimEnd(sugg, ':').replace(/:/g,sep),
                    leaf: _.last(sugg) != ':'
                  };
                }));
              },
              display: function(sugg) {
                return sugg.text;
              },
              templates: {
                suggestion: function(sugg) {
                  var suffix;
                  if (!sugg.leaf) {
                    suffix = ' ❯ ';
                  } else {
                    suffix = '';
                  }
                  var ret = _.last(_.split(sugg.text, sep)) + suffix;
                  return '<div>' + ret + '</div>';
                }
              }
            });
            if (ctrl.field.type) {
              ctrl.setSugg(ctrl.field.type);
              $(input).typeahead('val', ctrl.field.type.replace(/:/g,sep));
              ctrl.setVal(ctrl.field.type, false);
            }
            $(input).bind('typeahead:select', function(ev, sugg) {
              ctrl.setSugg(sugg.val);
              if (!sugg.leaf) {
                window.setTimeout(function() {
                  $(input).typeahead('val', sugg.text + sep);
                  $(input).typeahead('open');
                }, 100);
                $scope.$applyAsync();
              } else {
                ctrl.setVal(sugg.val, true);
                $scope.$applyAsync();
              }
            });
            $(clear).bind('click', function() {
              $(input).typeahead('val','');
              ctrl.setSugg('');
              ctrl.setVal('', true);
            });
          }
        };
      }
    ]);

})(angular);

;(function(angular) {

  var app = angular.module('Application');

  app.directive('popover', [
    '$compile',
    function($compile) {
      return {
        template: '',
        replace: false,
        restrict: 'A',
        scope: false,
        link: function($scope, element, attrs) {
          var id = 'angular-popover-' + Date.now() + '-' +
            Math.round(Math.random() * 1000000);

          element.popover({
            placement: 'bottom',
            html: true,
            trigger: 'focus',
            content: function() {
              return '<div id="' + id + '">' +
                $(attrs.popover).html() + '<div>';
            }
          });

          element.on('shown.bs.popover', function() {
            $compile($('#' + id))($scope);
          });
        }
      };
    }
  ]);
})(angular);

;(function(angular, undefined) {

  angular.module('Application')
    .directive('progressBar', [
      function() {
        return {
          restrict: 'EA',
          scope: {
            value: '@',
            label: '@'
          },
          templateUrl: 'templates/directives/progress.html',
          replace: true,
          link: function($scope, element, attr) {
            $scope.$watch('value', function(newValue, oldValue) {
              if (newValue !== oldValue) {
                newValue = parseFloat(newValue);
                if (isFinite(newValue) && (newValue >= 0)) {
                  $scope.value = newValue;
                } else {
                  $scope.value = 0.0;
                }
              }
            });
          }
        };
      }
    ]);

})(angular);

;(function(angular) {

  var _ = require('underscore');
  var services = require('app/services');

  angular.module('Application')
    .constant('_', _)
    .constant('Services', services)
    .value('ApplicationState', {})
    .config([
      '$httpProvider', '$compileProvider', '$logProvider',
      function($httpProvider, $compileProvider, $logProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $logProvider.debugEnabled(true);
      }
    ])
    .run([
      '$rootScope', 'Services', 'ApplicationLoader',
      'StepsService', 'UploadFileService', 'DescribeDataService',
      'ProvideMetadataService', 'DownloadPackageService',
      function($rootScope, Services, ApplicationLoader,
        StepsService, UploadFileService, DescribeDataService,
        ProvideMetadataService, DownloadPackageService) {
        $rootScope.ProcessingStatus = Services.datastore.ProcessingStatus;

        StepsService.setStepResetCallbacks({
          'upload-file': UploadFileService.resetState,
          'describe-data': DescribeDataService.resetState,
          'metadata': ProvideMetadataService.resetState,
          'download': DownloadPackageService.resetState
        });

        ApplicationLoader.then(function() {
          $rootScope.applicationLoaded = true;
        });
      }
    ]);

})(angular);

;(function(angular) {

  var services = require('app/services');

  var config = {
    defaultErrorHandler: function(error) {
      if (console.trace) {
        return console.trace(error);
      } else
      if (console.log) {
        return console.log(error);
      }
    },
    defaultPackageFileName: 'datapackage.json',
    events: {
      CONCEPTS_CHANGED: 'package.conceptsChanged'
    },
    storage: {
      collection: 'appstate',
      key: 'default'
    },
    steps: services.data.steps,
    isWizard: window.isWizard,
    maxFileSizeToStore: 100 * 1024 * 1024 // 100Mb
  };

  angular.module('Application')
    .constant('Configuration', config);

})(angular);

;(function(angular) {

  angular.module('Application')
    .config([
      '$routeProvider', '$locationProvider', '_', 'Configuration',
      function($routeProvider, $locationProvider, _, Configuration) {
        _.each(Configuration.steps, function(step) {
          $routeProvider
            .when(step.route, {
              templateUrl: step.templateUrl,
              controller: step.controller,
              step: step
            });
        });
        $routeProvider.otherwise({
          redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
      }
    ])
    .run([
      '$route',
      function($route) {
        // Capture initial $locationChangeStart event; otherwise ngView will
        // not work (f*cking "known" issue since `angular-route@1.5.5`)
      }
    ])

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('DescribeDataController', [
      '$scope', 'PackageService', 'DescribeDataService', 'ApplicationLoader',
      function($scope, PackageService, DescribeDataService, ApplicationLoader) {
        ApplicationLoader.then(function() {
          $scope.state = DescribeDataService.getState();
          $scope.resources = PackageService.getResources();

          $scope.onConceptChanged = function(field) {
            $scope.state = DescribeDataService.updateField(field);
            $scope.selectedMeasures = DescribeDataService
              .getSelectedConcepts('measure');
            $scope.selectedDimensions = DescribeDataService
              .getSelectedConcepts('dimension');
          };
	    $scope.onObeuConceptChanged = function(field) {
            
          };
        });
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('DownloadPackageController', [
      '$scope', 'PackageService', 'DownloadPackageService',
      'Configuration', 'ApplicationLoader', 'LoginService',
      function($scope, PackageService, DownloadPackageService,
        Configuration, ApplicationLoader, LoginService) {
        ApplicationLoader.then(function() {
          $scope.fileName = Configuration.defaultPackageFileName;
          $scope.attributes = PackageService.getAttributes();
          $scope.resources = PackageService.getResources();
          $scope.fiscalDataPackage = PackageService.createFiscalDataPackage();
          $scope.mappings = DownloadPackageService.generateMappings(
            PackageService.createFiscalDataPackage());
          $scope.login = LoginService;
          $scope.publishDataPackage = DownloadPackageService.publishDataPackage;
          $scope.state = DownloadPackageService.getState();
        });
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('HeaderController', [
      '$scope', 'LoginService',
      function($scope, LoginService) {
        $scope.login = LoginService;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('PreviewDataController', [
      '$scope', 'PreviewDataService', 'ApplicationLoader',
      function($scope, PreviewDataService, ApplicationLoader) {
        ApplicationLoader.then(function() {
          $scope.possibilities = PreviewDataService.getPossibilities();
          $scope.state = PreviewDataService.getState();
          //TODO: [Adam] This functionality is broken right now, we need to restore it correctly
          //$scope.previewData = PreviewDataService.getPreviewData();

          //$scope.onSelectPossibility = function(possibility) {
          //  PreviewDataService.selectPossibility(possibility);
          //  $scope.previewData = PreviewDataService.getPreviewData();
          //};
        });
      }
    ]);

})(angular);

;(function(angular, undefined) {

  angular.module('Application')
    .controller('ProvideMetadataController', [
      '$scope', 'PackageService', 'ProvideMetadataService',
      'ApplicationLoader', '_',
      function($scope, PackageService, ProvideMetadataService,
        ApplicationLoader, _) {
        ApplicationLoader.then(function() {
          $scope.forms = _.extend({}, $scope.forms);

          $scope.geoData = ProvideMetadataService.getGeoData();
          $scope.state = ProvideMetadataService.getState();

          $scope.attributes = PackageService.getAttributes();

          var fiscalPeriod = null;
          if ($scope.attributes && $scope.attributes.fiscalPeriod) {
            fiscalPeriod = $scope.attributes.fiscalPeriod;
          }
          $scope.period = {
            start: fiscalPeriod ? fiscalPeriod.from : '',
            end: fiscalPeriod ? fiscalPeriod.to : '',
          };

          $scope.$watch('attributes.title', function() {
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          });

          $scope.$watch('attributes.name', function() {
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          });

          $scope.$watch('period', function(value) {
            ProvideMetadataService.updateFiscalPeriod(value);
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          }, true);

          $scope.$watch('attributes.regionCode', function() {
            ProvideMetadataService.updateCountries();
            $scope.geoData = ProvideMetadataService.getGeoData();
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          });

          $scope.$watch('attributes', function(newValue, oldValue) {
            if ((newValue === oldValue)) {
              return;
            }
            $scope.state = ProvideMetadataService.validatePackage(
              $scope.forms.metadata);
          }, true);
        });
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('StepsController', [
      '$scope', 'StepsService', 'ApplicationLoader', 'StorageService',
      function($scope, StepsService, ApplicationLoader, StorageService) {
        ApplicationLoader.then(function() {
          $scope.steps = StepsService.getSteps();
          $scope.currentStep = StepsService.getCurrentStep();
          $scope.nextStep = StepsService.getNextStep($scope.currentStep);

          $scope.goToStep = function(step) {
            $scope.currentStep = StepsService.goToStep(step);
          };

          $scope.goToNextStep = function() {
            $scope.currentStep = StepsService.goToStep($scope.nextStep, true);
          };

          $scope.resetFromCurrentStep = function() {
            StepsService.resetStepsFrom($scope.currentStep);
          };

          $scope.restartFlow = function() {
            StorageService.clearApplicationState()
                .then(function() {
                  $scope.currentStep = StepsService.goToStep($scope.steps[0]);
                  StepsService.resetStepsFrom($scope.currentStep);
                });
          };

          $scope.$on('$routeChangeSuccess', function(event, route) {
            if (route.step) {
              var step = StepsService.getStepById(route.step.id);
              $scope.currentStep = StepsService.goToStep(step);
              $scope.nextStep = StepsService.getNextStep($scope.currentStep);
            }
          });
        });
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .controller('UploadFileController', [
      '$scope', '_', 'UploadFileService', 'ApplicationLoader', 'LoginService',
      'Configuration',
      function($scope, _, UploadFileService, ApplicationLoader, LoginService,
        Configuration) {
        $scope.login = LoginService;
        $scope.maxFileSizeToStore = Configuration.maxFileSizeToStore;

        ApplicationLoader.then(function() {

          function reloadState() {
            $scope.state = UploadFileService.getState();

            if ($scope.state.isUrl) {
              $scope.url = $scope.state.url;
            }
            if ($scope.state.isFile) {
              $scope.file = $scope.state.file.name;
            }
            $scope.isFileSelected = $scope.state.isFile;
            $scope.isUrlSelected = $scope.state.isUrl;
          }
          reloadState();

          UploadFileService.onReset(reloadState);

          $scope.$watch('url', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              $scope.resetFromCurrentStep();
              $scope.state = UploadFileService.resourceChanged(null,
                $scope.url);
              $scope.isFileSelected = false;
              $scope.isUrlSelected = !!$scope.url || $scope.state.isUrl;
            }
          });

          $scope.onFileSelected = function() {
            var file = _.first(this.files);
            $scope.file = file.name;
            $scope.resetFromCurrentStep();
            $scope.state = UploadFileService.resourceChanged(file, null);
            $scope.isFileSelected = $scope.state.isFile;
            $scope.isUrlSelected = false;
          };

          $scope.onClearSelectedResource = function() {
            $scope.file = null;
            $scope.url = null;
            $scope.isFileSelected = false;
            $scope.isUrlSelected = false;
            UploadFileService.resourceChanged(null, null);
            $scope.resetFromCurrentStep();
            $scope.state = UploadFileService.getState();
          };

          $scope.onShowValidationResults = function() {
            $scope.bootstrapModal().show('validation-results');
          };
        });
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('ApplicationLoader', [
      '$q', 'UtilsService', 'StorageService',
      function($q, UtilsService, StorageService) {
        var promises = [
          // Preload continents and countries
          UtilsService.getCurrencies().$promise,
          UtilsService.getContinents().$promise,
          UtilsService.getCountries().$promise,

          // Restore app state
          StorageService.restoreApplicationState()
        ];

        return $q.all(promises).then(function() {}); // Force execute
      }
    ]);

})(angular);

var OSTypes = require('os-types');
//var OBEUTypes = require('obeu-types');

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
        };

        result.getState = function() {
          return state;
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
          //TODO: Support more than 1 resource when OSTypes supports it
          _.forEach(fields, function(field) {
            delete field.errors;
            delete field.additionalOptions;
            delete field.slug;
          });
          var fdp = new OSTypes().fieldsToModel(fields);
          if (fdp.errors) {
            _.forEach(fields, function(field) {
              var fieldErrors = fdp.errors.perField[field.title];
              if (fieldErrors) {
                field.errors = fieldErrors;
              }
            });
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

;(function(angular) {

  angular.module('Application')
    .factory('DownloadPackageService', [
      '$q', '_', 'PackageService', 'ApplicationState', 'ApplicationLoader',
      'StepsService', 'StorageService', 'LoginService',
      function($q, _, PackageService, ApplicationState, ApplicationLoader,
        StepsService, StorageService, LoginService) {
        var result = {};

        var state = null;
        ApplicationLoader.then(function() {
          state = {};
          if (_.isObject(ApplicationState.downloadPackage)) {
            state = ApplicationState.downloadPackage;
          }
          ApplicationState.downloadPackage = state;
        });

        result.resetState = function() {
          state = {};
          ApplicationState.downloadPackage = state;
        };

        result.getState = function() {
          return state;
        };

        result.generateMappings = function(fiscalDataPackage) {
          var result = [];

          var getResource = function(name) {
            if (!!name) {
              return _.find(fiscalDataPackage.resources, function(resource) {
                return resource.name == name;
              });
            }
            return _.first(fiscalDataPackage.resources);
          };

          // Measures
          _.each(fiscalDataPackage.model.measures, function(measure, name) {
            var resource = getResource(measure.resource);
            result.push({
              name: name,
              sources: [{
                fileName: resource.title || resource.name,
                fieldName: measure.title
              }]
            });
          });

          // Dimensions
          _.each(fiscalDataPackage.model.dimensions,
            function(dimension, name) {
              var sources = [];
              _.each(dimension.attributes, function(attribute) {
                var resource = getResource(attribute.resource);
                sources.push({
                  fileName: resource.title || resource.name,
                  fieldName: attribute.title
                });
              });
              result.push({
                name: name,
                sources: sources
              });
            });

          return result;
        };

        result.publishDataPackage = function() {
          state.packagePublicUrl = null;
          state.isUploading = true;
          var files = PackageService.publish();
          state.uploads = files;
          files.$promise
            .then(function(dataPackage) {
              StorageService.clearApplicationState()
                .then(function() {
                  var packageName = PackageService.getAttributes().name;
                  var owner = LoginService.userId;
                  state.packagePublicUrl = '/viewer/' + owner + ':' +
                    packageName;
                });
              state.uploads = null;
            })
            .finally(function() {
              state.isUploading = false;
            });
          return state;
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('LoginService', [
      'authenticate', 'authorize', '$window',
      function(authenticate, authorize, $window) {
        var that = this;

        this.reset = function() {
          that.isLoggedIn = false;
          that.name = null;
          that.userId = null;
          that.email = null;
          that.avatar = null;
          that.permissions = null;
          that.permissionToken = null;
        };
        this.reset();

        var token = null;
        var isEventRegistered = false;
        var attempting = false;
        var href = null;

        this.check = function() {
          var next = $window.location.href;
          var check = authenticate.check(next);
          check.then(function(response) {
            attempting = false;
            token = response.token;
            that.isLoggedIn = true;
            that.name = response.profile.name;
            that.email = response.profile.email;
            // jscs:disable
            that.avatar = response.profile.avatar_url;
            // jscs:enable
            that.userId = response.profile.idhash;

            authorize.check(token, 'os.datastore')
              .then(function(permissionData) {
                that.permissionToken = permissionData.token;
                that.permissions = permissionData.permissions;
              });
          })
          .catch(function(providers) {
            if (!isEventRegistered) {
              $window.addEventListener('focus', function() {
                if (!that.isLoggedIn && attempting) {
                  that.check();
                }
              });
              isEventRegistered = true;
            }
            href = providers.google.url;
          });
        };
        this.check();

        this.login = function() {
          if (that.isLoggedIn || (href === null)) {
            return true;
          }
          attempting = true;
          authenticate.login(href, '_self');
        };

        this.logout = function() {
          if (that.isLoggedIn) {
            that.reset();
            authenticate.logout();
          }
        };

        return this;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('PackageService', [
      '$q', '$timeout', '_', 'Services', 'UtilsService', 'Configuration',
      'ApplicationState', 'ApplicationLoader', 'LoginService',
      'ValidationService',
      function($q, $timeout, _, Services, UtilsService, Configuration,
        ApplicationState, ApplicationLoader, LoginService,
        ValidationService) {
        var attributes = {};
        var resources = [];
        var schema = null;

        ApplicationLoader.then(function() {
          if (_.isObject(ApplicationState.package)) {
            attributes = ApplicationState.package.attributes;
            resources = ApplicationState.package.resources;
          }
          ApplicationState.package = {
            attributes: attributes,
            resources: resources
          };
        });

        var fiscalDataPackage = Services.fiscalDataPackage;
        var utils = Services.utils;

        var createNewDataPackage = function() {
          attributes.regionCode = '';
          attributes.countryCode = '';
          attributes.cityCode = '';
          resources.splice(0, resources.length);
        };
        createNewDataPackage();

        var result = {
          loadSchema: function() {
            return $q(function(resolve) {
              schema = fiscalDataPackage.getFiscalDataPackageSchema();
              resolve();
            });
          },
          getAttributes: function() {
            return attributes;
          },
          getResources: function() {
            return resources;
          },
          recreatePackage: function() {
            createNewDataPackage();
          },
          createResource: function(fileOrUrl, state) {
            return $q(function(resolve, reject) {
              var fileDescriptor = null;
              utils.blobToFileDescriptor(fileOrUrl,
                Configuration.maxFileSizeToStore)
                .then(function(fileOrUrl) {
                  var status = ValidationService.validateResource(fileOrUrl);
                  state.status = status;
                  return $q(function(resolve, reject) {
                    status.$promise.then(function(results) {
                      fileOrUrl.encoding = results.encoding;
                      resolve(utils.fileDescriptorToBlob(fileOrUrl));
                    }).catch(reject);
                  });
                })
                .then(function(fileOrUrl) {
                  var url = fileOrUrl;
                  if (_.isString(url)) {
                    url = UtilsService.decorateProxyUrl(url);
                  }
                  fileDescriptor = fileOrUrl;
                  return fiscalDataPackage.createResourceFromSource(url);
                })
                .then(function(resource) {
                  // Save file object - it will be needed when publishing
                  // data package
                  if (_.isObject(fileDescriptor)) {
                    resource.blob = fileDescriptor;
                  }
                  if (_.isString(fileOrUrl)) {
                    resource.source.url = fileOrUrl;
                  }
                  return resource;
                })
                .then(resolve)
                .catch(reject);
            });
          },
          addResource: function(resource) {
            utils.addItemWithUniqueName(resources, resource);
          },
          removeAllResources: function() {
            resources.splice(0, resources.length);
          },
          validateFiscalDataPackage: function() {
            var validationResult = {
              state: 'checking'
            };
            var dataPackage = this.createFiscalDataPackage();
            validationResult.$promise = $q(function(resolve, reject) {
              return fiscalDataPackage.validateDataPackage(dataPackage, schema)
                  .then(resolve)
                  .catch(reject);
            });

            validationResult.$promise
                .then(function(results) {
                  validationResult.state = 'completed';
                  if (results && !results.valid) {
                    validationResult.errors = results.errors;
                  }
                  return results;
                })
                .catch(function(error) {
                  validationResult.state = null;
                  Configuration.defaultErrorHandler(error);
                });

            return validationResult;
          },
          createFiscalDataPackage: function() {
            return fiscalDataPackage.createFiscalDataPackage(attributes,
              resources);
          },
          publish: function() {
            var files = _.map(resources, function(resource) {
              var url = resource.source.url;
              if (_.isString(url) && (url.length > 0)) {
                url = 'proxy?url=' + encodeURIComponent(url);
              }
              return {
                name: resource.name + '.csv',
                data: resource.data.raw,
                url: url,
                file: resource.blob
              };
            });
            var modifiedResources = _.map(resources, function(resource) {
              if (resource.source.url) {
                resource = _.clone(resource);
                resource.source = {
                  fileName: resource.name + '.csv'
                };
              }
              return resource;
            });
            var dataPackage = fiscalDataPackage.createFiscalDataPackage(
              attributes, modifiedResources);
            dataPackage.owner = LoginService.userId;
            dataPackage.author = LoginService.name +
              ' <' + LoginService.email + '>';

            // Create and prepend datapackage.json
            var packageFile = {
              name: Configuration.defaultPackageFileName,
              data: dataPackage
            };
            files.splice(0, 0, packageFile);

            var triggerDigest = function(immediateCall) {
              if (_.isFunction(triggerDigest)) {
                $timeout(triggerDigest, 500);
              }
              if (!!immediateCall) {
                $timeout(function() {});
              }
            };

            files = _.map(files, function(file) {
              file.$promise = $q(function(resolve, reject) {
                triggerDigest(true);
                Services.datastore.readContents(file)
                  .then(function() {
                    return Services.datastore.prepareForUpload(file, {
                      // jscs:disable
                      permission_token: LoginService.permissionToken,
                      // jscs:enable
                      name: dataPackage.name,
                      owner: dataPackage.owner
                    });
                  })
                  .then(function() {
                    return Services.datastore.upload(file);
                  })
                  .then(function() {
                    // datapackage.json has one more step in processing chain
                    if (file.name != Configuration.defaultPackageFileName) {
                      file.status = Services.datastore.ProcessingStatus.READY;
                    }
                    return file;
                  })
                  .then(resolve)
                  .catch(function(error) {
                    file.status = Services.datastore.ProcessingStatus.FAILED;
                    file.error = error;
                    reject(error);
                  });
              });
              return file;
            });

            files.$promise = $q(function(resolve, reject) {
              $q.all(_.pluck(files, '$promise'))
                .then(function(results) {
                  packageFile.countOfLines = 0;
                  _.each(files, function(file) {
                    if (file !== packageFile) {
                      packageFile.countOfLines += file.countOfLines;
                    }
                  });
                  Services.datastore.publish(packageFile)
                    .then(function() {
                      triggerDigest = null;
                      packageFile.status =
                        Services.datastore.ProcessingStatus.READY;
                      resolve(packageFile);
                    })
                    .catch(function(error) {
                      triggerDigest = null;
                      packageFile.status =
                        Services.datastore.ProcessingStatus.FAILED;
                      packageFile.error = error;
                      reject(error);
                    });
                })
                .catch(reject);
            });

            return files;
          }
        };

        result.loadSchema();

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('PreviewDataService', [
      '_', 'Services', 'PackageService', 'ApplicationState',
      'ApplicationLoader',
      function(_, Services, PackageService, ApplicationState,
      ApplicationLoader) {
        var result = {};

        var state = null;
        ApplicationLoader.then(function() {
          state = {};
          if (_.isObject(ApplicationState.previewData)) {
            state = ApplicationState.previewData;
          }
          state.selectedPossibility = null;
          ApplicationState.previewData = state;
        });

        var possibilities = Services.utils.availablePossibilities;

        result.getState = function() {
          return state;
        };

        result.getPossibilities = function() {
          return possibilities;
        };

        //result.getPreviewData = function() {
        //  return Services.utils.getDataForPreview(
        //    PackageService.getResources(), 10);
        //};

        result.update = function() {
          var resources = PackageService.getResources();
          _.each(possibilities, function(possibility) {
            possibility.update(resources);
          });
          if (state.selectedPossibility) {
            var possibility = _.findWhere(possibilities, {
              id: state.selectedPossibility
            });
            if (!possibility || !possibility.isAvailable) {
              possibility = _.findWhere(possibilities, {
                isAvailable: true
              });
              result.selectPossibility(possibility);
            }
          }
        };

        result.selectPossibility = function(possiblity) {
          state.selectedPossibility = null;
          if (_.isObject(possiblity)) {
            possiblity = _.findWhere(possibilities, {id: possiblity.id});
            if (_.isObject(possiblity) && possiblity.isAvailable) {
              state.selectedPossibility = possiblity.id;
              state.graph = possiblity.graph;
            }
          }
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('ProvideMetadataService', [
      '$timeout', '_', 'PackageService', 'UtilsService',
      'ValidationService', 'ApplicationState', 'ApplicationLoader',
      function($timeout, _, PackageService, UtilsService,
        ValidationService, ApplicationState, ApplicationLoader) {
        var result = {};

        var geoData = {};

        var state = null;
        ApplicationLoader.then(function() {
          state = {};
          if (_.isObject(ApplicationState.provideMetadata)) {
            state = ApplicationState.provideMetadata;
          }
          ApplicationState.provideMetadata = state;
        });

        result.resetState = function() {
          state = {};
          ApplicationState.provideMetadata = state;
        };

        result.getState = function() {
          return state;
        };

        result.getGeoData = function() {
          return geoData;
        };

        result.updateFiscalPeriod = function(period) {
          if (period) {
            var attributes = PackageService.getAttributes();
            attributes.fiscalPeriod = UtilsService.prepareFiscalPeriod(period);
          }
        };

        var prependEmptyItem = function(items) {
          return _.union([{
            code: '',
            name: ''
          }], items);
        };

        geoData.regions = prependEmptyItem([]);
        geoData.countries = prependEmptyItem([]);

        UtilsService.getContinents().$promise
          .then(prependEmptyItem)
          .then(function(items) {
            geoData.regions = items;
          });

        // Preload countries, but do not show them until continent selected
        UtilsService.getCountries();
        geoData.countries = prependEmptyItem([]);

        result.updateCountries = function() {
          var attributes = PackageService.getAttributes();
          var regions = attributes.regionCode;
          regions = !!regions ? [regions]
            : _.map(
            geoData.regions,
            function(item) {
              return item.code;
            }
          );
          UtilsService.getCountries(regions).$promise.then(function(items) {
            var attributes = PackageService.getAttributes();
            geoData.countries = prependEmptyItem(items);
            var codes = _.map(items, function(item) {
              return item.code;
            });
            if (!_.contains(codes, attributes.countryCode)) {
              attributes.countryCode = '';
            }
          });
        };

        result.validatePackage = function(form) {
          var result = ValidationService.validateAttributesForm(form);
          if (result === true) {
            result = PackageService.validateFiscalDataPackage();
          }
          $timeout(function() {
            state.status = result;
          });
          return state;
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('StepsService', [
      '$q', '$location', '_', 'Configuration', 'ApplicationState',
      'ApplicationLoader', 'StorageService',
      function($q, $location, _, Configuration, ApplicationState,
        ApplicationLoader, StorageService) {
        var currentStep = null;
        var steps = [];

        var resetCallbacks = {};

        ApplicationLoader.then(function() {
          if (_.isArray(ApplicationState.steps)) {
            steps = _.filter(ApplicationState.steps, _.isObject);
          }
          if (steps.length == 0) {
            steps = Configuration.steps;
          }

          currentStep = _.find(steps, 'isCurrent');
          if (!currentStep) {
            currentStep = _.first(steps);
          }
          result.updateStepsState(currentStep);

          if (Configuration.isWizard) {
            $location.path(currentStep.route);
          }

          ApplicationState.steps = steps;
        });

        var result = {
          getCurrentStep: function() {
            return currentStep;
          },
          goToStep: function(step, goNext) {
            if (step) {
              if (goNext || step.isPassed || step.isCurrent) {
                currentStep = step;
                result.updateStepsState(step);
                $location.path(step.route);
                StorageService.saveApplicationState();
              } else {
                $location.path('/');
              }
            }
            return currentStep;
          },
          getSteps: function() {
            return steps;
          },
          getStepById: function(stepId) {
            return _.findWhere(this.getSteps(), {
              id: stepId
            });
          },
          getNextStep: function(step) {
            var steps = this.getSteps();
            if (_.isObject(step)) {
              var isFound = false;
              return _.find(steps, function(item) {
                if (item.id == step.id) {
                  isFound = true;
                  return false;
                }
                return isFound;
              });
            }
          },
          setStepResetCallback: function(stepId, callback) {
            resetCallbacks[stepId] = callback;
          },
          setStepResetCallbacks: function(callbacks) {
            _.extend(resetCallbacks, callbacks);
          },
          resetStepsFrom: function(step, updateCurrentStep) {
            if (step) {
              var steps = this.getSteps();
              var found = false;
              _.each(steps, function(item) {
                if (found) {
                  item.isPassed = false;
                  item.isCurrent = false;
                  if (_.isFunction(resetCallbacks[item.id])) {
                    resetCallbacks[item.id]();
                  }
                }
                if (item.id == step.id) {
                  found = item;
                  if (_.isFunction(resetCallbacks[item.id])) {
                    resetCallbacks[item.id]();
                  }
                }
              });
              if (updateCurrentStep && found) {
                result.goToStep(found);
              }
              StorageService.saveApplicationState();
            }
          },
          updateStepsState: function(step) {
            var steps = this.getSteps();
            _.each(steps, function(item) {
              item.isCurrent = false;
            });
            if (_.isObject(step)) {
              // Side effect!!!
              _.find(steps, function(item) {
                if (item.id == step.id) {
                  item.isCurrent = true;
                  return true;
                }
                item.isPassed = true;
                return false;
              });
            }
            var lastStep = _.last(steps);
            if (lastStep.isCurrent) {
              lastStep.isPassed = true;
            }
          }
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('StorageService', [
      '$q', '$window', '_', 'ApplicationState', 'Configuration',
      function($q, $window, _, ApplicationState, Configuration) {
        // Helper functions
        function isStorageAvailable() {
          return !!$window._indexedDB ||
            !!$window.indexedDB ||
            !!$window.msIndexedDB ||
            !!$window.mozIndexedDB ||
            !!$window.webkitIndexedDB ||
            !!window.openDatabase; // there is WebSQL polyfill
        }

        function deepCloneValue(value) {
          return (function(value, undefined) {
            if (value === undefined) {
              return undefined;
            }
            return JSON.parse(JSON.stringify(value));
          })(value);
        }

        function prepareValueForSaving(value) {
          if (_.isArray(value)) {
            return _.chain(value)
              .filter(function(value) {
                return !_.isFunction(value);
              })
              .map(prepareValueForSaving)
              .value();
          }
          if (_.isObject(value)) {
            var result = {};
            _.each(value, function(value, key) {
              var isFunction = _.isFunction(value);
              var isAngular = ('' + key).substr(0, 1) == '$';
              if (!isFunction && !isAngular) {
                result[key] = prepareValueForSaving(value);
              }
            });
            return result;
          }
          return _.isFunction(value) ? null : value;
        }

        // Require modules
        var state = null;
        if (isStorageAvailable()) {
          var websql = require('treo/plugins/treo-websql');
          var treo = require('treo');

          // Describe db schema and connect to db
          var schema = treo.schema()
            .version(1)
            .addStore(Configuration.storage.collection, {
              key: 'key',
              increment: false
            });

          var db = treo('fiscal-data-packager', schema).use(websql());

          state = db.store(Configuration.storage.collection);
        }

        var result = {
          get: function(key) {
            return $q(function(resolve, reject) {
              if (state) {
                state.get(key, function(error, result) {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result ? result.value : null);
                  }
                });
              } else {
                resolve(null);
              }
            });
          },
          set: function(key, value) {
            return $q(function(resolve, reject) {
              if (state) {
                state.put({
                  key: key,
                  value: value
                }, function(error, result) {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                });
              } else {
                resolve(false);
              }
            }).then(function() {}); // Force execute
          },
          saveApplicationState: function() {
            var state = ApplicationState;

            // Check file size. If file is too large, do not store state
            if (state.uploadFile && state.uploadFile.file) {
              var size = state.uploadFile.file.size;
              if (size > Configuration.maxFileSizeToStore) {
                state = null;
              }
            }

            state = deepCloneValue(prepareValueForSaving(state));
            return result.set(Configuration.storage.key, state);
          },
          clearApplicationState: function() {
            for (var x in ApplicationState) {
              if (ApplicationState.hasOwnProperty(x)) {
                delete ApplicationState[x];
              }
            }
            return result.set(Configuration.storage.key, null);
          },
          restoreApplicationState: function() {
            return $q(function(resolve) {
              result.get(Configuration.storage.key)
                .then(function(value) {
                  _.extend(ApplicationState, value);
                  resolve();
                })
                .catch(function() {
                  resolve(true);
                });
            });
          }
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('UploadFileService', [
      '_', 'PackageService', 'ValidationService', 'Configuration',
      'UtilsService', 'Services', 'ApplicationState', 'ApplicationLoader',
      function(_, PackageService, ValidationService, Configuration,
        UtilsService, Services, ApplicationState, ApplicationLoader) {
        var utils = Services.utils;

        var result = {};

        var state = null;
        ApplicationLoader.then(function() {
          state = {};
          if (_.isObject(ApplicationState.uploadFile)) {
            state = ApplicationState.uploadFile;
          }
          ApplicationState.uploadFile = state;
        });

        var onResetCallback = null;
        result.onReset = function(cbk) {
          onResetCallback = cbk;
        };

        result.resetState = function() {
          state = {};
          ApplicationState.uploadFile = state;
          PackageService.recreatePackage();
          onResetCallback && onResetCallback();
        };

        var validateSource = function(source) {
          state.status = {
            state: 'reading'
          };

          PackageService.createResource(source, state)
            .then(function(resource) {
              var status = state.status;
              status.sampleSize = resource.data.rows.length;
              if (resource.data.headers) {
                status.sampleSize += 1;
              }

              if (!status.errors) {
                PackageService.removeAllResources();
                if (resource) {
                  PackageService.addResource(resource);
                }
                return resource;
              }
            })
            .catch(function(error) {
              state.status = null;
              Configuration.defaultErrorHandler(error);
            });
        };

        result.getState = function() {
          return state;
        };

        result.resourceChanged = function(file, url) {
          if (utils.isUrl(url)) {
            state.isUrl = true;
            state.url = url;
            validateSource(url);
            return state;
          }
          if (_.isObject(file)) {
            state.isFile = true;
            state.file = {
              name: file.name,
              type: file.type,
              size: file.size
            };
            validateSource(file);
            return state;
          }
          state = {};
          ApplicationState.uploadFile = state;
          PackageService.recreatePackage();
          return state;
        };

        return result;
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .factory('UtilsService', [
      '$q', '_', 'Services',
      function($q, _, Services) {
        var utils = Services.utils;

        var allContinents = null;
        var allCountries = null;
        var allCurrencies = null;

        return {
          slug: function(string) {
            return utils.convertToSlug(string);
          },
          decorateProxyUrl: function(url) {
            return utils.decorateProxyUrl(url);
          },
          undecorateProxyUrl: function(url) {
            return utils.undecorateProxyUrl(url);
          },
          findConcept: function(osType) {
            return _.find(utils.availableConcepts, function(concept) {
              return concept.osType == osType;
            });
          },
          getAvailableConcepts: function() {
            return utils.availableConcepts;
          },
          getAvailableTypes: function() {
            return utils.availableDataTypes;
          },
          promisify: function(alienPromise) {
            return $q(function(resolve, reject) {
              alienPromise.then(resolve).catch(reject);
            });
          },
          prepareFiscalPeriod: function(period) {
            var range = [];
            var result = undefined;
            if (!!period) {
              range = _.filter([
                period.start || period.from,
                period.end || period.to
              ]);
            }
            switch (range.length) {
              case 1:
                result = {
                  start: range[0]
                };
                break;
              case 2:
                result = {
                  start: range[0],
                  end: range[1]
                };
                break;
            }
            return result;
          },

          getCurrencies: function() {
            if (allCurrencies) {
              return allCurrencies;
            }
            var result = [];
            result.$promise = $q(function(resolve, reject) {
              Services.cosmopolitan.getCurrencies(false)
                .then(resolve)
                .catch(reject);
            });
            result.$promise.then(function(items) {
              [].push.apply(result, items);
              return items;
            });
            allCurrencies = result;
            return result;
          },

          getDefaultCurrency: function() {
            return utils.getDefaultCurrency();
          },

          getContinents: function() {
            if (allContinents) {
              return allContinents;
            }
            var result = [];
            result.$promise = $q(function(resolve, reject) {
              Services.cosmopolitan.getContinents(false)
                .then(resolve)
                .catch(reject);
            });
            result.$promise.then(function(items) {
              [].push.apply(result, items);
              return items;
            });
            allContinents = result;
            return result;
          },
          getCountries: function getCountries(continent) {
            if (!continent && allCountries) {
              // If continent is not available, use cache (all countries)
              return allCountries;
            }
            var result = [];
            result.$promise = $q(function(resolve, reject) {
              if (!!continent) {
                // If continent is available, try to load all countries,
                // and then filter them. Resolve with filtered array
                getCountries().$promise.then(function(countries) {
                  var filtered = [];
                  if (_.isArray(continent)) {
                    filtered = _.filter(countries, function(country) {
                      return _.contains(continent, country.continent);
                    });
                  } else {
                    filtered = _.filter(countries, function(country) {
                      return country.continent == continent;
                    });
                  }

                  [].push.apply(result, filtered);
                  resolve(result);
                }).catch(reject);
              } else {
                // If continent is not available, just load all countries
                Services.cosmopolitan.getCountries(false)
                  .then(resolve)
                  .catch(reject);
              }
            });
            result.$promise.then(function(items) {
              [].push.apply(result, items);
              return items;
            });
            if (!continent) {
              // If continent is not available, cache all countries
              allCountries = result;
            }
            return result;
          }
        };
      }
    ]);

})(angular);

var lodash = require('lodash');

;(function(angular) {

  var goodTablesUrl = 'http://goodtables.okfnlabs.org/api/run';

  angular.module('Application')
    .factory('ValidationService', [
      '$q', '_', 'Services', 'Configuration',
      function($q, _, Services, Configuration) {
        var utils = Services.utils;

        return {
          validateResource: function(source) {
            var validationResult = {
              state: 'checking'
            };
            if (typeof(source) !== 'string') {
              validationResult.$promise = $q(function(resolve, reject) {
                utils.validateData(source.data, undefined, undefined,
                  goodTablesUrl)
                  .then(resolve)
                  .catch(reject);
              });
            } else {
              validationResult.$promise = $q(function(resolve, reject) {
                utils.validateData(undefined, source, undefined, goodTablesUrl)
                  .then(resolve)
                  .catch(reject);
              });
            }
            validationResult.$promise
              .then(function(results) {
                validationResult.state = 'completed';
                if (results && results.errors && results.errors.length) {
                  validationResult.errors = results.errors;
                }
                return results;
              })
              .catch(function(error) {
                validationResult.state = null;
                Configuration.defaultErrorHandler(error);
              });

            return validationResult;
          },
          validateRequiredConcepts: function(resources) {
            var hasConcept = function(prefix) {
              return _.some(resources, function(resource) {
                return _.some(resource.fields, function(field) {
                  return lodash.startsWith(field.type, prefix);
                });
              });
            };
            return hasConcept('value') && hasConcept('date:');
          },
          validateAttributesForm: function(form) {
            if (!form || !form.$dirty) {
              return;
            }
            if (!form.$valid) {
              return {
                state: 'invalid'
              };
            }
            return true;
          }
        };
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .filter('fieldConcepts', [
      '_',
      function(_) {
        return function(field) {
          var result = field.allowedConcepts;
          if (!!field.type) {
            result = _.filter(result, function(concept) {
              return _.contains(concept.allowedTypes, field.type);
            });
          }
          return result;
        };
      }
    ])
    .filter('fieldTypes', [
      '_', 'UtilsService',
      function(_, UtilsService) {
        return function(field) {
          var result = field.allowedTypes;
          if (!!field.concept) {
            var concept = UtilsService.findConcept(field.concept);
            result = _.filter(result, function(type) {
              return _.contains(concept.allowedTypes, type.id);
            });
          }
          return result;
        };
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .filter('html', [
      '$sce',
      function($sce) {
        return function(input) {
          return $sce.trustAsHtml(input);
        };
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .filter('join', [
      '_',
      function(_) {
        return function(input, separator) {
          if (_.isArray(input)) {
            return _.filter(input).join(separator || ', ');
          }
          return input;
        };
      }
    ]);

})(angular);

;(function(angular) {

  angular.module('Application')
    .filter('numberFormat', [
      function() {
        return function(input, fractionDigits) {
          input = parseFloat(input);
          if (!isFinite(input)) {
            input = 0.0;
          }
          fractionDigits = parseFloat(fractionDigits);
          if (isFinite(fractionDigits) && (fractionDigits >= 1)) {
            fractionDigits = Math.floor(fractionDigits);
            input = input.toFixed(fractionDigits);
            return input.replace(/\.?0*$/,''); // Remove trailing zeros
          } else {
            return Math.round(input);
          }
        };
      }
    ]);

})(angular);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLmpzIiwibW9kdWxlcy5qcyIsImFuaW1hdGlvbnMvZmFkZS5qcyIsImRpcmVjdGl2ZXMvYm9vdHN0cmFwLW1vZGFsLmpzIiwiZGlyZWN0aXZlcy9maWxlLXNlbGVjdGVkLmpzIiwiZGlyZWN0aXZlcy9vYmV1LWRhdGF0eXBlLmpzIiwiZGlyZWN0aXZlcy9vcy1kYXRhdHlwZS5qcyIsImRpcmVjdGl2ZXMvcG9wb3Zlci5qcyIsImRpcmVjdGl2ZXMvcHJvZ3Jlc3MtYmFyLmpzIiwiY29uZmlnL2NvbmZpZy5qcyIsImNvbmZpZy9lbnYuanMiLCJjb25maWcvcm91dGVzLmpzIiwiY29udHJvbGxlcnMvZGVzY3JpYmUtZGF0YS5qcyIsImNvbnRyb2xsZXJzL2Rvd25sb2FkLXBhY2thZ2UuanMiLCJjb250cm9sbGVycy9oZWFkZXIuanMiLCJjb250cm9sbGVycy9wcmV2aWV3LWRhdGEuanMiLCJjb250cm9sbGVycy9wcm92aWRlLW1ldGFkYXRhLmpzIiwiY29udHJvbGxlcnMvc3RlcHMuanMiLCJjb250cm9sbGVycy91cGxvYWQtZmlsZS5qcyIsInNlcnZpY2VzL2FwcGxpY2F0aW9uLWxvYWRlci5qcyIsInNlcnZpY2VzL2Rlc2NyaWJlLWRhdGEuanMiLCJzZXJ2aWNlcy9kb3dubG9hZC1wYWNrYWdlLmpzIiwic2VydmljZXMvbG9naW4uanMiLCJzZXJ2aWNlcy9wYWNrYWdlLmpzIiwic2VydmljZXMvcHJldmlldy1kYXRhLmpzIiwic2VydmljZXMvcHJvdmlkZS1tZXRhZGF0YS5qcyIsInNlcnZpY2VzL3N0ZXBzLmpzIiwic2VydmljZXMvc3RvcmFnZS5qcyIsInNlcnZpY2VzL3VwbG9hZC1maWxlLmpzIiwic2VydmljZXMvdXRpbHMuanMiLCJzZXJ2aWNlcy92YWxpZGF0aW9uLmpzIiwiZmlsdGVycy9maWVsZC1maWx0ZXJzLmpzIiwiZmlsdGVycy9odG1sLmpzIiwiZmlsdGVycy9qb2luLmpzIiwiZmlsdGVycy9udW1iZXItZm9ybWF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nLCBbXG4gICAgJ25nUm91dGUnLFxuICAgICduZ0FuaW1hdGUnLFxuICAgICdhdXRoQ2xpZW50LnNlcnZpY2VzJ1xuICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCIvKipcbiAqIEltcG9ydCBzb21lIG1vZHVsZXMgLSByZXF1aXJlZCBmb3Igb3RoZXIgc3R1ZmYgbGlrZSBCb290c3RyYXAgYW5kIEFuZ3VsYXJcbiAqL1xuKGZ1bmN0aW9uKGdsb2JhbHMsIHJlcXVpcmUpIHtcbiAgZ2xvYmFscy4kID0gZ2xvYmFscy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbiAgcmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaC9mZXRjaC1ucG0tYnJvd3NlcmlmeScpOyAvLyBmZXRjaCgpIHBvbHlmaWxsXG59KSh3aW5kb3csIHJlcXVpcmUpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuYW5pbWF0aW9uKCcuZmFkZS1hbmltYXRpb24nLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmhpZGUoKS5mYWRlSW4oMTAwLCBkb25lRm4pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGRvbmVGbikge1xuICAgICAgICAgICAgJChlbGVtZW50KS5mYWRlT3V0KDEwMCwgZG9uZUZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIGV2ZW50cyA9IHtcbiAgICBNT0RBTF9PUEVOOiAnYm9vdHN0cmFwLW1vZGFsLm9wZW4nLFxuICAgIE1PREFMX0NMT1NFOiAnYm9vdHN0cmFwLW1vZGFsLmNsb3NlJ1xuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmRpcmVjdGl2ZSgnYm9vdHN0cmFwTW9kYWwnLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudHMuTU9EQUxfT1BFTiwgZnVuY3Rpb24oZXZlbnQsIG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cignaWQnKSA9PSBtb2RhbElkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS4kb24oZXZlbnRzLk1PREFMX0NMT1NFLCBmdW5jdGlvbihldmVudCwgbW9kYWxJZCkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCdpZCcpID09IG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKVxuICAgIC5ydW4oW1xuICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmJvb3RzdHJhcE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyICRzY29wZSA9IHRoaXM7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNob3c6IGZ1bmN0aW9uKG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoZXZlbnRzLk1PREFMX09QRU4sIFttb2RhbElkXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24obW9kYWxJZCkge1xuICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdChldmVudHMuTU9EQUxfQ0xPU0UsIFttb2RhbElkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmRpcmVjdGl2ZSgnbmdGaWxlU2VsZWN0ZWQnLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnJGNvbXBpbGUnLFxuICAgICAgZnVuY3Rpb24oJHRpbWVvdXQsICRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICAgdmFyIGxvY2FsU2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgbG9jYWxTY29wZS5maWxlcyA9IHRoaXMuZmlsZXM7XG4gICAgICAgICAgICAgIGVsZW1lbnQucmVwbGFjZVdpdGgoJGNvbXBpbGUoZWxlbWVudC5jbG9uZSgpKShzY29wZSkpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLiRldmFsKGF0dHIubmdGaWxlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuZmlsZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBPQkVVVHlwZXMgPSByZXF1aXJlKCdvYmV1LXR5cGVzJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG47KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5kaXJlY3RpdmUoJ29iZXVEYXRhdHlwZScsIFtcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9vYmV1LWRhdGF0eXBlLmh0bWwnLFxuICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICAgIHZhciBzdWdnID0gJyc7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2V0U3VnZzogZnVuY3Rpb24oX3N1Z2cpIHtcbiAgICAgICAgICAgICAgICAgIHN1Z2cgPSBfc3VnZztcbiAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0U3VnZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc3VnZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlzSW5jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXy5lbmRzV2l0aChzdWdnLCAnOicpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0VmFsOiBmdW5jdGlvbih2YWwsIGNsZWFyKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9iZXVGaWVsZC50eXBlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JldUZpZWxkLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJyxcbiAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XG4gICAgICAgICAgICBvYmV1RmllbGQ6ICc9JyxcbiAgICAgICAgICAgIG9uQ2hhbmdlZDogJyYnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnLnR5cGVhaGVhZCcpWzBdO1xuICAgICAgICAgICAgdmFyIGNsZWFyID0gZWxlbWVudC5maW5kKCcuY2xlYXInKVswXTtcbiAgICAgICAgICAgIHZhciBvdCA9IG5ldyBPQkVVVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBzZXAgPSAnIOKdryAnO1xuICAgICAgICAgICAgJChpbnB1dCkudHlwZWFoZWFkKHtcbiAgICAgICAgICAgICAgbWluTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbGltaXQ6IDEwMCxcbiAgICAgICAgICAgICAgc291cmNlOiBmdW5jdGlvbihxdWVyeSwgc3luYykge1xuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShuZXcgUmVnRXhwKHNlcCwnZycpLCc6Jyk7XG4gICAgICAgICAgICAgICAgc3luYyhfLm1hcChvdC5hdXRvQ29tcGxldGUocXVlcnkpLCBmdW5jdGlvbihzdWdnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2YWw6IHN1Z2csXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IF8udHJpbUVuZChzdWdnLCAnOicpLnJlcGxhY2UoLzovZyxzZXApLFxuICAgICAgICAgICAgICAgICAgICBsZWFmOiBfLmxhc3Qoc3VnZykgIT0gJzonXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGlzcGxheTogZnVuY3Rpb24oc3VnZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdWdnLnRleHQ7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246IGZ1bmN0aW9uKHN1Z2cpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBzdWZmaXg7XG4gICAgICAgICAgICAgICAgICBpZiAoIXN1Z2cubGVhZikge1xuICAgICAgICAgICAgICAgICAgICBzdWZmaXggPSAnIOKdryAnO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3VmZml4ID0gJyc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXy5sYXN0KF8uc3BsaXQoc3VnZy50ZXh0LCBzZXApKSArIHN1ZmZpeDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnPGRpdj4nICsgcmV0ICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjdHJsLm9iZXVGaWVsZC50eXBlKSB7XG4gICAgICAgICAgICAgIGN0cmwuc2V0U3VnZyhjdHJsLm9iZXVGaWVsZC50eXBlKTtcbiAgICAgICAgICAgICAgJChpbnB1dCkudHlwZWFoZWFkKCd2YWwnLCBjdHJsLm9iZXVGaWVsZC50eXBlLnJlcGxhY2UoLzovZyxzZXApKTtcbiAgICAgICAgICAgICAgY3RybC5zZXRWYWwoY3RybC5vYmV1RmllbGQudHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChpbnB1dCkuYmluZCgndHlwZWFoZWFkOnNlbGVjdCcsIGZ1bmN0aW9uKGV2LCBzdWdnKSB7XG4gICAgICAgICAgICAgIGN0cmwuc2V0U3VnZyhzdWdnLnZhbCk7XG4gICAgICAgICAgICAgIGlmICghc3VnZy5sZWFmKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsIHN1Z2cudGV4dCArIHNlcCk7XG4gICAgICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN0cmwuc2V0VmFsKHN1Z2cudmFsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGNsZWFyKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsJycpO1xuICAgICAgICAgICAgICBjdHJsLnNldFN1Z2coJycpO1xuICAgICAgICAgICAgICBjdHJsLnNldFZhbCgnJywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwidmFyIE9TVHlwZXMgPSByZXF1aXJlKCdvcy10eXBlcycpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZGlyZWN0aXZlKCdvc0RhdGF0eXBlJywgW1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9kaXJlY3RpdmVzL29zLWRhdGF0eXBlLmh0bWwnLFxuICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICAgIHZhciBzdWdnID0gJyc7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2V0U3VnZzogZnVuY3Rpb24oX3N1Z2cpIHtcbiAgICAgICAgICAgICAgICAgIHN1Z2cgPSBfc3VnZztcbiAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0U3VnZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gc3VnZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlzSW5jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXy5lbmRzV2l0aChzdWdnLCAnOicpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0VmFsOiBmdW5jdGlvbih2YWwsIGNsZWFyKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLnR5cGUgPSB2YWw7XG4gICAgICAgICAgICAgICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWVsZC5vcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCgpO1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseUFzeW5jKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCcsXG4gICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgZmllbGQ6ICc9JyxcbiAgICAgICAgICAgIG9uQ2hhbmdlZDogJyYnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnLnR5cGVhaGVhZCcpWzBdO1xuICAgICAgICAgICAgdmFyIGNsZWFyID0gZWxlbWVudC5maW5kKCcuY2xlYXInKVswXTtcbiAgICAgICAgICAgIHZhciBvdCA9IG5ldyBPU1R5cGVzKCk7XG4gICAgICAgICAgICB2YXIgc2VwID0gJyDina8gJztcbiAgICAgICAgICAgICQoaW5wdXQpLnR5cGVhaGVhZCh7XG4gICAgICAgICAgICAgIG1pbkxlbmd0aDogMCxcbiAgICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGxpbWl0OiAxMDAsXG4gICAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24ocXVlcnksIHN5bmMpIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2UobmV3IFJlZ0V4cChzZXAsJ2cnKSwnOicpO1xuICAgICAgICAgICAgICAgIHN5bmMoXy5tYXAob3QuYXV0b0NvbXBsZXRlKHF1ZXJ5KSwgZnVuY3Rpb24oc3VnZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBzdWdnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBfLnRyaW1FbmQoc3VnZywgJzonKS5yZXBsYWNlKC86L2csc2VwKSxcbiAgICAgICAgICAgICAgICAgICAgbGVhZjogXy5sYXN0KHN1Z2cpICE9ICc6J1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGRpc3BsYXk6IGZ1bmN0aW9uKHN1Z2cpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VnZy50ZXh0O1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiBmdW5jdGlvbihzdWdnKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgc3VmZml4O1xuICAgICAgICAgICAgICAgICAgaWYgKCFzdWdnLmxlYWYpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VmZml4ID0gJyDina8gJztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1ZmZpeCA9ICcnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdmFyIHJldCA9IF8ubGFzdChfLnNwbGl0KHN1Z2cudGV4dCwgc2VwKSkgKyBzdWZmaXg7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJzxkaXY+JyArIHJldCArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY3RybC5maWVsZC50eXBlKSB7XG4gICAgICAgICAgICAgIGN0cmwuc2V0U3VnZyhjdHJsLmZpZWxkLnR5cGUpO1xuICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsIGN0cmwuZmllbGQudHlwZS5yZXBsYWNlKC86L2csc2VwKSk7XG4gICAgICAgICAgICAgIGN0cmwuc2V0VmFsKGN0cmwuZmllbGQudHlwZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChpbnB1dCkuYmluZCgndHlwZWFoZWFkOnNlbGVjdCcsIGZ1bmN0aW9uKGV2LCBzdWdnKSB7XG4gICAgICAgICAgICAgIGN0cmwuc2V0U3VnZyhzdWdnLnZhbCk7XG4gICAgICAgICAgICAgIGlmICghc3VnZy5sZWFmKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsIHN1Z2cudGV4dCArIHNlcCk7XG4gICAgICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN0cmwuc2V0VmFsKHN1Z2cudmFsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGNsZWFyKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsJycpO1xuICAgICAgICAgICAgICBjdHJsLnNldFN1Z2coJycpO1xuICAgICAgICAgICAgICBjdHJsLnNldFZhbCgnJywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpO1xuXG4gIGFwcC5kaXJlY3RpdmUoJ3BvcG92ZXInLCBbXG4gICAgJyRjb21waWxlJyxcbiAgICBmdW5jdGlvbigkY29tcGlsZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGVtcGxhdGU6ICcnLFxuICAgICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIGlkID0gJ2FuZ3VsYXItcG9wb3Zlci0nICsgRGF0ZS5ub3coKSArICctJyArXG4gICAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcblxuICAgICAgICAgIGVsZW1lbnQucG9wb3Zlcih7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgICAgIHRyaWdnZXI6ICdmb2N1cycsXG4gICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICQoYXR0cnMucG9wb3ZlcikuaHRtbCgpICsgJzxkaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsZW1lbnQub24oJ3Nob3duLmJzLnBvcG92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRjb21waWxlKCQoJyMnICsgaWQpKSgkc2NvcGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgXSk7XG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZGlyZWN0aXZlKCdwcm9ncmVzc0JhcicsIFtcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICB2YWx1ZTogJ0AnLFxuICAgICAgICAgICAgbGFiZWw6ICdAJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9wcm9ncmVzcy5odG1sJyxcbiAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gcGFyc2VGbG9hdChuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRmluaXRlKG5ld1ZhbHVlKSAmJiAobmV3VmFsdWUgPj0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudmFsdWUgPSAwLjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4gIHZhciBzZXJ2aWNlcyA9IHJlcXVpcmUoJ2FwcC9zZXJ2aWNlcycpO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnN0YW50KCdfJywgXylcbiAgICAuY29uc3RhbnQoJ1NlcnZpY2VzJywgc2VydmljZXMpXG4gICAgLnZhbHVlKCdBcHBsaWNhdGlvblN0YXRlJywge30pXG4gICAgLmNvbmZpZyhbXG4gICAgICAnJGh0dHBQcm92aWRlcicsICckY29tcGlsZVByb3ZpZGVyJywgJyRsb2dQcm92aWRlcicsXG4gICAgICBmdW5jdGlvbigkaHR0cFByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkbG9nUHJvdmlkZXIpIHtcbiAgICAgICAgJGNvbXBpbGVQcm92aWRlci5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98ZmlsZXxqYXZhc2NyaXB0KTovKTtcbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAkbG9nUHJvdmlkZXIuZGVidWdFbmFibGVkKHRydWUpO1xuICAgICAgfVxuICAgIF0pXG4gICAgLnJ1bihbXG4gICAgICAnJHJvb3RTY29wZScsICdTZXJ2aWNlcycsICdBcHBsaWNhdGlvbkxvYWRlcicsXG4gICAgICAnU3RlcHNTZXJ2aWNlJywgJ1VwbG9hZEZpbGVTZXJ2aWNlJywgJ0Rlc2NyaWJlRGF0YVNlcnZpY2UnLFxuICAgICAgJ1Byb3ZpZGVNZXRhZGF0YVNlcnZpY2UnLCAnRG93bmxvYWRQYWNrYWdlU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCBTZXJ2aWNlcywgQXBwbGljYXRpb25Mb2FkZXIsXG4gICAgICAgIFN0ZXBzU2VydmljZSwgVXBsb2FkRmlsZVNlcnZpY2UsIERlc2NyaWJlRGF0YVNlcnZpY2UsXG4gICAgICAgIFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UsIERvd25sb2FkUGFja2FnZVNlcnZpY2UpIHtcbiAgICAgICAgJHJvb3RTY29wZS5Qcm9jZXNzaW5nU3RhdHVzID0gU2VydmljZXMuZGF0YXN0b3JlLlByb2Nlc3NpbmdTdGF0dXM7XG5cbiAgICAgICAgU3RlcHNTZXJ2aWNlLnNldFN0ZXBSZXNldENhbGxiYWNrcyh7XG4gICAgICAgICAgJ3VwbG9hZC1maWxlJzogVXBsb2FkRmlsZVNlcnZpY2UucmVzZXRTdGF0ZSxcbiAgICAgICAgICAnZGVzY3JpYmUtZGF0YSc6IERlc2NyaWJlRGF0YVNlcnZpY2UucmVzZXRTdGF0ZSxcbiAgICAgICAgICAnbWV0YWRhdGEnOiBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLnJlc2V0U3RhdGUsXG4gICAgICAgICAgJ2Rvd25sb2FkJzogRG93bmxvYWRQYWNrYWdlU2VydmljZS5yZXNldFN0YXRlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHJvb3RTY29wZS5hcHBsaWNhdGlvbkxvYWRlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIHZhciBzZXJ2aWNlcyA9IHJlcXVpcmUoJ2FwcC9zZXJ2aWNlcycpO1xuXG4gIHZhciBjb25maWcgPSB7XG4gICAgZGVmYXVsdEVycm9ySGFuZGxlcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjb25zb2xlLnRyYWNlKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLnRyYWNlKGVycm9yKTtcbiAgICAgIH0gZWxzZVxuICAgICAgaWYgKGNvbnNvbGUubG9nKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWZhdWx0UGFja2FnZUZpbGVOYW1lOiAnZGF0YXBhY2thZ2UuanNvbicsXG4gICAgZXZlbnRzOiB7XG4gICAgICBDT05DRVBUU19DSEFOR0VEOiAncGFja2FnZS5jb25jZXB0c0NoYW5nZWQnXG4gICAgfSxcbiAgICBzdG9yYWdlOiB7XG4gICAgICBjb2xsZWN0aW9uOiAnYXBwc3RhdGUnLFxuICAgICAga2V5OiAnZGVmYXVsdCdcbiAgICB9LFxuICAgIHN0ZXBzOiBzZXJ2aWNlcy5kYXRhLnN0ZXBzLFxuICAgIGlzV2l6YXJkOiB3aW5kb3cuaXNXaXphcmQsXG4gICAgbWF4RmlsZVNpemVUb1N0b3JlOiAxMDAgKiAxMDI0ICogMTAyNCAvLyAxMDBNYlxuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnN0YW50KCdDb25maWd1cmF0aW9uJywgY29uZmlnKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb25maWcoW1xuICAgICAgJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJ18nLCAnQ29uZmlndXJhdGlvbicsXG4gICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsIF8sIENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgXy5lYWNoKENvbmZpZ3VyYXRpb24uc3RlcHMsIGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oc3RlcC5yb3V0ZSwge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogc3RlcC50ZW1wbGF0ZVVybCxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogc3RlcC5jb250cm9sbGVyLFxuICAgICAgICAgICAgICBzdGVwOiBzdGVwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7XG4gICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgIH1cbiAgICBdKVxuICAgIC5ydW4oW1xuICAgICAgJyRyb3V0ZScsXG4gICAgICBmdW5jdGlvbigkcm91dGUpIHtcbiAgICAgICAgLy8gQ2FwdHVyZSBpbml0aWFsICRsb2NhdGlvbkNoYW5nZVN0YXJ0IGV2ZW50OyBvdGhlcndpc2UgbmdWaWV3IHdpbGxcbiAgICAgICAgLy8gbm90IHdvcmsgKGYqY2tpbmcgXCJrbm93blwiIGlzc3VlIHNpbmNlIGBhbmd1bGFyLXJvdXRlQDEuNS41YClcbiAgICAgIH1cbiAgICBdKVxuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnRyb2xsZXIoJ0Rlc2NyaWJlRGF0YUNvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ1BhY2thZ2VTZXJ2aWNlJywgJ0Rlc2NyaWJlRGF0YVNlcnZpY2UnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oJHNjb3BlLCBQYWNrYWdlU2VydmljZSwgRGVzY3JpYmVEYXRhU2VydmljZSwgQXBwbGljYXRpb25Mb2FkZXIpIHtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBEZXNjcmliZURhdGFTZXJ2aWNlLmdldFN0YXRlKCk7XG4gICAgICAgICAgJHNjb3BlLnJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuXG4gICAgICAgICAgJHNjb3BlLm9uQ29uY2VwdENoYW5nZWQgPSBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gRGVzY3JpYmVEYXRhU2VydmljZS51cGRhdGVGaWVsZChmaWVsZCk7XG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRNZWFzdXJlcyA9IERlc2NyaWJlRGF0YVNlcnZpY2VcbiAgICAgICAgICAgICAgLmdldFNlbGVjdGVkQ29uY2VwdHMoJ21lYXN1cmUnKTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZERpbWVuc2lvbnMgPSBEZXNjcmliZURhdGFTZXJ2aWNlXG4gICAgICAgICAgICAgIC5nZXRTZWxlY3RlZENvbmNlcHRzKCdkaW1lbnNpb24nKTtcbiAgICAgICAgICB9O1xuXHQgICAgJHNjb3BlLm9uT2JldUNvbmNlcHRDaGFuZ2VkID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnRyb2xsZXIoJ0Rvd25sb2FkUGFja2FnZUNvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ1BhY2thZ2VTZXJ2aWNlJywgJ0Rvd25sb2FkUGFja2FnZVNlcnZpY2UnLFxuICAgICAgJ0NvbmZpZ3VyYXRpb24nLCAnQXBwbGljYXRpb25Mb2FkZXInLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgUGFja2FnZVNlcnZpY2UsIERvd25sb2FkUGFja2FnZVNlcnZpY2UsXG4gICAgICAgIENvbmZpZ3VyYXRpb24sIEFwcGxpY2F0aW9uTG9hZGVyLCBMb2dpblNlcnZpY2UpIHtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuZmlsZU5hbWUgPSBDb25maWd1cmF0aW9uLmRlZmF1bHRQYWNrYWdlRmlsZU5hbWU7XG4gICAgICAgICAgJHNjb3BlLmF0dHJpYnV0ZXMgPSBQYWNrYWdlU2VydmljZS5nZXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgJHNjb3BlLnJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuICAgICAgICAgICRzY29wZS5maXNjYWxEYXRhUGFja2FnZSA9IFBhY2thZ2VTZXJ2aWNlLmNyZWF0ZUZpc2NhbERhdGFQYWNrYWdlKCk7XG4gICAgICAgICAgJHNjb3BlLm1hcHBpbmdzID0gRG93bmxvYWRQYWNrYWdlU2VydmljZS5nZW5lcmF0ZU1hcHBpbmdzKFxuICAgICAgICAgICAgUGFja2FnZVNlcnZpY2UuY3JlYXRlRmlzY2FsRGF0YVBhY2thZ2UoKSk7XG4gICAgICAgICAgJHNjb3BlLmxvZ2luID0gTG9naW5TZXJ2aWNlO1xuICAgICAgICAgICRzY29wZS5wdWJsaXNoRGF0YVBhY2thZ2UgPSBEb3dubG9hZFBhY2thZ2VTZXJ2aWNlLnB1Ymxpc2hEYXRhUGFja2FnZTtcbiAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBEb3dubG9hZFBhY2thZ2VTZXJ2aWNlLmdldFN0YXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ0xvZ2luU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkc2NvcGUsIExvZ2luU2VydmljZSkge1xuICAgICAgICAkc2NvcGUubG9naW4gPSBMb2dpblNlcnZpY2U7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29udHJvbGxlcignUHJldmlld0RhdGFDb250cm9sbGVyJywgW1xuICAgICAgJyRzY29wZScsICdQcmV2aWV3RGF0YVNlcnZpY2UnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oJHNjb3BlLCBQcmV2aWV3RGF0YVNlcnZpY2UsIEFwcGxpY2F0aW9uTG9hZGVyKSB7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLnBvc3NpYmlsaXRpZXMgPSBQcmV2aWV3RGF0YVNlcnZpY2UuZ2V0UG9zc2liaWxpdGllcygpO1xuICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByZXZpZXdEYXRhU2VydmljZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIC8vVE9ETzogW0FkYW1dIFRoaXMgZnVuY3Rpb25hbGl0eSBpcyBicm9rZW4gcmlnaHQgbm93LCB3ZSBuZWVkIHRvIHJlc3RvcmUgaXQgY29ycmVjdGx5XG4gICAgICAgICAgLy8kc2NvcGUucHJldmlld0RhdGEgPSBQcmV2aWV3RGF0YVNlcnZpY2UuZ2V0UHJldmlld0RhdGEoKTtcblxuICAgICAgICAgIC8vJHNjb3BlLm9uU2VsZWN0UG9zc2liaWxpdHkgPSBmdW5jdGlvbihwb3NzaWJpbGl0eSkge1xuICAgICAgICAgIC8vICBQcmV2aWV3RGF0YVNlcnZpY2Uuc2VsZWN0UG9zc2liaWxpdHkocG9zc2liaWxpdHkpO1xuICAgICAgICAgIC8vICAkc2NvcGUucHJldmlld0RhdGEgPSBQcmV2aWV3RGF0YVNlcnZpY2UuZ2V0UHJldmlld0RhdGEoKTtcbiAgICAgICAgICAvL307XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29udHJvbGxlcignUHJvdmlkZU1ldGFkYXRhQ29udHJvbGxlcicsIFtcbiAgICAgICckc2NvcGUnLCAnUGFja2FnZVNlcnZpY2UnLCAnUHJvdmlkZU1ldGFkYXRhU2VydmljZScsXG4gICAgICAnQXBwbGljYXRpb25Mb2FkZXInLCAnXycsXG4gICAgICBmdW5jdGlvbigkc2NvcGUsIFBhY2thZ2VTZXJ2aWNlLCBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLFxuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlciwgXykge1xuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5mb3JtcyA9IF8uZXh0ZW5kKHt9LCAkc2NvcGUuZm9ybXMpO1xuXG4gICAgICAgICAgJHNjb3BlLmdlb0RhdGEgPSBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLmdldEdlb0RhdGEoKTtcbiAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLmdldFN0YXRlKCk7XG5cbiAgICAgICAgICAkc2NvcGUuYXR0cmlidXRlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldEF0dHJpYnV0ZXMoKTtcblxuICAgICAgICAgIHZhciBmaXNjYWxQZXJpb2QgPSBudWxsO1xuICAgICAgICAgIGlmICgkc2NvcGUuYXR0cmlidXRlcyAmJiAkc2NvcGUuYXR0cmlidXRlcy5maXNjYWxQZXJpb2QpIHtcbiAgICAgICAgICAgIGZpc2NhbFBlcmlvZCA9ICRzY29wZS5hdHRyaWJ1dGVzLmZpc2NhbFBlcmlvZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLnBlcmlvZCA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiBmaXNjYWxQZXJpb2QgPyBmaXNjYWxQZXJpb2QuZnJvbSA6ICcnLFxuICAgICAgICAgICAgZW5kOiBmaXNjYWxQZXJpb2QgPyBmaXNjYWxQZXJpb2QudG8gOiAnJyxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgnYXR0cmlidXRlcy50aXRsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJvdmlkZU1ldGFkYXRhU2VydmljZS52YWxpZGF0ZVBhY2thZ2UoXG4gICAgICAgICAgICAgICRzY29wZS5mb3Jtcy5tZXRhZGF0YSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdhdHRyaWJ1dGVzLm5hbWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudmFsaWRhdGVQYWNrYWdlKFxuICAgICAgICAgICAgICAkc2NvcGUuZm9ybXMubWV0YWRhdGEpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgncGVyaW9kJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudXBkYXRlRmlzY2FsUGVyaW9kKHZhbHVlKTtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudmFsaWRhdGVQYWNrYWdlKFxuICAgICAgICAgICAgICAkc2NvcGUuZm9ybXMubWV0YWRhdGEpO1xuICAgICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgnYXR0cmlidXRlcy5yZWdpb25Db2RlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLnVwZGF0ZUNvdW50cmllcygpO1xuICAgICAgICAgICAgJHNjb3BlLmdlb0RhdGEgPSBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLmdldEdlb0RhdGEoKTtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudmFsaWRhdGVQYWNrYWdlKFxuICAgICAgICAgICAgICAkc2NvcGUuZm9ybXMubWV0YWRhdGEpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgnYXR0cmlidXRlcycsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKChuZXdWYWx1ZSA9PT0gb2xkVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudmFsaWRhdGVQYWNrYWdlKFxuICAgICAgICAgICAgICAkc2NvcGUuZm9ybXMubWV0YWRhdGEpO1xuICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb250cm9sbGVyKCdTdGVwc0NvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ1N0ZXBzU2VydmljZScsICdBcHBsaWNhdGlvbkxvYWRlcicsICdTdG9yYWdlU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkc2NvcGUsIFN0ZXBzU2VydmljZSwgQXBwbGljYXRpb25Mb2FkZXIsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLnN0ZXBzID0gU3RlcHNTZXJ2aWNlLmdldFN0ZXBzKCk7XG4gICAgICAgICAgJHNjb3BlLmN1cnJlbnRTdGVwID0gU3RlcHNTZXJ2aWNlLmdldEN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgJHNjb3BlLm5leHRTdGVwID0gU3RlcHNTZXJ2aWNlLmdldE5leHRTdGVwKCRzY29wZS5jdXJyZW50U3RlcCk7XG5cbiAgICAgICAgICAkc2NvcGUuZ29Ub1N0ZXAgPSBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ29Ub1N0ZXAoc3RlcCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5nb1RvTmV4dFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50U3RlcCA9IFN0ZXBzU2VydmljZS5nb1RvU3RlcCgkc2NvcGUubmV4dFN0ZXAsIHRydWUpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUucmVzZXRGcm9tQ3VycmVudFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFN0ZXBzU2VydmljZS5yZXNldFN0ZXBzRnJvbSgkc2NvcGUuY3VycmVudFN0ZXApO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUucmVzdGFydEZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFN0b3JhZ2VTZXJ2aWNlLmNsZWFyQXBwbGljYXRpb25TdGF0ZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ29Ub1N0ZXAoJHNjb3BlLnN0ZXBzWzBdKTtcbiAgICAgICAgICAgICAgICAgIFN0ZXBzU2VydmljZS5yZXNldFN0ZXBzRnJvbSgkc2NvcGUuY3VycmVudFN0ZXApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHJvdXRlKSB7XG4gICAgICAgICAgICBpZiAocm91dGUuc3RlcCkge1xuICAgICAgICAgICAgICB2YXIgc3RlcCA9IFN0ZXBzU2VydmljZS5nZXRTdGVwQnlJZChyb3V0ZS5zdGVwLmlkKTtcbiAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTdGVwID0gU3RlcHNTZXJ2aWNlLmdvVG9TdGVwKHN0ZXApO1xuICAgICAgICAgICAgICAkc2NvcGUubmV4dFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ2V0TmV4dFN0ZXAoJHNjb3BlLmN1cnJlbnRTdGVwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29udHJvbGxlcignVXBsb2FkRmlsZUNvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ18nLCAnVXBsb2FkRmlsZVNlcnZpY2UnLCAnQXBwbGljYXRpb25Mb2FkZXInLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgICdDb25maWd1cmF0aW9uJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgXywgVXBsb2FkRmlsZVNlcnZpY2UsIEFwcGxpY2F0aW9uTG9hZGVyLCBMb2dpblNlcnZpY2UsXG4gICAgICAgIENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gTG9naW5TZXJ2aWNlO1xuICAgICAgICAkc2NvcGUubWF4RmlsZVNpemVUb1N0b3JlID0gQ29uZmlndXJhdGlvbi5tYXhGaWxlU2l6ZVRvU3RvcmU7XG5cbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGZ1bmN0aW9uIHJlbG9hZFN0YXRlKCkge1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gVXBsb2FkRmlsZVNlcnZpY2UuZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgaWYgKCRzY29wZS5zdGF0ZS5pc1VybCkge1xuICAgICAgICAgICAgICAkc2NvcGUudXJsID0gJHNjb3BlLnN0YXRlLnVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUuc3RhdGUuaXNGaWxlKSB7XG4gICAgICAgICAgICAgICRzY29wZS5maWxlID0gJHNjb3BlLnN0YXRlLmZpbGUubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5pc0ZpbGVTZWxlY3RlZCA9ICRzY29wZS5zdGF0ZS5pc0ZpbGU7XG4gICAgICAgICAgICAkc2NvcGUuaXNVcmxTZWxlY3RlZCA9ICRzY29wZS5zdGF0ZS5pc1VybDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVsb2FkU3RhdGUoKTtcblxuICAgICAgICAgIFVwbG9hZEZpbGVTZXJ2aWNlLm9uUmVzZXQocmVsb2FkU3RhdGUpO1xuXG4gICAgICAgICAgJHNjb3BlLiR3YXRjaCgndXJsJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICRzY29wZS5yZXNldEZyb21DdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBVcGxvYWRGaWxlU2VydmljZS5yZXNvdXJjZUNoYW5nZWQobnVsbCxcbiAgICAgICAgICAgICAgICAkc2NvcGUudXJsKTtcbiAgICAgICAgICAgICAgJHNjb3BlLmlzRmlsZVNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICRzY29wZS5pc1VybFNlbGVjdGVkID0gISEkc2NvcGUudXJsIHx8ICRzY29wZS5zdGF0ZS5pc1VybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICRzY29wZS5vbkZpbGVTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBfLmZpcnN0KHRoaXMuZmlsZXMpO1xuICAgICAgICAgICAgJHNjb3BlLmZpbGUgPSBmaWxlLm5hbWU7XG4gICAgICAgICAgICAkc2NvcGUucmVzZXRGcm9tQ3VycmVudFN0ZXAoKTtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFVwbG9hZEZpbGVTZXJ2aWNlLnJlc291cmNlQ2hhbmdlZChmaWxlLCBudWxsKTtcbiAgICAgICAgICAgICRzY29wZS5pc0ZpbGVTZWxlY3RlZCA9ICRzY29wZS5zdGF0ZS5pc0ZpbGU7XG4gICAgICAgICAgICAkc2NvcGUuaXNVcmxTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUub25DbGVhclNlbGVjdGVkUmVzb3VyY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5maWxlID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS51cmwgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLmlzRmlsZVNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaXNVcmxTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgVXBsb2FkRmlsZVNlcnZpY2UucmVzb3VyY2VDaGFuZ2VkKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgJHNjb3BlLnJlc2V0RnJvbUN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBVcGxvYWRGaWxlU2VydmljZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUub25TaG93VmFsaWRhdGlvblJlc3VsdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5ib290c3RyYXBNb2RhbCgpLnNob3coJ3ZhbGlkYXRpb24tcmVzdWx0cycpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ0FwcGxpY2F0aW9uTG9hZGVyJywgW1xuICAgICAgJyRxJywgJ1V0aWxzU2VydmljZScsICdTdG9yYWdlU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkcSwgVXRpbHNTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXG4gICAgICAgICAgLy8gUHJlbG9hZCBjb250aW5lbnRzIGFuZCBjb3VudHJpZXNcbiAgICAgICAgICBVdGlsc1NlcnZpY2UuZ2V0Q3VycmVuY2llcygpLiRwcm9taXNlLFxuICAgICAgICAgIFV0aWxzU2VydmljZS5nZXRDb250aW5lbnRzKCkuJHByb21pc2UsXG4gICAgICAgICAgVXRpbHNTZXJ2aWNlLmdldENvdW50cmllcygpLiRwcm9taXNlLFxuXG4gICAgICAgICAgLy8gUmVzdG9yZSBhcHAgc3RhdGVcbiAgICAgICAgICBTdG9yYWdlU2VydmljZS5yZXN0b3JlQXBwbGljYXRpb25TdGF0ZSgpXG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHt9KTsgLy8gRm9yY2UgZXhlY3V0ZVxuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBPU1R5cGVzID0gcmVxdWlyZSgnb3MtdHlwZXMnKTtcbi8vdmFyIE9CRVVUeXBlcyA9IHJlcXVpcmUoJ29iZXUtdHlwZXMnKTtcblxuOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmFjdG9yeSgnRGVzY3JpYmVEYXRhU2VydmljZScsIFtcbiAgICAgICdfJywgJ1BhY2thZ2VTZXJ2aWNlJywgJ1V0aWxzU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsXG4gICAgICAnUHJldmlld0RhdGFTZXJ2aWNlJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oXywgUGFja2FnZVNlcnZpY2UsIFV0aWxzU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgICAgIFByZXZpZXdEYXRhU2VydmljZSwgQXBwbGljYXRpb25TdGF0ZSwgQXBwbGljYXRpb25Mb2FkZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHZhciBzdGF0ZSA9IG51bGw7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLmRlc2NyaWJlRGF0YSkpIHtcbiAgICAgICAgICAgIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZS5kZXNjcmliZURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuZGVzY3JpYmVEYXRhID0gc3RhdGU7XG4gICAgICAgICAgUHJldmlld0RhdGFTZXJ2aWNlLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXN1bHQucmVzZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5kZXNjcmliZURhdGEgPSBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LmdldFNlbGVjdGVkQ29uY2VwdHMgPSBmdW5jdGlvbihjb25jZXB0VHlwZSkge1xuICAgICAgICAgIHZhciBtYXBwZWQgPSBbXTtcbiAgICAgICAgICB2YXIgcmVzb3VyY2VzID0gUGFja2FnZVNlcnZpY2UuZ2V0UmVzb3VyY2VzKCk7XG4gICAgICAgICAgXy5lYWNoKHJlc291cmNlcywgZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgIF8uZWFjaChyZXNvdXJjZS5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5jb25jZXB0VHlwZSA9PSBjb25jZXB0VHlwZSkge1xuICAgICAgICAgICAgICAgIG1hcHBlZC5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIG1hcHBlZDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQudXBkYXRlRmllbGQgPSBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGZpZWxkcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpWzBdLmZpZWxkcztcbiAgICAgICAgICAvL1RPRE86IFN1cHBvcnQgbW9yZSB0aGFuIDEgcmVzb3VyY2Ugd2hlbiBPU1R5cGVzIHN1cHBvcnRzIGl0XG4gICAgICAgICAgXy5mb3JFYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBmaWVsZC5lcnJvcnM7XG4gICAgICAgICAgICBkZWxldGUgZmllbGQuYWRkaXRpb25hbE9wdGlvbnM7XG4gICAgICAgICAgICBkZWxldGUgZmllbGQuc2x1ZztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2YXIgZmRwID0gbmV3IE9TVHlwZXMoKS5maWVsZHNUb01vZGVsKGZpZWxkcyk7XG4gICAgICAgICAgaWYgKGZkcC5lcnJvcnMpIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgICAgIHZhciBmaWVsZEVycm9ycyA9IGZkcC5lcnJvcnMucGVyRmllbGRbZmllbGQudGl0bGVdO1xuICAgICAgICAgICAgICBpZiAoZmllbGRFcnJvcnMpIHtcbiAgICAgICAgICAgICAgICBmaWVsZC5lcnJvcnMgPSBmaWVsZEVycm9ycztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgICAgIHZhciBzY2hlbWFGaWVsZCA9IGZkcC5zY2hlbWEuZmllbGRzW2ZpZWxkLnRpdGxlXTtcbiAgICAgICAgICAgICAgaWYgKHNjaGVtYUZpZWxkKSB7XG4gICAgICAgICAgICAgICAgZmllbGQuYWRkaXRpb25hbE9wdGlvbnMgPSBzY2hlbWFGaWVsZC5vcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmICghZmllbGQub3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgZmllbGQub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfLmZvckVhY2goZmllbGQuYWRkaXRpb25hbE9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5uYW1lID09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLnZhbHVlcyA9IF8ubWFwKFV0aWxzU2VydmljZS5nZXRDdXJyZW5jaWVzKCksXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbS5jb2RlICsgJyAnICsgaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb24uZGVmYXVsdFZhbHVlID1cbiAgICAgICAgICAgICAgICAgICAgICBVdGlsc1NlcnZpY2UuZ2V0RGVmYXVsdEN1cnJlbmN5KCkuY29kZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChfLmhhcyhvcHRpb24sJ2RlZmF1bHRWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLm9wdGlvbnNbb3B0aW9uLm5hbWVdID0gb3B0aW9uLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWVsZC5hZGRpdGlvbmFsT3B0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLnN0YXR1cyA9IFZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlUmVxdWlyZWRDb25jZXB0cyhcbiAgICAgICAgICAgIFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpKTtcblxuICAgICAgICAgIFByZXZpZXdEYXRhU2VydmljZS51cGRhdGUoKTtcblxuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ0Rvd25sb2FkUGFja2FnZVNlcnZpY2UnLCBbXG4gICAgICAnJHEnLCAnXycsICdQYWNrYWdlU2VydmljZScsICdBcHBsaWNhdGlvblN0YXRlJywgJ0FwcGxpY2F0aW9uTG9hZGVyJyxcbiAgICAgICdTdGVwc1NlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRxLCBfLCBQYWNrYWdlU2VydmljZSwgQXBwbGljYXRpb25TdGF0ZSwgQXBwbGljYXRpb25Mb2FkZXIsXG4gICAgICAgIFN0ZXBzU2VydmljZSwgU3RvcmFnZVNlcnZpY2UsIExvZ2luU2VydmljZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KEFwcGxpY2F0aW9uU3RhdGUuZG93bmxvYWRQYWNrYWdlKSkge1xuICAgICAgICAgICAgc3RhdGUgPSBBcHBsaWNhdGlvblN0YXRlLmRvd25sb2FkUGFja2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5kb3dubG9hZFBhY2thZ2UgPSBzdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0LnJlc2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuZG93bmxvYWRQYWNrYWdlID0gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LmdldFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5nZW5lcmF0ZU1hcHBpbmdzID0gZnVuY3Rpb24oZmlzY2FsRGF0YVBhY2thZ2UpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICB2YXIgZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICBpZiAoISFuYW1lKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfLmZpbmQoZmlzY2FsRGF0YVBhY2thZ2UucmVzb3VyY2VzLCBmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5uYW1lID09IG5hbWU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QoZmlzY2FsRGF0YVBhY2thZ2UucmVzb3VyY2VzKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gTWVhc3VyZXNcbiAgICAgICAgICBfLmVhY2goZmlzY2FsRGF0YVBhY2thZ2UubW9kZWwubWVhc3VyZXMsIGZ1bmN0aW9uKG1lYXN1cmUsIG5hbWUpIHtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZSA9IGdldFJlc291cmNlKG1lYXN1cmUucmVzb3VyY2UpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBzb3VyY2VzOiBbe1xuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiByZXNvdXJjZS50aXRsZSB8fCByZXNvdXJjZS5uYW1lLFxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogbWVhc3VyZS50aXRsZVxuICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBEaW1lbnNpb25zXG4gICAgICAgICAgXy5lYWNoKGZpc2NhbERhdGFQYWNrYWdlLm1vZGVsLmRpbWVuc2lvbnMsXG4gICAgICAgICAgICBmdW5jdGlvbihkaW1lbnNpb24sIG5hbWUpIHtcbiAgICAgICAgICAgICAgdmFyIHNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgICAgXy5lYWNoKGRpbWVuc2lvbi5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZShhdHRyaWJ1dGUucmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBmaWxlTmFtZTogcmVzb3VyY2UudGl0bGUgfHwgcmVzb3VyY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogYXR0cmlidXRlLnRpdGxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICBzb3VyY2VzOiBzb3VyY2VzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5wdWJsaXNoRGF0YVBhY2thZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZS5wYWNrYWdlUHVibGljVXJsID0gbnVsbDtcbiAgICAgICAgICBzdGF0ZS5pc1VwbG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgdmFyIGZpbGVzID0gUGFja2FnZVNlcnZpY2UucHVibGlzaCgpO1xuICAgICAgICAgIHN0YXRlLnVwbG9hZHMgPSBmaWxlcztcbiAgICAgICAgICBmaWxlcy4kcHJvbWlzZVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YVBhY2thZ2UpIHtcbiAgICAgICAgICAgICAgU3RvcmFnZVNlcnZpY2UuY2xlYXJBcHBsaWNhdGlvblN0YXRlKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBwYWNrYWdlTmFtZSA9IFBhY2thZ2VTZXJ2aWNlLmdldEF0dHJpYnV0ZXMoKS5uYW1lO1xuICAgICAgICAgICAgICAgICAgdmFyIG93bmVyID0gTG9naW5TZXJ2aWNlLnVzZXJJZDtcbiAgICAgICAgICAgICAgICAgIHN0YXRlLnBhY2thZ2VQdWJsaWNVcmwgPSAnL3ZpZXdlci8nICsgb3duZXIgKyAnOicgK1xuICAgICAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc3RhdGUudXBsb2FkcyA9IG51bGw7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHN0YXRlLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdMb2dpblNlcnZpY2UnLCBbXG4gICAgICAnYXV0aGVudGljYXRlJywgJ2F1dGhvcml6ZScsICckd2luZG93JyxcbiAgICAgIGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZSwgYXV0aG9yaXplLCAkd2luZG93KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhhdC5pc0xvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICAgdGhhdC5uYW1lID0gbnVsbDtcbiAgICAgICAgICB0aGF0LnVzZXJJZCA9IG51bGw7XG4gICAgICAgICAgdGhhdC5lbWFpbCA9IG51bGw7XG4gICAgICAgICAgdGhhdC5hdmF0YXIgPSBudWxsO1xuICAgICAgICAgIHRoYXQucGVybWlzc2lvbnMgPSBudWxsO1xuICAgICAgICAgIHRoYXQucGVybWlzc2lvblRva2VuID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIHZhciB0b2tlbiA9IG51bGw7XG4gICAgICAgIHZhciBpc0V2ZW50UmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgYXR0ZW1wdGluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgaHJlZiA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBuZXh0ID0gJHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgIHZhciBjaGVjayA9IGF1dGhlbnRpY2F0ZS5jaGVjayhuZXh0KTtcbiAgICAgICAgICBjaGVjay50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBhdHRlbXB0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0b2tlbiA9IHJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICAgdGhhdC5pc0xvZ2dlZEluID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoYXQubmFtZSA9IHJlc3BvbnNlLnByb2ZpbGUubmFtZTtcbiAgICAgICAgICAgIHRoYXQuZW1haWwgPSByZXNwb25zZS5wcm9maWxlLmVtYWlsO1xuICAgICAgICAgICAgLy8ganNjczpkaXNhYmxlXG4gICAgICAgICAgICB0aGF0LmF2YXRhciA9IHJlc3BvbnNlLnByb2ZpbGUuYXZhdGFyX3VybDtcbiAgICAgICAgICAgIC8vIGpzY3M6ZW5hYmxlXG4gICAgICAgICAgICB0aGF0LnVzZXJJZCA9IHJlc3BvbnNlLnByb2ZpbGUuaWRoYXNoO1xuXG4gICAgICAgICAgICBhdXRob3JpemUuY2hlY2sodG9rZW4sICdvcy5kYXRhc3RvcmUnKVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihwZXJtaXNzaW9uRGF0YSkge1xuICAgICAgICAgICAgICAgIHRoYXQucGVybWlzc2lvblRva2VuID0gcGVybWlzc2lvbkRhdGEudG9rZW47XG4gICAgICAgICAgICAgICAgdGhhdC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25EYXRhLnBlcm1pc3Npb25zO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihwcm92aWRlcnMpIHtcbiAgICAgICAgICAgIGlmICghaXNFdmVudFJlZ2lzdGVyZWQpIHtcbiAgICAgICAgICAgICAgJHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhhdC5pc0xvZ2dlZEluICYmIGF0dGVtcHRpbmcpIHtcbiAgICAgICAgICAgICAgICAgIHRoYXQuY2hlY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpc0V2ZW50UmVnaXN0ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBocmVmID0gcHJvdmlkZXJzLmdvb2dsZS51cmw7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hlY2soKTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHRoYXQuaXNMb2dnZWRJbiB8fCAoaHJlZiA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhdHRlbXB0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBhdXRoZW50aWNhdGUubG9naW4oaHJlZiwgJ19zZWxmJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodGhhdC5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB0aGF0LnJlc2V0KCk7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGUubG9nb3V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1BhY2thZ2VTZXJ2aWNlJywgW1xuICAgICAgJyRxJywgJyR0aW1lb3V0JywgJ18nLCAnU2VydmljZXMnLCAnVXRpbHNTZXJ2aWNlJywgJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgICdWYWxpZGF0aW9uU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkcSwgJHRpbWVvdXQsIF8sIFNlcnZpY2VzLCBVdGlsc1NlcnZpY2UsIENvbmZpZ3VyYXRpb24sXG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUsIEFwcGxpY2F0aW9uTG9hZGVyLCBMb2dpblNlcnZpY2UsXG4gICAgICAgIFZhbGlkYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0ge307XG4gICAgICAgIHZhciByZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgdmFyIHNjaGVtYSA9IG51bGw7XG5cbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLnBhY2thZ2UpKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gQXBwbGljYXRpb25TdGF0ZS5wYWNrYWdlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICByZXNvdXJjZXMgPSBBcHBsaWNhdGlvblN0YXRlLnBhY2thZ2UucmVzb3VyY2VzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnBhY2thZ2UgPSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZXNcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZmlzY2FsRGF0YVBhY2thZ2UgPSBTZXJ2aWNlcy5maXNjYWxEYXRhUGFja2FnZTtcbiAgICAgICAgdmFyIHV0aWxzID0gU2VydmljZXMudXRpbHM7XG5cbiAgICAgICAgdmFyIGNyZWF0ZU5ld0RhdGFQYWNrYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5yZWdpb25Db2RlID0gJyc7XG4gICAgICAgICAgYXR0cmlidXRlcy5jb3VudHJ5Q29kZSA9ICcnO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuY2l0eUNvZGUgPSAnJztcbiAgICAgICAgICByZXNvdXJjZXMuc3BsaWNlKDAsIHJlc291cmNlcy5sZW5ndGgpO1xuICAgICAgICB9O1xuICAgICAgICBjcmVhdGVOZXdEYXRhUGFja2FnZSgpO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgbG9hZFNjaGVtYTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBzY2hlbWEgPSBmaXNjYWxEYXRhUGFja2FnZS5nZXRGaXNjYWxEYXRhUGFja2FnZVNjaGVtYSgpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRSZXNvdXJjZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlY3JlYXRlUGFja2FnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcmVhdGVOZXdEYXRhUGFja2FnZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY3JlYXRlUmVzb3VyY2U6IGZ1bmN0aW9uKGZpbGVPclVybCwgc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgdmFyIGZpbGVEZXNjcmlwdG9yID0gbnVsbDtcbiAgICAgICAgICAgICAgdXRpbHMuYmxvYlRvRmlsZURlc2NyaXB0b3IoZmlsZU9yVXJsLFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWF4RmlsZVNpemVUb1N0b3JlKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGZpbGVPclVybCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IFZhbGlkYXRpb25TZXJ2aWNlLnZhbGlkYXRlUmVzb3VyY2UoZmlsZU9yVXJsKTtcbiAgICAgICAgICAgICAgICAgIHN0YXRlLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbGVPclVybC5lbmNvZGluZyA9IHJlc3VsdHMuZW5jb2Rpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh1dGlscy5maWxlRGVzY3JpcHRvclRvQmxvYihmaWxlT3JVcmwpKTtcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZU9yVXJsKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgdXJsID0gZmlsZU9yVXJsO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcodXJsKSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBVdGlsc1NlcnZpY2UuZGVjb3JhdGVQcm94eVVybCh1cmwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZmlsZURlc2NyaXB0b3IgPSBmaWxlT3JVcmw7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmlzY2FsRGF0YVBhY2thZ2UuY3JlYXRlUmVzb3VyY2VGcm9tU291cmNlKHVybCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgLy8gU2F2ZSBmaWxlIG9iamVjdCAtIGl0IHdpbGwgYmUgbmVlZGVkIHdoZW4gcHVibGlzaGluZ1xuICAgICAgICAgICAgICAgICAgLy8gZGF0YSBwYWNrYWdlXG4gICAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChmaWxlRGVzY3JpcHRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2UuYmxvYiA9IGZpbGVEZXNjcmlwdG9yO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsZU9yVXJsKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZS5zb3VyY2UudXJsID0gZmlsZU9yVXJsO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkUmVzb3VyY2U6IGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgICB1dGlscy5hZGRJdGVtV2l0aFVuaXF1ZU5hbWUocmVzb3VyY2VzLCByZXNvdXJjZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVBbGxSZXNvdXJjZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVzb3VyY2VzLnNwbGljZSgwLCByZXNvdXJjZXMubGVuZ3RoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRlRmlzY2FsRGF0YVBhY2thZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHZhbGlkYXRpb25SZXN1bHQgPSB7XG4gICAgICAgICAgICAgIHN0YXRlOiAnY2hlY2tpbmcnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGRhdGFQYWNrYWdlID0gdGhpcy5jcmVhdGVGaXNjYWxEYXRhUGFja2FnZSgpO1xuICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlzY2FsRGF0YVBhY2thZ2UudmFsaWRhdGVEYXRhUGFja2FnZShkYXRhUGFja2FnZSwgc2NoZW1hKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhbGlkYXRpb25SZXN1bHQuJHByb21pc2VcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LnN0YXRlID0gJ2NvbXBsZXRlZCc7XG4gICAgICAgICAgICAgICAgICBpZiAocmVzdWx0cyAmJiAhcmVzdWx0cy52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LmVycm9ycyA9IHJlc3VsdHMuZXJyb3JzO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5kZWZhdWx0RXJyb3JIYW5kbGVyKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRpb25SZXN1bHQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjcmVhdGVGaXNjYWxEYXRhUGFja2FnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlzY2FsRGF0YVBhY2thZ2UuY3JlYXRlRmlzY2FsRGF0YVBhY2thZ2UoYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgcmVzb3VyY2VzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHB1Ymxpc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gXy5tYXAocmVzb3VyY2VzLCBmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICB2YXIgdXJsID0gcmVzb3VyY2Uuc291cmNlLnVybDtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcodXJsKSAmJiAodXJsLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gJ3Byb3h5P3VybD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiByZXNvdXJjZS5uYW1lICsgJy5jc3YnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlc291cmNlLmRhdGEucmF3LFxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGZpbGU6IHJlc291cmNlLmJsb2JcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIG1vZGlmaWVkUmVzb3VyY2VzID0gXy5tYXAocmVzb3VyY2VzLCBmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICBpZiAocmVzb3VyY2Uuc291cmNlLnVybCkge1xuICAgICAgICAgICAgICAgIHJlc291cmNlID0gXy5jbG9uZShyZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgcmVzb3VyY2Uuc291cmNlID0ge1xuICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IHJlc291cmNlLm5hbWUgKyAnLmNzdidcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGRhdGFQYWNrYWdlID0gZmlzY2FsRGF0YVBhY2thZ2UuY3JlYXRlRmlzY2FsRGF0YVBhY2thZ2UoXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZXMsIG1vZGlmaWVkUmVzb3VyY2VzKTtcbiAgICAgICAgICAgIGRhdGFQYWNrYWdlLm93bmVyID0gTG9naW5TZXJ2aWNlLnVzZXJJZDtcbiAgICAgICAgICAgIGRhdGFQYWNrYWdlLmF1dGhvciA9IExvZ2luU2VydmljZS5uYW1lICtcbiAgICAgICAgICAgICAgJyA8JyArIExvZ2luU2VydmljZS5lbWFpbCArICc+JztcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGFuZCBwcmVwZW5kIGRhdGFwYWNrYWdlLmpzb25cbiAgICAgICAgICAgIHZhciBwYWNrYWdlRmlsZSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogQ29uZmlndXJhdGlvbi5kZWZhdWx0UGFja2FnZUZpbGVOYW1lLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhUGFja2FnZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpbGVzLnNwbGljZSgwLCAwLCBwYWNrYWdlRmlsZSk7XG5cbiAgICAgICAgICAgIHZhciB0cmlnZ2VyRGlnZXN0ID0gZnVuY3Rpb24oaW1tZWRpYXRlQ2FsbCkge1xuICAgICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHRyaWdnZXJEaWdlc3QpKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQodHJpZ2dlckRpZ2VzdCwgNTAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoISFpbW1lZGlhdGVDYWxsKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7fSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbGVzID0gXy5tYXAoZmlsZXMsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgZmlsZS4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHRyaWdnZXJEaWdlc3QodHJ1ZSk7XG4gICAgICAgICAgICAgICAgU2VydmljZXMuZGF0YXN0b3JlLnJlYWRDb250ZW50cyhmaWxlKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXJ2aWNlcy5kYXRhc3RvcmUucHJlcGFyZUZvclVwbG9hZChmaWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8ganNjczpkaXNhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbl90b2tlbjogTG9naW5TZXJ2aWNlLnBlcm1pc3Npb25Ub2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAvLyBqc2NzOmVuYWJsZVxuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGFQYWNrYWdlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgb3duZXI6IGRhdGFQYWNrYWdlLm93bmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2VydmljZXMuZGF0YXN0b3JlLnVwbG9hZChmaWxlKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGF0YXBhY2thZ2UuanNvbiBoYXMgb25lIG1vcmUgc3RlcCBpbiBwcm9jZXNzaW5nIGNoYWluXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLm5hbWUgIT0gQ29uZmlndXJhdGlvbi5kZWZhdWx0UGFja2FnZUZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZmlsZS5zdGF0dXMgPSBTZXJ2aWNlcy5kYXRhc3RvcmUuUHJvY2Vzc2luZ1N0YXR1cy5SRUFEWTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuc3RhdHVzID0gU2VydmljZXMuZGF0YXN0b3JlLlByb2Nlc3NpbmdTdGF0dXMuRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICBmaWxlLmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZpbGVzLiRwcm9taXNlID0gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICRxLmFsbChfLnBsdWNrKGZpbGVzLCAnJHByb21pc2UnKSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICBwYWNrYWdlRmlsZS5jb3VudE9mTGluZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgXy5lYWNoKGZpbGVzLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlICE9PSBwYWNrYWdlRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2VGaWxlLmNvdW50T2ZMaW5lcyArPSBmaWxlLmNvdW50T2ZMaW5lcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBTZXJ2aWNlcy5kYXRhc3RvcmUucHVibGlzaChwYWNrYWdlRmlsZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckRpZ2VzdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgcGFja2FnZUZpbGUuc3RhdHVzID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlcnZpY2VzLmRhdGFzdG9yZS5Qcm9jZXNzaW5nU3RhdHVzLlJFQURZO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocGFja2FnZUZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyRGlnZXN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlRmlsZS5zdGF0dXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgU2VydmljZXMuZGF0YXN0b3JlLlByb2Nlc3NpbmdTdGF0dXMuRkFJTEVEO1xuICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2VGaWxlLmVycm9yID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5sb2FkU2NoZW1hKCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdQcmV2aWV3RGF0YVNlcnZpY2UnLCBbXG4gICAgICAnXycsICdTZXJ2aWNlcycsICdQYWNrYWdlU2VydmljZScsICdBcHBsaWNhdGlvblN0YXRlJyxcbiAgICAgICdBcHBsaWNhdGlvbkxvYWRlcicsXG4gICAgICBmdW5jdGlvbihfLCBTZXJ2aWNlcywgUGFja2FnZVNlcnZpY2UsIEFwcGxpY2F0aW9uU3RhdGUsXG4gICAgICBBcHBsaWNhdGlvbkxvYWRlcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGEpKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHkgPSBudWxsO1xuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGEgPSBzdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHBvc3NpYmlsaXRpZXMgPSBTZXJ2aWNlcy51dGlscy5hdmFpbGFibGVQb3NzaWJpbGl0aWVzO1xuXG4gICAgICAgIHJlc3VsdC5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2V0UG9zc2liaWxpdGllcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBwb3NzaWJpbGl0aWVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vcmVzdWx0LmdldFByZXZpZXdEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICByZXR1cm4gU2VydmljZXMudXRpbHMuZ2V0RGF0YUZvclByZXZpZXcoXG4gICAgICAgIC8vICAgIFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpLCAxMCk7XG4gICAgICAgIC8vfTtcblxuICAgICAgICByZXN1bHQudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuICAgICAgICAgIF8uZWFjaChwb3NzaWJpbGl0aWVzLCBmdW5jdGlvbihwb3NzaWJpbGl0eSkge1xuICAgICAgICAgICAgcG9zc2liaWxpdHkudXBkYXRlKHJlc291cmNlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHkpIHtcbiAgICAgICAgICAgIHZhciBwb3NzaWJpbGl0eSA9IF8uZmluZFdoZXJlKHBvc3NpYmlsaXRpZXMsIHtcbiAgICAgICAgICAgICAgaWQ6IHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFwb3NzaWJpbGl0eSB8fCAhcG9zc2liaWxpdHkuaXNBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgcG9zc2liaWxpdHkgPSBfLmZpbmRXaGVyZShwb3NzaWJpbGl0aWVzLCB7XG4gICAgICAgICAgICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlc3VsdC5zZWxlY3RQb3NzaWJpbGl0eShwb3NzaWJpbGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5zZWxlY3RQb3NzaWJpbGl0eSA9IGZ1bmN0aW9uKHBvc3NpYmxpdHkpIHtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZFBvc3NpYmlsaXR5ID0gbnVsbDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChwb3NzaWJsaXR5KSkge1xuICAgICAgICAgICAgcG9zc2libGl0eSA9IF8uZmluZFdoZXJlKHBvc3NpYmlsaXRpZXMsIHtpZDogcG9zc2libGl0eS5pZH0pO1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocG9zc2libGl0eSkgJiYgcG9zc2libGl0eS5pc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgICBzdGF0ZS5zZWxlY3RlZFBvc3NpYmlsaXR5ID0gcG9zc2libGl0eS5pZDtcbiAgICAgICAgICAgICAgc3RhdGUuZ3JhcGggPSBwb3NzaWJsaXR5LmdyYXBoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1Byb3ZpZGVNZXRhZGF0YVNlcnZpY2UnLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnXycsICdQYWNrYWdlU2VydmljZScsICdVdGlsc1NlcnZpY2UnLFxuICAgICAgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oJHRpbWVvdXQsIF8sIFBhY2thZ2VTZXJ2aWNlLCBVdGlsc1NlcnZpY2UsXG4gICAgICAgIFZhbGlkYXRpb25TZXJ2aWNlLCBBcHBsaWNhdGlvblN0YXRlLCBBcHBsaWNhdGlvbkxvYWRlcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIGdlb0RhdGEgPSB7fTtcblxuICAgICAgICB2YXIgc3RhdGUgPSBudWxsO1xuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3QoQXBwbGljYXRpb25TdGF0ZS5wcm92aWRlTWV0YWRhdGEpKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEFwcGxpY2F0aW9uU3RhdGUucHJvdmlkZU1ldGFkYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnByb3ZpZGVNZXRhZGF0YSA9IHN0YXRlO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXN1bHQucmVzZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5wcm92aWRlTWV0YWRhdGEgPSBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LmdldEdlb0RhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZ2VvRGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQudXBkYXRlRmlzY2FsUGVyaW9kID0gZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgaWYgKHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBQYWNrYWdlU2VydmljZS5nZXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmZpc2NhbFBlcmlvZCA9IFV0aWxzU2VydmljZS5wcmVwYXJlRmlzY2FsUGVyaW9kKHBlcmlvZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwcmVwZW5kRW1wdHlJdGVtID0gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICByZXR1cm4gXy51bmlvbihbe1xuICAgICAgICAgICAgY29kZTogJycsXG4gICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICAgIH1dLCBpdGVtcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZ2VvRGF0YS5yZWdpb25zID0gcHJlcGVuZEVtcHR5SXRlbShbXSk7XG4gICAgICAgIGdlb0RhdGEuY291bnRyaWVzID0gcHJlcGVuZEVtcHR5SXRlbShbXSk7XG5cbiAgICAgICAgVXRpbHNTZXJ2aWNlLmdldENvbnRpbmVudHMoKS4kcHJvbWlzZVxuICAgICAgICAgIC50aGVuKHByZXBlbmRFbXB0eUl0ZW0pXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgIGdlb0RhdGEucmVnaW9ucyA9IGl0ZW1zO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFByZWxvYWQgY291bnRyaWVzLCBidXQgZG8gbm90IHNob3cgdGhlbSB1bnRpbCBjb250aW5lbnQgc2VsZWN0ZWRcbiAgICAgICAgVXRpbHNTZXJ2aWNlLmdldENvdW50cmllcygpO1xuICAgICAgICBnZW9EYXRhLmNvdW50cmllcyA9IHByZXBlbmRFbXB0eUl0ZW0oW10pO1xuXG4gICAgICAgIHJlc3VsdC51cGRhdGVDb3VudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldEF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICB2YXIgcmVnaW9ucyA9IGF0dHJpYnV0ZXMucmVnaW9uQ29kZTtcbiAgICAgICAgICByZWdpb25zID0gISFyZWdpb25zID8gW3JlZ2lvbnNdXG4gICAgICAgICAgICA6IF8ubWFwKFxuICAgICAgICAgICAgZ2VvRGF0YS5yZWdpb25zLFxuICAgICAgICAgICAgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgVXRpbHNTZXJ2aWNlLmdldENvdW50cmllcyhyZWdpb25zKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldEF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgIGdlb0RhdGEuY291bnRyaWVzID0gcHJlcGVuZEVtcHR5SXRlbShpdGVtcyk7XG4gICAgICAgICAgICB2YXIgY29kZXMgPSBfLm1hcChpdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb2RlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIV8uY29udGFpbnMoY29kZXMsIGF0dHJpYnV0ZXMuY291bnRyeUNvZGUpKSB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZXMuY291bnRyeUNvZGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQudmFsaWRhdGVQYWNrYWdlID0gZnVuY3Rpb24oZm9ybSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZUF0dHJpYnV0ZXNGb3JtKGZvcm0pO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFBhY2thZ2VTZXJ2aWNlLnZhbGlkYXRlRmlzY2FsRGF0YVBhY2thZ2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdGF0ZS5zdGF0dXMgPSByZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmFjdG9yeSgnU3RlcHNTZXJ2aWNlJywgW1xuICAgICAgJyRxJywgJyRsb2NhdGlvbicsICdfJywgJ0NvbmZpZ3VyYXRpb24nLCAnQXBwbGljYXRpb25TdGF0ZScsXG4gICAgICAnQXBwbGljYXRpb25Mb2FkZXInLCAnU3RvcmFnZVNlcnZpY2UnLFxuICAgICAgZnVuY3Rpb24oJHEsICRsb2NhdGlvbiwgXywgQ29uZmlndXJhdGlvbiwgQXBwbGljYXRpb25TdGF0ZSxcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgICAgIHZhciBjdXJyZW50U3RlcCA9IG51bGw7XG4gICAgICAgIHZhciBzdGVwcyA9IFtdO1xuXG4gICAgICAgIHZhciByZXNldENhbGxiYWNrcyA9IHt9O1xuXG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheShBcHBsaWNhdGlvblN0YXRlLnN0ZXBzKSkge1xuICAgICAgICAgICAgc3RlcHMgPSBfLmZpbHRlcihBcHBsaWNhdGlvblN0YXRlLnN0ZXBzLCBfLmlzT2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN0ZXBzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBzdGVwcyA9IENvbmZpZ3VyYXRpb24uc3RlcHM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudFN0ZXAgPSBfLmZpbmQoc3RlcHMsICdpc0N1cnJlbnQnKTtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRTdGVwKSB7XG4gICAgICAgICAgICBjdXJyZW50U3RlcCA9IF8uZmlyc3Qoc3RlcHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQudXBkYXRlU3RlcHNTdGF0ZShjdXJyZW50U3RlcCk7XG5cbiAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5pc1dpemFyZCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoY3VycmVudFN0ZXAucm91dGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc3RlcHMgPSBzdGVwcztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBnZXRDdXJyZW50U3RlcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFN0ZXA7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnb1RvU3RlcDogZnVuY3Rpb24oc3RlcCwgZ29OZXh0KSB7XG4gICAgICAgICAgICBpZiAoc3RlcCkge1xuICAgICAgICAgICAgICBpZiAoZ29OZXh0IHx8IHN0ZXAuaXNQYXNzZWQgfHwgc3RlcC5pc0N1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RlcCA9IHN0ZXA7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnVwZGF0ZVN0ZXBzU3RhdGUoc3RlcCk7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoc3RlcC5yb3V0ZSk7XG4gICAgICAgICAgICAgICAgU3RvcmFnZVNlcnZpY2Uuc2F2ZUFwcGxpY2F0aW9uU3RhdGUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFN0ZXA7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRTdGVwczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcHM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRTdGVwQnlJZDogZnVuY3Rpb24oc3RlcElkKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kV2hlcmUodGhpcy5nZXRTdGVwcygpLCB7XG4gICAgICAgICAgICAgIGlkOiBzdGVwSWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0TmV4dFN0ZXA6IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgICAgIHZhciBzdGVwcyA9IHRoaXMuZ2V0U3RlcHMoKTtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHN0ZXApKSB7XG4gICAgICAgICAgICAgIHZhciBpc0ZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBfLmZpbmQoc3RlcHMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PSBzdGVwLmlkKSB7XG4gICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRm91bmQ7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0U3RlcFJlc2V0Q2FsbGJhY2s6IGZ1bmN0aW9uKHN0ZXBJZCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc2V0Q2FsbGJhY2tzW3N0ZXBJZF0gPSBjYWxsYmFjaztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFN0ZXBSZXNldENhbGxiYWNrczogZnVuY3Rpb24oY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChyZXNldENhbGxiYWNrcywgY2FsbGJhY2tzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0U3RlcHNGcm9tOiBmdW5jdGlvbihzdGVwLCB1cGRhdGVDdXJyZW50U3RlcCkge1xuICAgICAgICAgICAgaWYgKHN0ZXApIHtcbiAgICAgICAgICAgICAgdmFyIHN0ZXBzID0gdGhpcy5nZXRTdGVwcygpO1xuICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgXy5lYWNoKHN0ZXBzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICBpdGVtLmlzUGFzc2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBpdGVtLmlzQ3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZXNldENhbGxiYWNrc1tpdGVtLmlkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRDYWxsYmFja3NbaXRlbS5pZF0oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gc3RlcC5pZCkge1xuICAgICAgICAgICAgICAgICAgZm91bmQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihyZXNldENhbGxiYWNrc1tpdGVtLmlkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRDYWxsYmFja3NbaXRlbS5pZF0oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXBkYXRlQ3VycmVudFN0ZXAgJiYgZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZ29Ub1N0ZXAoZm91bmQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFN0b3JhZ2VTZXJ2aWNlLnNhdmVBcHBsaWNhdGlvblN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cGRhdGVTdGVwc1N0YXRlOiBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgICAgICB2YXIgc3RlcHMgPSB0aGlzLmdldFN0ZXBzKCk7XG4gICAgICAgICAgICBfLmVhY2goc3RlcHMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgaXRlbS5pc0N1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3Qoc3RlcCkpIHtcbiAgICAgICAgICAgICAgLy8gU2lkZSBlZmZlY3QhISFcbiAgICAgICAgICAgICAgXy5maW5kKHN0ZXBzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gc3RlcC5pZCkge1xuICAgICAgICAgICAgICAgICAgaXRlbS5pc0N1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW0uaXNQYXNzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFzdFN0ZXAgPSBfLmxhc3Qoc3RlcHMpO1xuICAgICAgICAgICAgaWYgKGxhc3RTdGVwLmlzQ3VycmVudCkge1xuICAgICAgICAgICAgICBsYXN0U3RlcC5pc1Bhc3NlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmFjdG9yeSgnU3RvcmFnZVNlcnZpY2UnLCBbXG4gICAgICAnJHEnLCAnJHdpbmRvdycsICdfJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQ29uZmlndXJhdGlvbicsXG4gICAgICBmdW5jdGlvbigkcSwgJHdpbmRvdywgXywgQXBwbGljYXRpb25TdGF0ZSwgQ29uZmlndXJhdGlvbikge1xuICAgICAgICAvLyBIZWxwZXIgZnVuY3Rpb25zXG4gICAgICAgIGZ1bmN0aW9uIGlzU3RvcmFnZUF2YWlsYWJsZSgpIHtcbiAgICAgICAgICByZXR1cm4gISEkd2luZG93Ll9pbmRleGVkREIgfHxcbiAgICAgICAgICAgICEhJHdpbmRvdy5pbmRleGVkREIgfHxcbiAgICAgICAgICAgICEhJHdpbmRvdy5tc0luZGV4ZWREQiB8fFxuICAgICAgICAgICAgISEkd2luZG93Lm1vekluZGV4ZWREQiB8fFxuICAgICAgICAgICAgISEkd2luZG93LndlYmtpdEluZGV4ZWREQiB8fFxuICAgICAgICAgICAgISF3aW5kb3cub3BlbkRhdGFiYXNlOyAvLyB0aGVyZSBpcyBXZWJTUUwgcG9seWZpbGxcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZXBDbG9uZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIChmdW5jdGlvbih2YWx1ZSwgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgICAgICB9KSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmVwYXJlVmFsdWVGb3JTYXZpbmcodmFsdWUpIHtcbiAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4odmFsdWUpXG4gICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIV8uaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5tYXAocHJlcGFyZVZhbHVlRm9yU2F2aW5nKVxuICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgICAgICBfLmVhY2godmFsdWUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgdmFyIGlzRnVuY3Rpb24gPSBfLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICAgICAgICB2YXIgaXNBbmd1bGFyID0gKCcnICsga2V5KS5zdWJzdHIoMCwgMSkgPT0gJyQnO1xuICAgICAgICAgICAgICBpZiAoIWlzRnVuY3Rpb24gJiYgIWlzQW5ndWxhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcHJlcGFyZVZhbHVlRm9yU2F2aW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IG51bGwgOiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlcXVpcmUgbW9kdWxlc1xuICAgICAgICB2YXIgc3RhdGUgPSBudWxsO1xuICAgICAgICBpZiAoaXNTdG9yYWdlQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgICB2YXIgd2Vic3FsID0gcmVxdWlyZSgndHJlby9wbHVnaW5zL3RyZW8td2Vic3FsJyk7XG4gICAgICAgICAgdmFyIHRyZW8gPSByZXF1aXJlKCd0cmVvJyk7XG5cbiAgICAgICAgICAvLyBEZXNjcmliZSBkYiBzY2hlbWEgYW5kIGNvbm5lY3QgdG8gZGJcbiAgICAgICAgICB2YXIgc2NoZW1hID0gdHJlby5zY2hlbWEoKVxuICAgICAgICAgICAgLnZlcnNpb24oMSlcbiAgICAgICAgICAgIC5hZGRTdG9yZShDb25maWd1cmF0aW9uLnN0b3JhZ2UuY29sbGVjdGlvbiwge1xuICAgICAgICAgICAgICBrZXk6ICdrZXknLFxuICAgICAgICAgICAgICBpbmNyZW1lbnQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBkYiA9IHRyZW8oJ2Zpc2NhbC1kYXRhLXBhY2thZ2VyJywgc2NoZW1hKS51c2Uod2Vic3FsKCkpO1xuXG4gICAgICAgICAgc3RhdGUgPSBkYi5zdG9yZShDb25maWd1cmF0aW9uLnN0b3JhZ2UuY29sbGVjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmdldChrZXksIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQgPyByZXN1bHQudmFsdWUgOiBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5wdXQoe1xuICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHt9KTsgLy8gRm9yY2UgZXhlY3V0ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2F2ZUFwcGxpY2F0aW9uU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZmlsZSBzaXplLiBJZiBmaWxlIGlzIHRvbyBsYXJnZSwgZG8gbm90IHN0b3JlIHN0YXRlXG4gICAgICAgICAgICBpZiAoc3RhdGUudXBsb2FkRmlsZSAmJiBzdGF0ZS51cGxvYWRGaWxlLmZpbGUpIHtcbiAgICAgICAgICAgICAgdmFyIHNpemUgPSBzdGF0ZS51cGxvYWRGaWxlLmZpbGUuc2l6ZTtcbiAgICAgICAgICAgICAgaWYgKHNpemUgPiBDb25maWd1cmF0aW9uLm1heEZpbGVTaXplVG9TdG9yZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGF0ZSA9IGRlZXBDbG9uZVZhbHVlKHByZXBhcmVWYWx1ZUZvclNhdmluZyhzdGF0ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zZXQoQ29uZmlndXJhdGlvbi5zdG9yYWdlLmtleSwgc3RhdGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2xlYXJBcHBsaWNhdGlvblN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggaW4gQXBwbGljYXRpb25TdGF0ZSkge1xuICAgICAgICAgICAgICBpZiAoQXBwbGljYXRpb25TdGF0ZS5oYXNPd25Qcm9wZXJ0eSh4KSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBBcHBsaWNhdGlvblN0YXRlW3hdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNldChDb25maWd1cmF0aW9uLnN0b3JhZ2Uua2V5LCBudWxsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc3RvcmVBcHBsaWNhdGlvblN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5nZXQoQ29uZmlndXJhdGlvbi5zdG9yYWdlLmtleSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgXy5leHRlbmQoQXBwbGljYXRpb25TdGF0ZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1VwbG9hZEZpbGVTZXJ2aWNlJywgW1xuICAgICAgJ18nLCAnUGFja2FnZVNlcnZpY2UnLCAnVmFsaWRhdGlvblNlcnZpY2UnLCAnQ29uZmlndXJhdGlvbicsXG4gICAgICAnVXRpbHNTZXJ2aWNlJywgJ1NlcnZpY2VzJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oXywgUGFja2FnZVNlcnZpY2UsIFZhbGlkYXRpb25TZXJ2aWNlLCBDb25maWd1cmF0aW9uLFxuICAgICAgICBVdGlsc1NlcnZpY2UsIFNlcnZpY2VzLCBBcHBsaWNhdGlvblN0YXRlLCBBcHBsaWNhdGlvbkxvYWRlcikge1xuICAgICAgICB2YXIgdXRpbHMgPSBTZXJ2aWNlcy51dGlscztcblxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KEFwcGxpY2F0aW9uU3RhdGUudXBsb2FkRmlsZSkpIHtcbiAgICAgICAgICAgIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZS51cGxvYWRGaWxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnVwbG9hZEZpbGUgPSBzdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIG9uUmVzZXRDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIHJlc3VsdC5vblJlc2V0ID0gZnVuY3Rpb24oY2JrKSB7XG4gICAgICAgICAgb25SZXNldENhbGxiYWNrID0gY2JrO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5yZXNldFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnVwbG9hZEZpbGUgPSBzdGF0ZTtcbiAgICAgICAgICBQYWNrYWdlU2VydmljZS5yZWNyZWF0ZVBhY2thZ2UoKTtcbiAgICAgICAgICBvblJlc2V0Q2FsbGJhY2sgJiYgb25SZXNldENhbGxiYWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHZhbGlkYXRlU291cmNlID0gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgICAgc3RhdGUuc3RhdHVzID0ge1xuICAgICAgICAgICAgc3RhdGU6ICdyZWFkaW5nJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBQYWNrYWdlU2VydmljZS5jcmVhdGVSZXNvdXJjZShzb3VyY2UsIHN0YXRlKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHN0YXRlLnN0YXR1cztcbiAgICAgICAgICAgICAgc3RhdHVzLnNhbXBsZVNpemUgPSByZXNvdXJjZS5kYXRhLnJvd3MubGVuZ3RoO1xuICAgICAgICAgICAgICBpZiAocmVzb3VyY2UuZGF0YS5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLnNhbXBsZVNpemUgKz0gMTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghc3RhdHVzLmVycm9ycykge1xuICAgICAgICAgICAgICAgIFBhY2thZ2VTZXJ2aWNlLnJlbW92ZUFsbFJlc291cmNlcygpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgUGFja2FnZVNlcnZpY2UuYWRkUmVzb3VyY2UocmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgc3RhdGUuc3RhdHVzID0gbnVsbDtcbiAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5kZWZhdWx0RXJyb3JIYW5kbGVyKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQucmVzb3VyY2VDaGFuZ2VkID0gZnVuY3Rpb24oZmlsZSwgdXJsKSB7XG4gICAgICAgICAgaWYgKHV0aWxzLmlzVXJsKHVybCkpIHtcbiAgICAgICAgICAgIHN0YXRlLmlzVXJsID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlLnVybCA9IHVybDtcbiAgICAgICAgICAgIHZhbGlkYXRlU291cmNlKHVybCk7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGZpbGUpKSB7XG4gICAgICAgICAgICBzdGF0ZS5pc0ZpbGUgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUuZmlsZSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICAgICAgICAgIHNpemU6IGZpbGUuc2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhbGlkYXRlU291cmNlKGZpbGUpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUudXBsb2FkRmlsZSA9IHN0YXRlO1xuICAgICAgICAgIFBhY2thZ2VTZXJ2aWNlLnJlY3JlYXRlUGFja2FnZSgpO1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1V0aWxzU2VydmljZScsIFtcbiAgICAgICckcScsICdfJywgJ1NlcnZpY2VzJyxcbiAgICAgIGZ1bmN0aW9uKCRxLCBfLCBTZXJ2aWNlcykge1xuICAgICAgICB2YXIgdXRpbHMgPSBTZXJ2aWNlcy51dGlscztcblxuICAgICAgICB2YXIgYWxsQ29udGluZW50cyA9IG51bGw7XG4gICAgICAgIHZhciBhbGxDb3VudHJpZXMgPSBudWxsO1xuICAgICAgICB2YXIgYWxsQ3VycmVuY2llcyA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzbHVnOiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5jb252ZXJ0VG9TbHVnKHN0cmluZyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWNvcmF0ZVByb3h5VXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5kZWNvcmF0ZVByb3h5VXJsKHVybCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1bmRlY29yYXRlUHJveHlVcmw6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxzLnVuZGVjb3JhdGVQcm94eVVybCh1cmwpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmluZENvbmNlcHQ6IGZ1bmN0aW9uKG9zVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh1dGlscy5hdmFpbGFibGVDb25jZXB0cywgZnVuY3Rpb24oY29uY2VwdCkge1xuICAgICAgICAgICAgICByZXR1cm4gY29uY2VwdC5vc1R5cGUgPT0gb3NUeXBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRBdmFpbGFibGVDb25jZXB0czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuYXZhaWxhYmxlQ29uY2VwdHM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRBdmFpbGFibGVUeXBlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuYXZhaWxhYmxlRGF0YVR5cGVzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJvbWlzaWZ5OiBmdW5jdGlvbihhbGllblByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgYWxpZW5Qcm9taXNlLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJlcGFyZUZpc2NhbFBlcmlvZDogZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoISFwZXJpb2QpIHtcbiAgICAgICAgICAgICAgcmFuZ2UgPSBfLmZpbHRlcihbXG4gICAgICAgICAgICAgICAgcGVyaW9kLnN0YXJ0IHx8IHBlcmlvZC5mcm9tLFxuICAgICAgICAgICAgICAgIHBlcmlvZC5lbmQgfHwgcGVyaW9kLnRvXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChyYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgIHN0YXJ0OiByYW5nZVswXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICBzdGFydDogcmFuZ2VbMF0sXG4gICAgICAgICAgICAgICAgICBlbmQ6IHJhbmdlWzFdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGdldEN1cnJlbmNpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGFsbEN1cnJlbmNpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFsbEN1cnJlbmNpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICByZXN1bHQuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgU2VydmljZXMuY29zbW9wb2xpdGFuLmdldEN1cnJlbmNpZXMoZmFsc2UpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgW10ucHVzaC5hcHBseShyZXN1bHQsIGl0ZW1zKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbGxDdXJyZW5jaWVzID0gcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZ2V0RGVmYXVsdEN1cnJlbmN5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5nZXREZWZhdWx0Q3VycmVuY3koKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZ2V0Q29udGluZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoYWxsQ29udGluZW50cykge1xuICAgICAgICAgICAgICByZXR1cm4gYWxsQ29udGluZW50cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHJlc3VsdC4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBTZXJ2aWNlcy5jb3Ntb3BvbGl0YW4uZ2V0Q29udGluZW50cyhmYWxzZSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQuJHByb21pc2UudGhlbihmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAgICAgICBbXS5wdXNoLmFwcGx5KHJlc3VsdCwgaXRlbXMpO1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFsbENvbnRpbmVudHMgPSByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q291bnRyaWVzOiBmdW5jdGlvbiBnZXRDb3VudHJpZXMoY29udGluZW50KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRpbmVudCAmJiBhbGxDb3VudHJpZXMpIHtcbiAgICAgICAgICAgICAgLy8gSWYgY29udGluZW50IGlzIG5vdCBhdmFpbGFibGUsIHVzZSBjYWNoZSAoYWxsIGNvdW50cmllcylcbiAgICAgICAgICAgICAgcmV0dXJuIGFsbENvdW50cmllcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHJlc3VsdC4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBpZiAoISFjb250aW5lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBjb250aW5lbnQgaXMgYXZhaWxhYmxlLCB0cnkgdG8gbG9hZCBhbGwgY291bnRyaWVzLFxuICAgICAgICAgICAgICAgIC8vIGFuZCB0aGVuIGZpbHRlciB0aGVtLiBSZXNvbHZlIHdpdGggZmlsdGVyZWQgYXJyYXlcbiAgICAgICAgICAgICAgICBnZXRDb3VudHJpZXMoKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKGNvdW50cmllcykge1xuICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gW107XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNvbnRpbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSBfLmZpbHRlcihjb3VudHJpZXMsIGZ1bmN0aW9uKGNvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyhjb250aW5lbnQsIGNvdW50cnkuY29udGluZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZCA9IF8uZmlsdGVyKGNvdW50cmllcywgZnVuY3Rpb24oY291bnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudHJ5LmNvbnRpbmVudCA9PSBjb250aW5lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBbXS5wdXNoLmFwcGx5KHJlc3VsdCwgZmlsdGVyZWQpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgY29udGluZW50IGlzIG5vdCBhdmFpbGFibGUsIGp1c3QgbG9hZCBhbGwgY291bnRyaWVzXG4gICAgICAgICAgICAgICAgU2VydmljZXMuY29zbW9wb2xpdGFuLmdldENvdW50cmllcyhmYWxzZSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQuJHByb21pc2UudGhlbihmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAgICAgICBbXS5wdXNoLmFwcGx5KHJlc3VsdCwgaXRlbXMpO1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghY29udGluZW50KSB7XG4gICAgICAgICAgICAgIC8vIElmIGNvbnRpbmVudCBpcyBub3QgYXZhaWxhYmxlLCBjYWNoZSBhbGwgY291bnRyaWVzXG4gICAgICAgICAgICAgIGFsbENvdW50cmllcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBsb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIGdvb2RUYWJsZXNVcmwgPSAnaHR0cDovL2dvb2R0YWJsZXMub2tmbmxhYnMub3JnL2FwaS9ydW4nO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1ZhbGlkYXRpb25TZXJ2aWNlJywgW1xuICAgICAgJyRxJywgJ18nLCAnU2VydmljZXMnLCAnQ29uZmlndXJhdGlvbicsXG4gICAgICBmdW5jdGlvbigkcSwgXywgU2VydmljZXMsIENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgdmFyIHV0aWxzID0gU2VydmljZXMudXRpbHM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWxpZGF0ZVJlc291cmNlOiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZGF0aW9uUmVzdWx0ID0ge1xuICAgICAgICAgICAgICBzdGF0ZTogJ2NoZWNraW5nJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yoc291cmNlKSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHV0aWxzLnZhbGlkYXRlRGF0YShzb3VyY2UuZGF0YSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICBnb29kVGFibGVzVXJsKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRpb25SZXN1bHQuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICB1dGlscy52YWxpZGF0ZURhdGEodW5kZWZpbmVkLCBzb3VyY2UsIHVuZGVmaW5lZCwgZ29vZFRhYmxlc1VybClcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LiRwcm9taXNlXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LnN0YXRlID0gJ2NvbXBsZXRlZCc7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5lcnJvcnMgJiYgcmVzdWx0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LmVycm9ycyA9IHJlc3VsdHMuZXJyb3JzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5kZWZhdWx0RXJyb3JIYW5kbGVyKGVycm9yKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0aW9uUmVzdWx0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdGVSZXF1aXJlZENvbmNlcHRzOiBmdW5jdGlvbihyZXNvdXJjZXMpIHtcbiAgICAgICAgICAgIHZhciBoYXNDb25jZXB0ID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBfLnNvbWUocmVzb3VyY2VzLCBmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLnNvbWUocmVzb3VyY2UuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvZGFzaC5zdGFydHNXaXRoKGZpZWxkLnR5cGUsIHByZWZpeCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBoYXNDb25jZXB0KCd2YWx1ZScpICYmIGhhc0NvbmNlcHQoJ2RhdGU6Jyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZXNGb3JtOiBmdW5jdGlvbihmb3JtKSB7XG4gICAgICAgICAgICBpZiAoIWZvcm0gfHwgIWZvcm0uJGRpcnR5KSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm9ybS4kdmFsaWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogJ2ludmFsaWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdmaWVsZENvbmNlcHRzJywgW1xuICAgICAgJ18nLFxuICAgICAgZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZmllbGQuYWxsb3dlZENvbmNlcHRzO1xuICAgICAgICAgIGlmICghIWZpZWxkLnR5cGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IF8uZmlsdGVyKHJlc3VsdCwgZnVuY3Rpb24oY29uY2VwdCkge1xuICAgICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyhjb25jZXB0LmFsbG93ZWRUeXBlcywgZmllbGQudHlwZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKVxuICAgIC5maWx0ZXIoJ2ZpZWxkVHlwZXMnLCBbXG4gICAgICAnXycsICdVdGlsc1NlcnZpY2UnLFxuICAgICAgZnVuY3Rpb24oXywgVXRpbHNTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBmaWVsZC5hbGxvd2VkVHlwZXM7XG4gICAgICAgICAgaWYgKCEhZmllbGQuY29uY2VwdCkge1xuICAgICAgICAgICAgdmFyIGNvbmNlcHQgPSBVdGlsc1NlcnZpY2UuZmluZENvbmNlcHQoZmllbGQuY29uY2VwdCk7XG4gICAgICAgICAgICByZXN1bHQgPSBfLmZpbHRlcihyZXN1bHQsIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoY29uY2VwdC5hbGxvd2VkVHlwZXMsIHR5cGUuaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdodG1sJywgW1xuICAgICAgJyRzY2UnLFxuICAgICAgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChpbnB1dCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdqb2luJywgW1xuICAgICAgJ18nLFxuICAgICAgZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHNlcGFyYXRvcikge1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIoaW5wdXQpLmpvaW4oc2VwYXJhdG9yIHx8ICcsICcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdudW1iZXJGb3JtYXQnLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBmcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICAgIGlucHV0ID0gcGFyc2VGbG9hdChpbnB1dCk7XG4gICAgICAgICAgaWYgKCFpc0Zpbml0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gMC4wO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmcmFjdGlvbkRpZ2l0cyA9IHBhcnNlRmxvYXQoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgIGlmIChpc0Zpbml0ZShmcmFjdGlvbkRpZ2l0cykgJiYgKGZyYWN0aW9uRGlnaXRzID49IDEpKSB7XG4gICAgICAgICAgICBmcmFjdGlvbkRpZ2l0cyA9IE1hdGguZmxvb3IoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXC4/MCokLywnJyk7IC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChpbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
