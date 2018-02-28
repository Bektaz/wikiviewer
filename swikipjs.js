//defining wikiApp which is main and injecting ngResource module
var wikiApp = angular.module('wikiApp',['ngResource']);   

//defining controller
wikiApp.controller('maincontroller',['$scope','$resource',function($scope,$resource){
    //variables
    $scope.searchWord = '';
    $scope.arr = [];
    $scope.vis = false;
    $scope.acIsVis = false;
    
    //enter key function
    $scope.enterfunc = function(){
        $scope.dataget();
        $scope.vis = true;
        $scope.acIsVis = false;
        $scope.searchWord = '';
        $scope.arr = [];
    }        
    
    //change function when change happens in input field
    $scope.change = function (){
        $scope.vis = false;
        $scope.acIsVis = true;
        console.log($scope.acIsVis);
        $scope.dataget();
        if($scope.searchWord.length===0){
            $scope.vis = false; 
        }
        $scope.arr = [];
    }
    
    //when link in autocomplete is clicked title from JSON object assigned to searchword var 
    //and request with that searchword is made with enterfunct()
    $scope.clickfunc = function(el){
        $scope.wR.$promise.then(function(data){
            $scope.searchWord = data.query.search[el].title;
            $scope.enterfunc();
            
        });
    } 
    
    //helper function, dataget function makes request to return JSON object and it removes html tags from
    //returned snippets and assigns the value back, so when data is accessed in html page the result is human
    //readable
    $scope.dataget = function(){
        $scope.wikiAPI = $resource("https://en.wikipedia.org/w/api.php?action=query&list=search&srwhat=text&srprop=snippet&continue=&format=json&callback=?",{callback: "JSON_CALLBACK"},{get:{method: "JSONP"}});
        $scope.wR =  $scope.wikiAPI.get({srsearch: $scope.searchWord});
        $scope.wR.$promise.then(function(data){
            for(var i=0; i<data.query.search.length; i++){
                var ar = data.query.search[i].snippet.split('<').join(',').split('>').join(',').split(',');
                for(var j=0; j<ar.length; j++){
                    if(ar[j]==='span class="searchmatch"' || ar[j]==='/span'){
                        ar[j] = ',';
                    }
                }
                $scope.arr.push(i);
                data.query.search[i].snippet = ar.join(',').split(',,,').join('');
            }
        });
    }    
}]);