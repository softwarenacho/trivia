console.log('Coded with love by Nacho Betancourt');

angular.module('triviaApp', []).controller('TriviaCtrl', ($scope, $http) => {

  let api_base = "https://opentdb.com/api.php?amount=10&type=multiple&category=";
  let loading = $('#loading');
  let categories = $('#categories');
  let correct = '<img src="icons/correct.svg" alt="correct">';
  let incorrect = '<img src="icons/incorrect.svg" alt="incorrect">';

  $scope.categories = {
    9: 'general',
    11: 'movies',
    17: 'science',
    22: 'geography',
    23: 'history'
  }

  $scope.init = () => {
    loading.toggle();
  }

  $scope.select_category = id => {
    loading.toggle();
    $scope.category_name = $scope.categories[id];
    $scope.score = {
      correct: 0,
      incorrect: 0
    }
    $http.get(api_base + id)
    .then( response => {
      loading.toggle();
      categories.toggle();
      $scope.questions = response.data.results;
      $scope.questions.forEach( q => {
        let answers = q.incorrect_answers;
        answers.push(q.correct_answer);
        q.answers = scramble(answers);
      });
    });
  }

  $scope.answer_question = (question, answer, e) => {
    let target = $(e.currentTarget).parent();
    let correct_answer = question.correct_answer === answer
    correct_answer ? $scope.score.correct++ : $scope.score.incorrect++;
    let img = correct_answer ? correct : incorrect;
    let response = `<span class="${ correct_answer ? 'correct' : 'incorrect' }">Correct answer: ${question.correct_answer}</span>`;
    target.html(img + response);
    target.parent().addClass(correct_answer ? 'correct' : 'incorrect')
    target.siblings().addClass(correct_answer ? 'correct' : 'incorrect')
    if ($scope.score.correct + $scope.score.incorrect == 10) {
      // endgame
    }
  }

  $scope.decode = function (text) {
    var txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

  function scramble(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

});
