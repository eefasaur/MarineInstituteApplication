var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
    //configures which controllers will be used for what page

    $routeProvider

	.when('/', {
	    templateURL: 'home/Create.cshtml',
	    controller: 'createController'
	})

	.when('/', {
	    templateURL: 'home/Insert.cshtml',
	    controller: 'insertController'
	})

});//routing of controllers to views

//the create page
//to do:
//  refactor the create.cshtml so that the create controller looks after entire page
//  create a directive for the dropdown menus
//  bind the vocab select to a watch method in a service for the createController to access
myApp.controller('vocabController', ['$scope', '$http', function ($scope, $http, Submit) {

    //get request that returns the list from parse method
    //this runs automatically when page loads however it will eventually
    //be ammended to be called when RUN button is clicked
    //this will be after a file upload service will be created
    $http.get('/Home/Parse')
            .success(function (result) {
                $scope.xmlWords = result;
                console.log('Success, $scope.xmlWords: ', $scope.xmlWords);//error checking
            })
        .error(function (data) {
            console.log(data);//error checking
        });


    //declare arrays that will be used with the list box
        $scope.tempRightArray = [];//stores words before being transferred to submit array
        $scope.tempLeftArray = [];//stores words before being transferred back (change of mind)
        $scope.submit = [];//stores the words to be submitted to a database vocabulary
        $scope.stopWords = [];//stores the words to be submitted to the stopword table


    //add selected words to array
    //generic function that takes in a word and stores it in the appropriate temp array (right/left)
    //called from view when word is clicked
    //ng-click="addToArray(tempRightArray, word)"
    $scope.addToArray = function (tempArray, word) {

        //get index of the word to check if already exists in array
        //index will also allow splicing if word already in array
            var index = tempArray.indexOf(word);

        //if else statement to check if word is already in the array or not
        //the outcome of this will toggle the class and also prevents duplicates 
        //from being added to the array
            if (index === -1) {//if index is less than 0 then it is not in the array
                tempArray.push(word);//push to array
                } else {
                    tempArray.splice(index, 1)//otherwise use splice method to remove it
                }
                console.log('Right temp array: $scope.tempRightArray', $scope.tempRightArray);//check array in console
            }//end addToArray method

    //transfer array function
    //generic function that takes in the list the words are coming from e.g. xmlWords, submit
    //the temp array they are being stored in, and the new array they are being moved too (right to left)
    $scope.transferArray = function (list, tempArray, newArray) {

        //for each word in the temp array get the index
        //if exists, splice it //http://www.w3schools.com/jsref/jsref_splice.asp
        //this gives the effect of the words being physically removed from the list int the view
            angular.forEach(tempArray, function (word) {
               var index = list.indexOf(word);//get index
                    if (index !== -1) {//if index exists => word in list
                        list.splice(index, 1);//remove the word from the list
                    }
            });

        //https://docs.angularjs.org/api/ng/function/angular.extend
        //this adds the contents of the temporary array into the new array e.g. tempright to submit
        angular.extend(newArray, tempArray);//native js doesn't work for this one?!

        console.log('newArray', newArray);//test in console
        console.log('Submit array: $scope.submit', $scope.submit);//test in console
        console.log('StopWords array: $scope.stopWords', $scope.stopWords);//test in console

        //might remove this as i might move all the functions to same controller and add a watch for the selected vocab instead
        if (newArray === $scope.submit) {
            Submit.store($scope.submit);
        }


        //got this working - review why
        //removes all words from the temp array
        //previously i had been having problems with index[0] being left
        //this was the case with foreach on its own, or a regular for loop
        //by using the following method of the for and while loops, it did the trick!!
        //http://stackoverflow.com/questions/35942325/splice-leave-record-behind
            angular.forEach(tempArray, function (word) {
                var index = tempArray.indexOf(word);
                for (var i = 0; i < tempArray.length; i++) {//for every element in this array
                    while (index !== -1 && index < tempArray.length) {//while the index is in the array AND the index is less than array length
                        tempArray.splice(index, 1);
                    }
                }
            });

        console.log('Right temp array: $scope.tempRightArray', $scope.tempRightArray);//test in console
        console.log('Left temp array: $scope.tempLeftArray', $scope.tempLeftArray);//test in console

    }//end transferArray method

    //submit stop words
    //function using a POST to submit the words to the stopword table in database
    $scope.submitStopWords = function () {

    //$http.post('api/Stopword/Insert')
        $http({
            method: 'POST',//what type of http request is it
            url: '../api/Stopword/Insert',//name of the uri method being called in contoller
            data: $scope.stopWords//parameters being passed
        })
            .success(function () {
                console.log('Success');//test in console
            })
            .error(function (data) {
                console.log('Failed data', data)//test in console
            });

            $scope.stopWords = [];//resets the array to 0 (this did not work in the transfer method above?)
    }//end submitStopWords method


    //the following will submit to the database
    //submits the selected vocab words to the appropriate table in database
    //needs access to the vocab selected in the dropdown directive
    $scope.submitDB = function () {

        //set parameters
        //vocab select is going to have to be accessed by watch service
        //ran into difficulty passing json objects to the controller
        //was passing an object array with different data types (string and array)
        //so decided to build it all into one array as this worked!
            $scope.submitArray = [$scope.vocabSelect];//first index in array is the vocab selected
            $scope.submitArray = $scope.submitArray.concat($scope.submit);//then the submit array is added
        //the correct parameters are handled in the controller method

        console.log('params: $scope.submitArray', $scope.submitArray);//test in console

        //post method
            $http({
                method: 'POST',
                url: '/api/Data/Insert',
                data: $scope.submitArray
            })
            .success(function () {
                console.log('Check DB!');
            })
            .error(function (data) {
                console.log('Failed data', data);
            });

        $scope.submit = [];//resets the array

    }//end submit to database vocabulary

}]);



//insert tag view
myApp.controller('insertController', ['$scope', '$location', function ($scope, $location) {

    //for the predefined tags
    $scope.schemaTag = [];
    $scope.keywords = [];
    $scope.baseTags = [];

    $scope.loadTags = function () {
        $http.get('/api/Data/GetSchemaTag')
            .success(function (result) {
                $scope.schemaTag = result;
                console.log('Predefined tags: $scope.schemaTag ', $scope.schemaTag);
            })
            .error(function (data) {
                console.log(data);
            })
    }

    $scope.baseTag = '';

    //$scope.loadBaseTags = function () {
    $http.get('/api/SchemaTag/GetTag')
        .success(function (result) {
            $scope.baseTags = result;
            console.log('Base tags: $scope.baseTags ', $scope.baseTags);
        })
        .error(function (data) {
            console.log(data);
        })
    //}

    $scope.keyword = '';

    $scope.loadKeywords = function () {
        $http.get('/api/Data/GetKeyword')
            .success(function (result) {
                $scope.keywords = result;
                console.log('Keywords: $scope.keywords ', $scope.keywords);
            })
            .error(function (data) {
                console.log(data);
            })
    }

    //tagbuilder also has its own controller below
    $scope.insertScope = '<itemscope=”http://schema.org/';
    $scope.insertProp = '<span itemprop=”';
    $scope.end = '”>';
    $scope.type = '';
    //$scope.keyword = '';

    $scope.insertTag = '';

    $scope.buildScope = function (baseTag, keyword) {

        //stringbuilder
        $scope.insertTag = $scope.insertScope.concat(baseTag, keyword, $scope.end);
        console.log('property tag: $scope.insertScope', $scope.insertScope);
    }

    $scope.buildProp = function (keyword) {
        //stringbuilder
        $scope.insertTag = $scope.insertProp.concat(keyword, $scope.end);
        console.log('property tag: $scope.insertTag', $scope.insertTag);
    }


}]);




//Will populate dropdown menus and set apporpriate parameters for inserting into database tables
//should be changed to a directive
myApp.controller('dropdownData', ['$scope', '$http', 'Submit', function ($scope, $http, Submit) {

    $scope.catSelect = '';
    $scope.vocabSelect = '';
    $scope.tagSelect = '';

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


}]);

myApp.controller('tagBuiler', ['$scope', function ($scope) {

    $scope.insertScope = '<itemscope=”http://schema.org/';
    $scope.insertProp = '<span itemprop=”';
    $scope.end = '”>';
    $scope.type = '';
    //$scope.keyword = '';

    $scope.insertTag = '';

    $scope.buildTag = function (baseTag,keyword,en) {
        
        if ($scope.type === 'itemprop') {
            //stringbuilder
            insertTag = insertProp.concat(keyword);
        } else {
            //stringbuilder
            insertScope = insertTag.concat(baseTag,keyword,end);
        }

        
    }

    $scope.buildScope = function (baseTag,keyword) {

        //stringbuilder
        $scope.insertScope = $scope.insertTag.concat(baseTag, keyword, $scope.end);
        console.log('property tag: $scope.insertTag', $scope.insertTag);
    }

    $scope.buildProp = function (keyword) {
        //stringbuilder
        $scope.insertTag = $scope.insertProp.concat(keyword, $scope.end);
        console.log('property tag: $scope.insertTag', $scope.insertTag);
    }

}]);//insert tag page
myApp.controller('htmlEdit', ['$scope', function ($scope) {

    $scope.filePath = '';

    $scope.plainHTML = "";//placeholder

    $scope.tag = '<span itemprop="test">';

    //e = event happening
    //do i need e in upload parameter?

    $scope.upload = function (e) {

        //var fileInput = $scope.filePath;
        var fileInput = document.getElementById('upload');
        console.log('fileInput', fileInput);
        var reader = new FileReader();

        var file = fileInput.files[0];//file reader object is an array even if only one file => must return index 0


        reader.onload = function (e) {
            //$scope.fileData = reader.result;
            $scope.$apply(function () {
                document.getElementById('html').innerText = reader.result;
                //console.log('$scope.plainHTML', $scope.plainHTML);
            });
            //$scope.plainHTML;

        };
        reader.readAsText(file);//this reads the file into the text area

    }

    $scope.selectedText = '';

    $scope.select = function (e) {

    }

    $scope.tag = '<div itemscope="test">';
    //$scope.surround = function (e) {}

    $scope.surround = function () {


        //selected text (highlighted in div)
        var selectedText = document.getSelection();
        $scope.text = selectedText.toString();
        console.log('selection: $scope.text', $scope.text);

        var node = document.createTextNode($scope.tag);

        var range = selectedText.getRangeAt(0);

        //http://stackoverflow.com/questions/3597116/insert-html-after-a-selection
        //https://developer.mozilla.org/en-US/docs/Web/API/Range/collapse

        range.insertNode(node);
        var tag = $scope.tag;
        if (tag.indexOf("div") != -1) {
            range.collapse(false);
            var div = document.createTextNode('</div>');
            range.insertNode(div);
        } else if (tag.indexOf("span") != -1) {
            range.collapse(false);
            var span = document.createTextNode('</span>');
            range.insertNode(span);
        }



    }



}]);//insert tag page

myApp.factory('tagAttr', ['$rootScope', function ($rootScope) {

    //attributes to be shared go here

}]);//empty


myApp.factory('Submit',['$rootScope', function ($rootScope) {

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

}]);//shared scope - but might just put all in one controller


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
}]);//not being used yet



