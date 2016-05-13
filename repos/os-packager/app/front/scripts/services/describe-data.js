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
