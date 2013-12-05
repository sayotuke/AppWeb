var app = angular.module('calendarApp', ['ui.bootstrap'])
    .directive('repeatDirective', function() {
        return function(scope, element, attrs) {
            if (scope.$last){
                $('.hiddenElements').hide();
            }
        };
    });
app.factory('calendarFactory', function()
{
    var factory = {};
    var classrooms;

    factory.getClassrooms = function($scope)
    {
    };
    return factory;
});
app.filter('startFrom', function() {
    return function(input, start) {
        if(input){
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});
app.config(function($routeProvider){
    $routeProvider
        .when('/',
        {
            controller : 'IndexController',
            templateUrl: 'views/index.html'
        })
        .when('/classrooms',
        {
            controller: 'ClassroomController',
            templateUrl: 'partials/classrooms.html'
        })
        .when('/teachers',
        {
            controller: 'TeacherController',
            templateUrl: 'partials/teachers.html'
        })
        .otherwise({redirectTo: '/'});
});
app.controller('ClassroomController', function($scope, $http, $timeout)
{
    $scope.isCollapsed = false;
    $scope.entryLimit = 3;

    $scope.noOfPages = 1;
    $scope.currentPage = 4;
    $scope.maxSize = 5;
    $scope.classroomsFiltered = new Array();

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function(){
        $scope.findAll();
    }

    $scope.add = function () {
        var name = $('#name').val();
        if (name !== "") {
            $('#name').val("");
            $http.get('/addClassroom/' + name).success(function (data, status, headers, config) {
                console.log("avant : "+$scope.classrooms);
                if(!$scope.classrooms)$scope.findAll();
                $scope.classrooms.push(data);
                console.log("apres : "+$scope.classrooms);
                $scope.filter();
            });
        }
    };
    $scope.findAll = function(){
        $http.get('/getClassrooms').success(function(data, status, headers, config) {
            $scope.classrooms = data;
            if($scope.classrooms)$scope.noOfPages = Math.ceil($scope.classrooms.length/$scope.entryLimit);
        });
    };
    //bug affichage dans le delete, delete la mauvaise ligne
    $scope.delete =function(id, index){
        $http.delete('/deleteClassroom/'+id).success(function(data, status, headers, config) {
            $scope.classrooms.splice(index, 1);
            console.log(index);
            if((($scope.classrooms.length)%$scope.entryLimit)===0)
            {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.classrooms.length/$scope.entryLimit);
            }
        });
    }
    $scope.edit = function(id, name)
    {
        $("#span"+id).hide();
        $("#editButton"+id).hide();
        $("#saveButton"+id).show();
        $("#cancelButton"+id).show();
        $("#text"+id).val(name).show();
    }
    $scope.edit_save = function(id, index)
    {
        var name = $("#text"+id).val();
        if(name!="")
        {
            $http.get('/editClassroom/'+id+'/'+name).success(function(data, status, headers, config) {
                $scope.classrooms[index].name = name;
            });
            $("#span"+id).show();
            $("#editButton"+id).show();
            $("#saveButton"+id).hide();
            $("#cancelButton"+id).hide();
            $("#text"+id).hide();
        }
    }
    $scope.cancel = function(id)
    {
        $("#span"+id).show();
        $("#editButton"+id).show();
        $("#saveButton"+id).hide();
        $("#cancelButton"+id).hide();
        $("#text"+id).hide();
    }

    $scope.filter = function() {
       $timeout(function() { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.classroomsFiltered.length/$scope.entryLimit);
            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
           $('.hiddenElements').hide();
        }, 2);

    };

});
app.controller('TeacherController', function($scope, $http)
{
    $scope.addTeacher = function(){
        $http.get('/addTeacher').success(function(data, status, headers, config) {
        });
    };
    $scope.getTeachers = function(){
        $http.get('/getTeachers').success(function(data, status, headers, config) {
            $scope.teachers = data;
        });
    };
});