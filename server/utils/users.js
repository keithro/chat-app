[{
  id: '',
  name: 'Andrew',
  room: 'The Office Fans'
}]

class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  
  removeUser (id) {
    // get user with matching id
    var user = this.getUser(id);

    // if that user exists filter them out from users array to leave remaining users
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    // returns user that was removed or null if no user was found
    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};

// //  Class
// // -------
// class Person {
//   // Constructor Function
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription () {
//     return `${this.name} is ${this.age} year(s)`
//   }
// }

// var me = new Person('Keith', 25);
// var description = me.getUserDescription();
// console.log(description);