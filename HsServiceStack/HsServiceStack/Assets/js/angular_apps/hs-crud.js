var hsCrud = angular.module('hsCrud', ['restangular'])
    .run(['Restangular', function (restangular) {
        restangular.setRequestSuffix('.json');
        
        restangular.setRestangularFields({
            id: "EntityId"
        });

        restangular.setRequestInterceptor(function (elem, operation) {
            //console.log('operation ' + operation);
            if (operation === "delete" || operation === "remove") {
                return undefined;
            }
            return elem;
        });
    }])
    .provider('basicCrud', ['RestangularProvider', function (restangularProvider) {

        var self = this;
        this.restObjects = [];
        this.$get = ['Restangular', function (restangular) {
            return {
                loadOne: function (ofType, entityId) {
                    var onePromise = restangular.one(ofType, entityId);
                    var restObj = { 'typeName': ofType, 'onePromise': onePromise, 'result': onePromise.get() };

                    return restObj;
                },
                loadList: function (ofType, queryParams) {
                    var allPromise = restangular.all(ofType);
                    var restObj = { 'typeName': ofType, 'allPromise': allPromise, 'resultList': allPromise.getList(queryParams) };

                    return restObj;
                },
                create: function (ofType, object) {
                    return restangular.all(ofType).post(object);
                },
                putList: function (listPromise, updatedObj) {
                    console.log('putting', updatedObj);
                    return listPromise.put(updatedObj);
                },
                /*
                    Return a promise for item deletion which will be resolved after the response is gotten from the server.
                */
                deleteItem: function (restItem) {
                    return restItem.customDELETE('');
                },
                setBaseUrl: function (baseUrl) {
                    console.log('setBaseUrl ' + baseUrl);
                    restangularProvider.setBaseUrl(baseUrl);
                },
                //Takes handler in form of function (response, operation, what, url)
                setResponseExtractor: function (handlerCallback) {
                    restangularProvider.setResponseExtractor(handlerCallback);
                }
            };
        }];
    }]);