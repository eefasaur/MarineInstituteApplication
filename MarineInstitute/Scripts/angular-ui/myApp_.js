var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', '$location', function ($scope, $location) {

    /*
    $http.get('/Home/StopWords')
            .success(function () {
                console.log('StopWords load, $scope.result: ', $scope.result);//error checking
            })
        .error(function (data) {
            console.log(data);//error checking
        });
        */
}]);

//Will populate dropdown menus and set apporpriate parameters for inserting into database tables
myApp.controller('dropdownData', ['$scope', '$http', 'Submit', function ($scope, $http, Submit) {

    $scope.catSelect = '';

    $scope.vocabSelect = '';
    $scope.dropdownTables = {};



    $http.get('/api/Catalogue/GetCatalogueTitle')
        .success(function (result) {
            $scope.catalogueTable = result;
            console.log('Success, $scope.catalogueTable: ', $scope.catalogueTable);//error checking
        })
        .error(function (data) {
            console.log(data);
        });

    //populate the arrays
    $http.get('/api/Vocabulary/Administration')
    .success(function (result) {
        $scope.adminCat = result;
        console.log('Success, $scope.adminCat: ', $scope.adminCat);//error checking
    })
    .error(function (result) {
        console.log(result);
    });


    $http.get('/api/Vocabulary/Oceanography')
    .success(function (result) {
        $scope.oceanCat = result;
        console.log('Success, $scope.oceanCat: ', $scope.oceanCat);//error checking
    })
    .error(function (data) {
        console.log(data);
    });

    $http.get('/api/Vocabulary/Meteorology')
    .success(function (result) {
        $scope.meteorCat = result;
        console.log('Success, $scope.meteorCat: ', $scope.meteorCat);//error checking
    })
    .error(function (data) {
        console.log(data);
    });

    $http.get('/api/Vocabulary/OceanEnergy')
    .success(function (result) {
        $scope.energyCat = result;
        console.log('Success: $scope.energyCat: ', $scope.energyCat);//error checking
    })
    .error(function (data) {
        console.log(data);
    });


    $scope.loadArray = function () {
        $scope.vocabArray = { 'Administration': $scope.adminCat, 'Oceanography': $scope.oceanCat, 'Meteorology': $scope.meteorCat, 'OceanEnergy': $scope.energyCat };
        //console.log('Vocab Array: $scope.vocabArray', $scope.vocabArray);
    }

    $scope.populate = function (catSelect) {
        $scope.dropdownTables = $scope.vocabArray[catSelect];
        console.log('Array selected: $scope.dropdownTables ', $scope.dropdownTables);
    }



    //the following will submit to the database

    $scope.apiURL = '';

    $scope.addressContactUri = '/api/AddressContact/InsertKeyword';
    $scope.tidesUri = '/api/Tide/InsertKeyword';
    $scope.wavesUri = '/api/Wave/InsertKeyword';


    $scope.apiArray = { 'AddressContact': $scope.addressContactUri, 'Tides': $scope.tidesUri, 'Waves': $scope.wavesUri };

    console.log('APi array: $scope.apiArray', $scope.apiArray);



    $scope.urlSelect = function (vocabSelect) {
        $scope.apiURL = $scope.apiArray[vocabSelect];
    }


    //var url = $scope.apiURL;

    $scope.submitDB = function () {

        console.log('URL: $scope.apiURL', $scope.apiURL);

        var data = Submit.get();
        //$scope.submit = Submit.get();

        //console.log("submit array: $scope.submit", $scope.submit);

        $http({ method: 'POST', url: $scope.apiURL, data: data })
        .success(function () {
            //console.log('Success $scope.submit', $scope.submit);
            console.log('Success data', data);
        })
        .error(function (data) {
            console.log('Failed data', data);
        });



        Submit.clear();

    }

}]);



myApp.factory('Submit', ['$rootScope', function ($rootScope) {

    var array = [];

    return {
        store: function (submit) {
            array = submit;
        },
        get: function () {
            return array;
        },
        clear: function () {
            array = [];

        }
    }

}]);

//Will pass the appropriate filename value into the parse method
//div id = uploadRun
//upload run is on hold for now - fileName is hard coded into the Parse method in HomeController

myApp.controller('uploadRun', ['$scope', '$http', function ($scope, $http) {


    $scope.textBoxDispay = 'C:\Users\eefasaur\Documents\Visual Studio 2013\Projects\ConsoleTests\ConsoleTests\Fisheries Biologically Sensitive Area_xml_iso19139.xml';

    var data = $scope.textBoxDispay;

    var config = {
        params: data
    };

    //call the parse method and pass in the filename
    $scope.runParse = function () {

        $http.get('/Home/Parse', config)
            .success(function (result) {
                $scope.xmlWords = result;
                console.log('Success, $scope.xmlWords: ', $scope.xmlWords);//error checking
            })
            .error(function (data) {
                console.log(data);//error checking
            });

    }
}]);


/*
    $scope.rightToLeft = function () {

        //removes the words from the xml array to place into the temp array
        angular.forEach($scope.tempRightArray, function (word) {
            var index = $scope.xmlWords.indexOf(word);
            if (index !== -1) {
                $scope.xmlWords.splice(index, 1);
            }
        });
                
        //as angular.extend is fussy to work with it is better to use the native javascript
        //for concatonation of two arrays, therefore the copy and extend if else is not needed
        //native script runs faster and more reliable - best practice use native wherever possible

        $scope.submit = $scope.submit.concat($scope.tempRightArray);
        console.log('Left array: $scope.submit', $scope.submit);

        Submit.store($scope.submit);

        $scope.tempRightArray = [];//resets array
    }//end right to left function

    //Submit.store($scope.submit);







    
}]);
*/

myApp.controller('listBox', ['$scope', '$http', 'Submit', function ($scope, $http, Submit) {

    //get request that returns the list from parse method
    $http.get('/Home/Parse')
            .success(function (result) {
                $scope.xmlWords = result;
                console.log('Success, $scope.xmlWords: ', $scope.xmlWords);//error checking
            })
        .error(function (data) {
            console.log(data);//error checking
        });

    //declare arrays
    $scope.tempRightArray = [];
    $scope.tempLeftArray = [];
    $scope.submit = [];
    $scope.stopWords = [];


    //add selected words to array
    $scope.addToArray = function (tempArray, word) {

        var index = tempArray.indexOf(word);


        //if else statement to check if word is already in the array or not
        //the outcome of this will toggle the class and also prevents duplicates 
        //from being added to the array
        if (index === -1) {//if index is less than 0 then it is not in the array
            tempArray.push(word);
        } else {
            tempArray.splice(index, 1)//otherwise use splice method to remove it
        }

        console.log('Right temp array: $scope.tempRightArray', $scope.tempRightArray);
    }


    $scope.transferArray = function (list, tempArray, newArray) {

        //removes the words from the submit array
        angular.forEach(tempArray, function (word) {
            var index = list.indexOf(word);
            if (index !== -1) {
                list.splice(index, 1);
            }
        });

        angular.extend(newArray, tempArray);//native js doesn't work for this one?!
        console.log('newArray', newArray);


        //newArray = newArray.concat(tempArray); - this didnt work when parameters were passed in!
        console.log('Submit array: $scope.submit', $scope.submit);
        console.log('StopWords array: $scope.stopWords', $scope.stopWords);

        Submit.store($scope.submit);

        //got this working - review why
        //http://stackoverflow.com/questions/35942325/splice-leave-record-behind
        angular.forEach(tempArray, function (word) {
            var index = tempArray.indexOf(word);
            for (var i = 0; i < tempArray.length; i++) {//for every element in this array
                while (index !== -1 && index < tempArray.length) {//while the index is in the array AND the index is less than array length
                    tempArray.splice(index, 1);
                }
            }
        });

        console.log('Right temp array: $scope.tempRightArray', $scope.tempRightArray);
        console.log('Left temp array: $scope.tempLeftArray', $scope.tempLeftArray);

    }//end 

    $scope.submitStopWords = function () {
        //$http.post('api/Stopword/Insert')
        $http({ method: 'POST', url: '../api/Stopword/Insert', data: $scope.stopWords })
        .success(function () {
            console.log('Success');
        })
        .error(function (data) {
            console.log('Failed data', data);
        });

        $scope.stopWords = [];
    }

}]);



myApp.factory('loadTables', ['$http', '$q', function ($http, $q) {

    var deferred = $q.defer();


}]);


