
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chores').del()
    .then(function () {
      // Inserts seed entries
      const chores = [{
        title: 'Build a CRUD App',
        priority: '1',
        description: ''
      }, {
        title: 'Make a checklist',
        priority: '1',
        description: ''
      }, {
        title: 'Eat dinner',
        priority: '4',
        description: ''
      }, {
        title: 'Buy a car',
        priority: '5',
        description: ''
      }, {
        title: 'Study jQuery',
        priority: '3',
        description: ''
      },]

      return knex('chores').insert(chores);
    });
};
