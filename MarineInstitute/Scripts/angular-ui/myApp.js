var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', '$location', function ($scope, $location) {


}]);

//Will populate dropdown menus and set apporpriate parameters for inserting into database tables
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


   

    //the following will submit to the database

        
    $scope.submitDB = function () {

    //set parameters
        $scope.submit = Submit.get();
        $scope.submitArray = [$scope.vocabSelect];
        $scope.submitArray = $scope.submitArray.concat($scope.submit);
       
        console.log('params: $scope.submitArray', $scope.submitArray);

    //post method
        $http({ method: 'POST', url: '/api/Data/Insert', data: $scope.submitArray })
        .success(function () {
            console.log('Check DB!');
        })
        .error(function (data) {
            console.log('Failed data', data);
        });

        //Submit.clear();

    }



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

}]);

myApp.factory('tagAttr', ['$rootScope', function ($rootScope) {

    //attributes to be shared go here

}]);

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

}]);


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

    //transfer array function
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
            
            if (newArray === $scope.submit) { Submit.store($scope.submit); }
            
            
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

    //submit stop words
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

myApp.controller('htmlEdit', ['$scope', function ($scope) {

    $scope.filePath ='';
    
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
        
        
        reader.onload = function(e){
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


        
}]);



myApp.factory('loadTables', ['$http', '$q', function ($http, $q) {

    var deferred = $q.defer();


}]);



