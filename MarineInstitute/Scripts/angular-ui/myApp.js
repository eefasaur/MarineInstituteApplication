var myApp = angular.module('myApp', ['ngRoute']);


//built a custom directive for the drop down menu 
//this particular UI element will be reused across two different views
//this reduces the amount of code required
//template vs templateUrl - IIS issues
//no isolated scope required as the directive can access all requried elements from
//parent scope (the dropdownData controller)
myApp.directive('dropdownMenu', function () {

    return {
        restrict: 'EA',
        template:'<div><p>Select which Category you would like to get tables from.....</p>'
            +'<select ng-click="loadArray()" ng-change="populate(catSelect)" ng-model="catSelect" class="btn btn-default dropdown-toggle"><option></option>'
            +'<option ng-repeat="cat in catalogueTable" class="list-group-item">{{ cat }}</option></select><br /><p>Select which Table you would like to selected add words to.....</p>'
            +'<select ng-model="vocabSelect" class="btn btn-default dropdown-toggle"><option class="default"></option>'
            + '<option ng-repeat="voc in dropdownTables" class="list-group-item">{{ voc }}</option></select>Selected = {{ vocabSelect }}</div>',
        //templateUrl: 'directives/dropdownMenu.html',//view
        replace: true,
        controller: 'dropdownData',
        //isolating the scope
        //prevents directive from effecting views
        scope: {//model
        }
    }

});//end directive

myApp.config(function ($routeProvider) {
    //configures which controllers will be used for what page

    $routeProvider

	.when('/', {
	    templateURL: 'Home/Create.cshtml',
	    controller: 'vocabController'
	})

	.when('/', {
	    templateURL: 'Home/Insert.cshtml',
	    controller: 'insertController'
	})

});//routing of controllers to views

//the vocab page (formally create page)
//to do:
//  refactor the create.cshtml so that the create controller looks after entire page
//  create a directive for the dropdown menus
//  bind the vocab select to a watch method in a service for the createController to access
myApp.controller('vocabController', ['$scope', '$http', 'vocabFactory', function ($scope, $http, vocabFactory) {

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
        $scope.submitArray = [];//stores the post array for database

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
                alert("Words sucessfully deleted");
                console.log('Success');//test in console
            })
            .error(function (data) {
                alert("Connection denied - check internet/database connections.");
                console.log('Failed data', data)//test in console
            });

            $scope.stopWords = [];//resets the array to 0 (this did not work in the transfer method above?)
    }//end submitStopWords method



    //the following will submit to the database
    //submits the selected vocab words to the appropriate table in database
    //needs access to the vocab selected in the dropdown directive
    $scope.submitDB = function () {

        //gets value of the selected vocabulary
        //uses a factory to pass variable across controllers
            $scope.vocabSelect = vocabFactory.vocabSelect;

        //might be able to remove following lines
            //$scope.$watch('vocabSelect', function () {
            //    vocabFactory.vocabSelect = $scope.vocabSelect;
            //    console.log('submut: $scope.vocabSelect', $scope.vocabSelect);//console testing
            //});

        //set parameters
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
myApp.controller('insertController', ['$scope', '$http', 'vocabFactory', 'tagFactory', function ($scope, $http, vocabFactory, tagFactory) {




    //gets value of the selected vocabulary
    //uses a factory to pass variable across controllers
    //a watch is set on the factory so that when it changes it will update the variable
    $scope.vocabSelect = '';//define the vocabFactory.selected on load - otherwise cannot be called in watch function


    //http:/ / stackoverflow.com / questions / 19744462 / update - scope - value - when - service - data - is - changed
    //watch function which checks value for change on digest loop
    //unsure of realistically how hard on performance this is....
    $scope.$watch(function () {
        $scope.vocabSelect = vocabFactory.get();
        //console.log('vocabarray INSERT CONTROLLER: $scope.vocabSelect', $scope.vocabSelect);//console testing
    });



    $scope.keyword = '';
    $scope.keywords = [];//the keywords filtered according to vocab selection

    // $scope.loadKeywords = function () {
    $http.get('/api/Data/GetKeyword')
        .success(function (result) {
            $scope.keywords = result;
            console.log('Keywords: $scope.keywords ', $scope.keywords);
        })
        .error(function (data) {
            console.log(data);
        })
    //  }




    //for the predefined tags
    $scope.schemaTag = [];//the list of predefined tags
    $scope.baseTags = [];//the schema.org base tags available on their site

    //calls controller to retrieve any already available pre-defined tags
    //$scope.loadTags = function () {
    $http.get('/api/Data/GetSchemaTag')
        .success(function (result) {
            $scope.schemaTag = result;//stores them in the array
            console.log('Predefined tags: $scope.schemaTag ', $scope.schemaTag);//console testings
        })
        .error(function (data) {
            console.log(data);
        })
    //}

    $scope.baseTag = '';
    //loads predefined base tags from schema.org
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


    $scope.insertTag = '<tag>';//default value - also used as a model for the predefined tags ($scope.schemaTag)

    $scope.$watch('insertTag', function () {
        tagFactory.store($scope.insertTag);//not doing a test because it will keep watching and clog console
                                           //will test its recieved in factory
    })





    //tagbuilder also has its own controller below
    //the elements required to create a tag
    $scope.insertScope = '<div itemscope=”http://schema.org/'; //scope tag
    $scope.insertProp = '<span itemprop=”'; //property tag
    $scope.end = '”>';//the end
    $scope.type = '';//probably not going to need this??
        
        

    //function which constructs the tag using the different elements that have been selected
    //scope tag takes in both the keyword and the base tag
        $scope.buildScope = function (baseTag, keyword) {

            //stringbuilder
            //really straightforward javascript method that concatonates strings together
            $scope.insertTag = $scope.insertScope.concat(baseTag, keyword, $scope.end);
            tagFactory.store($scope.insertTag);
            console.log('scope tag: $scope.insertTag', $scope.insertTag);//console testing
        };

    //propery tag just takes in keyword
    //uses the same string building method as the scope function
        $scope.buildProp = function (keyword) {
            //stringbuilder
            $scope.insertTag = $scope.insertProp.concat(keyword, $scope.end);
            tagFactory.store($scope.insertTag);
            console.log('property tag: $scope.insertTag', $scope.insertTag);
        };

    
    //function submits the newly created tag into the database
        $scope.submitTag = function(keyword){
        $scope.word = keyword;

        $scope.submit = [$scope.word, $scope.insertTag];//instantiate the submit array (will take a keyword and a tag)
        console.log('submit array NEW TAG:  $scope.submit', $scope.submit);
        //submit tag to database
        //takes in the keyword as a parameter to store at that index within the database
        $http({
            method: 'POST',//what type of http request is it
            url: '../api/Data/InsertTag',//name of the uri method being called in contoller
            data: $scope.submit//parameters being passed
        })
               .success(function () {
                   console.log('Success');//test in console
               })
               .error(function (data) {
                   console.log('Failed data', data)//test in console
               });

        $scope.submit = [];//resets the array to 0 
    }//end submitTag method

}]);

//Will populate dropdown menus and set apporpriate parameters for inserting into database tables
//should be changed to a directive
myApp.controller('dropdownData', ['$scope', '$http', 'vocabFactory', function ($scope, $http, vocabFactory) {

    $scope.catSelect = '';
    $scope.vocabSelect = '';

    $scope.$watch('vocabSelect', function () {//watch for any changes in this scope variable
        vocabFactory.store($scope.vocabSelect);//if there is a change, make the value bound to vocab select = to the value in the factory
        console.log('vocabarray DropDowncontroller: $scope.vocabSelect', $scope.vocabSelect);//console testing
    })

    /*
    $scope.vocabSelect = vocabFactory.vocabSelect;//set to value in the factory service

    //watch must be set on the factory service so that when the value changes it updates in this scope
        $scope.$watch('vocabSelect', function () {//watch vocab select for any changes and when there is a change
            vocabFactory.vocabSelect = $scope.vocabSelect;//update the value at vocabservce vocab select to the new value
            console.log('vocabarray DropDowncontroller: $scope.vocabSelect', $scope.vocabSelect);//console testing
        });
        */

    $scope.dropdownTables = {};

    //initial get request to populate the different catalogues
    $http.get('/api/Catalogue/GetCatalogueTitle')
        .success(function (result) {
            $scope.catalogueTable = result;
            console.log('Success, $scope.catalogueTable: ', $scope.catalogueTable);//error checking
        })
        .error(function (data) {
            console.log(data);
        });

    //populate the arrays
    //a series of get requests that bind the relevent vocabularies to the appropriate catagories
    //this is done server side using linq query language in the controllers
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



    //relating the tables to the appropriate catagory
        $scope.loadArray = function () {
            $scope.vocabArray = { 'Administration': $scope.adminCat, 'Oceanography': $scope.oceanCat, 'Meteorology': $scope.meteorCat, 'OceanEnergy': $scope.energyCat };
            //console.log('Vocab Array: $scope.vocabArray', $scope.vocabArray);
        }

    //when a catagory is selcted - the function looks for value at the 'index' selected
    // e.g. if catSelect = 'OceanEnergy' then vocabArray['OceanEnergy'] = energyCat
        $scope.populate = function (catSelect) {
            $scope.dropdownTables = $scope.vocabArray[catSelect];
            console.log('Array selected: $scope.dropdownTables ', $scope.dropdownTables);
        }


}]);


//this is a small factory which enables the drop down menu to pass the value
//of the vocabulary selected out to other controllers which need it
//anthony alicea service videos helped with this and placing the $watch
//on the related scope variables in other controllers
myApp.factory('vocabFactory', function () {

    var selected ='';
  
    return {
        store: function (word) {
            selected = word;
            console.log('selected vocab in factory: word ', word);//console testing
        },
        get: function () {
            return selected;
        }
    }
   
       
});

//handles the functionality of inserting tags
myApp.controller('htmlEdit', ['$scope', 'tagFactory', function ($scope, tagFactory) {

    $scope.filePath = '';

    $scope.plainHTML = "";//placeholder

    //$scope.tag = '<span itemprop="test">';

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
        $scope.tag = tagFactory.get();

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

}]);//end html editor

//will be used to share tags from main insert controller - to the editor
myApp.factory('tagFactory', function () {

    var tag = '';

    return {
        store: function (newTag) {
            tag = newTag;
            console.log('new tag in TAG FACTORY: newTag', newTag);//console testing
        },
        get: function () {
            return tag;
        }
    }

});//end tag service



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

//included in the insertController
myApp.controller('tagBuiler', ['$scope', function ($scope) {

    $scope.insertScope = '<itemscope=”http://schema.org/';
    $scope.insertProp = '<span itemprop=”';
    $scope.end = '”>';
    $scope.type = '';
    //$scope.keyword = '';

    $scope.insertTag = '';

    $scope.buildTag = function (baseTag, keyword, en) {

        if ($scope.type === 'itemprop') {
            //stringbuilder
            insertTag = insertProp.concat(keyword);
        } else {
            //stringbuilder
            insertScope = insertTag.concat(baseTag, keyword, end);
        }


    }

    $scope.buildScope = function (baseTag, keyword) {

        //stringbuilder
        $scope.insertScope = $scope.insertTag.concat(baseTag, keyword, $scope.end);
        console.log('property tag: $scope.insertTag', $scope.insertTag);
    }

    $scope.buildProp = function (keyword) {
        //stringbuilder
        $scope.insertTag = $scope.insertProp.concat(keyword, $scope.end);
        console.log('property tag: $scope.insertTag', $scope.insertTag);
    }

}]);//not being used


