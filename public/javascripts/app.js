var app = angular.module('calendarApp', ['ui.bootstrap'])
    .directive('repeatDirective', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $('.hiddenElements').hide();
            }
        };
    });
/*
Factory des classrooms, effectue les requêtes vers le serveur
 */
app.factory('classroomFactory', ['$http', function ($http) {

    var classroomFactory = {};

    classroomFactory.findAll = function () {
        return $http.get('/getClassrooms');
    };

    classroomFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    classroomFactory.add = function (data) {
        return $http.post('/addClassroom/', data);
    };

    classroomFactory.edit = function (classroom, newName) {
        return $http.put('/editClassroom/' + classroom._id + '/' + newName);
    };

    classroomFactory.delete = function (classroom) {
        return $http.delete('/deleteClassroom/' + classroom._id);
    };

    return classroomFactory;
}]);
/*
 Factory des classrooms, effectue les requêtes vers le serveur
 */
app.factory('teacherFactory', ['$http', function ($http) {

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
        return $http.put('/editTeacher/' + teacher._id + '/' + new_last_name + '/' + new_first_name);
    };

    teacherFactory.delete = function (teacher) {
        return $http.delete('/deleteTeacher/' + teacher._id);
    };

    return teacherFactory;
}]);
/*
 Factory des course, effectue les requêtes vers le serveur
 */
app.factory('courseFactory', ['$http', function ($http) {

    var courseFactory = {};

    courseFactory.findAll = function () {
        return $http.get('/getCourses');
    };

    courseFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    courseFactory.add = function (data) {
        return $http.post('/addCourse/', data);
    };

    courseFactory.edit = function (course, newName) {
        return $http.put('/editCourse/' + course._id + '/' + newName);
    };

    courseFactory.delete = function (course) {
        return $http.delete('/deleteCourse/' + course._id);
    };

    return courseFactory;
}]);
/*
 Factory des groupes, effectue les requêtes vers le serveur
 */
app.factory('promotionFactory', ['$http', function ($http) {

    var promotionFactory = {};

    promotionFactory.findAll = function () {
        return $http.get('/getPromotions');
    };

    promotionFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    promotionFactory.add = function (data) {
        return $http.post('/addPromotion/', data);
    };

    promotionFactory.edit = function (promotion, newName) {
        return $http.put('/editPromotion/' + promotion._id + '/' + newName);
    };

    promotionFactory.delete = function (promotion) {
        return $http.delete('/deletePromotion/' + promotion._id);
    };

    return promotionFactory;
}]);
/*
 Factory des horaires, effectue les requêtes vers le serveur
 */
app.factory('scheduleFactory', ['$http', function ($http) {

    var scheduleFactory = {};

    scheduleFactory.findAll = function () {
        return $http.get('/getSchedules');
    };

    scheduleFactory.find = function (id) {
        return $http.get('/getSchedule/' + id);
    };

    /*
    Renvoie les tranches horaires occupées par un groupe pour un jour donné
     */
    scheduleFactory.getSlotsTaken = function (day, month, year, promotion) {
        return $http.get('getSlotsTaken/' + day + '/' + month + '/' + year + '/' + promotion._id);
    };

    /*
    Renvoie tous les modèles d'horaires
     */
    scheduleFactory.getScheduleModels = function () {
        return $http.get('getSchedulesModels/');
    };

    /*
    Renvoie le total d'heures d'un professeur
     */
    scheduleFactory.getTeacherTotalHour = function (teacher) {
        return $http.get('getTeacherTotalHour/' + teacher._id);
    };

    /*
     Renvoie le total d'heure d'un professeur par rapport à un cours
     */
    scheduleFactory.getTeacherTotalHourByCourse = function (teacher, course) {
        return $http.get('getTeacherTotalHourByCourse/' + teacher._id + '/' + course._id);
    };

    /*
    Renvoie le total d'heures d'un groupe par rapport à un cours
     */
    scheduleFactory.getPromotionTotalHourByCourse = function (promotion, course) {
        return $http.get('getPromotionTotalHourByCourse/' + promotion._id + '/' + course._id);
    };

    /*
    Renvoie true si le local est déjà pris, sinon false
     */
    scheduleFactory.isClassroomTaken = function (classroom, course, day, month, year, begin, end) {
        return $http.get('isClassroomTaken/' + classroom._id + '/' + course._id + '/' + day + '/' + month + '/' + year + '/' + begin + '/' + end);
    };

    /*
    Renvoie true si le professeur est déjà pris, sinon false
     */
    scheduleFactory.isTeacherTaken = function (teachers, course, day, month, year, begin, end) {
        return $http.get('isTeacherTaken/' + teachers + '/' + course._id + '/' + day + '/' + month + '/' + year + '/' + begin + '/' + end);
    };

    scheduleFactory.add = function (data) {
        return $http.post('/addSchedule/', data);
    };

    scheduleFactory.edit = function (id_schedule, day, month, year, begin, end) {
        return $http.put('/editSchedule/' + id_schedule + '/' + day + '/' + month + '/' + year + '/' + begin + '/' + end);
    };

    scheduleFactory.delete = function (id_schedule) {
        return $http.delete('/deleteSchedule/' + id_schedule);
    };

    /*
    Renvoie les horaires à une date donnée
     */
    scheduleFactory.getSchedulesOfDate = function (date) {
        return $http.get('/getSchedulesOfDate/' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
    };

    /*
    Renvoie les modèles d'horaires d'un groupe
     */
    scheduleFactory.getScheduleModelsOfPromotion = function (promotion) {
        return $http.get('/getScheduleModelsOfPromotion/' + promotion._id);
    };

    /*
    Renvoie true si le local est lié à au moins un horaire, sinon false
     */
    scheduleFactory.isClassroomLinked = function (classroom) {
        return $http.get('/isClassroomLinked/' + classroom._id);
    };

    /*
     Renvoie true si le groupe est lié à au moins un horaire, sinon false
     */
    scheduleFactory.isPromotionLinked = function (promotion) {
        return $http.get('/isPromotionLinked/' + promotion._id);
    };

    /*
     Renvoie true si le professeur est lié à au moins un horaire, sinon false
     */
    scheduleFactory.isTeacherLinked = function (teacher) {
        return $http.get('/isTeacherLinked/' + teacher._id);
    };

    /*
     Renvoie true si le cours est lié à au moins un horaire, sinon false
     */
    scheduleFactory.isCourseLinked = function (course) {
        return $http.get('/isCourseLinked/' + course._id);
    };

    return scheduleFactory;
}]);
/*Service qui nous permet de gérer la session côté client*/
app.service('userService', ['$http', function ($http) {
    var userService = {};
    var session = "";

    /*
    Demande la session au serveur
     */
    $http.get("/getSession").success(function (data) {
        session = data;
    });

    userService.logout = function () {
        session = undefined;
    };

    /*
      Renvoie true si un user est connecté, sinon false
     */
    userService.isConnected = function () {
        if (session == "") {
            return false;
        }
        else {
            return true;
        }
    }

    return userService;

}]);
/*Filtre utilisé pour la pagination */
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});
/*
Route sur les partials en fonction de l'url en leur assignant un controller et un template
 */
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'FrontOfficeController',
            templateUrl: 'partials/index.html'
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
        .when('/badLogin',
        {
            controller: 'BadLoginController',
            templateUrl: 'partials/badLogin.html'
        })
        .otherwise({redirectTo: '/'});
});
/*
Controller des locaux
 */
app.controller('ClassroomController', ['$scope', '$http', '$timeout', 'classroomFactory', 'userService', '$location',
    'scheduleFactory', function ($scope, $http, $timeout, classroomFactory, userService, $location, scheduleFactory) {
        //Si l'utilisateur n'est pas connecté, on le renvoie à l'index
        if (!userService.isConnected())
            $location.path("/");
        $scope.isCollapsed = false;
        $scope.entryLimit = 10;

        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.classroomsFiltered = new Array();
        $scope.data = {};

        $scope.alerts = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.init = function () {
            $scope.findAll();
        };

        $scope.collapse = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
            if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
            else {
                $scope.data = {};
                $('#addButton').text("Annuler");
            }
        };

        /*
        Ajoute un local
         */
        $scope.add = function () {
            if ($scope.data.name !== undefined) {
                classroomFactory.add($scope.data).success(function (data, status, headers, config) {
                    if (!$scope.classrooms)$scope.findAll();
                    $scope.classrooms.push(data);
                    $scope.filter();
                });
                $scope.data = {};
            }
        };

        /*
        Va chercher tous les locaux
         */
        $scope.findAll = function () {
            classroomFactory.findAll().success(function (data, status, headers, config) {
                $scope.classrooms = data;
                if ($scope.classrooms)$scope.itemsToShow = $scope.classrooms.length;
            });
        };

        /*
        Supprime un local
         */
        $scope.delete = function (classroom) {
            //On vérifie sle local n'est pas lié à un horaire
            scheduleFactory.isClassroomLinked(classroom).success(function (data) {
                //Le local n'est pas lié, on peut le supprimer
                if (data == "false") {
                    classroomFactory.delete(classroom).success(function (data, status, headers, config) {
                        $scope.classrooms.splice($scope.classrooms.indexOf(classroom), 1);
                        if ((($scope.classrooms.length) % $scope.entryLimit) === 0) {
                            $scope.currentPage--;
                            $scope.itemsToShow = $scope.classrooms.length;
                        }
                    });
                }
                //Le local est lié à au moins un horaire, on ne peut pas le supprimer
                else {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "Le local que vous essayez de supprimer est utilisé dans un ou plusieurs horaires, veuillez d'abord supprimer ces horaires"});
                }
            });

        };
        /*
        Passe en mode édition
         */
        $scope.edit = function (classroom) {
            $("#span" + classroom._id).hide();
            $("#editButton" + classroom._id).hide();
            $("#deleteButton" + classroom._id).hide();
            $("#saveButton" + classroom._id).show();
            $("#cancelButton" + classroom._id).show();
            $("#text" + classroom._id).val(classroom.name).show();
        };
        /*
        Sauvegarde une édition
         */
        $scope.edit_save = function (classroom) {
            var newName = $("#text" + classroom._id).val();
            if (newName != "") {
                classroomFactory.edit(classroom, newName).success(function (data, status, headers, config) {
                    $scope.classrooms[$scope.classrooms.indexOf(classroom)].name = newName;
                });
                $("#span" + classroom._id).show();
                $("#editButton" + classroom._id).show();
                $("#deleteButton" + classroom._id).show();
                $("#saveButton" + classroom._id).hide();
                $("#cancelButton" + classroom._id).hide();
                $("#text" + classroom._id).hide();
            }
        };
        /*
        Annule une édition
         */
        $scope.cancel = function (classroom) {
            $("#span" + classroom._id).show();
            $("#editButton" + classroom._id).show();
            $("#deleteButton" + classroom._id).show();
            $("#saveButton" + classroom._id).hide();
            $("#cancelButton" + classroom._id).hide();
            $("#text" + classroom._id).hide();
        };

        /*
        Adapte la pagination en fonction du nombre de résultats du filtre
         */
        $scope.filter = function () {
            $timeout(function () { //wait for 'filtered' to be changed
                $scope.itemsToShow = $scope.classrooms.length;
                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };
                $('.hiddenElements').hide();
            }, 2);

        };

    }]);
/*
Controller des professeurs
 */
app.controller('TeacherController', ['$scope', '$http', '$timeout', 'teacherFactory', 'userService', '$location', 'scheduleFactory',
    function ($scope, $http, $timeout, teacherFactory, userService, $location, scheduleFactory) {
        //Si l'utilisateur n'est pas connecté, on le renvoie à l'index
        if (!userService.isConnected())
            $location.path("/");
        $scope.isCollapsed = false;
        $scope.entryLimit = 10;

        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.teachersFiltered = new Array();

        $scope.data = {};

        $scope.alerts = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.init = function () {
            $scope.findAll();
        };

        $scope.collapse = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
            if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
            else {
                $scope.data = {};
                $('#addButton').text("Annuler");
            }
        };
        /*
        Ajout d'un professeur
         */
        $scope.add = function () {
            if ($scope.data.last_name !== undefined && $scope.data.first_name !== undefined) {
                teacherFactory.add($scope.data).success(function (data, status, headers, config) {
                    if (!$scope.teachers)$scope.findAll();
                    $scope.teachers.push(data);
                    $scope.filter();
                });
                $scope.data = {};
            }
        };
        /*
        Va chercher tous les professeurs
         */
        $scope.findAll = function () {
            teacherFactory.findAll().success(function (data, status, headers, config) {
                $scope.teachers = data;
                if ($scope.teachers)$scope.itemsToShow = $scope.teachers.length;
                for (var index in $scope.teachers) {
                    $scope.teachers[index].last_and_first_name = $scope.teachers[index].last_name + " " + $scope.teachers[index].first_name;
                }
            });
        };
        /*
        Supprime un professeur
         */
        $scope.delete = function (teacher) {
            //On vérifie sur le professeur n'est pas lié à au moins un horaire
            scheduleFactory.isTeacherLinked(teacher).success(function (data) {
                //Le professeur n'est pas lié, on peut le supprimer
                if (data == "false") {
                    teacherFactory.delete(teacher).success(function (data, status, headers, config) {
                        $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                        if ((($scope.teachers.length) % $scope.entryLimit) === 0) {
                            $scope.currentPage--;
                            $scope.itemsToShow = $scope.teachers.length;
                        }
                    });
                }
                //Le professeur est lié à au moins un horaire, on ne peut pas le supprimer
                else {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "Le professeur que vous essayez de supprimer est utilisé dans un ou plusieurs horaires, veuillez d'abord supprimer ces horaires"});
                }
            });

        };
        /*
        On passe en mode édition
         */
        $scope.edit = function (teacher) {
            $("#span_last_name" + teacher._id).hide();
            $("#span_first_name" + teacher._id).hide();
            $("#editButton" + teacher._id).hide();
            $("#deleteButton" + teacher._id).hide();
            $("#saveButton" + teacher._id).show();
            $("#cancelButton" + teacher._id).show();
            $("#text_last_name" + teacher._id).val(teacher.last_name).show();
            $("#text_first_name" + teacher._id).val(teacher.first_name).show();
        };
        /*
        On sauve une édition
         */
        $scope.edit_save = function (teacher) {
            var new_last_name = $("#text_last_name" + teacher._id).val();
            var new_first_name = $("#text_first_name" + teacher._id).val();
            if (new_last_name != "" && new_first_name != "") {
                teacherFactory.edit(teacher, new_last_name, new_first_name).success(function (data, status, headers, config) {
                    $scope.teachers[$scope.teachers.indexOf(teacher)].last_name = new_last_name;
                    $scope.teachers[$scope.teachers.indexOf(teacher)].first_name = new_first_name;
                });
                $("#span_last_name" + teacher._id).show();
                $("#span_first_name" + teacher._id).show();
                $("#editButton" + teacher._id).show();
                $("#deleteButton" + teacher._id).show();
                $("#saveButton" + teacher._id).hide();
                $("#cancelButton" + teacher._id).hide();
                $("#text_last_name" + teacher._id).hide();
                $("#text_first_name" + teacher._id).hide();
            }
        };
        /*
        On annule une édition
         */
        $scope.cancel = function (teacher) {
            $("#span_last_name" + teacher._id).show();
            $("#span_first_name" + teacher._id).show();
            $("#editButton" + teacher._id).show();
            $("#deleteButton" + teacher._id).show();
            $("#saveButton" + teacher._id).hide();
            $("#cancelButton" + teacher._id).hide();
            $("#text_last_name" + teacher._id).hide();
            $("#text_first_name" + teacher._id).hide();
        };
        /*
         Adapte la pagination en fonction du nombre de résultats du filtre
         */
        $scope.filter = function () {
            $timeout(function () { //wait for 'filtered' to be changed
                $scope.itemsToShow = $scope.teachers.length;
                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };
                $('.hiddenElements').hide();
            }, 2);

        };
    }]);
/*
Controller des cours
 */
app.controller('CourseController', ['$scope', '$http', '$timeout', 'courseFactory', 'userService', '$location', 'scheduleFactory',
    function ($scope, $http, $timeout, courseFactory, userService, $location, scheduleFactory) {
        //Si l'utilisateur n'est pas connecté, on le renvoie à l'index
        if (!userService.isConnected())
            $location.path("/");
        $scope.isCollapsed = false;
        $scope.entryLimit = 10;

        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.coursesFiltered = new Array();
        $scope.data = {};

        $scope.alerts = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };


        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.init = function () {
            $scope.findAll();
        };

        $scope.collapse = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
            if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
            else {
                $scope.data = {};
                $('#addButton').text("Annuler");
            }
        };

        /*
        Ajoute un cours
         */
        $scope.add = function () {
            if ($scope.data.name !== undefined) {
                courseFactory.add($scope.data).success(function (data, status, headers, config) {
                    if (!$scope.courses)$scope.findAll();
                    $scope.courses.push(data);
                    $scope.filter();
                });
                $scope.data = {};
            }
        };
        /*
        Va chercher tous les cours
         */
        $scope.findAll = function () {
            courseFactory.findAll().success(function (data, status, headers, config) {
                $scope.courses = data;
                if ($scope.courses)$scope.itemsToShow = $scope.courses.length;
            });
        };
        /*
        Supprime un cours
         */
        $scope.delete = function (course) {
            //On vérifie si un cours n'est pas lié à au moins un horaire
            scheduleFactory.isCourseLinked(course).success(function (data) {
                //Le cours n'est pas lié, on peut le supprimer
                if (data == "false") {
                    courseFactory.delete(course).success(function (data, status, headers, config) {
                        $scope.courses.splice($scope.courses.indexOf(course), 1);
                        if ((($scope.courses.length) % $scope.entryLimit) === 0) {
                            $scope.currentPage--;
                            $scope.itemsToShow = $scope.courses.length;
                        }
                    });
                }
                //Le cours est lié, on ne peut pas le supprimer
                else {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "Le cours que vous essayez de supprimer est utilisé dans un ou plusieurs horaires, veuillez d'abord supprimer ces horaires"});
                }
            });

        };
        /*
        Passe en mode édition
         */
        $scope.edit = function (course) {
            $("#span" + course._id).hide();
            $("#editButton" + course._id).hide();
            $("#deleteButton" + course._id).hide();
            $("#saveButton" + course._id).show();
            $("#cancelButton" + course._id).show();
            $("#text" + course._id).val(course.name).show();
        };
        /*
        Sauve une édition
         */
        $scope.edit_save = function (course) {
            var newName = $("#text" + course._id).val();
            if (newName != "") {
                courseFactory.edit(course, newName).success(function (data, status, headers, config) {
                    $scope.courses[$scope.courses.indexOf(course)].name = newName;
                });
                $("#span" + course._id).show();
                $("#editButton" + course._id).show();
                $("#deleteButton" + course._id).show();
                $("#saveButton" + course._id).hide();
                $("#cancelButton" + course._id).hide();
                $("#text" + course._id).hide();
            }
        };
        /*
        Annule une édition
         */
        $scope.cancel = function (course) {
            $("#span" + course._id).show();
            $("#editButton" + course._id).show();
            $("#deleteButton" + course._id).show();
            $("#saveButton" + course._id).hide();
            $("#cancelButton" + course._id).hide();
            $("#text" + course._id).hide();
        };

        /*
         Adapte la pagination en fonction du nombre de résultats du filtre
         */
        $scope.filter = function () {
            $timeout(function () { //wait for 'filtered' to be changed
                $scope.itemsToShow = $scope.coursesFiltered.length;
                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };
                $('.hiddenElements').hide();
            }, 2);

        };
    }]);
/*
Controller des groupes
 */
app.controller("PromotionController", ['$scope', '$http', '$timeout', 'promotionFactory', 'userService', '$location', 'scheduleFactory',
    function ($scope, $http, $timeout, promotionFactory, userService, $location, scheduleFactory) {
        //Si l'utilisateur n'est pas connecté, on le renvoie à l'index
        if (!userService.isConnected())
            $location.path("/");
        $scope.isCollapsed = false;
        $scope.entryLimit = 10;

        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.promotionsFiltered = new Array();
        $scope.data = {};

        $scope.alerts = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.init = function () {
            $scope.findAll();
        };

        $scope.collapse = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
            if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
            else {
                $scope.data = {};
                $('#addButton').text("Annuler");
            }
        };

        /*
        Ajoute un groupe
         */
        $scope.add = function () {
            if ($scope.data.name !== undefined) {
                promotionFactory.add($scope.data).success(function (data, status, headers, config) {
                    if (!$scope.promotions)$scope.findAll();
                    $scope.promotions.push(data);
                    $scope.filter();
                });
                $scope.data = {};
            }
        };
        /*
        Va chercher tous les groupes
         */
        $scope.findAll = function () {
            promotionFactory.findAll().success(function (data, status, headers, config) {
                $scope.promotions = data;
                if ($scope.promotions)$scope.itemsToShow = $scope.promotions.length;
            });
        };
        /*
        Supprime un cours
         */
        $scope.delete = function (promotion) {
            //Vérifie si le groupe est lié à au moins un horaire
            scheduleFactory.isPromotionLinked(promotion).success(function (data) {
                //Le cours n'est pas lié à un horaire, on peut le supprimer
                if (data == "false") {
                    promotionFactory.delete(promotion).success(function (data, status, headers, config) {
                        $scope.promotions.splice($scope.promotions.indexOf(promotion), 1);
                        if ((($scope.promotions.length) % $scope.entryLimit) === 0) {
                            $scope.currentPage--;
                            $scope.itemsToShow = $scope.promotions.length;
                        }
                    });
                }
                //Le cours est lié à au moins un horaire, on ne peut pas le supprimer
                else {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "Le groupe que vous essayez de supprimer est utilisé dans un ou plusieurs horaires, veuillez d'abord supprimer ces horaires"});
                }
            });

        };
        /*
        Passe en mode édition
         */
        $scope.edit = function (promotion) {
            $("#span" + promotion._id).hide();
            $("#editButton" + promotion._id).hide();
            $("#deleteButton" + promotion._id).hide();
            $("#saveButton" + promotion._id).show();
            $("#cancelButton" + promotion._id).show();
            $("#text" + promotion._id).val(promotion.name).show();
        };
        /*
        Sauve une édition
         */
        $scope.edit_save = function (promotion) {
            var newName = $("#text" + promotion._id).val();
            if (newName != "") {
                promotionFactory.edit(promotion, newName).success(function (data, status, headers, config) {
                    $scope.promotions[$scope.promotions.indexOf(promotion)].name = newName;
                });
                $("#span" + promotion._id).show();
                $("#editButton" + promotion._id).show();
                $("#deleteButton" + promotion._id).show();
                $("#saveButton" + promotion._id).hide();
                $("#cancelButton" + promotion._id).hide();
                $("#text" + promotion._id).hide();
            }
        };
        /*
        Annule une édition
         */
        $scope.cancel = function (promotion) {
            $("#span" + promotion._id).show();
            $("#editButton" + promotion._id).show();
            $("#deleteButton" + promotion._id).show();
            $("#saveButton" + promotion._id).hide();
            $("#cancelButton" + promotion._id).hide();
            $("#text" + promotion._id).hide();
        };

        /*
        Adapate la pagination en fonction du filtre
         */
        $scope.filter = function () {
            $timeout(function () { //wait for 'filtered' to be changed
                $scope.itemsToShow = $scope.promotions.length;
                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };
                $('.hiddenElements').hide();
            }, 2);

        };
    }]);
/*
Controller des horaires
 */
app.controller('ScheduleController', ['$scope', '$location', '$http', '$timeout', 'classroomFactory', 'teacherFactory', 'courseFactory',
    'promotionFactory', 'scheduleFactory', 'userService', '$location', function ($scope, $location, $http, $timeout, classroomFactory, teacherFactory, courseFactory, promotionFactory, scheduleFactory, userService, $location) {
        //Si l'utilisateur n'est pas connecté, on le renvoie à l'index
        if (!userService.isConnected())
            $location.path("/");
        $scope.init = function () {
            classroomFactory.findAll().success(function (data, status, headers, config) {
                $scope.classrooms = data;
            });
            teacherFactory.findAll().success(function (data, status, headers, config) {
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
        $scope.alerts_model = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.closeAlertModel = function (index) {
            $scope.alerts_model.splice(index, 1);
        };

        /*
        Initialisation de minicolors.js
         */
        $scope.loadColors = function () {
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
                    $('.schedule_preview_model').css('background-color', hex);
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

        // Enlève le selction de weekend dans le datepicker
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = ( $scope.minDate ) ? null : new Date(2012, 0, 1);
        };
        $scope.toggleMin();

        /*
        Ouvre le datePicker
         */
        $scope.open = function () {
            $timeout(function () {
                $scope.opened = true;
            });
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = "yyyy/MM/dd";

        /*
        Vérifie quelles sont les tranches horaires prises par le groupe
         */
        $scope.checkSlotsTaken = function () {
            $scope.slots = Array(
                {id: 1, taken: false, name: "8:45 - 9:45"},
                {id: 2, taken: false, name: "9:45 - 10:45"},
                {id: 3, taken: false, name: "11:00 - 12:00"},
                {id: 4, taken: false, name: "12:00 - 13:00"},
                {id: 5, taken: false, name: "13:45 - 14:45"},
                {id: 6, taken: false, name: "14:45 - 15:45"},
                {id: 7, taken: false, name: "16:00 - 17:00"},
                {id: 8, taken: false, name: "17:00 - 18:00"});
            if ($scope.promotion !== undefined && $scope.promotion !== "")
                scheduleFactory.getSlotsTaken($scope.dt.getDate(), $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.promotion)
                    .success(function (data) {
                        for (var index in $scope.slots) {
                            $scope.slots[index].taken = false;
                        }
                        for (var index in data) {
                            if (data[index].begin === data[index].end) {
                                $scope.slots[data[index].begin - 1].taken = true;
                            }
                            else {
                                var diff = data[index].end - data[index].begin;
                                for (var i = data[index].begin - 1; i <= diff + data[index].begin - 1; i++) {
                                    $scope.slots[i].taken = true;
                                }
                            }
                        }
                    });
        };

        $scope.teachersTab = Array();

        /*
        Rajoute le professeur dans l'aperçu et dans les professeurs qui seront insérés
         */
        $scope.appendTeacher = function () {
            var teacher = $scope.teacher;
            if ($scope.teacher !== undefined && $scope.teacher !== "" && $scope.teachersTab.length < 2) {
                $scope.teachersTab.push($scope.teacher);
                $scope.teachersLeft.splice($scope.teachersLeft.indexOf($scope.teacher), 1);
                scheduleFactory.getTeacherTotalHour(teacher).success(function (data) {
                    var temp = teacher.last_name + " " + teacher.first_name.charAt(0).toUpperCase() + ". : " + data;
                    $scope.teacherHours.push(temp);
                });
                if ($scope.course !== undefined && $scope.course !== "") {
                    scheduleFactory.getTeacherTotalHourByCourse(teacher, $scope.course).success(function (data) {
                        var temp = teacher.last_name + " " + teacher.first_name.charAt(0).toUpperCase() + ". : " + data;
                        $scope.teacherHoursByCourse.push(temp);
                    });
                }
                $scope.teacher = undefined;
            }
        };

        /*
        Enlève le professeur de l'aperçu et des professeurs qui seront insérés
         */
        $scope.cancelTeacher = function (teacherAdded) {
            $scope.teachersLeft.push(teacherAdded);
            $scope.teacherHoursByCourse.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teacherHours.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teachersTab.splice($scope.teachersTab.indexOf(teacherAdded), 1);

        };

        /*
        Va chercher les totaux d'heures du cours pour le professeur pour ce cours
         */
        $scope.checkCourseHours = function () {
            $scope.teacherHoursByCourse.length = 0;
            if ($scope.teachersTab.length > 0 && $scope.course !== undefined && $scope.course !== "") {
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

        /*
        Va chercher le total d'heures du groupes par rapport au cours
         */
        $scope.checkPromotionHours = function () {
            $scope.promotionHours = Array();
            if ($scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== "" && !$.isEmptyObject($scope.promotion)) {
                scheduleFactory.getPromotionTotalHourByCourse($scope.promotion, $scope.course).success(function (data) {
                    $scope.promotionHours = $scope.promotion.name + " : " + data;
                });
            }
        };

        /*
         Pour limiter l'input de end en fonction de begin et des slots possibles qu'il reste
         */
        $scope.checkPossibleSlots = function () {
            $scope.possibleSlots.length = 0;
            for (var i = $scope.slots.indexOf($scope.begin); i < $scope.slots.length; i++) {
                if ($scope.slots[i].taken)break;
                $scope.possibleSlots.push($scope.slots[i]);
            }
        };

        /*
        Ajoute un modèle d'horaire
         */
        $scope.addScheduleModel = function () {
            if ($scope.classroom !== undefined && $scope.classroom !== "" && !$.isEmptyObject($scope.classroom)
                && $scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== "" && !$.isEmptyObject($scope.promotion)) {
                var teachersIDs = Array();
                for (var id in $scope.teachersTab) {
                    teachersIDs.push($scope.teachersTab[id]._id);
                }
                if (teachersIDs.length === 0)teachersIDs = null;
                var schedule = {
                    teachers: teachersIDs,
                    classroom: $scope.classroom._id,
                    course: $scope.course._id,
                    promotion: $scope.promotion._id,
                    //date: null,
                    color: $('#wheel_model_schedule').val(),
                    begin: null,
                    end: null
                };
                scheduleFactory.add(schedule).success(function (data, status, headers, config) {
                    $scope.result = data;
                    $scope.getJsonData(true);
                    $scope.promotion = {};
                    $scope.classroom = {};
                    $scope.course = {};
                    $scope.teachersLeft = $scope.teachers.slice(0);
                    $scope.teachersTab.length = 0;
                    $scope.alerts_model.length = 0;
                    $scope.alerts_model.push({type: 'success', msg: "Insertion de modèle de cours réussie"});
                });
            }
            else
            {
                $scope.alerts_model.length = 0;
                $scope.alerts_model.push({type: 'error', msg: "Veuillez remplir tous les champs"})
            }
        };

        /*
        Ajoute un horaire
         */
        $scope.addSchedule = function () {
            if ($scope.classroom !== undefined && $scope.classroom !== "" && !$.isEmptyObject($scope.classroom)
                && $scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== "" && !$.isEmptyObject($scope.promotion)
                && $scope.begin !== undefined && $scope.begin !== "" && !$.isEmptyObject($scope.begin)
                && $scope.end !== undefined && $scope.end !== "" && !$.isEmptyObject($scope.end)) {
                if ($scope.begin.id > $scope.end.id) {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "La tranche de début ne peut être supérieure à la tranche de fin"});
                }
                var teachersIDs = Array();
                for (id in $scope.teachersTab) {
                    teachersIDs.push($scope.teachersTab[id]._id);
                }
                if (teachersIDs.length === 0)teachersIDs = null;
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
                /*
                Vérification des conflits
                 */
                scheduleFactory.isClassroomTaken($scope.classroom, $scope.course, $scope.dt.getDate(),
                        $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.begin.id, $scope.end.id)
                    .success(function (data) {
                        if (data === "true") {
                            $scope.alerts.length = 0;
                            $scope.alerts.push({type: 'error', msg: "Cette classe est déjà prise à cette heure là"});
                        }
                        else {
                            scheduleFactory.isTeacherTaken(schedule.teachers, $scope.course, $scope.dt.getDate(),
                                    $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.begin.id, $scope.end.id)
                                .success(function (data) {
                                    if (data === "true") {
                                        $scope.alerts.length = 0;
                                        $scope.alerts.push({type: 'error', msg: "Ce(s) professeur(s) donne(nt) déjà un autre cours à ces tranches là"});
                                    }
                                    else {
                                        scheduleFactory.add(schedule)
                                            .success(function (data) {
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
                                                $scope.possibleSlots.length = 0;
                                                $scope.alerts.length = 0;
                                                $scope.alerts.push({type: 'success', msg: "Insertion de cours réussie"});
                                                $scope.getJsonData(true);
                                            })
                                            .error(function () {
                                                $scope.alerts.length = 0;
                                                $scope.alerts.push({type: 'error', msg: "Un problème est survenu"})
                                            });
                                    }
                                });
                        }
                    });
            }
            else {
                $scope.alerts.length = 0;
                $scope.alerts.push({type: 'error', msg: "Veuillez remplir tous les champs"})
            }
        };

        /*
        Récupèrer les données dans la DB et les mettre dans le localStorage
         */
        $scope.getJsonData = function (isFromUser) {
            var myGroupJsonString;
            var myTeachersJsonString;
            var myClassroomsJsonString;
            var myCoursesJsonString;
            var myEventListJsonString;

            // vérifie si le local storage est dispo sur le browser
            if (typeof(Storage) !== "undefined") {
                //vérifie si la requete viens du user
                if (isFromUser) {
                    promotionFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myGroupJsonString = JSON.stringify(data);
                        localStorage.mySavedGroupJSONString = myGroupJsonString;
                    });
                    teacherFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myTeachersJsonString = JSON.stringify(data);
                        localStorage.mySavedTeachersJSONString = myTeachersJsonString;
                    });
                    classroomFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myClassroomsJsonString = JSON.stringify(data);
                        localStorage.mySavedClassroomsJSONString = myClassroomsJsonString;
                    });
                    courseFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myCoursesJsonString = JSON.stringify(data);
                        localStorage.mySavedCoursesJSONString = myCoursesJsonString;
                    });
                    scheduleFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myEventListJsonString = JSON.stringify(data);
                        localStorage.mySavedEventListJSONString = myEventListJsonString;
                    });
                }
                else {
                    if (!localStorage.mySavedEventListJSONString || !localStorage.mySavedGroupJSONString || !localStorage.mySavedTeachersJSONString || !localStorage.mySavedClassroomsJSONString || !localStorage.mySavedCoursesJSONString) {
                        promotionFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myGroupJsonString = JSON.stringify(data);
                            localStorage.mySavedGroupJSONString = myGroupJsonString;
                        });
                        teacherFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myTeachersJsonString = JSON.stringify(data);
                            localStorage.mySavedTeachersJSONString = myTeachersJsonString;
                        });
                        classroomFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myClassroomsJsonString = JSON.stringify(data);
                            localStorage.mySavedClassroomsJSONString = myClassroomsJsonString;
                        });
                        courseFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myCoursesJsonString = JSON.stringify(data);
                            localStorage.mySavedCoursesJSONString = myCoursesJsonString;
                        });
                        scheduleFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myEventListJsonString = JSON.stringify(data);
                            localStorage.mySavedEventListJSONString = myEventListJsonString;
                        });
                    }
                }
            }
        };

        /*
        Va chercher les horaires par rapport à une date
         */
        $scope.loadSchedules = function () {
            scheduleFactory.getSchedulesOfDate($scope.dt).success(function (data, status, headers, config) {
                $scope.schedulesLoaded = data;
            });
        }

        $scope.heuresDebut = Array("8:45", "9:45", "11:00", "12:00", "13:45", "14:45", "16:00", "17:00");
        $scope.heuresFin = Array("9:45", "10:45", "12:00", "13:00", "14:45", "15:45", "17:00", "18:00");

        /*
        Supprime un horaire
         */
        $scope.delete = function (schedule) {
            scheduleFactory.delete(schedule._id).success(function () {
                $scope.schedulesLoaded.splice($scope.schedulesLoaded.indexOf(schedule), 1);
            });
        };

        /*
         Va chercher les modèles horaires par rapport à une date
         */
        $scope.load_schedule_models = function (promotion) {
            scheduleFactory.getScheduleModelsOfPromotion(promotion).success(function (data) {
                $scope.scheduleModelsLoaded = data;
            });
        };

        /*
        Supprime une modèle d'horaire
         */
        $scope.delete_model = function (schedule) {
            scheduleFactory.delete(schedule._id).success(function () {
                $scope.scheduleModelsLoaded.splice($scope.scheduleModelsLoaded.indexOf(schedule), 1);
            });
        };

    }]);
/*
Controller de l'import CSV
 */
app.controller('CsvController', ['$scope', 'userService', '$location', function ($scope, userService, $location) {
    //Si l'utilisateur n'est pas connecté, on le renvoie à l'undex
    if (!userService.isConnected())
        $location.path("/");
    /*
    Fonction pour uploader le fichier au serveur
     */
    $.fn.upload = function (remote, data, successFn, progressFn) {
        // if we dont have post data, move it along
        if (typeof data != "object") {
            progressFn = successFn;
            successFn = data;
        }
        return this.each(function () {
            if ($(this)[0].files[0]) {
                var formData = new FormData();
                formData.append($(this).attr("name"), $(this)[0].files[0]);

                // if we have post data too
                if (typeof data == "object") {
                    for (var i in data) {
                        formData.append(i, data[i]);
                    }
                }

                // do the ajax request
                $.ajax({
                    url: remote,
                    type: 'POST',
                    xhr: function () {
                        myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload && progressFn) {
                            myXhr.upload.addEventListener('progress', function (prog) {
                                var value = ~~((prog.loaded / prog.total) * 100);

                                // if we passed a progress function
                                if (progressFn && typeof progressFn == "function") {
                                    progressFn(prog, value);

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
                    complete: function (res) {
                        var json;
                        try {
                            json = JSON.parse(res.responseText);
                            $scope.conflicts = {};
                            $scope.conflicts = json;
                            document.getElementById("myFile").value = "";
                            document.getElementById("upload").disabled = true;
                            document.getElementById("upload").className = "btn";
                            ;
                            $scope.$apply();
                        } catch (e) {
                            json = res.responseText;
                        }
                        if (successFn) successFn(json);
                    }
                });
            }
        });
    };


    $("#upload").on("click", function () {
        $("#myFile").upload("/uploadFile/", function (success) {
        }, function (prog, value) {
            $scope.value = value;
        });
    });

    /*
    Vérification si il y a bien un fichier, et si il est au format csv
     */
    $scope.checkIfFileIsSelected = function () {
        var fileButton = document.getElementById("myFile");
        var updateButton = document.getElementById("upload");
        if (fileButton.value === "") {
            document.getElementById("error_csv_file").innerHTML = "";
            updateButton.disabled = true;
            updateButton.className = "btn";
        }
        else {
            var tab = fileButton.value.split(".");
            var extension = tab[tab.length - 1];
            if (extension == "csv") {
                document.getElementById("error_csv_file").innerHTML = "";
                updateButton.disabled = false;
                updateButton.className = "btn btn-success";
            }
            else {
                document.getElementById("error_csv_file").innerHTML = "Ce fichier n'est pas un fichier csv !";
                updateButton.disabled = true;
                updateButton.className = "btn";
            }
        }
    }
}]);

//Pour vérifier si le scheduler est déjà chargé pour ne pas le charger une deuxième fois
app.scheduler_loaded = false;
app.onTemplatesReady = undefined;
app.onExternalDragIn = undefined;
app.onViewChange = undefined;
app.onEmptyClick = undefined;
app.onMouseMove = undefined;
app.onBeforeEventChanged = undefined;
app.onDblClick = undefined;
app.onEventDeleted = undefined;
app.eventsTab = Array();
app.eventsToDeleteTab = Array();
app.eventToDelete = {};
app.controller('FrontOfficeController', ['$scope', '$route', '$http', '$timeout', 'classroomFactory', 'teacherFactory', 'courseFactory',
    'promotionFactory', 'scheduleFactory', 'userService', function ($scope, $route, $http, $timeout, classroomFactory, teacherFactory, courseFactory, promotionFactory, scheduleFactory, userService) {
        /*
         * initalisation de valeurs nécessaire au fonctionnement du tree
         * heuresDebut et heuresFin permettent de faire le lien entre les tranches d'heures de la DB et l'heure affichée
         * dans les events
         */
        var heuresDebut = Array("8:45", "9:45", "11:00", "12:00", "13:45", "14:45", "16:00", "17:00");
        var heuresFin = Array("9:45", "10:45", "12:00", "13:00", "14:45", "15:45", "17:00", "18:00");
        var tree = null;

        /*
         * vérifie si l'user est connecté
         */
        $scope.isConnected = userService.isConnected();

        /*
         * Permet d'importer le scheduler au format iCal
         */
        $scope.download_ical = function()
        {
            var icsMSG = scheduler.toICal();
            icsMSG = icsMSG.replace(/<br>/gi, "");
            //escape pour garder l'indentation dans le fichier sinon illisible par les parser ical
            var uri = 'data:text/calendar;charset=utf-8,' + escape(icsMSG);

            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = "schedule.ical";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        }

        /*
         * la fonction init est appellée lors du chargement de la page contenant le scheduler
         * elle s'occuper d'appeller toutes les méthodes nécessaires à l'initialisation de celui ci.
         */
        $scope.init = function () {
            $scope.initializeTree();
            $scope.defineSchedulerAttachedEvents();
            $scope.configureAndInitializeScheduler();
            $scope.getJsonData(false);
            $scope.populate_comboboxes();

        }

        /*
         * La fonction initializeTree configure et initialise le tree
         * le tree est accessible en mode admin et permet de créer des events
         * depuis des modèles en drag&drop
         */
        $scope.initializeTree = function () {
            tree = new dhtmlXTreeObject('treebox_ClassesTree', '100%', '100%', 0);
            tree.enableDragAndDrop(true);
            tree.attachEvent("onDrag", function () {
                return false;
            });
            tree.setImagePath("javascripts/dhtmlx_tree/imgs/csh_yellowbooks/");
            // création de la racine du tree
            // obligatoire pour le bon fonctionnement de l'ajout des childs du tree
            tree.loadJSONObject({id: 0, item: [
                {id: 1, text: "Classes", im0: "tombs.gif", im1: "tombs_open.gif", im2: "tombs.gif"}
            ]});
        }

        /*
         * Définis les events qui sont attachés au scheduler
         */
        $scope.defineSchedulerAttachedEvents = function () {
            /*
             * Vérifie si l'event est déjà attaché, si oui, le détache
             * (cas ou on refresh la page)
             */
            if (app.onTemplatesReady !== undefined)
                scheduler.detachEvent(app.onTemplatesReady);
            if (app.onExternalDragIn !== undefined)
                scheduler.detachEvent(app.onExternalDragIn);
            if (app.onViewChange !== undefined)
                scheduler.detachEvent(app.onViewChange);
            if (app.onEmptyClick !== undefined)
                scheduler.detachEvent(app.onEmptyClick);
            if (app.onMouseMove !== undefined)
                scheduler.detachEvent(app.onMouseMove);
            if (app.onBeforeEventChanged !== undefined)
                scheduler.detachEvent(app.onBeforeEventChanged);
            if (app.onDblClick !== undefined)
                scheduler.detachEvent(app.onDblClick);
            if (app.onEventDeleted !== undefined)
                scheduler.detachEvent(app.onEventDeleted);

            /*
             * attache les events quand le template est pret
             */
            app.onTemplatesReady = scheduler.attachEvent("onTemplatesReady", function () {
                /* gestion des event drop depuis le tree (drag&drop) */
                app.onExternalDragIn = scheduler.attachEvent("onExternalDragIn", function (id, source, e) {
                    /*
                     * si on drag un event depuis le tree dans le scheduler et que la zone ciblée est sur une pause
                     * on annule l'ajout au scheduler en retournant false
                     */
                    if (scheduler.checkInMarkedTimespan(scheduler.getEvent(id), "pause_section"))return false;
                    /*
                     * si l'attribut "tip" de l'event en provenance du tree est inexistant, c'est qu'il ne s'agit pas d'un modèle de cours
                     * dans ce cas on retourne false également et on annule l'ajout de l'event
                     * dans le cas contraire on gère l'ajout de l'event
                     */
                    if (tree.getUserData(tree._dragged[0].id, "tip") == undefined) {
                        return false;
                    }
                    else {
                        /*
                         * récupère la liste des évents présent à l'endroit ou on veut ajouter le nouvel event afin
                         * de vérifier les collisions
                         */
                        var presentEvents = scheduler.getEvents(scheduler.getEvent(id).start_date, scheduler.getEvent(id).end_date);
                        /*
                         * pour chaque event dans la liste, on formate la string pour la comparer avec celle de l'event qu'on veut
                         * ajouter au même endroit
                         */
                        var teacherName = "";
                        for (var presEv in presentEvents) {
                            if (presEv < (presentEvents.length) - 1) {

                                var scheduleTab = presentEvents[presEv].text.split("<br>");
                                var scheduleGroupAndClassroomTab = scheduleTab[1].split("/");
                                var scheduleTeachersTab = scheduleTab[2].split("-");

                                var scheduleCourse = scheduleTab[0];
                                var scheduleGroup = scheduleGroupAndClassroomTab[1].replace(/^\s+|\s+$/g, '');
                                var scheduleClassroom = scheduleGroupAndClassroomTab[0].replace(/^\s+|\s+$/g, '');
                                var scheduleTeachers = scheduleTab[2];

                                var treeTeachersTab = tree.getUserData(tree._dragged[0].id, "teachers").split("-");

                                var teacherIsPresent;
                                if (treeTeachersTab.length > scheduleTeachersTab.length) {
                                    teacherIsPresent = tree.getUserData(tree._dragged[0].id, "teachers").indexOf(scheduleTeachers) !== 1;
                                }
                                else {
                                    teacherIsPresent = scheduleTeachers.indexOf(tree.getUserData(tree._dragged[0].id, "teachers")) !== -1;
                                }

                                /* vérifie si l'event a ajouter entre en collision avec un event déjà présent */
                                if (tree.getUserData(tree._dragged[0].id, "classroom").indexOf(scheduleClassroom) != -1 &&
                                    tree.getUserData(tree._dragged[0].id, "course").indexOf(scheduleCourse) != -1 &&
                                    tree.getUserData(tree._dragged[0].id, "group").indexOf(scheduleGroup) != -1 &&
                                    teacherIsPresent) {
                                    return false;
                                }
                                /* si on est dans le même local, avec le même prof, le même cours et un groupe différent -> ok */
                                else if (tree.getUserData(tree._dragged[0].id, "classroom").indexOf(scheduleClassroom) !== -1) {
                                    if (tree.getUserData(tree._dragged[0].id, "course").indexOf(scheduleCourse) !== -1 &&
                                        tree.getUserData(tree._dragged[0].id, "group").indexOf(scheduleGroup) === -1 &&
                                        teacherIsPresent) {
                                        scheduler.getEvent(id).text = tree.getUserData(tree._dragged[0].id, "tip");
                                        scheduler.getEvent(id).color = tree.getUserData(tree._dragged[0].id, "color");
                                        scheduler.getEvent(id).start_date.getHours();
                                        scheduler.getEvent(id).start_date.getMinutes();
                                        scheduler.getEvent(id).idGroup = tree.getUserData(tree._dragged[0].id, "_idGroup");
                                        scheduler.getEvent(id).idCourse = tree.getUserData(tree._dragged[0].id, "_idCourse");
                                        scheduler.getEvent(id).idClassroom = tree.getUserData(tree._dragged[0].id, "_idClassroom");
                                        scheduler.getEvent(id).idTeachers = tree.getUserData(tree._dragged[0].id, "_idTeachers");
                                        continue;
                                    }
                                    else return false;
                                }
                                /*
                                 * si on est dans un local différent avec le même prof mais qu'on a le même cours et un groupe différent alors ok
                                 *(cours donné par 2 binomes dans 2 locaux différents en meme temps)
                                 */
                                else if (teacherIsPresent) {
                                    if (tree.getUserData(tree._dragged[0].id, "course").indexOf(scheduleCourse) !== -1 &&
                                        tree.getUserData(tree._dragged[0].id, "group").indexOf(scheduleGroup) === -1) {
                                        scheduler.getEvent(id).text = tree.getUserData(tree._dragged[0].id, "tip");
                                        scheduler.getEvent(id).color = tree.getUserData(tree._dragged[0].id, "color");
                                        scheduler.getEvent(id).start_date.getHours();
                                        scheduler.getEvent(id).start_date.getMinutes();
                                        scheduler.getEvent(id).idGroup = tree.getUserData(tree._dragged[0].id, "_idGroup");
                                        scheduler.getEvent(id).idCourse = tree.getUserData(tree._dragged[0].id, "_idCourse");
                                        scheduler.getEvent(id).idClassroom = tree.getUserData(tree._dragged[0].id, "_idClassroom");
                                        scheduler.getEvent(id).idTeachers = tree.getUserData(tree._dragged[0].id, "_idTeachers");
                                        continue;
                                    }
                                    else return false;
                                }
                                else {
                                    /* si on est dans un local différent avec un prof différent et que le groupe est différent -> OK */
                                    if (tree.getUserData(tree._dragged[0].id, "group").indexOf(scheduleGroup) === -1) {
                                        scheduler.getEvent(id).text = tree.getUserData(tree._dragged[0].id, "tip");
                                        scheduler.getEvent(id).color = tree.getUserData(tree._dragged[0].id, "color");
                                        scheduler.getEvent(id).start_date.getHours();
                                        scheduler.getEvent(id).start_date.getMinutes();
                                        scheduler.getEvent(id).idGroup = tree.getUserData(tree._dragged[0].id, "_idGroup");
                                        scheduler.getEvent(id).idCourse = tree.getUserData(tree._dragged[0].id, "_idCourse");
                                        scheduler.getEvent(id).idClassroom = tree.getUserData(tree._dragged[0].id, "_idClassroom");
                                        scheduler.getEvent(id).idTeachers = tree.getUserData(tree._dragged[0].id, "_idTeachers");
                                        continue;
                                    }
                                    else return false;
                                }
                            }
                            else {
                                scheduler.getEvent(id).text = tree.getUserData(tree._dragged[0].id, "tip");
                                scheduler.getEvent(id).color = tree.getUserData(tree._dragged[0].id, "color");
                                scheduler.getEvent(id).start_date.getHours();
                                scheduler.getEvent(id).start_date.getMinutes();
                                scheduler.getEvent(id).idGroup = tree.getUserData(tree._dragged[0].id, "_idGroup");
                                scheduler.getEvent(id).idCourse = tree.getUserData(tree._dragged[0].id, "_idCourse");
                                scheduler.getEvent(id).idClassroom = tree.getUserData(tree._dragged[0].id, "_idClassroom");
                                scheduler.getEvent(id).idTeachers = tree.getUserData(tree._dragged[0].id, "_idTeachers");
                                continue;
                            }
                        }
                    }
                    /*
                     * dans le cas ou l'event est bien ajouté, on update la view du scheduler puis on ajoute l'event a une liste d'events
                     * cette liste d'events sera envoyée dans la db lorsque l'user cliquera sur "sauvegarder" (voir event bouton sauvegarde)
                     */
                    scheduler.update_view();
                    app.eventsTab.push(scheduler.getEvent(id));
                    return true;
                });
                /* permet de cacher les zones de pause lorsqu'on est sur la vue du mois */
                app.onViewChange = scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
                    if (new_mode === "month") {
                        $(' div .gray_section').css("display", "none");
                        $(' div .red_section').css("display", "none");
                    }
                });

                /* gestion du surlignage de la tranche horaire survolée par la souris */
                var fix_date = function (date) {  // arrondis 17:48:56 en 17:30:00 par exemple
                    date = new Date(date);
                    if (date.getMinutes() < 15) {
                        date.setMinutes(0);
                    }
                    else {
                        if (date.getMinutes() < 30) {
                            date.setMinutes(15);
                        }
                        else {
                            if (date.getMinutes() < 45) {
                                date.setMinutes(30);
                            }
                            else {
                                date.setMinutes(45);
                            }
                        }
                    }
                    date.setSeconds(0);
                    return date;
                };
                var marked = null;
                var marked_date = null;
                var event_step = 120;

                /*
                 * empèche la création d'even en cliquant sur le scheduler
                 * dans ce cas ci, il s'agit d'empècher la création d'event lorsqu'on clique sur une zone vide
                 */
                app.onEmptyClick = scheduler.attachEvent("onEmptyClick", function (date, native_event) {
                    return false;
                });

                /* gère le surlignage de la zone survolée par la souris dans le scheduler */
                app.onmousemove = scheduler.attachEvent("onMouseMove", function (event_id, native_event) {
                    var date = scheduler.getActionData(native_event).date;
                    var fixed_date = fix_date(date);
                    if (+fixed_date != +marked_date) {
                        scheduler.unmarkTimespan(marked);
                        marked_date = fixed_date;
                        marked = scheduler.markTimespan({
                            start_date: fixed_date,
                            end_date: scheduler.date.add(fixed_date, event_step, "minute"),
                            css: "highlighted_timespan"
                        });
                    }
                });

                /*
                 * Cet event fonctionne de la même manière que onExternalDragIn sauf qu'elle gère le déplacement d'events
                 * que l'event ait été ajouté récement depuis le tree ou qu'il provienne directement de la db, on vérifie les
                 * collisions possible, et on l'ajoute a une liste qui sera envoyée à la db si on clique sur sauvegarder
                 */
                app.onBeforeEventChanged = scheduler.attachEvent("onBeforeEventChanged", function (ev, e, flag, ev_old) {
                    // si on drag un event depuis le scheduler (pour le déplacer) dans le scheduler et que la zone ciblée est sur une pause
                    // on annule le déplacement en retournant false
                    if (scheduler.checkInMarkedTimespan(scheduler.getEvent(ev.id), "pause_section"))return false;

                    // récupère la liste des évents présent à l'endroit ou on veut ajouter le nouvel event afin
                    // de vérifier les collisions
                    var presentEvents = scheduler.getEvents(ev.start_date, ev.end_date);

                    // pour chaque event dans la liste, on formate la string pour la comparer avec celle de l'event qu'on veut
                    // déplacer au même endroit
                    for (var presEv in presentEvents) {
                        if (presEv < (presentEvents.length) - 1) {
                            if (presentEvents[presEv] == ev)continue;
                            var scheduleTab = presentEvents[presEv].text.split("<br>");
                            var scheduleGroupAndClassroomTab = scheduleTab[1].split("/");
                            var scheduleTeachersTab = scheduleTab[2].split("-");

                            var scheduleCourse = scheduleTab[0];
                            var scheduleGroup = scheduleGroupAndClassroomTab[1].replace(/^\s+|\s+$/g, '');
                            var scheduleClassroom = scheduleGroupAndClassroomTab[0].replace(/^\s+|\s+$/g, '');
                            var scheduleTeachers = scheduleTab[2];

                            var evTab = ev.text.split("<br>");
                            var evGroupAndClassroomTab = evTab[1].split("/");
                            var evTeachersTab = evTab[2].split("-");

                            var evCourse = evTab[0];
                            var evGroup = evGroupAndClassroomTab[1].replace(/^\s+|\s+$/g, '');
                            var evClassroom = evGroupAndClassroomTab[0].replace(/^\s+|\s+$/g, '');
                            var evTeachers = evTab[2];

                            var teacherIsPresent;
                            if (evTeachersTab.length > scheduleTeachersTab.length) {
                                teacherIsPresent = evTeachers.indexOf(scheduleTeachers) != 1;
                            }
                            else {
                                teacherIsPresent = scheduleTeachers.indexOf(evTeachers) != -1;
                            }

                            /* vérifie si l'event qu'on déplace est identique (collision) à un event déjà présent */
                            if (evClassroom.indexOf(scheduleClassroom) != -1 &&
                                evCourse.indexOf(scheduleCourse) != -1 &&
                                evGroup.indexOf(scheduleGroup) != -1 &&
                                teacherIsPresent) {
                                return false;
                            }

                            /* vérifie si l'event qu'on déplace entre en collision avec un event déjà présent */
                            // si on est dans le même local, avec le même prof, le même cours et un groupe différent -> ok
                            if (evClassroom.indexOf(scheduleClassroom) != -1) {
                                if (evCourse.indexOf(scheduleCourse) != -1 &&
                                    evGroup.indexOf(scheduleGroup) === -1 &&
                                    teacherIsPresent) {
                                    continue;
                                }
                                else return false;
                            }
                            // si on est dans un local différent avec le même prof mais qu'on a le même cours et un groupe différent alors ok
                            //(cours donné par 2 binomes dans 2 locaux différents en meme temps)
                            else if (teacherIsPresent) {
                                if (evCourse.indexOf(scheduleCourse) != -1 &&
                                    evGroup.indexOf(scheduleGroup) === -1) {
                                    continue;
                                }
                                else return false;
                            }
                            else {
                                // si on est dans un local différent avec un prof différent et que le groupe est différent -> OK
                                if (evGroup.indexOf(scheduleGroup) === -1) {
                                    continue;
                                }
                                else return false;
                            }
                        }
                    }
                    // dans le cas ou l'event est bien déplacé, on update la view du scheduler puis on ajoute l'event a une liste d'events
                    // cette liste d'events sera envoyée dans la db lorsque l'user cliquera sur "sauvegarder" (voir event bouton sauvegarde)
                    scheduler.update_view();
                    var eventIndex = -1;

                    // cette boucle set a vérifier si l'event se trouvait déjà dans la liste des events a sauvegarder
                    // dans le cas ou on trouve l'event dans cette liste (via son ID) on le modifie dans la liste
                    // si on ne le trouve pas, on l'ajoute a la liste
                    for (var index in app.eventsTab) {
                        if (app.eventsTab[index].id === ev.id) {
                            eventIndex = index;
                            break;
                        }
                    }
                    if (eventIndex !== -1)
                        app.eventsTab[eventIndex] = ev;
                    else
                        app.eventsTab.push(ev);
                    return true;
                });

                /* désactive la création d'even lorsqu'on double clique sur le scheduler   */
                app.onDblClick = scheduler.attachEvent("onDblClick", function (id, e) {
                    return false;
                });

                /* gère la supression d'events */
                app.onEventDeleted = scheduler.attachEvent("onEventDeleted", function (id) {
                    var found = false;
                    for (var index in app.eventsTab) {
                        /*
                         * on cherche l'event dans eventsTab afin de vérifier si il s'agit d'un nouvel event
                         * ou si il provient de la base de données
                         */
                        if (app.eventsTab[index].id == id) {
                            //event provenant du tree
                            if (app.eventsTab[index].idCourse !== undefined) {
                                app.eventsTab.splice(index, 1);
                                found = true;
                                break;
                            }
                            //event provenant de la db
                            else {
                                app.eventsToDeleteTab.push(app.eventsTab[index].id);
                                app.eventsTab.splice(index, 1);
                                found = true;
                                break;
                            }
                        }
                    }
                    //event de la db qui n'a pas été déplacé (et donc qui n'est pas dans eventstab)
                    if (!found) {
                        app.eventsToDeleteTab.push(id);
                    }
                });
            });
        }

        /*
         * configuration du scheduler afin qu'il corresponde à ce que l'on veut
         */
        $scope.configureAndInitializeScheduler = function () {
            //paremètres simples
            scheduler.config.first_hour = 8;                                // heur de début du scheduer
            scheduler.config.last_hour = 19;                                // heure de fin du scheduler (19h pour éviter ambiguité avec affichage)
            scheduler.config.time_step = 15;                                // pas de 15min pour le déplacement et le resizing des events
            scheduler.config.event_duration = 120;                          // durée par défaut d'un nouvel event en minutes
            scheduler.config.details_on_create = false;                     // n'affiche pas les détails lors de la création
            scheduler.config.left_border = true;                            // affiche les bords gauches du calendrier
            scheduler.config.dblclick_create = false;                       // empèche la création d'event en double cliquant
            scheduler.config.drag_create = false;                           // empèche la création d'event en "tirant" une zone sur le scheduler
            scheduler.config.edit_on_create = false;                        // n'entre pas en mode édition lors de la création d'un event
            scheduler.config.icons_select = ["icon_delete"];                // n'affiche que l'icone de suppresion (et pas d'edition) dans le menu d'un event
            if (!$scope.isConnected)scheduler.config.readonly = true;       // le scheduler passe en readonly si on n'est pas en mode admin (connecté)
            scheduler.init('MASI_scheduler', new Date(), "week");           // initialise le scheduler
            scheduler.ignore_week = function (date) {
                if (date.getDay() == 6 || date.getDay() == 0) //cache samedi et dimanche
                    return true;
            };
            //définis les temps de pause, on ne pourra ajouter d'event sur ces zones
            if (!app.scheduler_loaded) {
                app.morningAndNightHours = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                          // de lundi a vendredi
                    zones: [0 * 60, 8 * 60 + 45, 18 * 60, 24 * 60],	// de 0h a 8h45	& de 18h a 24h
                    type: "pause_section", 			                // empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
                app.lunchTime = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                          // de lundi a vendredi
                    zones: [13 * 60, 13 * 60 + 45],			        // de 13h a 13h45
                    type: "pause_section", 			                // empèche d'entrer des event pour cette zone
                    css: "red_section"
                });
                app.pauseTime = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                                      // de lundi a vendredi
                    zones: [10 * 60 + 45, 11 * 60, 15 * 60 + 45, 16 * 60],		// de 10h45 a 11h et 15h45 a 16h
                    type: "pause_section", 			                            // empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
                app.weekends = scheduler.addMarkedTimespan({
                    days: [0, 6],                                   // samedi et dimanche
                    zones: "fullday",       			            // toute la journée
                    type: "pause_section", 			                // empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
                // update la vue du scheduler
                scheduler.update_view();
            }
            else {
                /*
                 * le else fait la même chose que le iff sauf qu'il supprime les zones dans le cas ou elles existent déjà
                 * afin d'éviter la superposition de celles-ci
                 */
                scheduler.deleteMarkedTimespan(app.morningAndNightHours);
                scheduler.deleteMarkedTimespan(app.lunchTime);
                scheduler.deleteMarkedTimespan(app.pauseTime);
                scheduler.deleteMarkedTimespan(app.weekends);
                //scheduler.updateView();
                app.morningAndNightHours = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                              // de lundi a vendredi
                    zones: [0 * 60, 8 * 60 + 45, 18 * 60, 24 * 60],	    // de 0h a 8h45	& de 18h a 24h
                    type: "pause_section", 			                    // empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
                app.lunchTime = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                 // de lundi a vendredi
                    zones: [13 * 60, 13 * 60 + 45],			// de 13h a 13h45
                    type: "pause_section", 			// empèche d'entrer des event pour cette zone
                    css: "red_section"
                });
                app.pauseTime = scheduler.addMarkedTimespan({
                    days: [1, 2, 3, 4, 5],                 // de lundi a vendredi
                    zones: [10 * 60 + 45, 11 * 60, 15 * 60 + 45, 16 * 60],			// de 10h45 a 11h et 15h45 a 16h
                    type: "pause_section", 			// empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
                app.weekends = scheduler.addMarkedTimespan({
                    days: [0, 6],                       // samedi et dimanche
                    zones: "fullday",       			// toute la journée
                    type: "pause_section", 			// empèche d'entrer des event pour cette zone
                    css: "gray_section"
                });
            }
            app.scheduler_loaded = true;
        }

        /*
         * fonction qui permet de récupérer les données dans la DB
         */
        $scope.getJsonData = function (isFromUser) {
            var myGroupJsonString;
            var myTeachersJsonString;
            var myClassroomsJsonString;
            var myCoursesJsonString;
            var myEventListJsonString;

            // vérifie si le local storage est dispo sur le browser
            if (typeof(Storage) !== "undefined") {
                //vérifie si la requete viens du user, si oui on ignore le local storage et on fait les requetes vers la db quand même(cas update)
                // après chaque requete on stocke le résultat dans le local storage afin de les utiliser plus tard
                if (isFromUser) {
                    promotionFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myGroupJsonString = JSON.stringify(data);
                        localStorage.mySavedGroupJSONString = myGroupJsonString;
                    });
                    teacherFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myTeachersJsonString = JSON.stringify(data);
                        localStorage.mySavedTeachersJSONString = myTeachersJsonString;
                    });
                    classroomFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myClassroomsJsonString = JSON.stringify(data);
                        localStorage.mySavedClassroomsJSONString = myClassroomsJsonString;
                    });
                    courseFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myCoursesJsonString = JSON.stringify(data);
                        localStorage.mySavedCoursesJSONString = myCoursesJsonString;
                    });
                    scheduleFactory.findAll().success(function (data, status, headers, config) {
                        //$scope.promotions = data;
                        myEventListJsonString = JSON.stringify(data);
                        localStorage.mySavedEventListJSONString = myEventListJsonString;
                        $scope.initialiseEvents();
                        $scope.populate_comboboxes();
                    });
                }
                /*
                 * dans le cas ou la requete ne vient pas du user (et donc a l'affichage de la page)
                 * on vérifie si le localstorage contient déjà les string, si oui on les réutilise
                 * si non on fait la requete vers la db (cas de la première fois sur le site)
                 */
                else {
                    // vérifie si les données sont présentes dans le local storage, si il en manque une seule on refait les 5 requetes
                    // (tant qu'a faire, on met à jour)
                    if (!localStorage.mySavedEventListJSONString || !localStorage.mySavedGroupJSONString || !localStorage.mySavedTeachersJSONString || !localStorage.mySavedClassroomsJSONString || !localStorage.mySavedCoursesJSONString) {
                        promotionFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myGroupJsonString = JSON.stringify(data);
                            localStorage.mySavedGroupJSONString = myGroupJsonString;
                        });
                        teacherFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myTeachersJsonString = JSON.stringify(data);
                            localStorage.mySavedTeachersJSONString = myTeachersJsonString;
                        });
                        classroomFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myClassroomsJsonString = JSON.stringify(data);
                            localStorage.mySavedClassroomsJSONString = myClassroomsJsonString;
                        });
                        courseFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myCoursesJsonString = JSON.stringify(data);
                            localStorage.mySavedCoursesJSONString = myCoursesJsonString;
                        });
                        scheduleFactory.findAll().success(function (data, status, headers, config) {
                            //$scope.promotions = data;
                            myEventListJsonString = JSON.stringify(data);
                            localStorage.mySavedEventListJSONString = myEventListJsonString;
                            $scope.initialiseEvents();
                            $scope.populate_comboboxes();
                        });
                    }
                    else {
                        $scope.initialiseEvents();
                        $scope.populate_comboboxes();
                    }
                }
            }
        };
        /*
         * fonction qui va ajouter les données du localstorage et les affichées dans le tree ou dans le scheduler
         */
        $scope.initialiseEvents = function () {
            //supression des éléments du tree avant de le reconstruire (si il y en a)
            tree.deleteChildItems(1);
            //récupération de la string dans le local storage
            var JsonArray = jQuery.parseJSON(localStorage.mySavedEventListJSONString);
            var jsonGroupsArray = jQuery.parseJSON(localStorage.mySavedGroupJSONString);

            var itmNotNull = 0;
            var nbItmsNotNull = 0;
            //compte le nombre de "modèles" parmis la liste, on en a besoin dans la boucle suivante
            for (var itms in JsonArray) {
                if (new Date(JsonArray[itms].date).getTime() != new Date(0).getTime()) {
                    itmNotNull++;
                }
            }
            //début de la string contenant les event, il faut boucler sur la liste de schedule afin d'en extraire les modèles avant de parser la string
            var eventsString = "[";
            var cptGrp = 11;
            for (var grp in jsonGroupsArray) {
                // ajout des groupes au tree
                tree.insertNewChild(1, cptGrp.toString(), jsonGroupsArray[grp].name, 0, 0, 0, 0, "CHILD");
                var cptCours = 1;
                var idCours = 1;
                for (var itm in JsonArray) {
                    // si la date N'EST PAS null, il s'agit d'un event, on l'ajoute donc dans la string qui contiendra tous les events
                    if (new Date(JsonArray[itm].date).getTime() != new Date(0).getTime()) {
                        // vu qu'on boucle sur les groupes, on passe plusieurs fois sur la liste des events, il est inutile de
                        // traiter la liste plus d'une fois dans le cas ou il s'agit d'un event (et pas d'un modèle).
                        if (grp == "0") {
                            eventsString += '{id:"' + JsonArray[itm]._id;														//récupération de l'ID de l'event
                            //récupération du texte de l'event
                            eventsString += '", text:"' + JsonArray[itm].course.name + '<br>' + JsonArray[itm].classroom.name + ' / ' + JsonArray[itm].promotion.name + '<br>';
                            var teacherName = "";
                            if (JsonArray[itm].teachers != null) {
                                var cpt = 0;
                                for (var key in JsonArray[itm].teachers) {
                                    lastname = JsonArray[itm].teachers[key].last_name;
                                    firstname = JsonArray[itm].teachers[key].first_name;
                                    if (cpt >= 1)
                                        teacherName += " - "
                                    teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                    cpt++;
                                }
                                eventsString += teacherName;
                            }
                            else {
                                eventsString += "Autonomie";
                            }
                            var tempDate = new Date(JsonArray[itm].date);
                            var dateWhitoutTime = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
                            eventsString += '", start_date:"' + dateWhitoutTime + ' ' + heuresDebut[JsonArray[itm].begin - 1];	//récupération de l'heure de début de l'event
                            eventsString += '", end_date:"' + dateWhitoutTime + ' ' + heuresFin[JsonArray[itm].end - 1];		//récupération de l'heure de fin de l'event
                            eventsString += '", color:"' + JsonArray[itm].color;
                            nbItmsNotNull++;												//récupération de la couleur de l'event
                            if (nbItmsNotNull >= itmNotNull) {
                                eventsString += '"}';
                            }
                            else {
                                eventsString += '"},';
                            }
                        }
                    }
                    //si la date EST null, il s'agit d'un MODELE d'event, on l'ajoutera donc dans le tree
                    else {
                        if (JsonArray[itm].promotion.name == jsonGroupsArray[grp].name) {
                            var newIdString = cptGrp.toString() + idCours.toString();
                            var teacher1;
                            var teacher2;
                            var teacherName = "";
                            if (JsonArray[itm].teachers != null) {
                                var cpt = 0;
                                for (var key2 in JsonArray[itm].teachers) {
                                    lastname = JsonArray[itm].teachers[key2].last_name;
                                    firstname = JsonArray[itm].teachers[key2].first_name;
                                    if (cpt >= 1) teacherName += " - ";
                                    teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                    cpt++;
                                }
                            }
                            else {
                                teacherName += "Autonomie";
                            }
                            tree.insertNewChild(cptGrp, newIdString, JsonArray[itm].course.name + " - " + teacherName, 0, 0, 0, 0, "");
                            //var teacherName = "";
                            var teachersIds = Array();
                            if (JsonArray[itm].teachers != null) {
                                for (var prof in JsonArray[itm].teachers) {
                                    teachersIds.push(JsonArray[itm].teachers[prof]._id);
                                }
                            }

                            if (teachersIds.length > 0)
                                tree.setUserData(newIdString, "_idTeachers", teachersIds);
                            else
                                tree.setUserData(newIdString, "_idTeachers", null);
                            // définis tous les attribut de l'élément dans le tree, on les récupère quand on drag un élément du tree
                            // vers le scheduler
                            tree.setUserData(newIdString, "teachers", teacherName);
                            tree.setUserData(newIdString, "_idGroup", JsonArray[itm].promotion._id);
                            tree.setUserData(newIdString, "_idCourse", JsonArray[itm].course._id);
                            tree.setUserData(newIdString, "_idClassroom", JsonArray[itm].classroom._id);
                            tree.setUserData(newIdString, "color", JsonArray[itm].color);
                            tree.setUserData(newIdString, "course", JsonArray[itm].course.name);
                            tree.setUserData(newIdString, "group", JsonArray[itm].promotion.name);
                            tree.setUserData(newIdString, "classroom", JsonArray[itm].classroom.name);
                            tree.setUserData(newIdString, "tip", JsonArray[itm].course.name + "<br>" + JsonArray[itm].promotion.name + " / " + JsonArray[itm].classroom.name + "<br>" + teacherName);
                            idCours++;
                        }
                        cptCours++;
                    }
                }
                // ferme l'élément père du tree pour réduire sa taille a l'affichage (pour que toutes les listes ne soient pas ouvertes)
                tree.closeItem(cptGrp);
                cptGrp++;
            }
            eventsString += "]";
            // parse la string dans le scheduler une fois que la génération de celle ci est terminée
            scheduler.parse(eventsString, "json");
        };

        /* cette fonction gère le remplissage des combobox du filtre de recherche */
        $scope.populate_comboboxes = function () {
            //remplissage des combobox (pour l'option de filtrage)
            $scope.cbx_promotions = jQuery.parseJSON(localStorage.mySavedGroupJSONString);
            $scope.cbx_teachers = jQuery.parseJSON(localStorage.mySavedTeachersJSONString);
            $scope.cbx_classrooms = jQuery.parseJSON(localStorage.mySavedClassroomsJSONString);
            $scope.cbx_courses = jQuery.parseJSON(localStorage.mySavedCoursesJSONString);

            $scope.filters = Array(
                {value: "none", name: "--Filtres--"},
                {value: "Groups_Select", name: "Groupes"},
                {value: "Teachers_Select", name: "Professeurs"},
                {value: "Classrooms_Select", name: "Locaux"},
                {value: "Courses_Select", name: "Cours"});
            $scope.filterChosen = "none";

            $scope.show_SelectedFilter(document.getElementById("Main_Select"));
        };

        /*
         * fonction qui met a jour l'affichage du scheduler
         * ATTENTION: on met a jour par rapport a la base de données
         */
        $scope.reload_schedulerEventsInStorage = function () {
            //reload des données
            //supression des éléments du tree avant de le reconstruire
            tree.deleteChildItems(1);
            scheduler.clearAll();
            $scope.getJsonData(true);
            app.eventsTab.length = 0;
            app.eventsToDeleteTab.length = 0;
        };
        /*
         * fonction qui va sauvegarder les events présent dans la liste eventsTab(liste contenant les events ajouté et déplacés)
         * et dans la liste eventsToDelete (la liste contenant les events a supprimer)
         */
        $scope.update_schedulerEventsToDB = function () {
            for (var index in app.eventsTab) {
                var day = app.eventsTab[index].start_date.getDate();
                var month = app.eventsTab[index].start_date.getMonth();
                var year = app.eventsTab[index].start_date.getFullYear();
                var begin_hours = app.eventsTab[index].start_date.getHours();
                var begin_minutes = app.eventsTab[index].start_date.getMinutes();
                var end_hours = app.eventsTab[index].end_date.getHours();
                var end_minutes = app.eventsTab[index].end_date.getMinutes();
                if (begin_minutes === 0)var begin_time = begin_hours + ":00";
                else var begin_time = begin_hours + ":" + begin_minutes;
                var begin_index = $.inArray(begin_time, heuresDebut);
                if (end_minutes === 0)var end_time = end_hours + ":00";
                else var end_time = end_hours + ":" + end_minutes;
                var end_index = $.inArray(end_time, heuresFin);
                // si c'est un event qui est dans la db
                if (app.eventsTab[index].idCourse === undefined) {
                    scheduleFactory.edit(app.eventsTab[index].id, day, month, year, begin_index + 1, end_index + 1).success(function (data) {
                    });
                }
                else {
                    var schedule = {
                        teachers: app.eventsTab[index].idTeachers,
                        classroom: app.eventsTab[index].idClassroom,
                        course: app.eventsTab[index].idCourse,
                        promotion: app.eventsTab[index].idGroup,
                        date: new Date(year, month, day),
                        color: app.eventsTab[index].color,
                        begin: begin_index + 1,
                        end: end_index + 1
                    };
                    scheduleFactory.add(schedule).success(function () {
                    });
                }
            }
            for (var index in app.eventsToDeleteTab) {
                scheduleFactory.delete(app.eventsToDeleteTab[index]).success(function () {
                });
            }
            // après avoir sauvegarder, on met a jour le scheduler
            $scope.reload_schedulerEventsInStorage();
        };
        /* méthode qui gère l'affichage des filtres en fonction de la sélection sur la première combobox */
        $scope.show_SelectedFilter = function () {
            var myMaincbx = $scope.filters;
            for (var i = 0; i < myMaincbx.length; i++) {
                if (myMaincbx[i].value != "none") {
                    if (myMaincbx[i].value == $scope.filterChosen)
                        document.getElementById(myMaincbx[i].value).className = "combobox_visibile";
                    else
                        document.getElementById(myMaincbx[i].value).className = "combobox_hidden";
                }
            }
        };

        /* fonction qui filtre l'affichage des events sur le scheduler */
        $scope.Filter_schedules = function () {
            var mainBox = $scope.filterChosen;
            if (mainBox != "none") {
                var selectedBox;
                if (mainBox == "Groups_Select")
                    selectedBox = $scope.promotionChosen;
                else if (mainBox == "Teachers_Select")
                    selectedBox = $scope.teacherChosen;
                else if (mainBox == "Classrooms_Select")
                    selectedBox = $scope.classroomChosen;
                else if (mainBox == "Courses_Select")
                    selectedBox = $scope.courseChosen;
                // on vide le scheduler
                scheduler.clearAll();
                //on le reremplit avec les données filtrées
                var JsonArrayFilter = jQuery.parseJSON(localStorage.mySavedEventListJSONString);
                var itmNotNull = 0;
                var nbItmsNotNull = 0;
                //compte le nombre de "modèles" parmis la liste, on en a besoin dans la boucle suivante
                for (var itms in JsonArrayFilter) {
                    if (JsonArrayFilter[itms].date != null) itmNotNull++;
                }
                //début de la string contenant les event, il faut boucler sur la liste de schedule afin d'en extraire les modèles avant de parser la string
                var eventsString = "[";
                for (var itm in JsonArrayFilter) {
                    // si la date N'EST PAS égale au timestamp 0, il s'agit un schedule
                    if (new Date(JsonArrayFilter[itm].date).getTime() != new Date(0).getTime()) {
                        //traitement du nom du professeur avant la condition (obligatoire pour le bon traitement)
                        var teacherName = "";
                        if (JsonArrayFilter[itm].teachers != null) {
                            var cpt = 0;
                            for (var key in JsonArrayFilter[itm].teachers) {
                                lastname = JsonArrayFilter[itm].teachers[key].last_name;
                                firstname = JsonArrayFilter[itm].teachers[key].first_name;
                                if (cpt >= 1)
                                    teacherName += " - "
                                teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                cpt++;
                            }
                        }
                        else {
                            teacherName += "Autonomie";
                        }

                        if (JsonArrayFilter[itm].promotion.name == selectedBox || JsonArrayFilter[itm].classroom.name == selectedBox || JsonArrayFilter[itm].course.name == selectedBox || teacherName.indexOf(selectedBox) != -1) {
                            eventsString += '{id:"' + JsonArrayFilter[itm]._id;														//récupération de l'ID de l'event
                            //récupération du texte de l'event
                            eventsString += '", text:"' + JsonArrayFilter[itm].course.name + '<br>' + JsonArrayFilter[itm].classroom.name + ' / ' + JsonArrayFilter[itm].promotion.name + '<br>' + teacherName;
                            var tempDate = new Date(JsonArrayFilter[itm].date);
                            var dateWhitoutTime = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
                            eventsString += '", start_date:"' + dateWhitoutTime + ' ' + heuresDebut[JsonArrayFilter[itm].begin - 1];	//récupération de l'heure de début de l'event
                            eventsString += '", end_date:"' + dateWhitoutTime + ' ' + heuresFin[JsonArrayFilter[itm].end - 1];		//récupération de l'heure de fin de l'event
                            eventsString += '", color:"' + JsonArrayFilter[itm].color;
                            nbItmsNotNull++;												//récupération de la couleur de l'event
                            if (nbItmsNotNull >= itmNotNull) {
                                eventsString += '"}';
                            }
                            else {
                                eventsString += '"},';
                            }
                        }
                    }
                }
                eventsString += "]";
                scheduler.parse(eventsString, "json");
            }
            else {
                $scope.initialiseEvents();
            }
        };

        //fais en sorte que le menu de login reste affiché quand on clique dans un des champs (login/pwd)
        $(function () {
            // Fix input element click problem
            $('.dropdown input, .dropdown label').click(function (e) {
                e.stopPropagation();
            });
        });
    }]);
/*
Controller du formulaire de login de la barre de navigation
 */
app.controller('NavBarController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.logout = function () {
        userService.logout();
        $('#logout-form').submit();
    };
}]);
/*
Controller de la page qui s'affiche en cas de mauvais login
 */
app.controller('BadLoginController', ['$scope', 'userService', '$location', '$http', function ($scope, userService, $location, $http) {
    if (userService.isConnected())
        $location.path("/");
    $(function () {
        // Fix input element click problem
        $('.dropdown input, .dropdown label').click(function (e) {
            e.stopPropagation();
        });
    });
}]);