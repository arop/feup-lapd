angular.module('lapd.help', [])

  .controller('HelpController', function($scope){
    $scope.questions = [];
    $scope.questions.push({
      question: "To plan a trip do I need to know the stops' name?",
      answer: "No, you can introduce an address, a zip code, a establishment, a place, etc. " +
      "We will give to you the near stops to those places."});
    $scope.questions.push({
      question: "How can I add or remove a route/stop from favorites?",
      answer: "Open the route/stop that you want add or remove from favourites and in the top right "+
      "corner you'll find a star. If the star is empty that route/stop is not in favourites, "+
      "otherwise is in favourites."});
    $scope.questions.push({
      question: "Uber estimates are given by EZ Trip?",
      answer: "No. Uber estimates are given by Uber itself."});
    $scope.questions.push({
      question: "Can I buy tickets to travel in bus and train through the application?",
      answer: "No. You'll have to buy the tickets with the respective companies."});

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleQuestion = function(question) {
      if ($scope.isQuestionShown(question)) {
        $scope.shownQuestion = null;
      } else {
        $scope.shownQuestion = question;
      }
    };
    $scope.isQuestionShown = function(question) {
      return $scope.shownQuestion === question;
    };
  })
