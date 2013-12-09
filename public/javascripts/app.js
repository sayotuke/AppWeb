var app = angular.module('calendarApp', ['ui.bootstrap'])
    .directive('repeatDirective', function() {
        return function(scope, element, attrs) {
            if (scope.$last){
                $('.hiddenElements').hide();
            }
        };
    });
app.factory('classroomFactory', ['$http', function($http) {

    var classroomFactory = {};

    classroomFactory.findAll = function () {
        return $http.get('/getClassrooms');
    };

    classroomFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    classroomFactory.add = function (data) {
        return $http.post('/addClassroom/',data);
    };

    classroomFactory.edit = function (classroom, newName) {
        return $http.put('/editClassroom/'+classroom._id+'/'+newName);
    };

    classroomFactory.delete = function (classroom) {
        return $http.delete('/deleteClassroom/'+classroom._id);
    };

    return classroomFactory;
}]);
app.factory('teacherFactory', ['$http', function($http) {

    var teacherFactory = {};

    teacherFactory.findAll = function () {
        return $http.get('/getTeachers');
    };

    teacherFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    teacherFactory.add = function (data) {
        return $http.post('/addTeacher/', data);
    };

    teacherFactory.edit = function (teacher, new_last_name, new_first_name) {
        return $http.put('/editTeacher/'+teacher._id+'/'+new_last_name+'/'+new_first_name);
    };

    teacherFactory.delete = function (teacher) {
        return $http.delete('/deleteTeacher/'+teacher._id);
    };

    return teacherFactory;
}]);
app.factory('courseFactory', ['$http', function($http) {

    var courseFactory = {};

    courseFactory.findAll = function () {
        return $http.get('/getCourses');
    };

    courseFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    courseFactory.add = function (data) {
        return $http.post('/addCourse/',data);
    };

    courseFactory.edit = function (course, newName) {
        return $http.put('/editCourse/'+course._id+'/'+newName);
    };

    courseFactory.delete = function (course) {
        return $http.delete('/deleteCourse/'+course._id);
    };

    return courseFactory;
}]);
app.factory('promotionFactory', ['$http', function($http) {

    var promotionFactory = {};

    promotionFactory.findAll = function () {
        return $http.get('/getPromotions');
    };

    promotionFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    promotionFactory.add = function (data) {
        return $http.post('/addPromotion/',data);
    };

    promotionFactory.edit = function (promotion, newName) {
        return $http.put('/editPromotion/'+promotion._id+'/'+newName);
    };

    promotionFactory.delete = function (promotion) {
        return $http.delete('/deletePromotion/'+promotion._id);
    };

    return promotionFactory;
}]);
app.factory('scheduleFactory', ['$http', function($http) {

    var scheduleFactory = {};

    scheduleFactory.findAll = function () {
        return $http.get('/getSchedules');
    };

    scheduleFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    scheduleFactory.add = function (data) {
        return $http.post('/addSchedule/',data);
    };

    scheduleFactory.edit = function (promotion, newName) {
        return $http.put('/editPromotion/'+promotion._id+'/'+newName);
    };

    scheduleFactory.delete = function (promotion) {
        return $http.delete('/deletePromotion/'+promotion._id);
    };

    return scheduleFactory;
}]);
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
        .when('/courses',
        {
            controller: 'CourseController',
            templateUrl: 'partials/courses.html'
        })
        .when('/promotions',
        {
            controller: 'PromotionController',
            templateUrl: 'partials/promotions.html'
        })
        .when('/schedules',
        {
            controller: 'ScheduleController',
            templateUrl: 'partials/schedules.html'
        })
        .when('/csv',
        {
            controller: 'CsvController',
            templateUrl: 'partials/csv.html'
        })
        .otherwise({redirectTo: '/'});
});
app.controller('ClassroomController',['$scope','$http','$timeout','classroomFactory', function($scope, $http, $timeout, classroomFactory)
{
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.classroomsFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function(){
        $scope.findAll();
    }

    $scope.collapse = function()
    {
        $scope.isCollapsed = !$scope.isCollapsed;
        if(!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else
        {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            classroomFactory.add($scope.data).success(function (data, status, headers, config) {
                if(!$scope.classrooms)$scope.findAll();
                $scope.classrooms.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function(){
        classroomFactory.findAll().success(function(data, status, headers, config) {
            $scope.classrooms = data;
            if($scope.classrooms)$scope.noOfPages = Math.ceil($scope.classrooms.length/$scope.entryLimit);
        });
    };
    $scope.delete =function(classroom){
        classroomFactory.delete(classroom).success(function(data, status, headers, config) {
            $scope.classrooms.splice($scope.classrooms.indexOf(classroom), 1);
            if((($scope.classrooms.length)%$scope.entryLimit)===0)
            {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.classrooms.length/$scope.entryLimit);
            }
        });
    }
    $scope.edit = function(classroom)
    {
        $("#span"+classroom._id).hide();
        $("#editButton"+classroom._id).hide();
        $("#deleteButton"+classroom._id).hide();
        $("#saveButton"+classroom._id).show();
        $("#cancelButton"+classroom._id).show();
        $("#text"+classroom._id).val(classroom.name).show();
    }
    $scope.edit_save = function(classroom)
    {
        var newName = $("#text"+classroom._id).val();
        if(newName!="")
        {
            classroomFactory.edit(classroom, newName).success(function(data, status, headers, config) {
                $scope.classrooms[$scope.classrooms.indexOf(classroom)].name = newName;
            });
            $("#span"+classroom._id).show();
            $("#editButton"+classroom._id).show();
            $("#deleteButton"+classroom._id).show();
            $("#saveButton"+classroom._id).hide();
            $("#cancelButton"+classroom._id).hide();
            $("#text"+classroom._id).hide();
        }
    }
    $scope.cancel = function(classroom)
    {
        $("#span"+classroom._id).show();
        $("#editButton"+classroom._id).show();
        $("#deleteButton"+classroom._id).show();
        $("#saveButton"+classroom._id).hide();
        $("#cancelButton"+classroom._id).hide();
        $("#text"+classroom._id).hide();
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

}]);
app.controller('TeacherController', ['$scope','$http','$timeout','teacherFactory', function($scope, $http, $timeout, teacherFactory)
{
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.teachersFiltered = new Array();

    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function(){
        $scope.findAll();
    }

    $scope.collapse = function()
    {
        $scope.isCollapsed = !$scope.isCollapsed;
        if(!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else
        {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.last_name !== undefined && $scope.data.first_name !== undefined) {
            teacherFactory.add($scope.data).success(function (data, status, headers, config) {
                if(!$scope.teachers)$scope.findAll();
                $scope.teachers.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function(){
        teacherFactory.findAll().success(function(data, status, headers, config) {
            $scope.teachers = data;
            if($scope.teachers)$scope.noOfPages = Math.ceil($scope.teachers.length/$scope.entryLimit);
        });
    };
    $scope.delete =function(teacher){
        teacherFactory.delete(teacher).success(function(data, status, headers, config) {
            $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
            if((($scope.teachers.length)%$scope.entryLimit)===0)
            {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.teachers.length/$scope.entryLimit);
            }
        });
    }
    $scope.edit = function(teacher)
    {
        $("#span_last_name"+teacher._id).hide();
        $("#span_first_name"+teacher._id).hide();
        $("#editButton"+teacher._id).hide();
        $("#deleteButton"+teacher._id).hide();
        $("#saveButton"+teacher._id).show();
        $("#cancelButton"+teacher._id).show();
        $("#text_last_name"+teacher._id).val(teacher.last_name).show();
        $("#text_first_name"+teacher._id).val(teacher.first_name).show();
    }
    $scope.edit_save = function(teacher)
    {
        var new_last_name = $("#text_last_name"+teacher._id).val();
        var new_first_name = $("#text_first_name"+teacher._id).val();
        if(new_last_name!="" && new_first_name!="")
        {
            teacherFactory.edit(teacher, new_last_name, new_first_name).success(function(data, status, headers, config) {
                $scope.teachers[$scope.teachers.indexOf(teacher)].last_name = new_last_name;
                $scope.teachers[$scope.teachers.indexOf(teacher)].first_name = new_first_name;
            });
            $("#span_last_name"+teacher._id).show();
            $("#span_first_name"+teacher._id).show();
            $("#editButton"+teacher._id).show();
            $("#deleteButton"+teacher._id).show();
            $("#saveButton"+teacher._id).hide();
            $("#cancelButton"+teacher._id).hide();
            $("#text_last_name"+teacher._id).hide();
            $("#text_first_name"+teacher._id).hide();
        }
    }
    $scope.cancel = function(teacher)
    {
        $("#span_last_name"+teacher._id).show();
        $("#span_first_name"+teacher._id).show();
        $("#editButton"+teacher._id).show();
        $("#deleteButton"+teacher._id).show();
        $("#saveButton"+teacher._id).hide();
        $("#cancelButton"+teacher._id).hide();
        $("#text_last_name"+teacher._id).hide();
        $("#text_first_name"+teacher._id).hide();
    }

    $scope.filter = function() {
        $timeout(function() { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.teachersFiltered.length/$scope.entryLimit);
            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller('CourseController', ['$scope','$http','$timeout','courseFactory', function($scope, $http, $timeout, courseFactory)
{
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.coursesFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function(){
        $scope.findAll();
    }

    $scope.collapse = function()
    {
        $scope.isCollapsed = !$scope.isCollapsed;
        if(!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else
        {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            courseFactory.add($scope.data).success(function (data, status, headers, config) {
                if(!$scope.courses)$scope.findAll();
                $scope.courses.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function(){
        courseFactory.findAll().success(function(data, status, headers, config) {
            $scope.courses = data;
            if($scope.courses)$scope.noOfPages = Math.ceil($scope.courses.length/$scope.entryLimit);
        });
    };
    $scope.delete =function(course){
        courseFactory.delete(course).success(function(data, status, headers, config) {
            $scope.courses.splice($scope.courses.indexOf(course), 1);
            if((($scope.courses.length)%$scope.entryLimit)===0)
            {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.courses.length/$scope.entryLimit);
            }
        });
    }
    $scope.edit = function(course)
    {
        $("#span"+course._id).hide();
        $("#editButton"+course._id).hide();
        $("#deleteButton"+course._id).hide();
        $("#saveButton"+course._id).show();
        $("#cancelButton"+course._id).show();
        $("#text"+course._id).val(course.name).show();
    }
    $scope.edit_save = function(course)
    {
        var newName = $("#text"+course._id).val();
        if(newName!="")
        {
            courseFactory.edit(course, newName).success(function(data, status, headers, config) {
                $scope.courses[$scope.courses.indexOf(course)].name = newName;
            });
            $("#span"+course._id).show();
            $("#editButton"+course._id).show();
            $("#deleteButton"+course._id).show();
            $("#saveButton"+course._id).hide();
            $("#cancelButton"+course._id).hide();
            $("#text"+course._id).hide();
        }
    }
    $scope.cancel = function(course)
    {
        $("#span"+course._id).show();
        $("#editButton"+course._id).show();
        $("#deleteButton"+course._id).show();
        $("#saveButton"+course._id).hide();
        $("#cancelButton"+course._id).hide();
        $("#text"+course._id).hide();
    }

    $scope.filter = function() {
        $timeout(function() { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.coursesFiltered.length/$scope.entryLimit);
            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller("PromotionController", ['$scope','$http','$timeout','promotionFactory', function($scope, $http, $timeout, promotionFactory){
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.promotionsFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function(){
        $scope.findAll();
    }

    $scope.collapse = function()
    {
        $scope.isCollapsed = !$scope.isCollapsed;
        if(!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else
        {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            promotionFactory.add($scope.data).success(function (data, status, headers, config) {
                if(!$scope.promotions)$scope.findAll();
                $scope.promotions.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function(){
        promotionFactory.findAll().success(function(data, status, headers, config) {
            $scope.promotions = data;
            if($scope.promotions)$scope.noOfPages = Math.ceil($scope.promotions.length/$scope.entryLimit);
        });
    };
    $scope.delete =function(promotion){
        promotionFactory.delete(promotion).success(function(data, status, headers, config) {
            $scope.promotions.splice($scope.promotions.indexOf(promotion), 1);
            if((($scope.promotions.length)%$scope.entryLimit)===0)
            {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.promotions.length/$scope.entryLimit);
            }
        });
    }
    $scope.edit = function(promotion)
    {
        $("#span"+promotion._id).hide();
        $("#editButton"+promotion._id).hide();
        $("#deleteButton"+promotion._id).hide();
        $("#saveButton"+promotion._id).show();
        $("#cancelButton"+promotion._id).show();
        $("#text"+promotion._id).val(promotion.name).show();
    }
    $scope.edit_save = function(promotion)
    {
        var newName = $("#text"+promotion._id).val();
        if(newName!="")
        {
            promotionFactory.edit(promotion, newName).success(function(data, status, headers, config) {
                $scope.promotions[$scope.promotions.indexOf(promotion)].name = newName;
            });
            $("#span"+promotion._id).show();
            $("#editButton"+promotion._id).show();
            $("#deleteButton"+promotion._id).show();
            $("#saveButton"+promotion._id).hide();
            $("#cancelButton"+promotion._id).hide();
            $("#text"+promotion._id).hide();
        }
    }
    $scope.cancel = function(promotion)
    {
        $("#span"+promotion._id).show();
        $("#editButton"+promotion._id).show();
        $("#deleteButton"+promotion._id).show();
        $("#saveButton"+promotion._id).hide();
        $("#cancelButton"+promotion._id).hide();
        $("#text"+promotion._id).hide();
    }

    $scope.filter = function() {
        $timeout(function() { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.promotionsFiltered.length/$scope.entryLimit);
            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller('ScheduleController', ['$scope', '$http', '$timeout', 'classroomFactory', 'teacherFactory', 'courseFactory',
    'promotionFactory', 'scheduleFactory', function ($scope, $http, $timeout, classroomFactory, teacherFaotory, courseFactory, promotionFactory, scheduleFactory) {
        classroomFactory.findAll().success(function (data, status, headers, config) {
            $scope.classrooms = data;
        });
        teacherFaotory.findAll().success(function (data, status, headers, config) {
            $scope.teachers = data;
            $scope.teachersLeft = $scope.teachers;
        });
        courseFactory.findAll().success(function (data, status, headers, config) {
            $scope.courses = data;
        });
        promotionFactory.findAll().success(function (data, status, headers, config) {
            $scope.promotions = data;
        });

        $(document).ready(function(){
            $("#wheel-demo").minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    try {
                        console.log(hex);
                    } catch (e) {
                    }
                },
                theme: 'bootstrap'
            });
        });



        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = ( $scope.minDate ) ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function () {
            $timeout(function () {
                $scope.opened = true;
            });
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.teachersTab = Array();

        $scope.appendTeacher = function()
        {
            if($scope.teacher!==undefined && $scope.teacher!=="" && $scope.teachersTab.length<2)
            {
                $scope.teachersTab.push($scope.teacher);
                $scope.teachersLeft.splice($scope.teachersLeft.indexOf($scope.teacher), 1);
                $scope.teacher = undefined;
            }
        };

        $scope.cancelTeacher = function(teacherAdded)
        {
            $scope.teachersLeft.push(teacherAdded);
            $scope.teachersTab.splice($scope.teachersTab.indexOf(teacherAdded), 1);
        }

        $scope.add = function () {
            var teachersIDs = Array();
            for(id in $scope.teachersTab)
            {
                teachersIDs.push($scope.teachersTab[id]._id);
            }
            var schedule = {
                teachers: teachersIDs,
                classroom: $scope.classroom._id,
                course: $scope.course._id,
                promotion: $scope.promotion._id,
                date: null,
                begin: 1,
                end: 4
            };
            console.log(schedule);
            scheduleFactory.add(schedule).success(function (data, status, headers, config) {
                $scope.result = data;
            });
        };

        $scope.$on('$viewContentLoaded', $scope.test);

        $scope.test = function(){
            scheduleFactory.findAll().success(function(data){$scope.test = data;});
            $("#wheel-demo").minicolors({
                control: $(this).attr('data-control') || 'wheel',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    try {
                        console.log(hex);
                    } catch (e) {
                    }
                },
                theme: 'bootstrap'
            });
        };

    }]);
app.controller('CsvController', function($scope, $http, $timeout){

    $.fn.upload = function(remote,data,successFn,progressFn) {
        // if we dont have post data, move it along
        if(typeof data != "object") {
            progressFn = successFn;
            successFn = data;
        }
        return this.each(function() {
            if($(this)[0].files[0]) {
                var formData = new FormData();
                formData.append($(this).attr("name"), $(this)[0].files[0]);

                // if we have post data too
                if(typeof data == "object") {
                    for(var i in data) {
                        formData.append(i,data[i]);
                    }
                }

                // do the ajax request
                $.ajax({
                    url: remote,
                    type: 'POST',
                    xhr: function() {
                        myXhr = $.ajaxSettings.xhr();
                        if(myXhr.upload && progressFn){
                            myXhr.upload.addEventListener('progress',function(prog) {
                                var value = ~~((prog.loaded / prog.total) * 100);

                                // if we passed a progress function
                                if(progressFn && typeof progressFn == "function") {
                                    progressFn(prog,value);

                                    // if we passed a progress element
                                } else if (progressFn) {
                                    $(progressFn).val(value);
                                }
                            }, false);
                        }
                        return myXhr;
                    },
                    data: formData,
                    dataType: "json",
                    cache: false,
                    contentType: false,
                    processData: false,
                    complete : function(res) {
                        var json;
                        try {
                            json = JSON.parse(res.responseText);
                        } catch(e) {
                            json = res.responseText;
                        }
                        if(successFn) successFn(json);
                    }
                });
            }
        });
    };


    $("#upload").on("click", function(){
        $("#myFile").upload("/uploadFile/", function(success){
            console.log("success");
        }, function(prog, value){
            $scope.value = value;
        });
    });

    /*
    var data = $("#myFile").val();
    console.log(data);

    $scope.upload = function(){
        console.log(data);
        $http.post('/uploadFile/', data).success(function(data, status, headers, config) {
           // $scope.courses[$scope.courses.indexOf(course)].name = newName;
        });
    };  */

});