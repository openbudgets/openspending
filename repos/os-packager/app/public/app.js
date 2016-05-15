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

var flag = 0;

;(function(angular) {

  angular.module('Application')
    .controller('DescribeDataController', [
      '$scope', 'PackageService', 'DescribeDataService', 'ApplicationLoader',
      function($scope, PackageService, DescribeDataService, ApplicationLoader) {
          ApplicationLoader.then(function() {
	      console.log('flag', flag);
	     // if (flag < 2){
		  $scope.state = DescribeDataService.getState();
		  $scope.resources = PackageService.getResources();
	//	  flag += 1}
	      /*
	      if (!!PackageService.getResources()){
		  var fields = PackageService.getResources()[0].fields;
		  console.log('fields', fields);
		  var fdp = new OSTypes().fieldsToModel(fields);
	      
		  if (fdp.errors){
		      $scope.obeuState = DescribeDataService.getState('obeu');
		      $scope.obeuResources = PackageService.getResources('obeu');
		  }else{
		      $scope.state = DescribeDataService.getState();
		      $scope.resources = PackageService.getResources();
		  }
	      }else{
		  $scope.state = DescribeDataService.getState();
		  $scope.resources = PackageService.getResources();
	      }
	      */
	      
              $scope.onConceptChanged = function(field) {
	
		console.log('in describe-data onConceptChanged', field);
		$scope.state = DescribeDataService.updateField(field);
		$scope.selectedMeasures = DescribeDataService
		    .getSelectedConcepts('measure');
		$scope.selectedDimensions = DescribeDataService
		    .getSelectedConcepts('dimension');
            };
	    $scope.onObeuConceptChanged = function(field) {
		console.log('in describe-data  onObeuConceptChanged', field);
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
                  this.field.obeuType = val;
                  if (clear) {
                    this.field.options = {};
                  }
                  this.onChanged();
                  $scope.$applyAsync();
                }
              };
            }
          ],
          controllerAs: 'obeuCtrl',
          bindToController: {
            field: '=',
            onChanged: '&'
          },
            link: function($scope, element, attr, obeuCtrl) {
		var label = element.find('.control-label')[0];
		if (label.innerHTML === 'ObeuDataType'){
		    console.log('in obeu-datatype.js');
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
		    if (obeuCtrl.field.obeuType) {
			obeuCtrl.setSugg(obeuCtrl.field.obeuType);
			$(input).typeahead('val', obeuCtrl.field.obeuType.replace(/:/g,sep));
			obeuCtrl.setVal(obeuCtrl.field.obeuType, false);
		    }
		    $(input).bind('typeahead:select', function(ev, sugg) {
			obeuCtrl.setSugg(sugg.val);
			if (!sugg.leaf) {
			    window.setTimeout(function() {
				$(input).typeahead('val', sugg.text + sep);
				$(input).typeahead('open');
			    }, 100);
			    $scope.$applyAsync();
			} else {
			    obeuCtrl.setVal(sugg.val, true);
			    $scope.$applyAsync();
			}
		    });
		    $(clear).bind('click', function() {
			$(input).typeahead('val','');
			obeuCtrl.setSugg('');
			obeuCtrl.setVal('', true);
		    });
		}
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
		var label = element.find('.control-label')[0];
		if (label.innerHTML === 'OsDataType'){
		    console.log('in os-datatype.js');
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

	  var obeuAttributes = {};
	  var obeuResources = [];
	  var obeuSchema = null; 

        ApplicationLoader.then(function() {
          if (_.isObject(ApplicationState.package)) {
              attributes = ApplicationState.package.attributes;
              resources = ApplicationState.package.resources;
	      console.log('att',attributes);
	      console.log('res',resources);
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
            getResources: function(cat) {
		console.log('PackageService.getResources cat=', cat, '*');
		if (cat === 'os' || cat === undefined){
		    return resources;
		}
		if (cat === 'obeu'){
		    return obeuResources;
		}
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
	      console.log('in provide metadata service',state);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLmpzIiwibW9kdWxlcy5qcyIsImFuaW1hdGlvbnMvZmFkZS5qcyIsImNvbmZpZy9jb25maWcuanMiLCJjb25maWcvZW52LmpzIiwiY29uZmlnL3JvdXRlcy5qcyIsImNvbnRyb2xsZXJzL2Rlc2NyaWJlLWRhdGEuanMiLCJjb250cm9sbGVycy9kb3dubG9hZC1wYWNrYWdlLmpzIiwiY29udHJvbGxlcnMvaGVhZGVyLmpzIiwiY29udHJvbGxlcnMvcHJldmlldy1kYXRhLmpzIiwiY29udHJvbGxlcnMvcHJvdmlkZS1tZXRhZGF0YS5qcyIsImNvbnRyb2xsZXJzL3N0ZXBzLmpzIiwiY29udHJvbGxlcnMvdXBsb2FkLWZpbGUuanMiLCJkaXJlY3RpdmVzL2Jvb3RzdHJhcC1tb2RhbC5qcyIsImRpcmVjdGl2ZXMvZmlsZS1zZWxlY3RlZC5qcyIsImRpcmVjdGl2ZXMvb2JldS1kYXRhdHlwZS5qcyIsImRpcmVjdGl2ZXMvb3MtZGF0YXR5cGUuanMiLCJkaXJlY3RpdmVzL3BvcG92ZXIuanMiLCJkaXJlY3RpdmVzL3Byb2dyZXNzLWJhci5qcyIsImZpbHRlcnMvZmllbGQtZmlsdGVycy5qcyIsImZpbHRlcnMvaHRtbC5qcyIsImZpbHRlcnMvam9pbi5qcyIsImZpbHRlcnMvbnVtYmVyLWZvcm1hdC5qcyIsInNlcnZpY2VzL2FwcGxpY2F0aW9uLWxvYWRlci5qcyIsInNlcnZpY2VzL2Rlc2NyaWJlLWRhdGEuanMiLCJzZXJ2aWNlcy9kb3dubG9hZC1wYWNrYWdlLmpzIiwic2VydmljZXMvbG9naW4uanMiLCJzZXJ2aWNlcy9wYWNrYWdlLmpzIiwic2VydmljZXMvcHJldmlldy1kYXRhLmpzIiwic2VydmljZXMvcHJvdmlkZS1tZXRhZGF0YS5qcyIsInNlcnZpY2VzL3N0ZXBzLmpzIiwic2VydmljZXMvc3RvcmFnZS5qcyIsInNlcnZpY2VzL3VwbG9hZC1maWxlLmpzIiwic2VydmljZXMvdXRpbHMuanMiLCJzZXJ2aWNlcy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4N0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4OEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicsIFtcbiAgICAnbmdSb3V0ZScsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ2F1dGhDbGllbnQuc2VydmljZXMnXG4gIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIi8qKlxuICogSW1wb3J0IHNvbWUgbW9kdWxlcyAtIHJlcXVpcmVkIGZvciBvdGhlciBzdHVmZiBsaWtlIEJvb3RzdHJhcCBhbmQgQW5ndWxhclxuICovXG4oZnVuY3Rpb24oZ2xvYmFscywgcmVxdWlyZSkge1xuICBnbG9iYWxzLiQgPSBnbG9iYWxzLmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5Jyk7IC8vIGZldGNoKCkgcG9seWZpbGxcbn0pKHdpbmRvdywgcmVxdWlyZSk7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5hbmltYXRpb24oJy5mYWRlLWFuaW1hdGlvbicsIFtcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCBkb25lRm4pIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaGlkZSgpLmZhZGVJbigxMDAsIGRvbmVGbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgZG9uZUZuKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmZhZGVPdXQoMTAwLCBkb25lRm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICB2YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbiAgdmFyIHNlcnZpY2VzID0gcmVxdWlyZSgnYXBwL3NlcnZpY2VzJyk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29uc3RhbnQoJ18nLCBfKVxuICAgIC5jb25zdGFudCgnU2VydmljZXMnLCBzZXJ2aWNlcylcbiAgICAudmFsdWUoJ0FwcGxpY2F0aW9uU3RhdGUnLCB7fSlcbiAgICAuY29uZmlnKFtcbiAgICAgICckaHR0cFByb3ZpZGVyJywgJyRjb21waWxlUHJvdmlkZXInLCAnJGxvZ1Byb3ZpZGVyJyxcbiAgICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsICRsb2dQcm92aWRlcikge1xuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfG1haWx0b3xmaWxlfGphdmFzY3JpcHQpOi8pO1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgXSlcbiAgICAucnVuKFtcbiAgICAgICckcm9vdFNjb3BlJywgJ1NlcnZpY2VzJywgJ0FwcGxpY2F0aW9uTG9hZGVyJyxcbiAgICAgICdTdGVwc1NlcnZpY2UnLCAnVXBsb2FkRmlsZVNlcnZpY2UnLCAnRGVzY3JpYmVEYXRhU2VydmljZScsXG4gICAgICAnUHJvdmlkZU1ldGFkYXRhU2VydmljZScsICdEb3dubG9hZFBhY2thZ2VTZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsIFNlcnZpY2VzLCBBcHBsaWNhdGlvbkxvYWRlcixcbiAgICAgICAgU3RlcHNTZXJ2aWNlLCBVcGxvYWRGaWxlU2VydmljZSwgRGVzY3JpYmVEYXRhU2VydmljZSxcbiAgICAgICAgUHJvdmlkZU1ldGFkYXRhU2VydmljZSwgRG93bmxvYWRQYWNrYWdlU2VydmljZSkge1xuICAgICAgICAkcm9vdFNjb3BlLlByb2Nlc3NpbmdTdGF0dXMgPSBTZXJ2aWNlcy5kYXRhc3RvcmUuUHJvY2Vzc2luZ1N0YXR1cztcblxuICAgICAgICBTdGVwc1NlcnZpY2Uuc2V0U3RlcFJlc2V0Q2FsbGJhY2tzKHtcbiAgICAgICAgICAndXBsb2FkLWZpbGUnOiBVcGxvYWRGaWxlU2VydmljZS5yZXNldFN0YXRlLFxuICAgICAgICAgICdkZXNjcmliZS1kYXRhJzogRGVzY3JpYmVEYXRhU2VydmljZS5yZXNldFN0YXRlLFxuICAgICAgICAgICdtZXRhZGF0YSc6IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UucmVzZXRTdGF0ZSxcbiAgICAgICAgICAnZG93bmxvYWQnOiBEb3dubG9hZFBhY2thZ2VTZXJ2aWNlLnJlc2V0U3RhdGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmFwcGxpY2F0aW9uTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIHNlcnZpY2VzID0gcmVxdWlyZSgnYXBwL3NlcnZpY2VzJyk7XG5cbiAgdmFyIGNvbmZpZyA9IHtcbiAgICBkZWZhdWx0RXJyb3JIYW5kbGVyOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKGNvbnNvbGUudHJhY2UpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUudHJhY2UoZXJyb3IpO1xuICAgICAgfSBlbHNlXG4gICAgICBpZiAoY29uc29sZS5sb2cpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRQYWNrYWdlRmlsZU5hbWU6ICdkYXRhcGFja2FnZS5qc29uJyxcbiAgICBldmVudHM6IHtcbiAgICAgIENPTkNFUFRTX0NIQU5HRUQ6ICdwYWNrYWdlLmNvbmNlcHRzQ2hhbmdlZCdcbiAgICB9LFxuICAgIHN0b3JhZ2U6IHtcbiAgICAgIGNvbGxlY3Rpb246ICdhcHBzdGF0ZScsXG4gICAgICBrZXk6ICdkZWZhdWx0J1xuICAgIH0sXG4gICAgc3RlcHM6IHNlcnZpY2VzLmRhdGEuc3RlcHMsXG4gICAgaXNXaXphcmQ6IHdpbmRvdy5pc1dpemFyZCxcbiAgICBtYXhGaWxlU2l6ZVRvU3RvcmU6IDEwMCAqIDEwMjQgKiAxMDI0IC8vIDEwME1iXG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29uc3RhbnQoJ0NvbmZpZ3VyYXRpb24nLCBjb25maWcpO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbmZpZyhbXG4gICAgICAnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnXycsICdDb25maWd1cmF0aW9uJyxcbiAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgXywgQ29uZmlndXJhdGlvbikge1xuICAgICAgICBfLmVhY2goQ29uZmlndXJhdGlvbi5zdGVwcywgZnVuY3Rpb24oc3RlcCkge1xuICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbihzdGVwLnJvdXRlLCB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBzdGVwLnRlbXBsYXRlVXJsLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiBzdGVwLmNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgIHN0ZXA6IHN0ZXBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtcbiAgICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgfVxuICAgIF0pXG4gICAgLnJ1bihbXG4gICAgICAnJHJvdXRlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb3V0ZSkge1xuICAgICAgICAvLyBDYXB0dXJlIGluaXRpYWwgJGxvY2F0aW9uQ2hhbmdlU3RhcnQgZXZlbnQ7IG90aGVyd2lzZSBuZ1ZpZXcgd2lsbFxuICAgICAgICAvLyBub3Qgd29yayAoZipja2luZyBcImtub3duXCIgaXNzdWUgc2luY2UgYGFuZ3VsYXItcm91dGVAMS41LjVgKVxuICAgICAgfVxuICAgIF0pXG5cbn0pKGFuZ3VsYXIpO1xuIiwidmFyIGZsYWcgPSAwO1xuXG47KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb250cm9sbGVyKCdEZXNjcmliZURhdGFDb250cm9sbGVyJywgW1xuICAgICAgJyRzY29wZScsICdQYWNrYWdlU2VydmljZScsICdEZXNjcmliZURhdGFTZXJ2aWNlJywgJ0FwcGxpY2F0aW9uTG9hZGVyJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgUGFja2FnZVNlcnZpY2UsIERlc2NyaWJlRGF0YVNlcnZpY2UsIEFwcGxpY2F0aW9uTG9hZGVyKSB7XG4gICAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcblx0ICAgICAgY29uc29sZS5sb2coJ2ZsYWcnLCBmbGFnKTtcblx0ICAgICAvLyBpZiAoZmxhZyA8IDIpe1xuXHRcdCAgJHNjb3BlLnN0YXRlID0gRGVzY3JpYmVEYXRhU2VydmljZS5nZXRTdGF0ZSgpO1xuXHRcdCAgJHNjb3BlLnJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuXHQvL1x0ICBmbGFnICs9IDF9XG5cdCAgICAgIC8qXG5cdCAgICAgIGlmICghIVBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpKXtcblx0XHQgIHZhciBmaWVsZHMgPSBQYWNrYWdlU2VydmljZS5nZXRSZXNvdXJjZXMoKVswXS5maWVsZHM7XG5cdFx0ICBjb25zb2xlLmxvZygnZmllbGRzJywgZmllbGRzKTtcblx0XHQgIHZhciBmZHAgPSBuZXcgT1NUeXBlcygpLmZpZWxkc1RvTW9kZWwoZmllbGRzKTtcblx0ICAgICAgXG5cdFx0ICBpZiAoZmRwLmVycm9ycyl7XG5cdFx0ICAgICAgJHNjb3BlLm9iZXVTdGF0ZSA9IERlc2NyaWJlRGF0YVNlcnZpY2UuZ2V0U3RhdGUoJ29iZXUnKTtcblx0XHQgICAgICAkc2NvcGUub2JldVJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygnb2JldScpO1xuXHRcdCAgfWVsc2V7XG5cdFx0ICAgICAgJHNjb3BlLnN0YXRlID0gRGVzY3JpYmVEYXRhU2VydmljZS5nZXRTdGF0ZSgpO1xuXHRcdCAgICAgICRzY29wZS5yZXNvdXJjZXMgPSBQYWNrYWdlU2VydmljZS5nZXRSZXNvdXJjZXMoKTtcblx0XHQgIH1cblx0ICAgICAgfWVsc2V7XG5cdFx0ICAkc2NvcGUuc3RhdGUgPSBEZXNjcmliZURhdGFTZXJ2aWNlLmdldFN0YXRlKCk7XG5cdFx0ICAkc2NvcGUucmVzb3VyY2VzID0gUGFja2FnZVNlcnZpY2UuZ2V0UmVzb3VyY2VzKCk7XG5cdCAgICAgIH1cblx0ICAgICAgKi9cblx0ICAgICAgXG4gICAgICAgICAgICAgICRzY29wZS5vbkNvbmNlcHRDaGFuZ2VkID0gZnVuY3Rpb24oZmllbGQpIHtcblx0XG5cdFx0Y29uc29sZS5sb2coJ2luIGRlc2NyaWJlLWRhdGEgb25Db25jZXB0Q2hhbmdlZCcsIGZpZWxkKTtcblx0XHQkc2NvcGUuc3RhdGUgPSBEZXNjcmliZURhdGFTZXJ2aWNlLnVwZGF0ZUZpZWxkKGZpZWxkKTtcblx0XHQkc2NvcGUuc2VsZWN0ZWRNZWFzdXJlcyA9IERlc2NyaWJlRGF0YVNlcnZpY2Vcblx0XHQgICAgLmdldFNlbGVjdGVkQ29uY2VwdHMoJ21lYXN1cmUnKTtcblx0XHQkc2NvcGUuc2VsZWN0ZWREaW1lbnNpb25zID0gRGVzY3JpYmVEYXRhU2VydmljZVxuXHRcdCAgICAuZ2V0U2VsZWN0ZWRDb25jZXB0cygnZGltZW5zaW9uJyk7XG4gICAgICAgICAgICB9O1xuXHQgICAgJHNjb3BlLm9uT2JldUNvbmNlcHRDaGFuZ2VkID0gZnVuY3Rpb24oZmllbGQpIHtcblx0XHRjb25zb2xlLmxvZygnaW4gZGVzY3JpYmUtZGF0YSAgb25PYmV1Q29uY2VwdENoYW5nZWQnLCBmaWVsZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICBdKTtcbiAgICBcbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29udHJvbGxlcignRG93bmxvYWRQYWNrYWdlQ29udHJvbGxlcicsIFtcbiAgICAgICckc2NvcGUnLCAnUGFja2FnZVNlcnZpY2UnLCAnRG93bmxvYWRQYWNrYWdlU2VydmljZScsXG4gICAgICAnQ29uZmlndXJhdGlvbicsICdBcHBsaWNhdGlvbkxvYWRlcicsICdMb2dpblNlcnZpY2UnLFxuICAgICAgZnVuY3Rpb24oJHNjb3BlLCBQYWNrYWdlU2VydmljZSwgRG93bmxvYWRQYWNrYWdlU2VydmljZSxcbiAgICAgICAgQ29uZmlndXJhdGlvbiwgQXBwbGljYXRpb25Mb2FkZXIsIExvZ2luU2VydmljZSkge1xuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5maWxlTmFtZSA9IENvbmZpZ3VyYXRpb24uZGVmYXVsdFBhY2thZ2VGaWxlTmFtZTtcbiAgICAgICAgICAkc2NvcGUuYXR0cmlidXRlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldEF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAkc2NvcGUucmVzb3VyY2VzID0gUGFja2FnZVNlcnZpY2UuZ2V0UmVzb3VyY2VzKCk7XG4gICAgICAgICAgJHNjb3BlLmZpc2NhbERhdGFQYWNrYWdlID0gUGFja2FnZVNlcnZpY2UuY3JlYXRlRmlzY2FsRGF0YVBhY2thZ2UoKTtcbiAgICAgICAgICAkc2NvcGUubWFwcGluZ3MgPSBEb3dubG9hZFBhY2thZ2VTZXJ2aWNlLmdlbmVyYXRlTWFwcGluZ3MoXG4gICAgICAgICAgICBQYWNrYWdlU2VydmljZS5jcmVhdGVGaXNjYWxEYXRhUGFja2FnZSgpKTtcbiAgICAgICAgICAkc2NvcGUubG9naW4gPSBMb2dpblNlcnZpY2U7XG4gICAgICAgICAgJHNjb3BlLnB1Ymxpc2hEYXRhUGFja2FnZSA9IERvd25sb2FkUGFja2FnZVNlcnZpY2UucHVibGlzaERhdGFQYWNrYWdlO1xuICAgICAgICAgICRzY29wZS5zdGF0ZSA9IERvd25sb2FkUGFja2FnZVNlcnZpY2UuZ2V0U3RhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIFtcbiAgICAgICckc2NvcGUnLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgTG9naW5TZXJ2aWNlKSB7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IExvZ2luU2VydmljZTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb250cm9sbGVyKCdQcmV2aWV3RGF0YUNvbnRyb2xsZXInLCBbXG4gICAgICAnJHNjb3BlJywgJ1ByZXZpZXdEYXRhU2VydmljZScsICdBcHBsaWNhdGlvbkxvYWRlcicsXG4gICAgICBmdW5jdGlvbigkc2NvcGUsIFByZXZpZXdEYXRhU2VydmljZSwgQXBwbGljYXRpb25Mb2FkZXIpIHtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUucG9zc2liaWxpdGllcyA9IFByZXZpZXdEYXRhU2VydmljZS5nZXRQb3NzaWJpbGl0aWVzKCk7XG4gICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJldmlld0RhdGFTZXJ2aWNlLmdldFN0YXRlKCk7XG4gICAgICAgICAgLy9UT0RPOiBbQWRhbV0gVGhpcyBmdW5jdGlvbmFsaXR5IGlzIGJyb2tlbiByaWdodCBub3csIHdlIG5lZWQgdG8gcmVzdG9yZSBpdCBjb3JyZWN0bHlcbiAgICAgICAgICAvLyRzY29wZS5wcmV2aWV3RGF0YSA9IFByZXZpZXdEYXRhU2VydmljZS5nZXRQcmV2aWV3RGF0YSgpO1xuXG4gICAgICAgICAgLy8kc2NvcGUub25TZWxlY3RQb3NzaWJpbGl0eSA9IGZ1bmN0aW9uKHBvc3NpYmlsaXR5KSB7XG4gICAgICAgICAgLy8gIFByZXZpZXdEYXRhU2VydmljZS5zZWxlY3RQb3NzaWJpbGl0eShwb3NzaWJpbGl0eSk7XG4gICAgICAgICAgLy8gICRzY29wZS5wcmV2aWV3RGF0YSA9IFByZXZpZXdEYXRhU2VydmljZS5nZXRQcmV2aWV3RGF0YSgpO1xuICAgICAgICAgIC8vfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyLCB1bmRlZmluZWQpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb250cm9sbGVyKCdQcm92aWRlTWV0YWRhdGFDb250cm9sbGVyJywgW1xuICAgICAgJyRzY29wZScsICdQYWNrYWdlU2VydmljZScsICdQcm92aWRlTWV0YWRhdGFTZXJ2aWNlJyxcbiAgICAgICdBcHBsaWNhdGlvbkxvYWRlcicsICdfJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgUGFja2FnZVNlcnZpY2UsIFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UsXG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLCBfKSB7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLmZvcm1zID0gXy5leHRlbmQoe30sICRzY29wZS5mb3Jtcyk7XG5cbiAgICAgICAgICAkc2NvcGUuZ2VvRGF0YSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UuZ2V0R2VvRGF0YSgpO1xuICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UuZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICRzY29wZS5hdHRyaWJ1dGVzID0gUGFja2FnZVNlcnZpY2UuZ2V0QXR0cmlidXRlcygpO1xuXG4gICAgICAgICAgdmFyIGZpc2NhbFBlcmlvZCA9IG51bGw7XG4gICAgICAgICAgaWYgKCRzY29wZS5hdHRyaWJ1dGVzICYmICRzY29wZS5hdHRyaWJ1dGVzLmZpc2NhbFBlcmlvZCkge1xuICAgICAgICAgICAgZmlzY2FsUGVyaW9kID0gJHNjb3BlLmF0dHJpYnV0ZXMuZmlzY2FsUGVyaW9kO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUucGVyaW9kID0ge1xuICAgICAgICAgICAgc3RhcnQ6IGZpc2NhbFBlcmlvZCA/IGZpc2NhbFBlcmlvZC5mcm9tIDogJycsXG4gICAgICAgICAgICBlbmQ6IGZpc2NhbFBlcmlvZCA/IGZpc2NhbFBlcmlvZC50byA6ICcnLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdhdHRyaWJ1dGVzLnRpdGxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBQcm92aWRlTWV0YWRhdGFTZXJ2aWNlLnZhbGlkYXRlUGFja2FnZShcbiAgICAgICAgICAgICAgJHNjb3BlLmZvcm1zLm1ldGFkYXRhKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2F0dHJpYnV0ZXMubmFtZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJvdmlkZU1ldGFkYXRhU2VydmljZS52YWxpZGF0ZVBhY2thZ2UoXG4gICAgICAgICAgICAgICRzY29wZS5mb3Jtcy5tZXRhZGF0YSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdwZXJpb2QnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgUHJvdmlkZU1ldGFkYXRhU2VydmljZS51cGRhdGVGaXNjYWxQZXJpb2QodmFsdWUpO1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJvdmlkZU1ldGFkYXRhU2VydmljZS52YWxpZGF0ZVBhY2thZ2UoXG4gICAgICAgICAgICAgICRzY29wZS5mb3Jtcy5tZXRhZGF0YSk7XG4gICAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdhdHRyaWJ1dGVzLnJlZ2lvbkNvZGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UudXBkYXRlQ291bnRyaWVzKCk7XG4gICAgICAgICAgICAkc2NvcGUuZ2VvRGF0YSA9IFByb3ZpZGVNZXRhZGF0YVNlcnZpY2UuZ2V0R2VvRGF0YSgpO1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJvdmlkZU1ldGFkYXRhU2VydmljZS52YWxpZGF0ZVBhY2thZ2UoXG4gICAgICAgICAgICAgICRzY29wZS5mb3Jtcy5tZXRhZGF0YSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdhdHRyaWJ1dGVzJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoKG5ld1ZhbHVlID09PSBvbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gUHJvdmlkZU1ldGFkYXRhU2VydmljZS52YWxpZGF0ZVBhY2thZ2UoXG4gICAgICAgICAgICAgICRzY29wZS5mb3Jtcy5tZXRhZGF0YSk7XG4gICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmNvbnRyb2xsZXIoJ1N0ZXBzQ29udHJvbGxlcicsIFtcbiAgICAgICckc2NvcGUnLCAnU3RlcHNTZXJ2aWNlJywgJ0FwcGxpY2F0aW9uTG9hZGVyJywgJ1N0b3JhZ2VTZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgU3RlcHNTZXJ2aWNlLCBBcHBsaWNhdGlvbkxvYWRlciwgU3RvcmFnZVNlcnZpY2UpIHtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuc3RlcHMgPSBTdGVwc1NlcnZpY2UuZ2V0U3RlcHMoKTtcbiAgICAgICAgICAkc2NvcGUuY3VycmVudFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ2V0Q3VycmVudFN0ZXAoKTtcbiAgICAgICAgICAkc2NvcGUubmV4dFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ2V0TmV4dFN0ZXAoJHNjb3BlLmN1cnJlbnRTdGVwKTtcblxuICAgICAgICAgICRzY29wZS5nb1RvU3RlcCA9IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50U3RlcCA9IFN0ZXBzU2VydmljZS5nb1RvU3RlcChzdGVwKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJHNjb3BlLmdvVG9OZXh0U3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTdGVwID0gU3RlcHNTZXJ2aWNlLmdvVG9TdGVwKCRzY29wZS5uZXh0U3RlcCwgdHJ1ZSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5yZXNldEZyb21DdXJyZW50U3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3RlcHNTZXJ2aWNlLnJlc2V0U3RlcHNGcm9tKCRzY29wZS5jdXJyZW50U3RlcCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5yZXN0YXJ0RmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3RvcmFnZVNlcnZpY2UuY2xlYXJBcHBsaWNhdGlvblN0YXRlKClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50U3RlcCA9IFN0ZXBzU2VydmljZS5nb1RvU3RlcCgkc2NvcGUuc3RlcHNbMF0pO1xuICAgICAgICAgICAgICAgICAgU3RlcHNTZXJ2aWNlLnJlc2V0U3RlcHNGcm9tKCRzY29wZS5jdXJyZW50U3RlcCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCwgcm91dGUpIHtcbiAgICAgICAgICAgIGlmIChyb3V0ZS5zdGVwKSB7XG4gICAgICAgICAgICAgIHZhciBzdGVwID0gU3RlcHNTZXJ2aWNlLmdldFN0ZXBCeUlkKHJvdXRlLnN0ZXAuaWQpO1xuICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudFN0ZXAgPSBTdGVwc1NlcnZpY2UuZ29Ub1N0ZXAoc3RlcCk7XG4gICAgICAgICAgICAgICRzY29wZS5uZXh0U3RlcCA9IFN0ZXBzU2VydmljZS5nZXROZXh0U3RlcCgkc2NvcGUuY3VycmVudFN0ZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5jb250cm9sbGVyKCdVcGxvYWRGaWxlQ29udHJvbGxlcicsIFtcbiAgICAgICckc2NvcGUnLCAnXycsICdVcGxvYWRGaWxlU2VydmljZScsICdBcHBsaWNhdGlvbkxvYWRlcicsICdMb2dpblNlcnZpY2UnLFxuICAgICAgJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgZnVuY3Rpb24oJHNjb3BlLCBfLCBVcGxvYWRGaWxlU2VydmljZSwgQXBwbGljYXRpb25Mb2FkZXIsIExvZ2luU2VydmljZSxcbiAgICAgICAgQ29uZmlndXJhdGlvbikge1xuICAgICAgICAkc2NvcGUubG9naW4gPSBMb2dpblNlcnZpY2U7XG4gICAgICAgICRzY29wZS5tYXhGaWxlU2l6ZVRvU3RvcmUgPSBDb25maWd1cmF0aW9uLm1heEZpbGVTaXplVG9TdG9yZTtcblxuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgZnVuY3Rpb24gcmVsb2FkU3RhdGUoKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3RhdGUgPSBVcGxvYWRGaWxlU2VydmljZS5nZXRTdGF0ZSgpO1xuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLnN0YXRlLmlzVXJsKSB7XG4gICAgICAgICAgICAgICRzY29wZS51cmwgPSAkc2NvcGUuc3RhdGUudXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5zdGF0ZS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmZpbGUgPSAkc2NvcGUuc3RhdGUuZmlsZS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLmlzRmlsZVNlbGVjdGVkID0gJHNjb3BlLnN0YXRlLmlzRmlsZTtcbiAgICAgICAgICAgICRzY29wZS5pc1VybFNlbGVjdGVkID0gJHNjb3BlLnN0YXRlLmlzVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWxvYWRTdGF0ZSgpO1xuXG4gICAgICAgICAgVXBsb2FkRmlsZVNlcnZpY2Uub25SZXNldChyZWxvYWRTdGF0ZSk7XG5cbiAgICAgICAgICAkc2NvcGUuJHdhdGNoKCd1cmwnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLnJlc2V0RnJvbUN1cnJlbnRTdGVwKCk7XG4gICAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFVwbG9hZEZpbGVTZXJ2aWNlLnJlc291cmNlQ2hhbmdlZChudWxsLFxuICAgICAgICAgICAgICAgICRzY29wZS51cmwpO1xuICAgICAgICAgICAgICAkc2NvcGUuaXNGaWxlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgJHNjb3BlLmlzVXJsU2VsZWN0ZWQgPSAhISRzY29wZS51cmwgfHwgJHNjb3BlLnN0YXRlLmlzVXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJHNjb3BlLm9uRmlsZVNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IF8uZmlyc3QodGhpcy5maWxlcyk7XG4gICAgICAgICAgICAkc2NvcGUuZmlsZSA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgICRzY29wZS5yZXNldEZyb21DdXJyZW50U3RlcCgpO1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlID0gVXBsb2FkRmlsZVNlcnZpY2UucmVzb3VyY2VDaGFuZ2VkKGZpbGUsIG51bGwpO1xuICAgICAgICAgICAgJHNjb3BlLmlzRmlsZVNlbGVjdGVkID0gJHNjb3BlLnN0YXRlLmlzRmlsZTtcbiAgICAgICAgICAgICRzY29wZS5pc1VybFNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5vbkNsZWFyU2VsZWN0ZWRSZXNvdXJjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmZpbGUgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLnVybCA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUuaXNGaWxlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5pc1VybFNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBVcGxvYWRGaWxlU2VydmljZS5yZXNvdXJjZUNoYW5nZWQobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAkc2NvcGUucmVzZXRGcm9tQ3VycmVudFN0ZXAoKTtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IFVwbG9hZEZpbGVTZXJ2aWNlLmdldFN0YXRlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5vblNob3dWYWxpZGF0aW9uUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmJvb3RzdHJhcE1vZGFsKCkuc2hvdygndmFsaWRhdGlvbi1yZXN1bHRzJyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIGV2ZW50cyA9IHtcbiAgICBNT0RBTF9PUEVOOiAnYm9vdHN0cmFwLW1vZGFsLm9wZW4nLFxuICAgIE1PREFMX0NMT1NFOiAnYm9vdHN0cmFwLW1vZGFsLmNsb3NlJ1xuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmRpcmVjdGl2ZSgnYm9vdHN0cmFwTW9kYWwnLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJHNjb3BlLiRvbihldmVudHMuTU9EQUxfT1BFTiwgZnVuY3Rpb24oZXZlbnQsIG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cignaWQnKSA9PSBtb2RhbElkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS4kb24oZXZlbnRzLk1PREFMX0NMT1NFLCBmdW5jdGlvbihldmVudCwgbW9kYWxJZCkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCdpZCcpID09IG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKVxuICAgIC5ydW4oW1xuICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmJvb3RzdHJhcE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyICRzY29wZSA9IHRoaXM7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNob3c6IGZ1bmN0aW9uKG1vZGFsSWQpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoZXZlbnRzLk1PREFMX09QRU4sIFttb2RhbElkXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24obW9kYWxJZCkge1xuICAgICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdChldmVudHMuTU9EQUxfQ0xPU0UsIFttb2RhbElkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmRpcmVjdGl2ZSgnbmdGaWxlU2VsZWN0ZWQnLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnJGNvbXBpbGUnLFxuICAgICAgZnVuY3Rpb24oJHRpbWVvdXQsICRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICAgdmFyIGxvY2FsU2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgbG9jYWxTY29wZS5maWxlcyA9IHRoaXMuZmlsZXM7XG4gICAgICAgICAgICAgIGVsZW1lbnQucmVwbGFjZVdpdGgoJGNvbXBpbGUoZWxlbWVudC5jbG9uZSgpKShzY29wZSkpO1xuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLiRldmFsKGF0dHIubmdGaWxlU2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuZmlsZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBvYmV1X3R5cGVzID0ge1xuICBcImFjY291bnRpbmdScmVjb3JkOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJmYWN0XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlXCJcbiAgfSwgXG4gIFwiYW1vdW50Om1lYXN1cmVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJudW1iZXJcIlxuICB9LCBcbiAgXCJidWRnZXRMaW5lOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJmYWN0XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjphcHByb3ZlZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpkcmFmdFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpleGVjdXRlZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpyZXZpc2VkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCJcbiAgfSwgXG4gIFwiYnVkZ2V0YXJ5VW5pdDpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImJ1ZGdldGFyeVVuaXQ6ZGltZW5zaW9uOm5hbWVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCJcbiAgfSwgXG4gIFwiY3VycmVuY3k6YXR0cmlidXRlOmlkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImVudGl0eVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJjdXJyZW5jeTphdHRyaWJ1dGU6bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJjdXJyZW5jeTpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImN1cnJlbmN5OmRpbWVuc2lvbjpuYW1lXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImVudGl0eVwiXG4gIH0sIFxuICBcImRhdGU6ZGltZW5zaW9uOmZpc2NhbFBlcmlvZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJkYXRldGltZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJkaXJlY3Rpb25cIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwib3RoZXJcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZmlzY2FsUGVyaW9kOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJkYXRldGltZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmaXNjYWxZZWFyOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcImRhdGVcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZGF0ZXRpbWVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJsYWJlbGZvclwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCJcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZVwiXG4gIH0sIFxuICBcImxvY2F0aW9uOmF0dHJpYnV0ZTppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwibG9jYXRpb246YXR0cmlidXRlOm5hbWVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCJcbiAgfSwgXG4gIFwib3BlcmF0aW9uQ2hhcmFjdGVyOmRpbWVuc2lvbjpleHBlbmRpdHVyZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcIm9wZXJhdGlvbkNoYXJhY3RlcjpkaW1lbnNpb246cmV2ZW51ZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcIm9yZ2FuaXphdGlvbjpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcIm9yZ2FuaXphdGlvbjpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJwYXJ0bmVyOmRpbWVuc2lvbjppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicGFydG5lcjpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGVcIlxuICB9LCBcbiAgXCJwcm9qZWN0OmRpbWVuc2lvbjppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvamVjdDpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJ0YXhlc0luY2x1ZGVkOmF0dHJpYnV0ZTpjb2RlXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCJcbiAgfSwgXG4gIFwidGF4ZXNJbmNsdWRlZDphdHRyaWJ1dGU6aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwib3RoZXJcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwidGF4ZXNJbmNsdWRlZDpkaW1lbnNpb246Y29kZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcInRheGVzSW5jbHVkZWQ6ZGltZW5zaW9uOmlkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH1cbn07XG5cbnZhciBPQkVVVHlwZXMgPSBjbGFzcyBUeXBlUHJvY2Vzc29yIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnR5cGVzID0gb2JldV90eXBlcztcbiAgICB9XG5cbiAgICBnZXRBbGxUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudHlwZXMpO1xuICAgIH1cblxuICAgIGF1dG9Db21wbGV0ZShwcmVmaXgpIHtcbiAgICAgICAgaWYgKCAhcHJlZml4ICkge1xuICAgICAgICAgICAgcHJlZml4ID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wdGlvbnMgPSBfLmZpbHRlcih0aGlzLmdldEFsbFR5cGVzKCksICh0eXApID0+IHtcbiAgICAgICAgICByZXR1cm4gXy5zdGFydHNXaXRoKHR5cCwgcHJlZml4KTtcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIHZhciBwcmVmaXhMZW4gPSBwcmVmaXgubGVuZ3RoO1xuICAgICAgICB2YXIgZmluZE5leHRJbmRleCA9ICh0eXApID0+IHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gcHJlZml4TGVuIDsgaSA8IHR5cC5sZW5ndGggOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBbaV0gPT0gXCI6XCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMgPSBfLm1hcChvcHRpb25zLCAodHlwKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gZmluZE5leHRJbmRleCh0eXApO1xuICAgICAgICAgICAgdmFyIHJldCA9IHR5cC5zbGljZSgwLG5leHRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIG5leHRJbmRleCA8IHR5cC5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHR5cFtuZXh0SW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfLnVuaXEob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgX2NoZWNrSW5wdXQoZmllbGRzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBnb3QgYW4gYXJyYXkuLi5cbiAgICAgICAgdmFyIHZhbGlkID0gXy5pc0FycmF5KGZpZWxkcykgfHwgdGhpcy5fZ2VuZXJhbEVycm9yKFwiRmllbGRzIHNob3VsZCBiZSBhbiBhcnJheVwiKTtcbiAgICAgICAgLy8gLi4uIG9mIG9iamVjdHMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiZcbiAgICAgICAgICAgIF8uZXZlcnkoZmllbGRzLCAoZikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmlzT2JqZWN0KGYpIHx8IHRoaXMuX2dlbmVyYWxFcnJvcihcIkZpZWxkIGl0ZW1zIHNob3VsZCBiZSBvYmplY3RzXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiB3aXRoIGFsbCB0aGUgbWFuZGF0b3J5IHByb3BlcnRpZXMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiZcbiAgICAgICAgICAgIF8uZXZlcnkoZmllbGRzLCAoZikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXy5oYXNJbihmLCAnbmFtZScpICYmIF8uaGFzSW4oZiwgJ3R5cGUnKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2VuZXJhbEVycm9yKFwiRmllbGQgaXRlbXMgc2hvdWxkIGhhdmUgJ25hbWUnIGFuZCAndHlwZSdcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gLi4uIGFuZCBubyB1bmtub3duIHByb3BlcnRpZXMgLi4uXG4gICAgICAgIHZhciBhbGxvd2VkUHJvcGVydGllcyA9IFtcbiAgICAgICAgICAgICduYW1lJywgJ3RpdGxlJywgJ3R5cGUnLCAnZm9ybWF0JywgJ2RhdGEnLCAnb3B0aW9ucycsICdyZXNvdXJjZScgIC8vIGNvbW1vbiBwcm9wZXJ0aWVzXG4gICAgICAgIF07XG4gICAgICAvKiAgdmFsaWQgPSB2YWxpZCAmJlxuICAgICAgICAgICAgXy5ldmVyeShmaWVsZHMsIChmKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBfLmRpZmZlcmVuY2UoXy5rZXlzKGYpLCBhbGxvd2VkUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkaWZmLmxlbmd0aCA9PSAwKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZEVycm9yKGYubmFtZSwgXCJHb3QgdW5rbm93biBwcm9wZXJ0aWVzIFwiK2RpZmYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiBhbmQgYWxsIHR5cGVzIGFyZSB2YWxpZCAuLi5cbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJlxuICAgICAgICAgICAgXy5ldmVyeShmaWVsZHMsIChmKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFmLnR5cGUgfHwgXy5oYXNJbih0aGlzLnR5cGVzLCBmLnR5cGUpIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpZWxkRXJyb3IoZi5uYW1lLCBcIkdvdCB1bmtub3duIHR5cGUgXCIgKyBmLnR5cGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiBhbmQgbm8gdW5rbm93biBhZGRpdGlvbmFsIG9wdGlvbnMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiYgXG4gICAgICAgICAgICBfLmV2ZXJ5KGZpZWxkcywgKGYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICFmLnR5cGUgKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICAgICAgdmFyIGFsbG93ZWRPcHRpb25zID0gXy51bmlvbihcbiAgICAgICAgICAgICAgICAgICAgXy5nZXQoZXh0cmFPcHRpb25zLCAnZGF0YVR5cGVzLicrdGhpcy50eXBlc1tmLnR5cGVdLmRhdGFUeXBlKycub3B0aW9ucycsIFtdKSxcbiAgICAgICAgICAgICAgICAgICAgXy5nZXQoZXh0cmFPcHRpb25zLCAnb2JldVR5cGVzLicrZi50eXBlKycub3B0aW9ucycsIFtdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYWxsb3dlZE9wdGlvbnMgPSBfLm1hcChhbGxvd2VkT3B0aW9ucywgJ25hbWUnKTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZ2V0KGYsICdvcHRpb25zJywge30pO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBfLmtleXMob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBfLmRpZmZlcmVuY2Uob3B0aW9ucywgYWxsb3dlZE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGlmZi5sZW5ndGggPT0gMCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmllbGRFcnJvcihmLm5hbWUsIFwiR290IHVua25vd24gb3B0aW9ucyBrZXkgXCIrZGlmZik7XG4gICAgICAgICAgICB9KTsqL1xuICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuXG4gICAgX3RpdGxlVG9TbHVnKHRpdGxlLCB0eXBlKSB7XG4gICAgICAgIHZhciBzbHVnUmUgPSBuZXcgUmVnRXhwKCdbYS16QS1aMC05XSsnLCdnJyk7XG4gICAgICAgIHZhciB2b3dlbHNSZSA9IG5ldyBSZWdFeHAoJ1thZWlvdV0rJywnZycpO1xuICAgICAgICB2YXIgc2x1Z3MgPSBfLmRlYnVycih0aXRsZSkubWF0Y2goc2x1Z1JlKTtcbiAgICAgICAgaWYgKCBzbHVncyA9PSBudWxsIHx8IHNsdWdzLmxlbmd0aCA9PSAwICkge1xuICAgICAgICAgICAgc2x1Z3MgPSBfLmpvaW4odHlwZS5zcGxpdCh2b3dlbHNSZSksJycpLm1hdGNoKHNsdWdSZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNsdWcgPSBfLmpvaW4oc2x1Z3MsICdfJyk7XG4gICAgICAgIGlmICggdGhpcy5hbGxOYW1lcy5pbmRleE9mKHNsdWcpID49IDAgKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoIHRydWUgKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF0dGVtcHQgPSBzbHVnICsgJ18nICsgaTtcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuYWxsTmFtZXMuaW5kZXhPZihhdHRlbXB0KSA8IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsdWcgPSBhdHRlbXB0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSs9MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsbE5hbWVzLnB1c2goc2x1ZylcbiAgICAgICAgcmV0dXJuIHNsdWc7XG4gICAgfVxuXG4gICAgX2luaXRFcnJvcnMoKSB7XG4gICAgICAgIHRoaXMuZXJyb3JzID0geyBnZW5lcmFsOiBbXSwgcGVyRmllbGQ6IHt9IH07XG4gICAgfVxuXG4gICAgX2dlbmVyYWxFcnJvcihlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMuZ2VuZXJhbC5wdXNoKGVycik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfZmllbGRFcnJvcihmaWVsZCwgZXJyKSB7XG4gICAgICAgIHZhciBmaWVsZEVycm9ycyA9IHRoaXMuZXJyb3JzLnBlckZpZWxkW2ZpZWxkXTtcbiAgICAgICAgaWYgKCFmaWVsZEVycm9ycykge1xuICAgICAgICAgICAgZmllbGRFcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnBlckZpZWxkW2ZpZWxkXSA9IGZpZWxkRXJyb3JzO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkRXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qX2VtYmVkT3B0aW9ucyh0YXJnZXQsIG9wdGlvbnMsIGF2YWlsYWJsZU9wdGlvbnMpIHtcbiAgICAgICAgXy5mb3JFYWNoKGF2YWlsYWJsZU9wdGlvbnMsIChhdmFpbGFibGVPcHRpb24pID0+IHtcbiAgICAgICAgICAgIHZhciBuID0gYXZhaWxhYmxlT3B0aW9uLm5hbWU7XG4gICAgICAgICAgICBpZiAoXy5oYXNJbihvcHRpb25zLCBuKSAmJiBvcHRpb25zW25dKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25dID0gb3B0aW9uc1tuXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5oYXNJbihhdmFpbGFibGVPcHRpb24sICdkZWZhdWx0VmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuXSA9IGF2YWlsYWJsZU9wdGlvbi5kZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICBcbiAgICB9Ki9cblxuICAgIGZpZWxkc1RvTW9kZWwoZmllbGRzKSB7XG4gICAgICAgIC8vIFByZXBhcmUgZXJyb3JzXG4gICAgICAgIHRoaXMuX2luaXRFcnJvcnMoKTtcbiAgICAgICAgLy8gRGV0ZWN0IGludmFsaWQgZGF0YVxuICAgICAgICBpZiAoICF0aGlzLl9jaGVja0lucHV0KGZpZWxkcykgKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0ge2Vycm9yczogdGhpcy5lcnJvcnN9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmV0LG51bGwsMikpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICAvLyBNb2RlbGxpbmdcbiAgICAgICAgdmFyIGRpbWVuc2lvbnMgPSB7fTtcbiAgICAgICAgdmFyIG1lYXN1cmVzID0ge307XG4gICAgICAgIHZhciBtb2RlbCA9IHsgZGltZW5zaW9ucywgbWVhc3VyZXMgfTtcbiAgICAgICAgdmFyIHNjaGVtYSA9IHtmaWVsZHM6e30sIHByaW1hcnlLZXk6W119O1xuICAgICAgICB0aGlzLmFsbE5hbWVzID0gW107XG4gICAgICAgIF8uZm9yRWFjaChfLmZpbHRlcihmaWVsZHMsIChmKSA9PiB7IHJldHVybiAhIWYudHlwZTsgfSksIChmKSA9PiB7XG4gICAgICAgICAgICB2YXIgb2JldVR5cGUgPSB0aGlzLnR5cGVzW2YudHlwZV07XG4gICAgICAgICAgICBpZiAoIWYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICBmLnRpdGxlID0gZi5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZi5zbHVnID0gdGhpcy5fdGl0bGVUb1NsdWcoZi50aXRsZSwgZi50eXBlKTtcbiAgICAgICAgICAgIHZhciBjb25jZXB0VHlwZSA9IF8uc3BsaXQoZi50eXBlLCc6JylbMF07XG4gICAgICAgICAgICBzY2hlbWEuZmllbGRzW2YudGl0bGVdID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBmLnRpdGxlLFxuICAgICAgICAgICAgICAgIG5hbWU6IGYubmFtZSxcbiAgICAgICAgICAgICAgICBzbHVnOiBmLnNsdWcsXG4gICAgICAgICAgICAgICAgdHlwZTogb2JldVR5cGUuZGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBvYmV1VHlwZS5mb3JtYXQgfHwgZi5mb3JtYXQgfHwgJ2RlZmF1bHQnLFxuICAgICAgICAgICAgICAgIG9iZXVUeXBlOiBmLnR5cGUsXG4gICAgICAgICAgICAgICAgY29uY2VwdFR5cGU6IGNvbmNlcHRUeXBlLFxuICAgICAgICAgICAgICAgIHJlc291cmNlOiBmLnJlc291cmNlLCBcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXSAvKiBfLnVuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZ2V0KGV4dHJhT3B0aW9ucywgJ2RhdGFUeXBlcy4nK29iZXVUeXBlLmRhdGFUeXBlKycub3B0aW9ucycsIFtdKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5nZXQoZXh0cmFPcHRpb25zLCAnb2JldVR5cGVzLicrZi50eXBlKycub3B0aW9ucycsIFtdKVxuICAgICAgICAgICAgICAgICkgKi9cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgLy8gIHRoaXMuX2VtYmVkT3B0aW9ucyhzY2hlbWEuZmllbGRzW2YudGl0bGVdLCBmLm9wdGlvbnMsIF8uZ2V0KGV4dHJhT3B0aW9ucywgJ2RhdGFUeXBlcy4nK29iZXVUeXBlLmRhdGFUeXBlKycub3B0aW9ucycsIFtdKSk7XG5cbiAgICAgICAgICAgIGlmICggY29uY2VwdFR5cGUgPT0gJ3ZhbHVlJyApIHsgLy9uZXZlciBleGVjdXRlZFxuICAgICAgICAgICAgICAgIC8vIE1lYXN1cmVcbiAgICAgICAgICAgICAgICB2YXIgbWVhc3VyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBmLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmLnRpdGxlXG4gICAgICAgICAgICAgICAgXHR9XG4gICAgICAgICAgICAgICAgLy8gRXh0cmEgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIGlmIChmLnJlc291cmNlKSAgICAgICAgICB7IG1lYXN1cmUucmVzb3VyY2UgPSBmLnJlc291cmNlOyB9XG4gICAgICAgICAgICAgIC8vICB0aGlzLl9lbWJlZE9wdGlvbnMobWVhc3VyZSwgZi5vcHRpb25zLCBfLmdldChleHRyYU9wdGlvbnMsICdvYmV1VHlwZXMuYW1vdW50Lm9wdGlvbnMnLCBbXSkpO1xuICAgICAgICAgICAgICAgIG1lYXN1cmVzW2Yuc2x1Z10gPSBtZWFzdXJlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZGltZW5zaW9uO1xuICAgICAgICAgICAgICAgIGlmICggXy5oYXNJbihkaW1lbnNpb25zLCBjb25jZXB0VHlwZSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbiA9IGRpbWVuc2lvbnNbY29uY2VwdFR5cGVdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvblR5cGU6IG9iZXVUeXBlLmRpbWVuc2lvblR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5S2V5OiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIG9iZXVUeXBlLmNsYXNzaWZpY2F0aW9uVHlwZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbi5jbGFzc2lmaWNhdGlvblR5cGUgPSBvYmV1VHlwZS5jbGFzc2lmaWNhdGlvblR5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGltZW5zaW9uc1tjb25jZXB0VHlwZV0gPSBkaW1lbnNpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZi50aXRsZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKCBmLnJlc291cmNlICkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUucmVzb3VyY2UgPSBmLnJlc291cmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaW1lbnNpb24uYXR0cmlidXRlc1tmLnNsdWddID0gYXR0cmlidXRlO1xuICAgICAgICAgICAgICAgIGlmIChvYmV1VHlwZS51bmlxdWVJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbi5wcmltYXJ5S2V5LnB1c2goZi5zbHVnKTtcbiAgICAgICAgICAgICAgICAgICAgc2NoZW1hLnByaW1hcnlLZXkucHVzaChmLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFByb2Nlc3MgcGFyZW50LCBsYWJlbGZvclxuICAgICAgICB2YXIgZmluZEF0dHJpYnV0ZSA9IChmaWVsZCwgb2JldVR5cGUpID0+IHtcbiAgICAgICAgICAgIGlmICggZmllbGQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtrZXk6ZmllbGQuc2x1ZywgYXR0cjpkaW1lbnNpb25zW2ZpZWxkLmNvbmNlcHRUeXBlXS5hdHRyaWJ1dGVzW2ZpZWxkLnNsdWddfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggb2JldVR5cGUgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gXy5maW5kKF8udmFsdWVzKHNjaGVtYS5maWVsZHMpLCAoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5zdGFydHNXaXRoKGkub2JldVR5cGUsIG9iZXVUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmluZEF0dHJpYnV0ZShmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIF8uZm9yRWFjaChfLnZhbHVlcyhzY2hlbWEuZmllbGRzKSwgKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICB2YXIgb2JldVR5cGUgPSB0aGlzLnR5cGVzW2ZpZWxkLm9iZXVUeXBlXTtcbiAgICAgICAgICAgIHZhciBsYWJlbGZvciA9IG9iZXVUeXBlLmxhYmVsZm9yO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IG9iZXVUeXBlLnBhcmVudDtcbiAgICAgICAgICAgIGlmICggbGFiZWxmb3IgfHwgcGFyZW50ICkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBmaW5kQXR0cmlidXRlKGZpZWxkKS5hdHRyO1xuICAgICAgICAgICAgICAgIGlmICggbGFiZWxmb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRBdHRyaWJ1dGUgPSBmaW5kQXR0cmlidXRlKG51bGwsIGxhYmVsZm9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0YXJnZXRBdHRyaWJ1dGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubGFiZWxmb3IgPSB0YXJnZXRBdHRyaWJ1dGUua2V5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICggcGFyZW50ICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0QXR0cmlidXRlID0gZmluZEF0dHJpYnV0ZShudWxsLCBwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHRhcmdldEF0dHJpYnV0ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5wYXJlbnQgPSB0YXJnZXRBdHRyaWJ1dGUua2V5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gRml4IHByaW1hcnkga2V5cyBpbiBjYXNlIHRoZXkncmUgbWlzc2luZ1xuICAgICAgICBfLmZvckVhY2gobW9kZWwuZGltZW5zaW9ucywgKGRpbWVuc2lvbikgPT4ge1xuICAgICAgICAgICBpZiAoZGltZW5zaW9uLnByaW1hcnlLZXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgIGRpbWVuc2lvbi5wcmltYXJ5S2V5ID0gXy5rZXlzKGRpbWVuc2lvbi5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZmRwID0ge21vZGVsLCBzY2hlbWF9O1xuICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGZkcCxudWxsLDIpKTtcbiAgICAgICAgcmV0dXJuIGZkcDtcbiAgICB9XG59O1xuXG4vL3ZhciBPQkVVVHlwZXMgPSByZXF1aXJlKCdvYmV1LXR5cGVzJyk7XG5cblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZGlyZWN0aXZlKCdvYmV1RGF0YXR5cGUnLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RpcmVjdGl2ZXMvb2JldS1kYXRhdHlwZS5odG1sJyxcbiAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgICB2YXIgc3VnZyA9ICcnO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNldFN1Z2c6IGZ1bmN0aW9uKF9zdWdnKSB7XG4gICAgICAgICAgICAgICAgICBzdWdnID0gX3N1Z2c7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFN1Z2c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z2c7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpc0luY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZW5kc1dpdGgoc3VnZywgJzonKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldFZhbDogZnVuY3Rpb24odmFsLCBjbGVhcikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5maWVsZC5vYmV1VHlwZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgIGlmIChjbGVhcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHRoaXMub25DaGFuZ2VkKCk7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICdvYmV1Q3RybCcsXG4gICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgZmllbGQ6ICc9JyxcbiAgICAgICAgICAgIG9uQ2hhbmdlZDogJyYnXG4gICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0ciwgb2JldUN0cmwpIHtcblx0XHR2YXIgbGFiZWwgPSBlbGVtZW50LmZpbmQoJy5jb250cm9sLWxhYmVsJylbMF07XG5cdFx0aWYgKGxhYmVsLmlubmVySFRNTCA9PT0gJ09iZXVEYXRhVHlwZScpe1xuXHRcdCAgICBjb25zb2xlLmxvZygnaW4gb2JldS1kYXRhdHlwZS5qcycpO1xuXHRcdCAgICB2YXIgaW5wdXQgPSBlbGVtZW50LmZpbmQoJy50eXBlYWhlYWQnKVswXTtcblx0XHQgICAgdmFyIGNsZWFyID0gZWxlbWVudC5maW5kKCcuY2xlYXInKVswXTtcblx0XHQgICAgdmFyIG90ID0gbmV3IE9CRVVUeXBlcygpO1xuXHRcdCAgICB2YXIgc2VwID0gJyDina8gJztcblx0XHQgICAgJChpbnB1dCkudHlwZWFoZWFkKHtcblx0XHRcdG1pbkxlbmd0aDogMCxcblx0XHRcdGhpZ2hsaWdodDogdHJ1ZVxuXHRcdCAgICB9LCB7XG5cdFx0XHRsaW1pdDogMTAwLFxuXHRcdFx0c291cmNlOiBmdW5jdGlvbihxdWVyeSwgc3luYykge1xuXHRcdFx0ICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShuZXcgUmVnRXhwKHNlcCwnZycpLCc6Jyk7XG5cdFx0XHQgICAgc3luYyhfLm1hcChvdC5hdXRvQ29tcGxldGUocXVlcnkpLCBmdW5jdGlvbihzdWdnKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCAgICB2YWw6IHN1Z2csXG5cdFx0XHRcdCAgICB0ZXh0OiBfLnRyaW1FbmQoc3VnZywgJzonKS5yZXBsYWNlKC86L2csc2VwKSxcblx0XHRcdFx0ICAgIGxlYWY6IF8ubGFzdChzdWdnKSAhPSAnOidcblx0XHRcdFx0fTtcblx0XHRcdCAgICB9KSk7XG5cdFx0XHR9LFxuXHRcdFx0ZGlzcGxheTogZnVuY3Rpb24oc3VnZykge1xuXHRcdFx0ICAgIHJldHVybiBzdWdnLnRleHQ7XG5cdFx0XHR9LFxuXHRcdFx0dGVtcGxhdGVzOiB7XG5cdFx0XHQgICAgc3VnZ2VzdGlvbjogZnVuY3Rpb24oc3VnZykge1xuXHRcdFx0XHR2YXIgc3VmZml4O1xuXHRcdFx0XHRpZiAoIXN1Z2cubGVhZikge1xuXHRcdFx0XHQgICAgc3VmZml4ID0gJyDina8gJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICAgIHN1ZmZpeCA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciByZXQgPSBfLmxhc3QoXy5zcGxpdChzdWdnLnRleHQsIHNlcCkpICsgc3VmZml4O1xuXHRcdFx0XHRyZXR1cm4gJzxkaXY+JyArIHJldCArICc8L2Rpdj4nO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblx0XHQgICAgfSk7XG5cdFx0ICAgIGlmIChvYmV1Q3RybC5maWVsZC5vYmV1VHlwZSkge1xuXHRcdFx0b2JldUN0cmwuc2V0U3VnZyhvYmV1Q3RybC5maWVsZC5vYmV1VHlwZSk7XG5cdFx0XHQkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsIG9iZXVDdHJsLmZpZWxkLm9iZXVUeXBlLnJlcGxhY2UoLzovZyxzZXApKTtcblx0XHRcdG9iZXVDdHJsLnNldFZhbChvYmV1Q3RybC5maWVsZC5vYmV1VHlwZSwgZmFsc2UpO1xuXHRcdCAgICB9XG5cdFx0ICAgICQoaW5wdXQpLmJpbmQoJ3R5cGVhaGVhZDpzZWxlY3QnLCBmdW5jdGlvbihldiwgc3VnZykge1xuXHRcdFx0b2JldUN0cmwuc2V0U3VnZyhzdWdnLnZhbCk7XG5cdFx0XHRpZiAoIXN1Z2cubGVhZikge1xuXHRcdFx0ICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsIHN1Z2cudGV4dCArIHNlcCk7XG5cdFx0XHRcdCQoaW5wdXQpLnR5cGVhaGVhZCgnb3BlbicpO1xuXHRcdFx0ICAgIH0sIDEwMCk7XG5cdFx0XHQgICAgJHNjb3BlLiRhcHBseUFzeW5jKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0ICAgIG9iZXVDdHJsLnNldFZhbChzdWdnLnZhbCwgdHJ1ZSk7XG5cdFx0XHQgICAgJHNjb3BlLiRhcHBseUFzeW5jKCk7XG5cdFx0XHR9XG5cdFx0ICAgIH0pO1xuXHRcdCAgICAkKGNsZWFyKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JChpbnB1dCkudHlwZWFoZWFkKCd2YWwnLCcnKTtcblx0XHRcdG9iZXVDdHJsLnNldFN1Z2coJycpO1xuXHRcdFx0b2JldUN0cmwuc2V0VmFsKCcnLCB0cnVlKTtcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBPU1R5cGVzID0gcmVxdWlyZSgnb3MtdHlwZXMnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmRpcmVjdGl2ZSgnb3NEYXRhdHlwZScsIFtcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9vcy1kYXRhdHlwZS5odG1sJyxcbiAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgICB2YXIgc3VnZyA9ICcnO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNldFN1Z2c6IGZ1bmN0aW9uKF9zdWdnKSB7XG4gICAgICAgICAgICAgICAgICBzdWdnID0gX3N1Z2c7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFN1Z2c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Z2c7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpc0luY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZW5kc1dpdGgoc3VnZywgJzonKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldFZhbDogZnVuY3Rpb24odmFsLCBjbGVhcikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5maWVsZC50eXBlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmllbGQub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcbiAgICAgICAgICAgIGZpZWxkOiAnPScsXG4gICAgICAgICAgICBvbkNoYW5nZWQ6ICcmJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcblx0XHR2YXIgbGFiZWwgPSBlbGVtZW50LmZpbmQoJy5jb250cm9sLWxhYmVsJylbMF07XG5cdFx0aWYgKGxhYmVsLmlubmVySFRNTCA9PT0gJ09zRGF0YVR5cGUnKXtcblx0XHQgICAgY29uc29sZS5sb2coJ2luIG9zLWRhdGF0eXBlLmpzJyk7XG5cdFx0ICAgIHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnLnR5cGVhaGVhZCcpWzBdO1xuXHRcdCAgICB2YXIgY2xlYXIgPSBlbGVtZW50LmZpbmQoJy5jbGVhcicpWzBdO1xuXHRcdCAgICB2YXIgb3QgPSBuZXcgT1NUeXBlcygpO1xuXHRcdCAgICB2YXIgc2VwID0gJyDina8gJztcblx0XHQgICAgJChpbnB1dCkudHlwZWFoZWFkKHtcblx0XHRcdG1pbkxlbmd0aDogMCxcblx0XHRcdGhpZ2hsaWdodDogdHJ1ZVxuXHRcdCAgICB9LCB7XG5cdFx0XHRsaW1pdDogMTAwLFxuXHRcdFx0c291cmNlOiBmdW5jdGlvbihxdWVyeSwgc3luYykge1xuXHRcdFx0ICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShuZXcgUmVnRXhwKHNlcCwnZycpLCc6Jyk7XG5cdFx0XHQgICAgc3luYyhfLm1hcChvdC5hdXRvQ29tcGxldGUocXVlcnkpLCBmdW5jdGlvbihzdWdnKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCAgICB2YWw6IHN1Z2csXG5cdFx0XHRcdCAgICB0ZXh0OiBfLnRyaW1FbmQoc3VnZywgJzonKS5yZXBsYWNlKC86L2csc2VwKSxcblx0XHRcdFx0ICAgIGxlYWY6IF8ubGFzdChzdWdnKSAhPSAnOidcblx0XHRcdFx0fTtcblx0XHRcdCAgICB9KSk7XG5cdFx0XHR9LFxuXHRcdFx0ZGlzcGxheTogZnVuY3Rpb24oc3VnZykge1xuXHRcdFx0ICAgIHJldHVybiBzdWdnLnRleHQ7XG5cdFx0XHR9LFxuXHRcdFx0dGVtcGxhdGVzOiB7XG5cdFx0XHQgICAgc3VnZ2VzdGlvbjogZnVuY3Rpb24oc3VnZykge1xuXHRcdFx0XHR2YXIgc3VmZml4O1xuXHRcdFx0XHRpZiAoIXN1Z2cubGVhZikge1xuXHRcdFx0XHQgICAgc3VmZml4ID0gJyDina8gJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICAgIHN1ZmZpeCA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciByZXQgPSBfLmxhc3QoXy5zcGxpdChzdWdnLnRleHQsIHNlcCkpICsgc3VmZml4O1xuXHRcdFx0XHRyZXR1cm4gJzxkaXY+JyArIHJldCArICc8L2Rpdj4nO1xuXHRcdFx0ICAgIH1cblx0XHRcdH1cblx0XHQgICAgfSk7XG5cdFx0ICAgIGlmIChjdHJsLmZpZWxkLnR5cGUpIHtcblx0XHRcdGN0cmwuc2V0U3VnZyhjdHJsLmZpZWxkLnR5cGUpO1xuXHRcdFx0JChpbnB1dCkudHlwZWFoZWFkKCd2YWwnLCBjdHJsLmZpZWxkLnR5cGUucmVwbGFjZSgvOi9nLHNlcCkpO1xuXHRcdFx0Y3RybC5zZXRWYWwoY3RybC5maWVsZC50eXBlLCBmYWxzZSk7XG5cdFx0ICAgIH1cblx0XHQgICAgJChpbnB1dCkuYmluZCgndHlwZWFoZWFkOnNlbGVjdCcsIGZ1bmN0aW9uKGV2LCBzdWdnKSB7XG5cdFx0XHRjdHJsLnNldFN1Z2coc3VnZy52YWwpO1xuXHRcdFx0aWYgKCFzdWdnLmxlYWYpIHtcblx0XHRcdCAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JChpbnB1dCkudHlwZWFoZWFkKCd2YWwnLCBzdWdnLnRleHQgKyBzZXApO1xuXHRcdFx0XHQkKGlucHV0KS50eXBlYWhlYWQoJ29wZW4nKTtcblx0XHRcdCAgICB9LCAxMDApO1xuXHRcdFx0ICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdGN0cmwuc2V0VmFsKHN1Z2cudmFsLCB0cnVlKTtcblx0XHRcdCAgICAkc2NvcGUuJGFwcGx5QXN5bmMoKTtcblx0XHRcdH1cblx0XHQgICAgfSk7XG5cdFx0ICAgICQoY2xlYXIpLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKGlucHV0KS50eXBlYWhlYWQoJ3ZhbCcsJycpO1xuXHRcdFx0Y3RybC5zZXRTdWdnKCcnKTtcblx0XHRcdGN0cmwuc2V0VmFsKCcnLCB0cnVlKTtcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuICAgIFxufSkoYW5ndWxhcik7XG4gIFxuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpO1xuXG4gIGFwcC5kaXJlY3RpdmUoJ3BvcG92ZXInLCBbXG4gICAgJyRjb21waWxlJyxcbiAgICBmdW5jdGlvbigkY29tcGlsZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGVtcGxhdGU6ICcnLFxuICAgICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIGlkID0gJ2FuZ3VsYXItcG9wb3Zlci0nICsgRGF0ZS5ub3coKSArICctJyArXG4gICAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTtcblxuICAgICAgICAgIGVsZW1lbnQucG9wb3Zlcih7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgICAgIHRyaWdnZXI6ICdmb2N1cycsXG4gICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICQoYXR0cnMucG9wb3ZlcikuaHRtbCgpICsgJzxkaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsZW1lbnQub24oJ3Nob3duLmJzLnBvcG92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRjb21waWxlKCQoJyMnICsgaWQpKSgkc2NvcGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgXSk7XG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhciwgdW5kZWZpbmVkKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZGlyZWN0aXZlKCdwcm9ncmVzc0JhcicsIFtcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICB2YWx1ZTogJ0AnLFxuICAgICAgICAgICAgbGFiZWw6ICdAJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZGlyZWN0aXZlcy9wcm9ncmVzcy5odG1sJyxcbiAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gcGFyc2VGbG9hdChuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRmluaXRlKG5ld1ZhbHVlKSAmJiAobmV3VmFsdWUgPj0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudmFsdWUgPSAwLjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdmaWVsZENvbmNlcHRzJywgW1xuICAgICAgJ18nLFxuICAgICAgZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZmllbGQuYWxsb3dlZENvbmNlcHRzO1xuICAgICAgICAgIGlmICghIWZpZWxkLnR5cGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IF8uZmlsdGVyKHJlc3VsdCwgZnVuY3Rpb24oY29uY2VwdCkge1xuICAgICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyhjb25jZXB0LmFsbG93ZWRUeXBlcywgZmllbGQudHlwZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKVxuICAgIC5maWx0ZXIoJ2ZpZWxkVHlwZXMnLCBbXG4gICAgICAnXycsICdVdGlsc1NlcnZpY2UnLFxuICAgICAgZnVuY3Rpb24oXywgVXRpbHNTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBmaWVsZC5hbGxvd2VkVHlwZXM7XG4gICAgICAgICAgaWYgKCEhZmllbGQuY29uY2VwdCkge1xuICAgICAgICAgICAgdmFyIGNvbmNlcHQgPSBVdGlsc1NlcnZpY2UuZmluZENvbmNlcHQoZmllbGQuY29uY2VwdCk7XG4gICAgICAgICAgICByZXN1bHQgPSBfLmZpbHRlcihyZXN1bHQsIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoY29uY2VwdC5hbGxvd2VkVHlwZXMsIHR5cGUuaWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdodG1sJywgW1xuICAgICAgJyRzY2UnLFxuICAgICAgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChpbnB1dCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdqb2luJywgW1xuICAgICAgJ18nLFxuICAgICAgZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHNlcGFyYXRvcikge1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIoaW5wdXQpLmpvaW4oc2VwYXJhdG9yIHx8ICcsICcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmlsdGVyKCdudW1iZXJGb3JtYXQnLCBbXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBmcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICAgIGlucHV0ID0gcGFyc2VGbG9hdChpbnB1dCk7XG4gICAgICAgICAgaWYgKCFpc0Zpbml0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gMC4wO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmcmFjdGlvbkRpZ2l0cyA9IHBhcnNlRmxvYXQoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgIGlmIChpc0Zpbml0ZShmcmFjdGlvbkRpZ2l0cykgJiYgKGZyYWN0aW9uRGlnaXRzID49IDEpKSB7XG4gICAgICAgICAgICBmcmFjdGlvbkRpZ2l0cyA9IE1hdGguZmxvb3IoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXC4/MCokLywnJyk7IC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChpbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ0FwcGxpY2F0aW9uTG9hZGVyJywgW1xuICAgICAgJyRxJywgJ1V0aWxzU2VydmljZScsICdTdG9yYWdlU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkcSwgVXRpbHNTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgICAgICB2YXIgcHJvbWlzZXMgPSBbXG4gICAgICAgICAgLy8gUHJlbG9hZCBjb250aW5lbnRzIGFuZCBjb3VudHJpZXNcbiAgICAgICAgICBVdGlsc1NlcnZpY2UuZ2V0Q3VycmVuY2llcygpLiRwcm9taXNlLFxuICAgICAgICAgIFV0aWxzU2VydmljZS5nZXRDb250aW5lbnRzKCkuJHByb21pc2UsXG4gICAgICAgICAgVXRpbHNTZXJ2aWNlLmdldENvdW50cmllcygpLiRwcm9taXNlLFxuXG4gICAgICAgICAgLy8gUmVzdG9yZSBhcHAgc3RhdGVcbiAgICAgICAgICBTdG9yYWdlU2VydmljZS5yZXN0b3JlQXBwbGljYXRpb25TdGF0ZSgpXG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHt9KTsgLy8gRm9yY2UgZXhlY3V0ZVxuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsInZhciBvYmV1X3R5cGVzID0ge1xuICBcImFjY291bnRpbmdScmVjb3JkOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJmYWN0XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCJcbiAgfSwgXG4gIFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJhZG1pbmlzdHJhdGl2ZS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImFkbWluaXN0cmF0aXZlLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiYWRtaW5pc3RyYXRpdmUtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlXCJcbiAgfSwgXG4gIFwiYW1vdW50Om1lYXN1cmVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJudW1iZXJcIlxuICB9LCBcbiAgXCJidWRnZXRMaW5lOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJmYWN0XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjphcHByb3ZlZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpkcmFmdFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpleGVjdXRlZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcImJ1ZGdldFBoYXNlOmRpbWVuc2lvbjpyZXZpc2VkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCJcbiAgfSwgXG4gIFwiYnVkZ2V0YXJ5VW5pdDpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImJ1ZGdldGFyeVVuaXQ6ZGltZW5zaW9uOm5hbWVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCJcbiAgfSwgXG4gIFwiY3VycmVuY3k6YXR0cmlidXRlOmlkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImVudGl0eVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJjdXJyZW5jeTphdHRyaWJ1dGU6bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJjdXJyZW5jeTpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImN1cnJlbmN5OmRpbWVuc2lvbjpuYW1lXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImVudGl0eVwiXG4gIH0sIFxuICBcImRhdGU6ZGltZW5zaW9uOmZpc2NhbFBlcmlvZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJkYXRldGltZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJkaXJlY3Rpb25cIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwib3RoZXJcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpjb2RlXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImVjb25vbWljXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZWNvbm9taWMtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJlY29ub21pY1wiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJlY29ub21pYy1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZmlzY2FsUGVyaW9kOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJkYXRldGltZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmaXNjYWxZZWFyOmRpbWVuc2lvblwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcImRhdGVcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZGF0ZXRpbWVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlOmZ1bGxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6ZGVzY3JpcHRpb25cIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcImxhYmVsZm9yXCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlOnBhcnRcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmRlc2NyaXB0aW9uXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJsYWJlbGZvclwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCJcbiAgfSwgXG4gIFwiZnVuY3Rpb25hbC1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZVwiLCBcbiAgICBcInVuaXF1ZUlkZW50aWZpZXJcIjogdHJ1ZVxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcImZ1bmN0aW9uYWxcIiwgXG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJjbGFzc2lmaWNhdGlvblwiLCBcbiAgICBcInBhcmVudFwiOiBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcImZ1bmN0aW9uYWwtY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJmdW5jdGlvbmFsXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6bGFiZWxcIjoge1xuICAgIFwiY2xhc3NpZmljYXRpb25UeXBlXCI6IFwiZnVuY3Rpb25hbFwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJmdW5jdGlvbmFsLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZVwiXG4gIH0sIFxuICBcImxvY2F0aW9uOmF0dHJpYnV0ZTppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwibG9jYXRpb246YXR0cmlidXRlOm5hbWVcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCJcbiAgfSwgXG4gIFwib3BlcmF0aW9uQ2hhcmFjdGVyOmRpbWVuc2lvbjpleHBlbmRpdHVyZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcIm9wZXJhdGlvbkNoYXJhY3RlcjpkaW1lbnNpb246cmV2ZW51ZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcIm9yZ2FuaXphdGlvbjpkaW1lbnNpb246aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiZW50aXR5XCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcIm9yZ2FuaXphdGlvbjpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJwYXJ0bmVyOmRpbWVuc2lvbjppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicGFydG5lcjpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246Y29kZTpmdWxsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmNvZGU6cGFydFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxhYmVsXCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDE6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMTpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDI6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwxOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMjpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDM6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwyOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIlxuICB9LCBcbiAgXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGU6ZnVsbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwicGFyZW50XCI6IFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsMzpjb2RlXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH0sIFxuICBcInByb2dyYW1tLWNsYXNzaWZpY2F0aW9uOmRpbWVuc2lvbjpsZXZlbDQ6Y29kZTpwYXJ0XCI6IHtcbiAgICBcImNsYXNzaWZpY2F0aW9uVHlwZVwiOiBcInByb2dyYW1tXCIsIFxuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwiY2xhc3NpZmljYXRpb25cIiwgXG4gICAgXCJwYXJlbnRcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWwzOmNvZGVcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpkZXNjcmlwdGlvblwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCJcbiAgfSwgXG4gIFwicHJvZ3JhbW0tY2xhc3NpZmljYXRpb246ZGltZW5zaW9uOmxldmVsNDpsYWJlbFwiOiB7XG4gICAgXCJjbGFzc2lmaWNhdGlvblR5cGVcIjogXCJwcm9ncmFtbVwiLCBcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcImNsYXNzaWZpY2F0aW9uXCIsIFxuICAgIFwibGFiZWxmb3JcIjogXCJwcm9ncmFtbS1jbGFzc2lmaWNhdGlvbjpkaW1lbnNpb246bGV2ZWw0OmNvZGVcIlxuICB9LCBcbiAgXCJwcm9qZWN0OmRpbWVuc2lvbjppZFwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwicHJvamVjdDpkaW1lbnNpb246bmFtZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJlbnRpdHlcIlxuICB9LCBcbiAgXCJ0YXhlc0luY2x1ZGVkOmF0dHJpYnV0ZTpjb2RlXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCJcbiAgfSwgXG4gIFwidGF4ZXNJbmNsdWRlZDphdHRyaWJ1dGU6aWRcIjoge1xuICAgIFwiZGF0YVR5cGVcIjogXCJzdHJpbmdcIiwgXG4gICAgXCJkaW1lbnNpb25UeXBlXCI6IFwib3RoZXJcIiwgXG4gICAgXCJ1bmlxdWVJZGVudGlmaWVyXCI6IHRydWVcbiAgfSwgXG4gIFwidGF4ZXNJbmNsdWRlZDpkaW1lbnNpb246Y29kZVwiOiB7XG4gICAgXCJkYXRhVHlwZVwiOiBcInN0cmluZ1wiLCBcbiAgICBcImRpbWVuc2lvblR5cGVcIjogXCJvdGhlclwiXG4gIH0sIFxuICBcInRheGVzSW5jbHVkZWQ6ZGltZW5zaW9uOmlkXCI6IHtcbiAgICBcImRhdGFUeXBlXCI6IFwic3RyaW5nXCIsIFxuICAgIFwiZGltZW5zaW9uVHlwZVwiOiBcIm90aGVyXCIsIFxuICAgIFwidW5pcXVlSWRlbnRpZmllclwiOiB0cnVlXG4gIH1cbn07XG5cbnZhciBPQkVVVHlwZXMgPSBjbGFzcyBUeXBlUHJvY2Vzc29yIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnR5cGVzID0gb2JldV90eXBlcztcbiAgICB9XG5cbiAgICBnZXRBbGxUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudHlwZXMpO1xuICAgIH1cblxuICAgIGF1dG9Db21wbGV0ZShwcmVmaXgpIHtcbiAgICAgICAgaWYgKCAhcHJlZml4ICkge1xuICAgICAgICAgICAgcHJlZml4ID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wdGlvbnMgPSBfLmZpbHRlcih0aGlzLmdldEFsbFR5cGVzKCksICh0eXApID0+IHtcbiAgICAgICAgICByZXR1cm4gXy5zdGFydHNXaXRoKHR5cCwgcHJlZml4KTtcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIHZhciBwcmVmaXhMZW4gPSBwcmVmaXgubGVuZ3RoO1xuICAgICAgICB2YXIgZmluZE5leHRJbmRleCA9ICh0eXApID0+IHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gcHJlZml4TGVuIDsgaSA8IHR5cC5sZW5ndGggOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBbaV0gPT0gXCI6XCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMgPSBfLm1hcChvcHRpb25zLCAodHlwKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gZmluZE5leHRJbmRleCh0eXApO1xuICAgICAgICAgICAgdmFyIHJldCA9IHR5cC5zbGljZSgwLG5leHRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIG5leHRJbmRleCA8IHR5cC5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHR5cFtuZXh0SW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfLnVuaXEob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgX2NoZWNrSW5wdXQoZmllbGRzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBnb3QgYW4gYXJyYXkuLi5cbiAgICAgICAgdmFyIHZhbGlkID0gXy5pc0FycmF5KGZpZWxkcykgfHwgdGhpcy5fZ2VuZXJhbEVycm9yKFwiRmllbGRzIHNob3VsZCBiZSBhbiBhcnJheVwiKTtcbiAgICAgICAgLy8gLi4uIG9mIG9iamVjdHMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiZcbiAgICAgICAgICAgIF8uZXZlcnkoZmllbGRzLCAoZikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmlzT2JqZWN0KGYpIHx8IHRoaXMuX2dlbmVyYWxFcnJvcihcIkZpZWxkIGl0ZW1zIHNob3VsZCBiZSBvYmplY3RzXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiB3aXRoIGFsbCB0aGUgbWFuZGF0b3J5IHByb3BlcnRpZXMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiZcbiAgICAgICAgICAgIF8uZXZlcnkoZmllbGRzLCAoZikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXy5oYXNJbihmLCAnbmFtZScpICYmIF8uaGFzSW4oZiwgJ3R5cGUnKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2VuZXJhbEVycm9yKFwiRmllbGQgaXRlbXMgc2hvdWxkIGhhdmUgJ25hbWUnIGFuZCAndHlwZSdcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gLi4uIGFuZCBubyB1bmtub3duIHByb3BlcnRpZXMgLi4uXG4gICAgICAgIHZhciBhbGxvd2VkUHJvcGVydGllcyA9IFtcbiAgICAgICAgICAgICduYW1lJywgJ3RpdGxlJywgJ3R5cGUnLCAnZm9ybWF0JywgJ2RhdGEnLCAnb3B0aW9ucycsICdyZXNvdXJjZScgIC8vIGNvbW1vbiBwcm9wZXJ0aWVzXG4gICAgICAgIF07XG4gICAgICAvKiAgdmFsaWQgPSB2YWxpZCAmJlxuICAgICAgICAgICAgXy5ldmVyeShmaWVsZHMsIChmKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBfLmRpZmZlcmVuY2UoXy5rZXlzKGYpLCBhbGxvd2VkUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkaWZmLmxlbmd0aCA9PSAwKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZEVycm9yKGYubmFtZSwgXCJHb3QgdW5rbm93biBwcm9wZXJ0aWVzIFwiK2RpZmYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiBhbmQgYWxsIHR5cGVzIGFyZSB2YWxpZCAuLi5cbiAgICAgICAgdmFsaWQgPSB2YWxpZCAmJlxuICAgICAgICAgICAgXy5ldmVyeShmaWVsZHMsIChmKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFmLnR5cGUgfHwgXy5oYXNJbih0aGlzLnR5cGVzLCBmLnR5cGUpIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpZWxkRXJyb3IoZi5uYW1lLCBcIkdvdCB1bmtub3duIHR5cGUgXCIgKyBmLnR5cGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vIC4uLiBhbmQgbm8gdW5rbm93biBhZGRpdGlvbmFsIG9wdGlvbnMgLi4uXG4gICAgICAgIHZhbGlkID0gdmFsaWQgJiYgXG4gICAgICAgICAgICBfLmV2ZXJ5KGZpZWxkcywgKGYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoICFmLnR5cGUgKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgICAgICAgdmFyIGFsbG93ZWRPcHRpb25zID0gXy51bmlvbihcbiAgICAgICAgICAgICAgICAgICAgXy5nZXQoZXh0cmFPcHRpb25zLCAnZGF0YVR5cGVzLicrdGhpcy50eXBlc1tmLnR5cGVdLmRhdGFUeXBlKycub3B0aW9ucycsIFtdKSxcbiAgICAgICAgICAgICAgICAgICAgXy5nZXQoZXh0cmFPcHRpb25zLCAnb2JldVR5cGVzLicrZi50eXBlKycub3B0aW9ucycsIFtdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYWxsb3dlZE9wdGlvbnMgPSBfLm1hcChhbGxvd2VkT3B0aW9ucywgJ25hbWUnKTtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IF8uZ2V0KGYsICdvcHRpb25zJywge30pO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBfLmtleXMob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBfLmRpZmZlcmVuY2Uob3B0aW9ucywgYWxsb3dlZE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGlmZi5sZW5ndGggPT0gMCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmllbGRFcnJvcihmLm5hbWUsIFwiR290IHVua25vd24gb3B0aW9ucyBrZXkgXCIrZGlmZik7XG4gICAgICAgICAgICB9KTsqL1xuICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuXG4gICAgX3RpdGxlVG9TbHVnKHRpdGxlLCB0eXBlKSB7XG4gICAgICAgIHZhciBzbHVnUmUgPSBuZXcgUmVnRXhwKCdbYS16QS1aMC05XSsnLCdnJyk7XG4gICAgICAgIHZhciB2b3dlbHNSZSA9IG5ldyBSZWdFeHAoJ1thZWlvdV0rJywnZycpO1xuICAgICAgICB2YXIgc2x1Z3MgPSBfLmRlYnVycih0aXRsZSkubWF0Y2goc2x1Z1JlKTtcbiAgICAgICAgaWYgKCBzbHVncyA9PSBudWxsIHx8IHNsdWdzLmxlbmd0aCA9PSAwICkge1xuICAgICAgICAgICAgc2x1Z3MgPSBfLmpvaW4odHlwZS5zcGxpdCh2b3dlbHNSZSksJycpLm1hdGNoKHNsdWdSZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNsdWcgPSBfLmpvaW4oc2x1Z3MsICdfJyk7XG4gICAgICAgIGlmICggdGhpcy5hbGxOYW1lcy5pbmRleE9mKHNsdWcpID49IDAgKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoIHRydWUgKSB7XG4gICAgICAgICAgICAgICAgbGV0IGF0dGVtcHQgPSBzbHVnICsgJ18nICsgaTtcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuYWxsTmFtZXMuaW5kZXhPZihhdHRlbXB0KSA8IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsdWcgPSBhdHRlbXB0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSs9MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsbE5hbWVzLnB1c2goc2x1ZylcbiAgICAgICAgcmV0dXJuIHNsdWc7XG4gICAgfVxuXG4gICAgX2luaXRFcnJvcnMoKSB7XG4gICAgICAgIHRoaXMuZXJyb3JzID0geyBnZW5lcmFsOiBbXSwgcGVyRmllbGQ6IHt9IH07XG4gICAgfVxuXG4gICAgX2dlbmVyYWxFcnJvcihlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMuZ2VuZXJhbC5wdXNoKGVycik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfZmllbGRFcnJvcihmaWVsZCwgZXJyKSB7XG4gICAgICAgIHZhciBmaWVsZEVycm9ycyA9IHRoaXMuZXJyb3JzLnBlckZpZWxkW2ZpZWxkXTtcbiAgICAgICAgaWYgKCFmaWVsZEVycm9ycykge1xuICAgICAgICAgICAgZmllbGRFcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnBlckZpZWxkW2ZpZWxkXSA9IGZpZWxkRXJyb3JzO1xuICAgICAgICB9XG4gICAgICAgIGZpZWxkRXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qX2VtYmVkT3B0aW9ucyh0YXJnZXQsIG9wdGlvbnMsIGF2YWlsYWJsZU9wdGlvbnMpIHtcbiAgICAgICAgXy5mb3JFYWNoKGF2YWlsYWJsZU9wdGlvbnMsIChhdmFpbGFibGVPcHRpb24pID0+IHtcbiAgICAgICAgICAgIHZhciBuID0gYXZhaWxhYmxlT3B0aW9uLm5hbWU7XG4gICAgICAgICAgICBpZiAoXy5oYXNJbihvcHRpb25zLCBuKSAmJiBvcHRpb25zW25dKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25dID0gb3B0aW9uc1tuXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5oYXNJbihhdmFpbGFibGVPcHRpb24sICdkZWZhdWx0VmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuXSA9IGF2YWlsYWJsZU9wdGlvbi5kZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICBcbiAgICB9Ki9cblxuICAgIGZpZWxkc1RvTW9kZWwoZmllbGRzKSB7XG4gICAgICAgIC8vIFByZXBhcmUgZXJyb3JzXG4gICAgICAgIHRoaXMuX2luaXRFcnJvcnMoKTtcbiAgICAgICAgLy8gRGV0ZWN0IGludmFsaWQgZGF0YVxuICAgICAgICBpZiAoICF0aGlzLl9jaGVja0lucHV0KGZpZWxkcykgKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0ge2Vycm9yczogdGhpcy5lcnJvcnN9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmV0LG51bGwsMikpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICAvLyBNb2RlbGxpbmdcbiAgICAgICAgdmFyIGRpbWVuc2lvbnMgPSB7fTtcbiAgICAgICAgdmFyIG1lYXN1cmVzID0ge307XG4gICAgICAgIHZhciBtb2RlbCA9IHsgZGltZW5zaW9ucywgbWVhc3VyZXMgfTtcbiAgICAgICAgdmFyIHNjaGVtYSA9IHtmaWVsZHM6e30sIHByaW1hcnlLZXk6W119O1xuICAgICAgICB0aGlzLmFsbE5hbWVzID0gW107XG4gICAgICAgIF8uZm9yRWFjaChfLmZpbHRlcihmaWVsZHMsIChmKSA9PiB7IHJldHVybiAhIWYudHlwZTsgfSksIChmKSA9PiB7XG4gICAgICAgICAgICB2YXIgb2JldVR5cGUgPSB0aGlzLnR5cGVzW2YudHlwZV07XG4gICAgICAgICAgICBpZiAoIWYudGl0bGUpIHtcbiAgICAgICAgICAgICAgICBmLnRpdGxlID0gZi5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZi5zbHVnID0gdGhpcy5fdGl0bGVUb1NsdWcoZi50aXRsZSwgZi50eXBlKTtcbiAgICAgICAgICAgIHZhciBjb25jZXB0VHlwZSA9IF8uc3BsaXQoZi50eXBlLCc6JylbMF07XG4gICAgICAgICAgICBzY2hlbWEuZmllbGRzW2YudGl0bGVdID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBmLnRpdGxlLFxuICAgICAgICAgICAgICAgIG5hbWU6IGYubmFtZSxcbiAgICAgICAgICAgICAgICBzbHVnOiBmLnNsdWcsXG4gICAgICAgICAgICAgICAgdHlwZTE6IG9iZXVUeXBlLmRhdGFUeXBlLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogb2JldVR5cGUuZm9ybWF0IHx8IGYuZm9ybWF0IHx8ICdkZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBvYmV1VHlwZTogZi50eXBlLFxuICAgICAgICAgICAgICAgIGNvbmNlcHRUeXBlOiBjb25jZXB0VHlwZSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogZi5yZXNvdXJjZSwgXG4gICAgICAgICAgICAgICAgb3B0aW9uczogW10gLyogXy51bmlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmdldChleHRyYU9wdGlvbnMsICdkYXRhVHlwZXMuJytvYmV1VHlwZS5kYXRhVHlwZSsnLm9wdGlvbnMnLCBbXSksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZ2V0KGV4dHJhT3B0aW9ucywgJ29iZXVUeXBlcy4nK2YudHlwZSsnLm9wdGlvbnMnLCBbXSlcbiAgICAgICAgICAgICAgICApICovXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIC8vICB0aGlzLl9lbWJlZE9wdGlvbnMoc2NoZW1hLmZpZWxkc1tmLnRpdGxlXSwgZi5vcHRpb25zLCBfLmdldChleHRyYU9wdGlvbnMsICdkYXRhVHlwZXMuJytvYmV1VHlwZS5kYXRhVHlwZSsnLm9wdGlvbnMnLCBbXSkpO1xuXG4gICAgICAgICAgICBpZiAoIGNvbmNlcHRUeXBlID09ICd2YWx1ZScgKSB7IC8vbmV2ZXIgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlXG4gICAgICAgICAgICAgICAgdmFyIG1lYXN1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZi50aXRsZVxuICAgICAgICAgICAgICAgIFx0fVxuICAgICAgICAgICAgICAgIC8vIEV4dHJhIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBpZiAoZi5yZXNvdXJjZSkgICAgICAgICAgeyBtZWFzdXJlLnJlc291cmNlID0gZi5yZXNvdXJjZTsgfVxuICAgICAgICAgICAgICAvLyAgdGhpcy5fZW1iZWRPcHRpb25zKG1lYXN1cmUsIGYub3B0aW9ucywgXy5nZXQoZXh0cmFPcHRpb25zLCAnb2JldVR5cGVzLmFtb3VudC5vcHRpb25zJywgW10pKTtcbiAgICAgICAgICAgICAgICBtZWFzdXJlc1tmLnNsdWddID0gbWVhc3VyZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGRpbWVuc2lvbjtcbiAgICAgICAgICAgICAgICBpZiAoIF8uaGFzSW4oZGltZW5zaW9ucywgY29uY2VwdFR5cGUpICkge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb24gPSBkaW1lbnNpb25zW2NvbmNlcHRUeXBlXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb25UeXBlOiBvYmV1VHlwZS5kaW1lbnNpb25UeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeUtleTogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvYmV1VHlwZS5jbGFzc2lmaWNhdGlvblR5cGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb24uY2xhc3NpZmljYXRpb25UeXBlID0gb2JldVR5cGUuY2xhc3NpZmljYXRpb25UeXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnNbY29uY2VwdFR5cGVdID0gZGltZW5zaW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGYubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGYudGl0bGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICggZi5yZXNvdXJjZSApIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLnJlc291cmNlID0gZi5yZXNvdXJjZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGltZW5zaW9uLmF0dHJpYnV0ZXNbZi5zbHVnXSA9IGF0dHJpYnV0ZTtcbiAgICAgICAgICAgICAgICBpZiAob2JldVR5cGUudW5pcXVlSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICBkaW1lbnNpb24ucHJpbWFyeUtleS5wdXNoKGYuc2x1Zyk7XG4gICAgICAgICAgICAgICAgICAgIHNjaGVtYS5wcmltYXJ5S2V5LnB1c2goZi5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBQcm9jZXNzIHBhcmVudCwgbGFiZWxmb3JcbiAgICAgICAgdmFyIGZpbmRBdHRyaWJ1dGUgPSAoZmllbGQsIG9iZXVUeXBlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIGZpZWxkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7a2V5OmZpZWxkLnNsdWcsIGF0dHI6ZGltZW5zaW9uc1tmaWVsZC5jb25jZXB0VHlwZV0uYXR0cmlidXRlc1tmaWVsZC5zbHVnXX07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIG9iZXVUeXBlICkge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IF8uZmluZChfLnZhbHVlcyhzY2hlbWEuZmllbGRzKSwgKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uc3RhcnRzV2l0aChpLm9iZXVUeXBlLCBvYmV1VHlwZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRBdHRyaWJ1dGUoZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBfLmZvckVhY2goXy52YWx1ZXMoc2NoZW1hLmZpZWxkcyksIChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgdmFyIG9iZXVUeXBlID0gdGhpcy50eXBlc1tmaWVsZC5vYmV1VHlwZV07XG4gICAgICAgICAgICB2YXIgbGFiZWxmb3IgPSBvYmV1VHlwZS5sYWJlbGZvcjtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBvYmV1VHlwZS5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAoIGxhYmVsZm9yIHx8IHBhcmVudCApIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gZmluZEF0dHJpYnV0ZShmaWVsZCkuYXR0cjtcbiAgICAgICAgICAgICAgICBpZiAoIGxhYmVsZm9yICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0QXR0cmlidXRlID0gZmluZEF0dHJpYnV0ZShudWxsLCBsYWJlbGZvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdGFyZ2V0QXR0cmlidXRlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlLmxhYmVsZm9yID0gdGFyZ2V0QXR0cmlidXRlLmtleTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIHBhcmVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldEF0dHJpYnV0ZSA9IGZpbmRBdHRyaWJ1dGUobnVsbCwgcGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0YXJnZXRBdHRyaWJ1dGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUucGFyZW50ID0gdGFyZ2V0QXR0cmlidXRlLmtleTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEZpeCBwcmltYXJ5IGtleXMgaW4gY2FzZSB0aGV5J3JlIG1pc3NpbmdcbiAgICAgICAgXy5mb3JFYWNoKG1vZGVsLmRpbWVuc2lvbnMsIChkaW1lbnNpb24pID0+IHtcbiAgICAgICAgICAgaWYgKGRpbWVuc2lvbi5wcmltYXJ5S2V5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICBkaW1lbnNpb24ucHJpbWFyeUtleSA9IF8ua2V5cyhkaW1lbnNpb24uYXR0cmlidXRlcyk7XG4gICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGZkcCA9IHttb2RlbCwgc2NoZW1hfTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShmZHAsbnVsbCwyKSk7XG4gICAgICAgIHJldHVybiBmZHA7XG4gICAgfVxufTtcblxuLy92YXIgT0JFVVR5cGVzID0gcmVxdWlyZSgnb2JldS10eXBlcycpO1xuXG52YXIgT1NUeXBlcyA9IHJlcXVpcmUoJ29zLXR5cGVzJyk7XG5cblxuOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmFjdG9yeSgnRGVzY3JpYmVEYXRhU2VydmljZScsIFtcbiAgICAgICdfJywgJ1BhY2thZ2VTZXJ2aWNlJywgJ1V0aWxzU2VydmljZScsICdWYWxpZGF0aW9uU2VydmljZScsXG4gICAgICAnUHJldmlld0RhdGFTZXJ2aWNlJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oXywgUGFja2FnZVNlcnZpY2UsIFV0aWxzU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2UsXG4gICAgICAgIFByZXZpZXdEYXRhU2VydmljZSwgQXBwbGljYXRpb25TdGF0ZSwgQXBwbGljYXRpb25Mb2FkZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHZhciBzdGF0ZSA9IG51bGw7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLmRlc2NyaWJlRGF0YSkpIHtcbiAgICAgICAgICAgIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZS5kZXNjcmliZURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuZGVzY3JpYmVEYXRhID0gc3RhdGU7XG4gICAgICAgICAgUHJldmlld0RhdGFTZXJ2aWNlLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXN1bHQucmVzZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3RhdGUgPSB7fTtcblx0ICAgIEFwcGxpY2F0aW9uU3RhdGUuZGVzY3JpYmVEYXRhID0gc3RhdGU7XG5cdCAgICAvKlxuXHQgICAgICBhZGRlZCBieSBURC5cblx0ICAgICAqL1xuXHQgICAgb2JldVN0YXRlID0ge307XG5cdCAgICBBcHBsaWNhdGlvblN0YXRlLmRlc2NyaWJlT2JldURhdGEgPSBvYmV1U3RhdGU7XG5cdCAgICBcbiAgICAgICAgfTtcblx0ICAvL2NoYW5nZWQgYnkgVEQuXG4gICAgICAgICAgcmVzdWx0LmdldFN0YXRlID0gZnVuY3Rpb24oY2F0KSB7XG5cdCAgICAgIGNvbnNvbGUubG9nKCdEZXNjcmliZURhdGFTZXJ2aWNlLmdldFN0YXRlLCBjYXQ9JywgY2F0LCAnKicpO1xuXHQgICAgICBpZiAoY2F0ID09PSAnb3MnIHx8IGNhdCA9PT0gdW5kZWZpbmVkKXtcblx0XHQgIHJldHVybiBzdGF0ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoY2F0ID09PSAnb2JldScpe1xuXHRcdCAgcmV0dXJuIG9iZXVTdGF0ZTtcblx0ICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5nZXRTZWxlY3RlZENvbmNlcHRzID0gZnVuY3Rpb24oY29uY2VwdFR5cGUpIHtcbiAgICAgICAgICB2YXIgbWFwcGVkID0gW107XG4gICAgICAgICAgdmFyIHJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuICAgICAgICAgIF8uZWFjaChyZXNvdXJjZXMsIGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgICBfLmVhY2gocmVzb3VyY2UuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuY29uY2VwdFR5cGUgPT0gY29uY2VwdFR5cGUpIHtcbiAgICAgICAgICAgICAgICBtYXBwZWQucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBtYXBwZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnVwZGF0ZUZpZWxkID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpWzBdLmZpZWxkcztcblx0ICAgIGNvbnNvbGUubG9nKCdpbiBzY3JpcHRzL3NlcnZpY2VzL2Rlc2NyaWJlLWRhdGEuanMnLCBmaWVsZHMpO1xuICAgICAgICAgIC8vVE9ETzogU3VwcG9ydCBtb3JlIHRoYW4gMSByZXNvdXJjZSB3aGVuIE9TVHlwZXMgc3VwcG9ydHMgaXRcbiAgICAgICAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgZGVsZXRlIGZpZWxkLmVycm9ycztcbiAgICAgICAgICAgIGRlbGV0ZSBmaWVsZC5hZGRpdGlvbmFsT3B0aW9ucztcbiAgICAgICAgICAgIGRlbGV0ZSBmaWVsZC5zbHVnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGZkcCA9IG5ldyBPU1R5cGVzKCkuZmllbGRzVG9Nb2RlbChmaWVsZHMpO1xuXG5cdCAgICBcblx0ICAgIFxuICAgICAgICAgICAgaWYgKGZkcC5lcnJvcnMpIHtcblx0XHQvL2lmIGVycm9yLCB0aGlzIGZpZWxkIHNob3VsZCBiZSBhbiBvYmV1IGZpZWxkLlxuXHRcdC8qICBcblx0XHQgIF8uZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0ICB2YXIgZmllbGRFcnJvcnMgPSBmZHAuZXJyb3JzLnBlckZpZWxkW2ZpZWxkLnRpdGxlXTtcblx0XHQgIGlmIChmaWVsZEVycm9ycykge1xuICAgICAgICAgICAgICAgICAgZmllbGQuZXJyb3JzID0gZmllbGRFcnJvcnM7XG5cdFx0ICB9XG5cdFx0ICB9KTtcblx0XHQqL1xuXHRcdFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgICB2YXIgc2NoZW1hRmllbGQgPSBmZHAuc2NoZW1hLmZpZWxkc1tmaWVsZC50aXRsZV07XG4gICAgICAgICAgICAgIGlmIChzY2hlbWFGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpZWxkLmFkZGl0aW9uYWxPcHRpb25zID0gc2NoZW1hRmllbGQub3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAoIWZpZWxkLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGZpZWxkLmFkZGl0aW9uYWxPcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubmFtZSA9PSAnY3VycmVuY3knKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi52YWx1ZXMgPSBfLm1hcChVdGlsc1NlcnZpY2UuZ2V0Q3VycmVuY2llcygpLFxuICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0uY29kZSArICcgJyArIGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLmRlZmF1bHRWYWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgICAgVXRpbHNTZXJ2aWNlLmdldERlZmF1bHRDdXJyZW5jeSgpLmNvZGU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoXy5oYXMob3B0aW9uLCdkZWZhdWx0VmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5vcHRpb25zW29wdGlvbi5uYW1lXSA9IG9wdGlvbi5kZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGQuYWRkaXRpb25hbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmaWVsZC5vcHRpb25zID0ge307XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZS5zdGF0dXMgPSBWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZVJlcXVpcmVkQ29uY2VwdHMoXG4gICAgICAgICAgICBQYWNrYWdlU2VydmljZS5nZXRSZXNvdXJjZXMoKSk7XG5cbiAgICAgICAgICBQcmV2aWV3RGF0YVNlcnZpY2UudXBkYXRlKCk7XG5cbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdEb3dubG9hZFBhY2thZ2VTZXJ2aWNlJywgW1xuICAgICAgJyRxJywgJ18nLCAnUGFja2FnZVNlcnZpY2UnLCAnQXBwbGljYXRpb25TdGF0ZScsICdBcHBsaWNhdGlvbkxvYWRlcicsXG4gICAgICAnU3RlcHNTZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJywgJ0xvZ2luU2VydmljZScsXG4gICAgICBmdW5jdGlvbigkcSwgXywgUGFja2FnZVNlcnZpY2UsIEFwcGxpY2F0aW9uU3RhdGUsIEFwcGxpY2F0aW9uTG9hZGVyLFxuICAgICAgICBTdGVwc1NlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlLCBMb2dpblNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHZhciBzdGF0ZSA9IG51bGw7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLmRvd25sb2FkUGFja2FnZSkpIHtcbiAgICAgICAgICAgIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZS5kb3dubG9hZFBhY2thZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuZG93bmxvYWRQYWNrYWdlID0gc3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc3VsdC5yZXNldFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLmRvd25sb2FkUGFja2FnZSA9IHN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2VuZXJhdGVNYXBwaW5ncyA9IGZ1bmN0aW9uKGZpc2NhbERhdGFQYWNrYWdlKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgdmFyIGdldFJlc291cmNlID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgaWYgKCEhbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gXy5maW5kKGZpc2NhbERhdGFQYWNrYWdlLnJlc291cmNlcywgZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UubmFtZSA9PSBuYW1lO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KGZpc2NhbERhdGFQYWNrYWdlLnJlc291cmNlcyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIE1lYXN1cmVzXG4gICAgICAgICAgXy5lYWNoKGZpc2NhbERhdGFQYWNrYWdlLm1vZGVsLm1lYXN1cmVzLCBmdW5jdGlvbihtZWFzdXJlLCBuYW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZShtZWFzdXJlLnJlc291cmNlKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgc291cmNlczogW3tcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogcmVzb3VyY2UudGl0bGUgfHwgcmVzb3VyY2UubmFtZSxcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IG1lYXN1cmUudGl0bGVcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gRGltZW5zaW9uc1xuICAgICAgICAgIF8uZWFjaChmaXNjYWxEYXRhUGFja2FnZS5tb2RlbC5kaW1lbnNpb25zLFxuICAgICAgICAgICAgZnVuY3Rpb24oZGltZW5zaW9uLCBuYW1lKSB7XG4gICAgICAgICAgICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgICAgICAgICAgIF8uZWFjaChkaW1lbnNpb24uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc291cmNlID0gZ2V0UmVzb3VyY2UoYXR0cmlidXRlLnJlc291cmNlKTtcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IHJlc291cmNlLnRpdGxlIHx8IHJlc291cmNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGF0dHJpYnV0ZS50aXRsZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgc291cmNlczogc291cmNlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQucHVibGlzaERhdGFQYWNrYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUucGFja2FnZVB1YmxpY1VybCA9IG51bGw7XG4gICAgICAgICAgc3RhdGUuaXNVcGxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgIHZhciBmaWxlcyA9IFBhY2thZ2VTZXJ2aWNlLnB1Ymxpc2goKTtcbiAgICAgICAgICBzdGF0ZS51cGxvYWRzID0gZmlsZXM7XG4gICAgICAgICAgZmlsZXMuJHByb21pc2VcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGFQYWNrYWdlKSB7XG4gICAgICAgICAgICAgIFN0b3JhZ2VTZXJ2aWNlLmNsZWFyQXBwbGljYXRpb25TdGF0ZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcGFja2FnZU5hbWUgPSBQYWNrYWdlU2VydmljZS5nZXRBdHRyaWJ1dGVzKCkubmFtZTtcbiAgICAgICAgICAgICAgICAgIHZhciBvd25lciA9IExvZ2luU2VydmljZS51c2VySWQ7XG4gICAgICAgICAgICAgICAgICBzdGF0ZS5wYWNrYWdlUHVibGljVXJsID0gJy92aWV3ZXIvJyArIG93bmVyICsgJzonICtcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZU5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHN0YXRlLnVwbG9hZHMgPSBudWxsO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBzdGF0ZS5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgXSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiOyhmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ0FwcGxpY2F0aW9uJylcbiAgICAuZmFjdG9yeSgnTG9naW5TZXJ2aWNlJywgW1xuICAgICAgJ2F1dGhlbnRpY2F0ZScsICdhdXRob3JpemUnLCAnJHdpbmRvdycsXG4gICAgICBmdW5jdGlvbihhdXRoZW50aWNhdGUsIGF1dGhvcml6ZSwgJHdpbmRvdykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoYXQuaXNMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAgIHRoYXQubmFtZSA9IG51bGw7XG4gICAgICAgICAgdGhhdC51c2VySWQgPSBudWxsO1xuICAgICAgICAgIHRoYXQuZW1haWwgPSBudWxsO1xuICAgICAgICAgIHRoYXQuYXZhdGFyID0gbnVsbDtcbiAgICAgICAgICB0aGF0LnBlcm1pc3Npb25zID0gbnVsbDtcbiAgICAgICAgICB0aGF0LnBlcm1pc3Npb25Ub2tlbiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICB2YXIgdG9rZW4gPSBudWxsO1xuICAgICAgICB2YXIgaXNFdmVudFJlZ2lzdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGF0dGVtcHRpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGhyZWYgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9ICR3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICB2YXIgY2hlY2sgPSBhdXRoZW50aWNhdGUuY2hlY2sobmV4dCk7XG4gICAgICAgICAgY2hlY2sudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgYXR0ZW1wdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdG9rZW4gPSByZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAgIHRoYXQuaXNMb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICB0aGF0Lm5hbWUgPSByZXNwb25zZS5wcm9maWxlLm5hbWU7XG4gICAgICAgICAgICB0aGF0LmVtYWlsID0gcmVzcG9uc2UucHJvZmlsZS5lbWFpbDtcbiAgICAgICAgICAgIC8vIGpzY3M6ZGlzYWJsZVxuICAgICAgICAgICAgdGhhdC5hdmF0YXIgPSByZXNwb25zZS5wcm9maWxlLmF2YXRhcl91cmw7XG4gICAgICAgICAgICAvLyBqc2NzOmVuYWJsZVxuICAgICAgICAgICAgdGhhdC51c2VySWQgPSByZXNwb25zZS5wcm9maWxlLmlkaGFzaDtcblxuICAgICAgICAgICAgYXV0aG9yaXplLmNoZWNrKHRva2VuLCAnb3MuZGF0YXN0b3JlJylcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocGVybWlzc2lvbkRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnBlcm1pc3Npb25Ub2tlbiA9IHBlcm1pc3Npb25EYXRhLnRva2VuO1xuICAgICAgICAgICAgICAgIHRoYXQucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uRGF0YS5wZXJtaXNzaW9ucztcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24ocHJvdmlkZXJzKSB7XG4gICAgICAgICAgICBpZiAoIWlzRXZlbnRSZWdpc3RlcmVkKSB7XG4gICAgICAgICAgICAgICR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoYXQuaXNMb2dnZWRJbiAmJiBhdHRlbXB0aW5nKSB7XG4gICAgICAgICAgICAgICAgICB0aGF0LmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaXNFdmVudFJlZ2lzdGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHJlZiA9IHByb3ZpZGVycy5nb29nbGUudXJsO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoZWNrKCk7XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0aGF0LmlzTG9nZ2VkSW4gfHwgKGhyZWYgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXR0ZW1wdGluZyA9IHRydWU7XG4gICAgICAgICAgYXV0aGVudGljYXRlLmxvZ2luKGhyZWYsICdfc2VsZicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHRoYXQuaXNMb2dnZWRJbikge1xuICAgICAgICAgICAgdGhhdC5yZXNldCgpO1xuICAgICAgICAgICAgYXV0aGVudGljYXRlLmxvZ291dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdQYWNrYWdlU2VydmljZScsIFtcbiAgICAgICckcScsICckdGltZW91dCcsICdfJywgJ1NlcnZpY2VzJywgJ1V0aWxzU2VydmljZScsICdDb25maWd1cmF0aW9uJyxcbiAgICAgICdBcHBsaWNhdGlvblN0YXRlJywgJ0FwcGxpY2F0aW9uTG9hZGVyJywgJ0xvZ2luU2VydmljZScsXG4gICAgICAnVmFsaWRhdGlvblNlcnZpY2UnLFxuICAgICAgZnVuY3Rpb24oJHEsICR0aW1lb3V0LCBfLCBTZXJ2aWNlcywgVXRpbHNTZXJ2aWNlLCBDb25maWd1cmF0aW9uLFxuICAgICAgICBBcHBsaWNhdGlvblN0YXRlLCBBcHBsaWNhdGlvbkxvYWRlciwgTG9naW5TZXJ2aWNlLFxuICAgICAgICBWYWxpZGF0aW9uU2VydmljZSkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICB2YXIgcmVzb3VyY2VzID0gW107XG4gICAgICAgICAgdmFyIHNjaGVtYSA9IG51bGw7XG5cblx0ICB2YXIgb2JldUF0dHJpYnV0ZXMgPSB7fTtcblx0ICB2YXIgb2JldVJlc291cmNlcyA9IFtdO1xuXHQgIHZhciBvYmV1U2NoZW1hID0gbnVsbDsgXG5cbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLnBhY2thZ2UpKSB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBBcHBsaWNhdGlvblN0YXRlLnBhY2thZ2UuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgcmVzb3VyY2VzID0gQXBwbGljYXRpb25TdGF0ZS5wYWNrYWdlLnJlc291cmNlcztcblx0ICAgICAgY29uc29sZS5sb2coJ2F0dCcsYXR0cmlidXRlcyk7XG5cdCAgICAgIGNvbnNvbGUubG9nKCdyZXMnLHJlc291cmNlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUucGFja2FnZSA9IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICByZXNvdXJjZXM6IHJlc291cmNlc1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmaXNjYWxEYXRhUGFja2FnZSA9IFNlcnZpY2VzLmZpc2NhbERhdGFQYWNrYWdlO1xuICAgICAgICB2YXIgdXRpbHMgPSBTZXJ2aWNlcy51dGlscztcblxuICAgICAgICB2YXIgY3JlYXRlTmV3RGF0YVBhY2thZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLnJlZ2lvbkNvZGUgPSAnJztcbiAgICAgICAgICBhdHRyaWJ1dGVzLmNvdW50cnlDb2RlID0gJyc7XG4gICAgICAgICAgYXR0cmlidXRlcy5jaXR5Q29kZSA9ICcnO1xuICAgICAgICAgIHJlc291cmNlcy5zcGxpY2UoMCwgcmVzb3VyY2VzLmxlbmd0aCk7XG4gICAgICAgIH07XG4gICAgICAgIGNyZWF0ZU5ld0RhdGFQYWNrYWdlKCk7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGxvYWRTY2hlbWE6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlKSB7XG5cdFx0ICAgIHNjaGVtYSA9IGZpc2NhbERhdGFQYWNrYWdlLmdldEZpc2NhbERhdGFQYWNrYWdlU2NoZW1hKCk7XG5cdFx0ICAgIHJlc29sdmUoKTtcblx0XHR9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBdHRyaWJ1dGVzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXR0cmlidXRlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRSZXNvdXJjZXM6IGZ1bmN0aW9uKGNhdCkge1xuXHRcdGNvbnNvbGUubG9nKCdQYWNrYWdlU2VydmljZS5nZXRSZXNvdXJjZXMgY2F0PScsIGNhdCwgJyonKTtcblx0XHRpZiAoY2F0ID09PSAnb3MnIHx8IGNhdCA9PT0gdW5kZWZpbmVkKXtcblx0XHQgICAgcmV0dXJuIHJlc291cmNlcztcblx0XHR9XG5cdFx0aWYgKGNhdCA9PT0gJ29iZXUnKXtcblx0XHQgICAgcmV0dXJuIG9iZXVSZXNvdXJjZXM7XG5cdFx0fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlY3JlYXRlUGFja2FnZTogZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlTmV3RGF0YVBhY2thZ2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGVSZXNvdXJjZTogZnVuY3Rpb24oZmlsZU9yVXJsLCBzdGF0ZSkge1xuXHRcdHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHQgICAgdmFyIGZpbGVEZXNjcmlwdG9yID0gbnVsbDtcblx0XHQgICAgdXRpbHMuYmxvYlRvRmlsZURlc2NyaXB0b3IoZmlsZU9yVXJsLFxuXHRcdFx0XHRcdCAgICAgICBDb25maWd1cmF0aW9uLm1heEZpbGVTaXplVG9TdG9yZSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZpbGVPclVybCkge1xuXHRcdFx0ICAgIHZhciBzdGF0dXMgPSBWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZVJlc291cmNlKGZpbGVPclVybCk7XG5cdFx0XHQgICAgc3RhdGUuc3RhdHVzID0gc3RhdHVzO1xuXHRcdFx0ICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0c3RhdHVzLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuXHRcdFx0XHQgICAgZmlsZU9yVXJsLmVuY29kaW5nID0gcmVzdWx0cy5lbmNvZGluZztcblx0XHRcdFx0ICAgIHJlc29sdmUodXRpbHMuZmlsZURlc2NyaXB0b3JUb0Jsb2IoZmlsZU9yVXJsKSk7XG5cdFx0XHRcdH0pLmNhdGNoKHJlamVjdCk7XG5cdFx0XHQgICAgfSk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZmlsZU9yVXJsKSB7XG5cdFx0XHQgICAgdmFyIHVybCA9IGZpbGVPclVybDtcblx0XHRcdCAgICBpZiAoXy5pc1N0cmluZyh1cmwpKSB7XG5cdFx0XHRcdHVybCA9IFV0aWxzU2VydmljZS5kZWNvcmF0ZVByb3h5VXJsKHVybCk7XG5cdFx0XHQgICAgfVxuICAgICAgICAgICAgICAgICAgZmlsZURlc2NyaXB0b3IgPSBmaWxlT3JVcmw7XG5cdFx0XHQgICAgcmV0dXJuIGZpc2NhbERhdGFQYWNrYWdlLmNyZWF0ZVJlc291cmNlRnJvbVNvdXJjZSh1cmwpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc291cmNlKSB7XG5cdFx0XHQgICAgLy8gU2F2ZSBmaWxlIG9iamVjdCAtIGl0IHdpbGwgYmUgbmVlZGVkIHdoZW4gcHVibGlzaGluZ1xuXHRcdFx0ICAgIC8vIGRhdGEgcGFja2FnZVxuXHRcdFx0ICAgIGlmIChfLmlzT2JqZWN0KGZpbGVEZXNjcmlwdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZS5ibG9iID0gZmlsZURlc2NyaXB0b3I7XG5cdFx0XHQgICAgfVxuXHRcdFx0ICAgIGlmIChfLmlzU3RyaW5nKGZpbGVPclVybCkpIHtcblx0XHRcdFx0cmVzb3VyY2Uuc291cmNlLnVybCA9IGZpbGVPclVybDtcblx0XHRcdCAgICB9XG5cdFx0XHQgICAgcmV0dXJuIHJlc291cmNlO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlc29sdmUpXG5cdFx0XHQuY2F0Y2gocmVqZWN0KTtcblx0XHR9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRSZXNvdXJjZTogZnVuY3Rpb24ocmVzb3VyY2UpIHtcblx0XHR1dGlscy5hZGRJdGVtV2l0aFVuaXF1ZU5hbWUocmVzb3VyY2VzLCByZXNvdXJjZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlQWxsUmVzb3VyY2VzOiBmdW5jdGlvbigpIHtcblx0XHRyZXNvdXJjZXMuc3BsaWNlKDAsIHJlc291cmNlcy5sZW5ndGgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZhbGlkYXRlRmlzY2FsRGF0YVBhY2thZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2YWxpZGF0aW9uUmVzdWx0ID0ge1xuXHRcdCAgICBzdGF0ZTogJ2NoZWNraW5nJ1xuICAgICAgICAgICAgfTtcblx0XHR2YXIgZGF0YVBhY2thZ2UgPSB0aGlzLmNyZWF0ZUZpc2NhbERhdGFQYWNrYWdlKCk7XG5cdFx0dmFsaWRhdGlvblJlc3VsdC4kcHJvbWlzZSA9ICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdCAgICByZXR1cm4gZmlzY2FsRGF0YVBhY2thZ2UudmFsaWRhdGVEYXRhUGFja2FnZShkYXRhUGFja2FnZSwgc2NoZW1hKVxuXHRcdFx0LnRoZW4ocmVzb2x2ZSlcblx0XHRcdC5jYXRjaChyZWplY3QpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHZhbGlkYXRpb25SZXN1bHQuJHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuXHRcdFx0dmFsaWRhdGlvblJlc3VsdC5zdGF0ZSA9ICdjb21wbGV0ZWQnO1xuXHRcdFx0aWYgKHJlc3VsdHMgJiYgIXJlc3VsdHMudmFsaWQpIHtcblx0XHRcdCAgICB2YWxpZGF0aW9uUmVzdWx0LmVycm9ycyA9IHJlc3VsdHMuZXJyb3JzO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0dmFsaWRhdGlvblJlc3VsdC5zdGF0ZSA9IG51bGw7XG5cdFx0XHRDb25maWd1cmF0aW9uLmRlZmF1bHRFcnJvckhhbmRsZXIoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblx0XHRcblx0XHRyZXR1cm4gdmFsaWRhdGlvblJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGVGaXNjYWxEYXRhUGFja2FnZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZpc2NhbERhdGFQYWNrYWdlLmNyZWF0ZUZpc2NhbERhdGFQYWNrYWdlKGF0dHJpYnV0ZXMsXG5cdFx0XHRcdFx0XHRcdFx0IHJlc291cmNlcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHVibGlzaDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZpbGVzID0gXy5tYXAocmVzb3VyY2VzLCBmdW5jdGlvbihyZXNvdXJjZSkge1xuXHRcdCAgICB2YXIgdXJsID0gcmVzb3VyY2Uuc291cmNlLnVybDtcblx0XHQgICAgaWYgKF8uaXNTdHJpbmcodXJsKSAmJiAodXJsLmxlbmd0aCA+IDApKSB7XG5cdFx0XHR1cmwgPSAncHJveHk/dXJsPScgKyBlbmNvZGVVUklDb21wb25lbnQodXJsKTtcblx0XHQgICAgfVxuXHRcdCAgICByZXR1cm4ge1xuXHRcdFx0bmFtZTogcmVzb3VyY2UubmFtZSArICcuY3N2Jyxcblx0XHRcdGRhdGE6IHJlc291cmNlLmRhdGEucmF3LFxuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRmaWxlOiByZXNvdXJjZS5ibG9iXG5cdFx0ICAgIH07XG5cdFx0fSk7XG4gICAgICAgICAgICB2YXIgbW9kaWZpZWRSZXNvdXJjZXMgPSBfLm1hcChyZXNvdXJjZXMsIGZ1bmN0aW9uKHJlc291cmNlKSB7XG5cdFx0aWYgKHJlc291cmNlLnNvdXJjZS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2UgPSBfLmNsb25lKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2Uuc291cmNlID0ge1xuXHRcdFx0ZmlsZU5hbWU6IHJlc291cmNlLm5hbWUgKyAnLmNzdidcbiAgICAgICAgICAgICAgICAgICAgfTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc291cmNlO1xuICAgICAgICAgICAgfSk7XG5cdFx0dmFyIGRhdGFQYWNrYWdlID0gZmlzY2FsRGF0YVBhY2thZ2UuY3JlYXRlRmlzY2FsRGF0YVBhY2thZ2UoXG5cdFx0ICAgIGF0dHJpYnV0ZXMsIG1vZGlmaWVkUmVzb3VyY2VzKTtcblx0XHRkYXRhUGFja2FnZS5vd25lciA9IExvZ2luU2VydmljZS51c2VySWQ7XG5cdFx0ZGF0YVBhY2thZ2UuYXV0aG9yID0gTG9naW5TZXJ2aWNlLm5hbWUgK1xuXHRcdCAgICAnIDwnICsgTG9naW5TZXJ2aWNlLmVtYWlsICsgJz4nO1xuXHRcdFxuXHRcdC8vIENyZWF0ZSBhbmQgcHJlcGVuZCBkYXRhcGFja2FnZS5qc29uXG5cdFx0dmFyIHBhY2thZ2VGaWxlID0ge1xuXHRcdCAgICBuYW1lOiBDb25maWd1cmF0aW9uLmRlZmF1bHRQYWNrYWdlRmlsZU5hbWUsXG5cdFx0ICAgIGRhdGE6IGRhdGFQYWNrYWdlXG5cdFx0fTtcblx0XHRmaWxlcy5zcGxpY2UoMCwgMCwgcGFja2FnZUZpbGUpO1xuXHRcdFxuXHRcdHZhciB0cmlnZ2VyRGlnZXN0ID0gZnVuY3Rpb24oaW1tZWRpYXRlQ2FsbCkge1xuXHRcdCAgICBpZiAoXy5pc0Z1bmN0aW9uKHRyaWdnZXJEaWdlc3QpKSB7XG5cdFx0XHQkdGltZW91dCh0cmlnZ2VyRGlnZXN0LCA1MDApO1xuXHRcdCAgICB9XG5cdFx0ICAgIGlmICghIWltbWVkaWF0ZUNhbGwpIHtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge30pO1xuXHRcdCAgICB9XG5cdFx0fTtcblx0XHRcblx0XHRmaWxlcyA9IF8ubWFwKGZpbGVzLCBmdW5jdGlvbihmaWxlKSB7XG5cdFx0ICAgIGZpbGUuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHRyaWdnZXJEaWdlc3QodHJ1ZSk7XG5cdFx0XHRTZXJ2aWNlcy5kYXRhc3RvcmUucmVhZENvbnRlbnRzKGZpbGUpXG5cdFx0XHQgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBTZXJ2aWNlcy5kYXRhc3RvcmUucHJlcGFyZUZvclVwbG9hZChmaWxlLCB7XG5cdFx0XHRcdCAgICAvLyBqc2NzOmRpc2FibGVcblx0XHRcdFx0ICAgIHBlcm1pc3Npb25fdG9rZW46IExvZ2luU2VydmljZS5wZXJtaXNzaW9uVG9rZW4sXG5cdFx0XHRcdCAgICAvLyBqc2NzOmVuYWJsZVxuXHRcdFx0XHQgICAgbmFtZTogZGF0YVBhY2thZ2UubmFtZSxcblx0XHRcdFx0ICAgIG93bmVyOiBkYXRhUGFja2FnZS5vd25lclxuXHRcdFx0XHR9KTtcblx0XHRcdCAgICB9KVxuXHRcdFx0ICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gU2VydmljZXMuZGF0YXN0b3JlLnVwbG9hZChmaWxlKTtcblx0XHRcdCAgICB9KVxuXHRcdFx0ICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBkYXRhcGFja2FnZS5qc29uIGhhcyBvbmUgbW9yZSBzdGVwIGluIHByb2Nlc3NpbmcgY2hhaW5cblx0XHRcdFx0aWYgKGZpbGUubmFtZSAhPSBDb25maWd1cmF0aW9uLmRlZmF1bHRQYWNrYWdlRmlsZU5hbWUpIHtcblx0XHRcdFx0ICAgIGZpbGUuc3RhdHVzID0gU2VydmljZXMuZGF0YXN0b3JlLlByb2Nlc3NpbmdTdGF0dXMuUkVBRFk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZpbGU7XG5cdFx0XHQgICAgfSlcblx0XHRcdCAgICAudGhlbihyZXNvbHZlKVxuXHRcdFx0ICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRmaWxlLnN0YXR1cyA9IFNlcnZpY2VzLmRhdGFzdG9yZS5Qcm9jZXNzaW5nU3RhdHVzLkZBSUxFRDtcblx0XHRcdFx0ZmlsZS5lcnJvciA9IGVycm9yO1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0ICAgIH0pO1xuXHRcdCAgICB9KTtcblx0XHQgICAgcmV0dXJuIGZpbGU7XG5cdFx0fSk7XG5cdFx0XG5cdFx0ZmlsZXMuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHQgICAgJHEuYWxsKF8ucGx1Y2soZmlsZXMsICckcHJvbWlzZScpKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuXHRcdFx0ICAgIHBhY2thZ2VGaWxlLmNvdW50T2ZMaW5lcyA9IDA7XG5cdFx0XHQgICAgXy5lYWNoKGZpbGVzLCBmdW5jdGlvbihmaWxlKSB7XG5cdFx0XHRcdGlmIChmaWxlICE9PSBwYWNrYWdlRmlsZSkge1xuXHRcdFx0XHQgICAgcGFja2FnZUZpbGUuY291bnRPZkxpbmVzICs9IGZpbGUuY291bnRPZkxpbmVzO1xuXHRcdFx0XHR9XG5cdFx0XHQgICAgfSk7XG5cdFx0XHQgICAgU2VydmljZXMuZGF0YXN0b3JlLnB1Ymxpc2gocGFja2FnZUZpbGUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQgICAgdHJpZ2dlckRpZ2VzdCA9IG51bGw7XG5cdFx0XHRcdCAgICBwYWNrYWdlRmlsZS5zdGF0dXMgPVxuXHRcdFx0XHRcdFNlcnZpY2VzLmRhdGFzdG9yZS5Qcm9jZXNzaW5nU3RhdHVzLlJFQURZO1xuXHRcdFx0XHQgICAgcmVzb2x2ZShwYWNrYWdlRmlsZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHQgICAgdHJpZ2dlckRpZ2VzdCA9IG51bGw7XG5cdFx0XHRcdCAgICBwYWNrYWdlRmlsZS5zdGF0dXMgPVxuXHRcdFx0XHRcdFNlcnZpY2VzLmRhdGFzdG9yZS5Qcm9jZXNzaW5nU3RhdHVzLkZBSUxFRDtcblx0XHRcdFx0ICAgIHBhY2thZ2VGaWxlLmVycm9yID0gZXJyb3I7XG5cdFx0XHRcdCAgICByZWplY3QoZXJyb3IpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2gocmVqZWN0KTtcblx0XHR9KTtcblx0XHRcblx0XHRyZXR1cm4gZmlsZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5sb2FkU2NoZW1hKCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdQcmV2aWV3RGF0YVNlcnZpY2UnLCBbXG4gICAgICAnXycsICdTZXJ2aWNlcycsICdQYWNrYWdlU2VydmljZScsICdBcHBsaWNhdGlvblN0YXRlJyxcbiAgICAgICdBcHBsaWNhdGlvbkxvYWRlcicsXG4gICAgICBmdW5jdGlvbihfLCBTZXJ2aWNlcywgUGFja2FnZVNlcnZpY2UsIEFwcGxpY2F0aW9uU3RhdGUsXG4gICAgICBBcHBsaWNhdGlvbkxvYWRlcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgQXBwbGljYXRpb25Mb2FkZXIudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGEpKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHkgPSBudWxsO1xuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUucHJldmlld0RhdGEgPSBzdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHBvc3NpYmlsaXRpZXMgPSBTZXJ2aWNlcy51dGlscy5hdmFpbGFibGVQb3NzaWJpbGl0aWVzO1xuXG4gICAgICAgIHJlc3VsdC5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2V0UG9zc2liaWxpdGllcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBwb3NzaWJpbGl0aWVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vcmVzdWx0LmdldFByZXZpZXdEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICByZXR1cm4gU2VydmljZXMudXRpbHMuZ2V0RGF0YUZvclByZXZpZXcoXG4gICAgICAgIC8vICAgIFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpLCAxMCk7XG4gICAgICAgIC8vfTtcblxuICAgICAgICByZXN1bHQudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlc291cmNlcyA9IFBhY2thZ2VTZXJ2aWNlLmdldFJlc291cmNlcygpO1xuICAgICAgICAgIF8uZWFjaChwb3NzaWJpbGl0aWVzLCBmdW5jdGlvbihwb3NzaWJpbGl0eSkge1xuICAgICAgICAgICAgcG9zc2liaWxpdHkudXBkYXRlKHJlc291cmNlcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHkpIHtcbiAgICAgICAgICAgIHZhciBwb3NzaWJpbGl0eSA9IF8uZmluZFdoZXJlKHBvc3NpYmlsaXRpZXMsIHtcbiAgICAgICAgICAgICAgaWQ6IHN0YXRlLnNlbGVjdGVkUG9zc2liaWxpdHlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFwb3NzaWJpbGl0eSB8fCAhcG9zc2liaWxpdHkuaXNBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgcG9zc2liaWxpdHkgPSBfLmZpbmRXaGVyZShwb3NzaWJpbGl0aWVzLCB7XG4gICAgICAgICAgICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlc3VsdC5zZWxlY3RQb3NzaWJpbGl0eShwb3NzaWJpbGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5zZWxlY3RQb3NzaWJpbGl0eSA9IGZ1bmN0aW9uKHBvc3NpYmxpdHkpIHtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZFBvc3NpYmlsaXR5ID0gbnVsbDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChwb3NzaWJsaXR5KSkge1xuICAgICAgICAgICAgcG9zc2libGl0eSA9IF8uZmluZFdoZXJlKHBvc3NpYmlsaXRpZXMsIHtpZDogcG9zc2libGl0eS5pZH0pO1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocG9zc2libGl0eSkgJiYgcG9zc2libGl0eS5pc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgICBzdGF0ZS5zZWxlY3RlZFBvc3NpYmlsaXR5ID0gcG9zc2libGl0eS5pZDtcbiAgICAgICAgICAgICAgc3RhdGUuZ3JhcGggPSBwb3NzaWJsaXR5LmdyYXBoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1Byb3ZpZGVNZXRhZGF0YVNlcnZpY2UnLCBbXG4gICAgICAnJHRpbWVvdXQnLCAnXycsICdQYWNrYWdlU2VydmljZScsICdVdGlsc1NlcnZpY2UnLFxuICAgICAgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ0FwcGxpY2F0aW9uU3RhdGUnLCAnQXBwbGljYXRpb25Mb2FkZXInLFxuICAgICAgZnVuY3Rpb24oJHRpbWVvdXQsIF8sIFBhY2thZ2VTZXJ2aWNlLCBVdGlsc1NlcnZpY2UsXG4gICAgICAgIFZhbGlkYXRpb25TZXJ2aWNlLCBBcHBsaWNhdGlvblN0YXRlLCBBcHBsaWNhdGlvbkxvYWRlcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdmFyIGdlb0RhdGEgPSB7fTtcblxuICAgICAgICB2YXIgc3RhdGUgPSBudWxsO1xuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3QoQXBwbGljYXRpb25TdGF0ZS5wcm92aWRlTWV0YWRhdGEpKSB7XG4gICAgICAgICAgICAgIHN0YXRlID0gQXBwbGljYXRpb25TdGF0ZS5wcm92aWRlTWV0YWRhdGE7XG5cdCAgICAgIGNvbnNvbGUubG9nKCdpbiBwcm92aWRlIG1ldGFkYXRhIHNlcnZpY2UnLHN0YXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5wcm92aWRlTWV0YWRhdGEgPSBzdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0LnJlc2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzdGF0ZSA9IHt9O1xuICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUucHJvdmlkZU1ldGFkYXRhID0gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LmdldFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc3VsdC5nZXRHZW9EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGdlb0RhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnVwZGF0ZUZpc2NhbFBlcmlvZCA9IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgIGlmIChwZXJpb2QpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gUGFja2FnZVNlcnZpY2UuZ2V0QXR0cmlidXRlcygpO1xuICAgICAgICAgICAgYXR0cmlidXRlcy5maXNjYWxQZXJpb2QgPSBVdGlsc1NlcnZpY2UucHJlcGFyZUZpc2NhbFBlcmlvZChwZXJpb2QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcHJlcGVuZEVtcHR5SXRlbSA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgcmV0dXJuIF8udW5pb24oW3tcbiAgICAgICAgICAgIGNvZGU6ICcnLFxuICAgICAgICAgICAgbmFtZTogJydcbiAgICAgICAgICB9XSwgaXRlbXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGdlb0RhdGEucmVnaW9ucyA9IHByZXBlbmRFbXB0eUl0ZW0oW10pO1xuICAgICAgICBnZW9EYXRhLmNvdW50cmllcyA9IHByZXBlbmRFbXB0eUl0ZW0oW10pO1xuXG4gICAgICAgIFV0aWxzU2VydmljZS5nZXRDb250aW5lbnRzKCkuJHByb21pc2VcbiAgICAgICAgICAudGhlbihwcmVwZW5kRW1wdHlJdGVtKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICBnZW9EYXRhLnJlZ2lvbnMgPSBpdGVtcztcbiAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBQcmVsb2FkIGNvdW50cmllcywgYnV0IGRvIG5vdCBzaG93IHRoZW0gdW50aWwgY29udGluZW50IHNlbGVjdGVkXG4gICAgICAgIFV0aWxzU2VydmljZS5nZXRDb3VudHJpZXMoKTtcbiAgICAgICAgZ2VvRGF0YS5jb3VudHJpZXMgPSBwcmVwZW5kRW1wdHlJdGVtKFtdKTtcblxuICAgICAgICByZXN1bHQudXBkYXRlQ291bnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBQYWNrYWdlU2VydmljZS5nZXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgdmFyIHJlZ2lvbnMgPSBhdHRyaWJ1dGVzLnJlZ2lvbkNvZGU7XG4gICAgICAgICAgcmVnaW9ucyA9ICEhcmVnaW9ucyA/IFtyZWdpb25zXVxuICAgICAgICAgICAgOiBfLm1hcChcbiAgICAgICAgICAgIGdlb0RhdGEucmVnaW9ucyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIFV0aWxzU2VydmljZS5nZXRDb3VudHJpZXMocmVnaW9ucykuJHByb21pc2UudGhlbihmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBQYWNrYWdlU2VydmljZS5nZXRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgICBnZW9EYXRhLmNvdW50cmllcyA9IHByZXBlbmRFbXB0eUl0ZW0oaXRlbXMpO1xuICAgICAgICAgICAgdmFyIGNvZGVzID0gXy5tYXAoaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29kZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGNvZGVzLCBhdHRyaWJ1dGVzLmNvdW50cnlDb2RlKSkge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVzLmNvdW50cnlDb2RlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnZhbGlkYXRlUGFja2FnZSA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVBdHRyaWJ1dGVzRm9ybShmb3JtKTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBQYWNrYWdlU2VydmljZS52YWxpZGF0ZUZpc2NhbERhdGFQYWNrYWdlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3RhdGUuc3RhdHVzID0gcmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1N0ZXBzU2VydmljZScsIFtcbiAgICAgICckcScsICckbG9jYXRpb24nLCAnXycsICdDb25maWd1cmF0aW9uJywgJ0FwcGxpY2F0aW9uU3RhdGUnLFxuICAgICAgJ0FwcGxpY2F0aW9uTG9hZGVyJywgJ1N0b3JhZ2VTZXJ2aWNlJyxcbiAgICAgIGZ1bmN0aW9uKCRxLCAkbG9jYXRpb24sIF8sIENvbmZpZ3VyYXRpb24sIEFwcGxpY2F0aW9uU3RhdGUsXG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLCBTdG9yYWdlU2VydmljZSkge1xuICAgICAgICB2YXIgY3VycmVudFN0ZXAgPSBudWxsO1xuICAgICAgICB2YXIgc3RlcHMgPSBbXTtcblxuICAgICAgICB2YXIgcmVzZXRDYWxsYmFja3MgPSB7fTtcblxuICAgICAgICBBcHBsaWNhdGlvbkxvYWRlci50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkoQXBwbGljYXRpb25TdGF0ZS5zdGVwcykpIHtcbiAgICAgICAgICAgIHN0ZXBzID0gXy5maWx0ZXIoQXBwbGljYXRpb25TdGF0ZS5zdGVwcywgXy5pc09iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdGVwcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgc3RlcHMgPSBDb25maWd1cmF0aW9uLnN0ZXBzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRTdGVwID0gXy5maW5kKHN0ZXBzLCAnaXNDdXJyZW50Jyk7XG4gICAgICAgICAgaWYgKCFjdXJyZW50U3RlcCkge1xuICAgICAgICAgICAgY3VycmVudFN0ZXAgPSBfLmZpcnN0KHN0ZXBzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnVwZGF0ZVN0ZXBzU3RhdGUoY3VycmVudFN0ZXApO1xuXG4gICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24uaXNXaXphcmQpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGN1cnJlbnRTdGVwLnJvdXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnN0ZXBzID0gc3RlcHM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgZ2V0Q3VycmVudFN0ZXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGVwO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ29Ub1N0ZXA6IGZ1bmN0aW9uKHN0ZXAsIGdvTmV4dCkge1xuICAgICAgICAgICAgaWYgKHN0ZXApIHtcbiAgICAgICAgICAgICAgaWYgKGdvTmV4dCB8fCBzdGVwLmlzUGFzc2VkIHx8IHN0ZXAuaXNDdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFN0ZXAgPSBzdGVwO1xuICAgICAgICAgICAgICAgIHJlc3VsdC51cGRhdGVTdGVwc1N0YXRlKHN0ZXApO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHN0ZXAucm91dGUpO1xuICAgICAgICAgICAgICAgIFN0b3JhZ2VTZXJ2aWNlLnNhdmVBcHBsaWNhdGlvblN0YXRlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRTdGVwO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0U3RlcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXBzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0U3RlcEJ5SWQ6IGZ1bmN0aW9uKHN0ZXBJZCkge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmluZFdoZXJlKHRoaXMuZ2V0U3RlcHMoKSwge1xuICAgICAgICAgICAgICBpZDogc3RlcElkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldE5leHRTdGVwOiBmdW5jdGlvbihzdGVwKSB7XG4gICAgICAgICAgICB2YXIgc3RlcHMgPSB0aGlzLmdldFN0ZXBzKCk7XG4gICAgICAgICAgICBpZiAoXy5pc09iamVjdChzdGVwKSkge1xuICAgICAgICAgICAgICB2YXIgaXNGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gXy5maW5kKHN0ZXBzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gc3RlcC5pZCkge1xuICAgICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpc0ZvdW5kO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFN0ZXBSZXNldENhbGxiYWNrOiBmdW5jdGlvbihzdGVwSWQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXNldENhbGxiYWNrc1tzdGVwSWRdID0gY2FsbGJhY2s7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXRTdGVwUmVzZXRDYWxsYmFja3M6IGZ1bmN0aW9uKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgXy5leHRlbmQocmVzZXRDYWxsYmFja3MsIGNhbGxiYWNrcyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFN0ZXBzRnJvbTogZnVuY3Rpb24oc3RlcCwgdXBkYXRlQ3VycmVudFN0ZXApIHtcbiAgICAgICAgICAgIGlmIChzdGVwKSB7XG4gICAgICAgICAgICAgIHZhciBzdGVwcyA9IHRoaXMuZ2V0U3RlcHMoKTtcbiAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgIF8uZWFjaChzdGVwcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgaXRlbS5pc1Bhc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgaXRlbS5pc0N1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVzZXRDYWxsYmFja3NbaXRlbS5pZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Q2FsbGJhY2tzW2l0ZW0uaWRdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09IHN0ZXAuaWQpIHtcbiAgICAgICAgICAgICAgICAgIGZvdW5kID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24ocmVzZXRDYWxsYmFja3NbaXRlbS5pZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Q2FsbGJhY2tzW2l0ZW0uaWRdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZUN1cnJlbnRTdGVwICYmIGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmdvVG9TdGVwKGZvdW5kKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBTdG9yYWdlU2VydmljZS5zYXZlQXBwbGljYXRpb25TdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXBkYXRlU3RlcHNTdGF0ZTogZnVuY3Rpb24oc3RlcCkge1xuICAgICAgICAgICAgdmFyIHN0ZXBzID0gdGhpcy5nZXRTdGVwcygpO1xuICAgICAgICAgICAgXy5lYWNoKHN0ZXBzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgIGl0ZW0uaXNDdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHN0ZXApKSB7XG4gICAgICAgICAgICAgIC8vIFNpZGUgZWZmZWN0ISEhXG4gICAgICAgICAgICAgIF8uZmluZChzdGVwcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09IHN0ZXAuaWQpIHtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uaXNDdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtLmlzUGFzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxhc3RTdGVwID0gXy5sYXN0KHN0ZXBzKTtcbiAgICAgICAgICAgIGlmIChsYXN0U3RlcC5pc0N1cnJlbnQpIHtcbiAgICAgICAgICAgICAgbGFzdFN0ZXAuaXNQYXNzZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiIsIjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdBcHBsaWNhdGlvbicpXG4gICAgLmZhY3RvcnkoJ1N0b3JhZ2VTZXJ2aWNlJywgW1xuICAgICAgJyRxJywgJyR3aW5kb3cnLCAnXycsICdBcHBsaWNhdGlvblN0YXRlJywgJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgZnVuY3Rpb24oJHEsICR3aW5kb3csIF8sIEFwcGxpY2F0aW9uU3RhdGUsIENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uc1xuICAgICAgICBmdW5jdGlvbiBpc1N0b3JhZ2VBdmFpbGFibGUoKSB7XG4gICAgICAgICAgcmV0dXJuICEhJHdpbmRvdy5faW5kZXhlZERCIHx8XG4gICAgICAgICAgICAhISR3aW5kb3cuaW5kZXhlZERCIHx8XG4gICAgICAgICAgICAhISR3aW5kb3cubXNJbmRleGVkREIgfHxcbiAgICAgICAgICAgICEhJHdpbmRvdy5tb3pJbmRleGVkREIgfHxcbiAgICAgICAgICAgICEhJHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHxcbiAgICAgICAgICAgICEhd2luZG93Lm9wZW5EYXRhYmFzZTsgLy8gdGhlcmUgaXMgV2ViU1FMIHBvbHlmaWxsXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWVwQ2xvbmVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiAoZnVuY3Rpb24odmFsdWUsIHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgICAgfSkodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJlcGFyZVZhbHVlRm9yU2F2aW5nKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmNoYWluKHZhbHVlKVxuICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFfLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAubWFwKHByZXBhcmVWYWx1ZUZvclNhdmluZylcbiAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgXy5lYWNoKHZhbHVlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIHZhciBpc0Z1bmN0aW9uID0gXy5pc0Z1bmN0aW9uKHZhbHVlKTtcbiAgICAgICAgICAgICAgdmFyIGlzQW5ndWxhciA9ICgnJyArIGtleSkuc3Vic3RyKDAsIDEpID09ICckJztcbiAgICAgICAgICAgICAgaWYgKCFpc0Z1bmN0aW9uICYmICFpc0FuZ3VsYXIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHByZXBhcmVWYWx1ZUZvclNhdmluZyh2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyBudWxsIDogdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXF1aXJlIG1vZHVsZXNcbiAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgaWYgKGlzU3RvcmFnZUF2YWlsYWJsZSgpKSB7XG4gICAgICAgICAgdmFyIHdlYnNxbCA9IHJlcXVpcmUoJ3RyZW8vcGx1Z2lucy90cmVvLXdlYnNxbCcpO1xuICAgICAgICAgIHZhciB0cmVvID0gcmVxdWlyZSgndHJlbycpO1xuXG4gICAgICAgICAgLy8gRGVzY3JpYmUgZGIgc2NoZW1hIGFuZCBjb25uZWN0IHRvIGRiXG4gICAgICAgICAgdmFyIHNjaGVtYSA9IHRyZW8uc2NoZW1hKClcbiAgICAgICAgICAgIC52ZXJzaW9uKDEpXG4gICAgICAgICAgICAuYWRkU3RvcmUoQ29uZmlndXJhdGlvbi5zdG9yYWdlLmNvbGxlY3Rpb24sIHtcbiAgICAgICAgICAgICAga2V5OiAna2V5JyxcbiAgICAgICAgICAgICAgaW5jcmVtZW50OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgZGIgPSB0cmVvKCdmaXNjYWwtZGF0YS1wYWNrYWdlcicsIHNjaGVtYSkudXNlKHdlYnNxbCgpKTtcblxuICAgICAgICAgIHN0YXRlID0gZGIuc3RvcmUoQ29uZmlndXJhdGlvbi5zdG9yYWdlLmNvbGxlY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5nZXQoa2V5LCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0ID8gcmVzdWx0LnZhbHVlIDogbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUucHV0KHtcbiAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7fSk7IC8vIEZvcmNlIGV4ZWN1dGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNhdmVBcHBsaWNhdGlvblN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IEFwcGxpY2F0aW9uU3RhdGU7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZpbGUgc2l6ZS4gSWYgZmlsZSBpcyB0b28gbGFyZ2UsIGRvIG5vdCBzdG9yZSBzdGF0ZVxuICAgICAgICAgICAgaWYgKHN0YXRlLnVwbG9hZEZpbGUgJiYgc3RhdGUudXBsb2FkRmlsZS5maWxlKSB7XG4gICAgICAgICAgICAgIHZhciBzaXplID0gc3RhdGUudXBsb2FkRmlsZS5maWxlLnNpemU7XG4gICAgICAgICAgICAgIGlmIChzaXplID4gQ29uZmlndXJhdGlvbi5tYXhGaWxlU2l6ZVRvU3RvcmUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdGUgPSBkZWVwQ2xvbmVWYWx1ZShwcmVwYXJlVmFsdWVGb3JTYXZpbmcoc3RhdGUpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2V0KENvbmZpZ3VyYXRpb24uc3RvcmFnZS5rZXksIHN0YXRlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNsZWFyQXBwbGljYXRpb25TdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4IGluIEFwcGxpY2F0aW9uU3RhdGUpIHtcbiAgICAgICAgICAgICAgaWYgKEFwcGxpY2F0aW9uU3RhdGUuaGFzT3duUHJvcGVydHkoeCkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgQXBwbGljYXRpb25TdGF0ZVt4XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zZXQoQ29uZmlndXJhdGlvbi5zdG9yYWdlLmtleSwgbnVsbCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXN0b3JlQXBwbGljYXRpb25TdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICByZXN1bHQuZ2V0KENvbmZpZ3VyYXRpb24uc3RvcmFnZS5rZXkpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKEFwcGxpY2F0aW9uU3RhdGUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdVcGxvYWRGaWxlU2VydmljZScsIFtcbiAgICAgICdfJywgJ1BhY2thZ2VTZXJ2aWNlJywgJ1ZhbGlkYXRpb25TZXJ2aWNlJywgJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgJ1V0aWxzU2VydmljZScsICdTZXJ2aWNlcycsICdBcHBsaWNhdGlvblN0YXRlJywgJ0FwcGxpY2F0aW9uTG9hZGVyJyxcbiAgICAgIGZ1bmN0aW9uKF8sIFBhY2thZ2VTZXJ2aWNlLCBWYWxpZGF0aW9uU2VydmljZSwgQ29uZmlndXJhdGlvbixcbiAgICAgICAgVXRpbHNTZXJ2aWNlLCBTZXJ2aWNlcywgQXBwbGljYXRpb25TdGF0ZSwgQXBwbGljYXRpb25Mb2FkZXIpIHtcbiAgICAgICAgdmFyIHV0aWxzID0gU2VydmljZXMudXRpbHM7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHZhciBzdGF0ZSA9IG51bGw7XG4gICAgICAgIEFwcGxpY2F0aW9uTG9hZGVyLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChBcHBsaWNhdGlvblN0YXRlLnVwbG9hZEZpbGUpKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEFwcGxpY2F0aW9uU3RhdGUudXBsb2FkRmlsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS51cGxvYWRGaWxlID0gc3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBvblJlc2V0Q2FsbGJhY2sgPSBudWxsO1xuICAgICAgICByZXN1bHQub25SZXNldCA9IGZ1bmN0aW9uKGNiaykge1xuICAgICAgICAgIG9uUmVzZXRDYWxsYmFjayA9IGNiaztcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQucmVzZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN0YXRlID0ge307XG4gICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS51cGxvYWRGaWxlID0gc3RhdGU7XG4gICAgICAgICAgUGFja2FnZVNlcnZpY2UucmVjcmVhdGVQYWNrYWdlKCk7XG4gICAgICAgICAgb25SZXNldENhbGxiYWNrICYmIG9uUmVzZXRDYWxsYmFjaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB2YWxpZGF0ZVNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgIHN0YXRlLnN0YXR1cyA9IHtcbiAgICAgICAgICAgIHN0YXRlOiAncmVhZGluZydcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgUGFja2FnZVNlcnZpY2UuY3JlYXRlUmVzb3VyY2Uoc291cmNlLCBzdGF0ZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgIHZhciBzdGF0dXMgPSBzdGF0ZS5zdGF0dXM7XG4gICAgICAgICAgICAgIHN0YXR1cy5zYW1wbGVTaXplID0gcmVzb3VyY2UuZGF0YS5yb3dzLmxlbmd0aDtcbiAgICAgICAgICAgICAgaWYgKHJlc291cmNlLmRhdGEuaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5zYW1wbGVTaXplICs9IDE7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoIXN0YXR1cy5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICBQYWNrYWdlU2VydmljZS5yZW1vdmVBbGxSZXNvdXJjZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgIFBhY2thZ2VTZXJ2aWNlLmFkZFJlc291cmNlKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIHN0YXRlLnN0YXR1cyA9IG51bGw7XG4gICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uZGVmYXVsdEVycm9ySGFuZGxlcihlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXN1bHQuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzdWx0LnJlc291cmNlQ2hhbmdlZCA9IGZ1bmN0aW9uKGZpbGUsIHVybCkge1xuICAgICAgICAgIGlmICh1dGlscy5pc1VybCh1cmwpKSB7XG4gICAgICAgICAgICBzdGF0ZS5pc1VybCA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZS51cmwgPSB1cmw7XG4gICAgICAgICAgICB2YWxpZGF0ZVNvdXJjZSh1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc09iamVjdChmaWxlKSkge1xuICAgICAgICAgICAgc3RhdGUuaXNGaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlLmZpbGUgPSB7XG4gICAgICAgICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgICAgICAgICBzaXplOiBmaWxlLnNpemVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YWxpZGF0ZVNvdXJjZShmaWxlKTtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnVwbG9hZEZpbGUgPSBzdGF0ZTtcbiAgICAgICAgICBQYWNrYWdlU2VydmljZS5yZWNyZWF0ZVBhY2thZ2UoKTtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCI7KGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdVdGlsc1NlcnZpY2UnLCBbXG4gICAgICAnJHEnLCAnXycsICdTZXJ2aWNlcycsXG4gICAgICBmdW5jdGlvbigkcSwgXywgU2VydmljZXMpIHtcbiAgICAgICAgdmFyIHV0aWxzID0gU2VydmljZXMudXRpbHM7XG5cbiAgICAgICAgdmFyIGFsbENvbnRpbmVudHMgPSBudWxsO1xuICAgICAgICB2YXIgYWxsQ291bnRyaWVzID0gbnVsbDtcbiAgICAgICAgdmFyIGFsbEN1cnJlbmNpZXMgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2x1ZzogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuY29udmVydFRvU2x1ZyhzdHJpbmcpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVjb3JhdGVQcm94eVVybDogZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuZGVjb3JhdGVQcm94eVVybCh1cmwpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdW5kZWNvcmF0ZVByb3h5VXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlscy51bmRlY29yYXRlUHJveHlVcmwodXJsKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpbmRDb25jZXB0OiBmdW5jdGlvbihvc1R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpbmQodXRpbHMuYXZhaWxhYmxlQ29uY2VwdHMsIGZ1bmN0aW9uKGNvbmNlcHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbmNlcHQub3NUeXBlID09IG9zVHlwZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0QXZhaWxhYmxlQ29uY2VwdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmF2YWlsYWJsZUNvbmNlcHRzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0QXZhaWxhYmxlVHlwZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmF2YWlsYWJsZURhdGFUeXBlcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByb21pc2lmeTogZnVuY3Rpb24oYWxpZW5Qcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGFsaWVuUHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByZXBhcmVGaXNjYWxQZXJpb2Q6IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIHJhbmdlID0gW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCEhcGVyaW9kKSB7XG4gICAgICAgICAgICAgIHJhbmdlID0gXy5maWx0ZXIoW1xuICAgICAgICAgICAgICAgIHBlcmlvZC5zdGFydCB8fCBwZXJpb2QuZnJvbSxcbiAgICAgICAgICAgICAgICBwZXJpb2QuZW5kIHx8IHBlcmlvZC50b1xuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAocmFuZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICBzdGFydDogcmFuZ2VbMF1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IHJhbmdlWzBdLFxuICAgICAgICAgICAgICAgICAgZW5kOiByYW5nZVsxXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBnZXRDdXJyZW5jaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChhbGxDdXJyZW5jaWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhbGxDdXJyZW5jaWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0LiRwcm9taXNlID0gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIFNlcnZpY2VzLmNvc21vcG9saXRhbi5nZXRDdXJyZW5jaWVzKGZhbHNlKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgIFtdLnB1c2guYXBwbHkocmVzdWx0LCBpdGVtcyk7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYWxsQ3VycmVuY2llcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGdldERlZmF1bHRDdXJyZW5jeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuZ2V0RGVmYXVsdEN1cnJlbmN5KCk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGdldENvbnRpbmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGFsbENvbnRpbmVudHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFsbENvbnRpbmVudHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICByZXN1bHQuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgU2VydmljZXMuY29zbW9wb2xpdGFuLmdldENvbnRpbmVudHMoZmFsc2UpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgW10ucHVzaC5hcHBseShyZXN1bHQsIGl0ZW1zKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbGxDb250aW5lbnRzID0gcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24gZ2V0Q291bnRyaWVzKGNvbnRpbmVudCkge1xuICAgICAgICAgICAgaWYgKCFjb250aW5lbnQgJiYgYWxsQ291bnRyaWVzKSB7XG4gICAgICAgICAgICAgIC8vIElmIGNvbnRpbmVudCBpcyBub3QgYXZhaWxhYmxlLCB1c2UgY2FjaGUgKGFsbCBjb3VudHJpZXMpXG4gICAgICAgICAgICAgIHJldHVybiBhbGxDb3VudHJpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICByZXN1bHQuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgaWYgKCEhY29udGluZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgY29udGluZW50IGlzIGF2YWlsYWJsZSwgdHJ5IHRvIGxvYWQgYWxsIGNvdW50cmllcyxcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhlbiBmaWx0ZXIgdGhlbS4gUmVzb2x2ZSB3aXRoIGZpbHRlcmVkIGFycmF5XG4gICAgICAgICAgICAgICAgZ2V0Q291bnRyaWVzKCkuJHByb21pc2UudGhlbihmdW5jdGlvbihjb3VudHJpZXMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShjb250aW5lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkID0gXy5maWx0ZXIoY291bnRyaWVzLCBmdW5jdGlvbihjb3VudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoY29udGluZW50LCBjb3VudHJ5LmNvbnRpbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQgPSBfLmZpbHRlcihjb3VudHJpZXMsIGZ1bmN0aW9uKGNvdW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY291bnRyeS5jb250aW5lbnQgPT0gY29udGluZW50O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgW10ucHVzaC5hcHBseShyZXN1bHQsIGZpbHRlcmVkKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElmIGNvbnRpbmVudCBpcyBub3QgYXZhaWxhYmxlLCBqdXN0IGxvYWQgYWxsIGNvdW50cmllc1xuICAgICAgICAgICAgICAgIFNlcnZpY2VzLmNvc21vcG9saXRhbi5nZXRDb3VudHJpZXMoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgW10ucHVzaC5hcHBseShyZXN1bHQsIGl0ZW1zKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIWNvbnRpbmVudCkge1xuICAgICAgICAgICAgICAvLyBJZiBjb250aW5lbnQgaXMgbm90IGF2YWlsYWJsZSwgY2FjaGUgYWxsIGNvdW50cmllc1xuICAgICAgICAgICAgICBhbGxDb3VudHJpZXMgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoYW5ndWxhcik7XG4iLCJ2YXIgbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbjsoZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gIHZhciBnb29kVGFibGVzVXJsID0gJ2h0dHA6Ly9nb29kdGFibGVzLm9rZm5sYWJzLm9yZy9hcGkvcnVuJztcblxuICBhbmd1bGFyLm1vZHVsZSgnQXBwbGljYXRpb24nKVxuICAgIC5mYWN0b3J5KCdWYWxpZGF0aW9uU2VydmljZScsIFtcbiAgICAgICckcScsICdfJywgJ1NlcnZpY2VzJywgJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgZnVuY3Rpb24oJHEsIF8sIFNlcnZpY2VzLCBDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHZhciB1dGlscyA9IFNlcnZpY2VzLnV0aWxzO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsaWRhdGVSZXNvdXJjZTogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWRhdGlvblJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgc3RhdGU6ICdjaGVja2luZydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodHlwZW9mKHNvdXJjZSkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRpb25SZXN1bHQuJHByb21pc2UgPSAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICB1dGlscy52YWxpZGF0ZURhdGEoc291cmNlLmRhdGEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgZ29vZFRhYmxlc1VybClcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWxpZGF0aW9uUmVzdWx0LiRwcm9taXNlID0gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgdXRpbHMudmFsaWRhdGVEYXRhKHVuZGVmaW5lZCwgc291cmNlLCB1bmRlZmluZWQsIGdvb2RUYWJsZXNVcmwpXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC4kcHJvbWlzZVxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSA9ICdjb21wbGV0ZWQnO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMuZXJyb3JzICYmIHJlc3VsdHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvblJlc3VsdC5lcnJvcnMgPSByZXN1bHRzLmVycm9ycztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uZGVmYXVsdEVycm9ySGFuZGxlcihlcnJvcik7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGlvblJlc3VsdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRlUmVxdWlyZWRDb25jZXB0czogZnVuY3Rpb24ocmVzb3VyY2VzKSB7XG4gICAgICAgICAgICB2YXIgaGFzQ29uY2VwdCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgICAgICAgICByZXR1cm4gXy5zb21lKHJlc291cmNlcywgZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5zb21lKHJlc291cmNlLmZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsb2Rhc2guc3RhcnRzV2l0aChmaWVsZC50eXBlLCBwcmVmaXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gaGFzQ29uY2VwdCgndmFsdWUnKSAmJiBoYXNDb25jZXB0KCdkYXRlOicpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGVzRm9ybTogZnVuY3Rpb24oZm9ybSkge1xuICAgICAgICAgICAgaWYgKCFmb3JtIHx8ICFmb3JtLiRkaXJ0eSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvcm0uJHZhbGlkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdGU6ICdpbnZhbGlkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIF0pO1xuXG59KShhbmd1bGFyKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
