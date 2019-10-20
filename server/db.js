const { DataStore } = require('notarealdb');

const store = new DataStore('./data');

module.exports = {
  messages: store.collection('messages'),
  users: store.collection('users')
};
