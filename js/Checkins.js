angular.module('d3', []).factory('d3Service', [function () { return d3; }]);

angular
	.module('DataExplorer', ['ngWebworker', 'ngFileSaver', 'd3'])
	.controller('CheckinsController', ['$scope', '$http', 'Webworker', 'FileSaver', 'Blob', function ($scope, $http, Webworker, FileSaver, Blob) {

		$scope.item_limit = 5;
		$scope.checkins_page = 0;
		$scope.users_page = 0;
		$scope.summary_page = 0;
		
		$scope.users = [];
		$scope.projects = [];
		
		$scope.checkins = [];
		$scope.filtered_checkins = [];
		$scope.page_checkins = [];
		
		$scope.user_output = [];
		$scope.filtered_output = [];
		$scope.page_output = [];

		$scope.summary = [];
		$scope.filtered_summary = [];
		$scope.page_summary = [];

		$scope.selected_user = '';
		$scope.selected_project = '';

		$scope.GetUserList = function() {
			
			var config = {'Content-Type': 'application/json; charset=utf-8'};

			$http.get('http://daelsepara.pythonanywhere.com/api/v1/list/users', config).then(function(result) {

				$scope.users = result.data;
			});
		}

		$scope.GetProjectList = function() {
			
			var config = {'Content-Type': 'application/json; charset=utf-8'};

			$http.get('http://daelsepara.pythonanywhere.com/api/v1/list/projects', config).then(function(result) {

				$scope.projects = result.data;
			});
		}

		$scope.GetCheckins = function() {
			
			var config = {'Content-Type': 'application/json; charset=utf-8'};

			$http.get('http://daelsepara.pythonanywhere.com/api/v1/checkins', config).then(function(result) {

				$scope.checkins = result.data;

				$scope.FilterCheckins();

				$scope.RefreshCheckinsPage();
			});
		}

		$scope.GetUserOutput = function() {
			
			var config = {'Content-Type': 'application/json; charset=utf-8'};

			$http.get('http://daelsepara.pythonanywhere.com/api/v1/users', config).then(function(result) {

				$scope.user_output = result.data;

				$scope.FilterOutput();

				$scope.RefreshUsersPage();
			});
		}

		$scope.GetSummary = function() {
			
			var config = {'Content-Type': 'application/json; charset=utf-8'};

			$http.get('http://daelsepara.pythonanywhere.com/api/v1/summary', config).then(function(result) {

				$scope.summary = result.data;

				$scope.FilterSummary();

				$scope.RefreshSummaryPage();
			});
		}

		$scope.ApplyAllFilters = function() {
			
			$scope.ApplyCheckinFilters();
			$scope.ApplyOutputFilters();
			$scope.ApplySummaryFilters();
		}

		$scope.RefreshCheckinsPage = function() {

			var max_item = Math.min($scope.filtered_checkins.length, ($scope.checkins_page + 1) * $scope.item_limit);
			var min_item = Math.max($scope.checkins_page * $scope.item_limit, 0);

			$scope.page_checkins = $scope.filtered_checkins.slice(min_item, max_item);
		}

		$scope.PreviousCheckinsPage = function() {

			$scope.checkins_page = $scope.checkins_page - 1;
			$scope.RefreshCheckinsPage();
		}

		$scope.NextCheckinsPage = function() {

			$scope.checkins_page = $scope.checkins_page + 1;
			$scope.RefreshCheckinsPage();
		}

		$scope.ApplyCheckinFilters = function() {

			$scope.checkins_page = 0;

			$scope.FilterCheckins();
			$scope.RefreshCheckinsPage();
		}
		
		$scope.FilterCheckins = function() {

			var filtered_list = $scope.checkins;

			if (filtered_list.length > 0) {
				if ($scope.selected_user.length > 0) {
					filtered_list = filtered_list.filter(x => x.user == $scope.selected_user);
				}
			}

			if (filtered_list.length > 0) {
				if ($scope.selected_project.length > 0) {
					filtered_list = filtered_list.filter(x => x.project == $scope.selected_project);
				}
			}

			$scope.filtered_checkins = filtered_list;
		}
		
		$scope.PreviousUsersPage = function() {

			$scope.users_page = $scope.users_page - 1;
			$scope.RefreshUsersPage();
		}

		$scope.NextUsersPage = function() {

			$scope.users_page = $scope.users_page + 1;
			$scope.RefreshUsersPage();
		}

		$scope.FilterOutput = function() {

			var filtered_list = $scope.user_output;

			if (filtered_list.length > 0) {
				if ($scope.selected_user.length > 0) {
					filtered_list = filtered_list.filter(x => x.user == $scope.selected_user);
				}
			}

			if (filtered_list.length > 0) {
				if ($scope.selected_project.length > 0) {
					filtered_list = filtered_list.filter(x => x.project == $scope.selected_project);
				}
			}

			$scope.filtered_output = filtered_list;
		}

		$scope.ApplyOutputFilters = function() {

			$scope.users_page = 0;

			$scope.FilterOutput();
			$scope.RefreshUsersPage();
		}

		$scope.RefreshUsersPage = function() {

			var max_item = Math.min($scope.filtered_output.length, ($scope.users_page + 1) * $scope.item_limit);
			var min_item = Math.max($scope.users_page * $scope.item_limit, 0);

			$scope.page_output = $scope.filtered_output.slice(min_item, max_item);
		}

		$scope.PreviousSummaryPage = function() {

			$scope.summary_page = $scope.summary_page - 1;
			$scope.RefreshSummaryPage();
		}

		$scope.NextSummaryPage = function() {

			$scope.summary_page = $scope.summary_page + 1;
			$scope.RefreshSummaryPage();
		}

		$scope.FilterSummary = function() {

			var filtered_list = $scope.summary;

			if (filtered_list.length > 0) {
				if ($scope.selected_user.length > 0) {
					filtered_list = filtered_list.filter(x => x.user == $scope.selected_user);
				}
			}

			$scope.filtered_summary = filtered_list;
		}

		$scope.ApplySummaryFilters = function() {

			$scope.summary_page = 0;

			$scope.FilterSummary();
			$scope.RefreshSummaryPage();
		}

		$scope.RefreshSummaryPage = function() {

			var max_item = Math.min($scope.filtered_summary.length, ($scope.summary_page + 1) * $scope.item_limit);
			var min_item = Math.max($scope.summary_page * $scope.item_limit, 0);

			$scope.page_summary = $scope.filtered_summary.slice(min_item, max_item);
		}

		$scope.Initialize = function () {
			
			$scope.GetUserList();
			$scope.GetProjectList();

			$scope.GetCheckins();
			$scope.GetUserOutput();
			$scope.GetSummary();
		}
	}]);
