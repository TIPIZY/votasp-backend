const Answers = require('../../models/answers');

const _genericInternalErrorGenerator = (context) =>
  (error) => {
    console.error(error);
    context.internalServerError('Something went wrong');
  };

const _genericResponseOrNotFound = (context) =>
  (response) =>
    response ?
      context.ok(response) :
      context.notFound();

const _listAnswersGenerator = (type = 'Voter') =>
  (context) =>
    Answers[type].findOne({ userId: context.state.user.sub })
      .then( _genericResponseOrNotFound(context) )
      .catch( _genericInternalErrorGenerator(context) );

const _saveAnswersGenerator = (type = 'Voter') =>
  (context) =>
    new Answers[type]({
      userId: context.state.user.sub,
      answers: context.request.body,
    })
      .save()
      .then( _genericResponseOrNotFound(context) )
      .catch( _genericInternalErrorGenerator(context) );

const listUserAnswers = (context) =>
  context.state.user['isCandidate'] ?
    _listAnswersGenerator('Candidate')(context) :
    _listAnswersGenerator('Voter')(context);

const saveUserAnswers = (context) =>
  context.state.user['isCandidate'] ?
    _saveAnswersGenerator('Candidate')(context) :
    _saveAnswersGenerator('Voter')(context);

module.exports = {
  listUserAnswers,
  saveUserAnswers,
};
