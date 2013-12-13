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

    scheduleFactory.getSlotsTaken = function (day, month, year, promotion) {
        return $http.get('getSlotsTaken/' + day + '/' + month + '/' + year + '/' + promotion._id);
    };

    scheduleFactory.getScheduleModels = function () {
        return $http.get('getSchedulesModels/');
    };

    scheduleFactory.getTeacherTotalHour = function (teacher) {
        return $http.get('getTeacherTotalHour/'+teacher._id);
    };

    scheduleFactory.getTeacherTotalHourByCourse = function (teacher, course) {
        return $http.get('getTeacherTotalHourByCourse/' + teacher._id + '/' + course._id);
    };

    scheduleFactory.getPromotionTotalHourByCourse = function (promotion, course) {
        return $http.get('getPromotionTotalHourByCourse/' + promotion._id + '/' + course._id);
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

        $scope.init = function () {
            classroomFactory.findAll().success(function (data, status, headers, config) {
                $scope.classrooms = data;
            });
            teacherFaotory.findAll().success(function (data, status, headers, config) {
                $scope.teachers = data;
                $scope.teachersLeft = $scope.teachers.slice(0);
            });
            courseFactory.findAll().success(function (data, status, headers, config) {
                $scope.courses = data;
            });
            promotionFactory.findAll().success(function (data, status, headers, config) {
                $scope.promotions = data;
                //On l'appelle lors du dernier findAll pour être sûr que la vue est bien chargée
                $scope.loadColors();
            });

        };

        $scope.teacherHours = Array();
        $scope.teacherHoursByCourse = Array();
        $scope.possibleSlots = Array();
        $scope.alerts = Array();

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };



        $scope.loadColors = function(){
            $("#wheel_model_schedule").minicolors({
                control: $(this).attr('data-control') || 'wheel',
                defaultValue: $(this).attr('data-defaultValue') || '#18b1dd',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    $('.schedule_preview').css('background-color', hex);
                },
                theme: 'bootstrap'
            });
            $("#wheel_schedule").minicolors({
                control: $(this).attr('data-control') || 'wheel',
                defaultValue: $(this).attr('data-defaultValue') || '#18b1dd',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    $('.schedule_preview').css('background-color', hex);
                },
                theme: 'bootstrap'
            });
        };

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

        $scope.format="dd/MM/yyyy";

        $scope.checkSlotsTaken = function()
        {
            $scope.slots = Array(
                {id:1, taken: false, name:"8:45 - 9:45"},
                {id:2, taken: false, name:"9:45 - 10:45"},
                {id:3, taken: false, name:"11:00 - 12:00"},
                {id:4, taken: false, name:"12:00 - 13:00"},
                {id:5, taken: false, name:"13:45 - 14:45"},
                {id:6, taken: false, name:"14:45 - 15:45"},
                {id:7, taken: false, name:"16:00 - 17:00"},
                {id:8, taken: false, name:"17:00 - 18:00"});
          if($scope.promotion!==undefined && $scope.promotion!=="")
          scheduleFactory.getSlotsTaken($scope.dt.getDate(), $scope.dt.getMonth(),$scope.dt.getFullYear(), $scope.promotion)
              .success(function(data){
                  for(var index in $scope.slots)
                  {
                      $scope.slots[index].taken = false;
                  }
                  for(var index in data)
                  {
                      if(data[index].begin === data[index].end)
                      {
                          $scope.slots[data[index].begin-1].taken = true;
                      }
                      else
                      {
                          var diff = data[index].end- data[index].begin;
                          for(var i=data[index].begin-1; i<=diff+data[index].begin-1; i++)
                          {
                              $scope.slots[i].taken=true;
                          }
                      }
                  }
              });
        };

        $scope.teachersTab = Array();

        $scope.appendTeacher = function()
        {
            var teacher = $scope.teacher;
            if($scope.teacher!==undefined && $scope.teacher!=="" && $scope.teachersTab.length<2)
            {
                $scope.teachersTab.push($scope.teacher);
                $scope.teachersLeft.splice($scope.teachersLeft.indexOf($scope.teacher), 1);
                scheduleFactory.getTeacherTotalHour(teacher).success(function(data){
                     var temp = teacher.last_name+" "+teacher.first_name.charAt(0).toUpperCase()+". : "+data;
                     $scope.teacherHours.push(temp);
                });
                if($scope.course!==undefined && $scope.course!=="")
                {
                    scheduleFactory.getTeacherTotalHourByCourse(teacher, $scope.course).success(function(data){
                        var temp = teacher.last_name+" "+teacher.first_name.charAt(0).toUpperCase()+". : "+data;
                        $scope.teacherHoursByCourse.push(temp);
                    });
                }
                $scope.teacher = undefined;
            }
        };

        $scope.cancelTeacher = function(teacherAdded)
        {
            $scope.teachersLeft.push(teacherAdded);
            $scope.teacherHoursByCourse.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teacherHours.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teachersTab.splice($scope.teachersTab.indexOf(teacherAdded), 1);

        };

        $scope.checkCourseHours = function()
        {
            $scope.teacherHoursByCourse.length = 0;
            if($scope.teachersTab.length > 0 && $scope.course!==undefined && $scope.course!=="")
            {
                var index = 0;
                scheduleFactory.getTeacherTotalHourByCourse($scope.teachersTab[index], $scope.course).success(function (data) {
                    var temp = $scope.teachersTab[index].last_name + " " + $scope.teachersTab[index].first_name.charAt(0).toUpperCase() + ". : " + data;
                    $scope.teacherHoursByCourse.push(temp);
                    if ($scope.teachersTab.length > 1) {
                        index = 1;
                        scheduleFactory.getTeacherTotalHourByCourse($scope.teachersTab[index], $scope.course).success(function (data) {
                            var temp = $scope.teachersTab[index].last_name + " " + $scope.teachersTab[index].first_name.charAt(0).toUpperCase() + ". : " + data;
                            $scope.teacherHoursByCourse.push(temp);

                        });
                    }
                });

            }
        };

        $scope.checkPromotionHours = function()
        {
            $scope.promotionHours=Array();
            if($scope.course!==undefined && $scope.course!=="" && $scope.promotion!==undefined && $scope.promotion!=="")
            {
                scheduleFactory.getPromotionTotalHourByCourse($scope.promotion, $scope.course).success(function(data){
                    $scope.promotionHours = $scope.promotion.name+" : "+data;
                });
            }
        };

        $scope.checkPossibleSlots = function()
        {
            $scope.possibleSlots.length = 0;
            for(var i=$scope.slots.indexOf($scope.begin); i<$scope.slots.length; i++)
            {
                if($scope.slots[i].taken)break;
                $scope.possibleSlots.push($scope.slots[i]);
            }
        };

        $scope.addScheduleModel = function () {
            var teachersIDs = Array();
            for(var id in $scope.teachersTab)
            {
                teachersIDs.push($scope.teachersTab[id]._id);
            }
            var schedule = {
                teachers: teachersIDs,
                classroom: $scope.classroom._id,
                course: $scope.course._id,
                promotion: $scope.promotion._id,
                date: null,
                color: $('#wheel_model_schedule').val(),
                begin: null,
                end: null
            };
            console.log(schedule);
            scheduleFactory.add(schedule).success(function (data, status, headers, config) {
                $scope.result = data;
            });
        };

        $scope.addSchedule = function () {
            if ($scope.classroom !== undefined && $scope.classroom !== "" && !$.isEmptyObject($scope.classroom)
                && $scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== ""  && !$.isEmptyObject($scope.promotion)
                && $scope.begin !== undefined && $scope.begin !== "" && !$.isEmptyObject($scope.begin)
                && $scope.end !== undefined && $scope.end !== "" && !$.isEmptyObject($scope.end))
            {
                if ($scope.begin.id > $scope.end.id)
                {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "La tranche de début ne peut être supérieure à la tranche de fin"})
                }
                var teachersIDs = Array();
                for (id in $scope.teachersTab) {
                    teachersIDs.push($scope.teachersTab[id]._id);
                }
                if(teachersIDs.length===0)teachersIDs=null;
                var schedule = {
                    teachers: teachersIDs,
                    classroom: $scope.classroom._id,
                    course: $scope.course._id,
                    promotion: $scope.promotion._id,
                    date: $scope.dt,
                    color: $('#wheel_schedule').val(),
                    begin: $scope.begin.id,
                    end: $scope.end.id
                };
                scheduleFactory.add(schedule)
                    .success(function (data, status, headers, config) {
                        console.log("datatatatat : "+data);
                        if(data==="classroom")
                        {
                            $scope.alerts.length = 0;
                            $scope.alerts.push({type: 'error', msg: "Cette classe est déjà prise à cette heure là"});
                        }
                        else
                        {
                            $scope.result = data;
                            $scope.classroom = {};
                            $scope.course = {};
                            $scope.teachersLeft = $scope.teachers.slice(0);
                            $scope.teachersTab.length = 0;
                            $scope.teacherHours.length = 0;
                            $scope.teacherHoursByCourse.length = 0;
                            $scope.promotionHours = undefined;
                            $scope.promotion = {};
                            $scope.begin = {};
                            $scope.end = {};
                            $scope.alerts.length = 0;
                            $scope.possibleSlots.length = 0;
                            $scope.alerts.push({type: 'success', msg: "Insertion de cours réussie"});
                        }

                    })
                    .error(function () {
                        $scope.alerts.length = 0;
                        $scope.alerts.push({type: 'error', msg: "Un problème est survenu"})
                    });
            }
            else
            {
                $scope.alerts.length = 0;
                $scope.alerts.push({type: 'error', msg: "Veuillez remplir tous les champs"})
            }
        };
        $scope.test = function(){
           // scheduleFactory.findAll().success(function(data){$scope.test = data;})
        }

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