const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }];
  });

  // addUser tests (doesn't use users list above)
  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Keith',
      room: 'The Office Fans'
    };
    var resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user]);
  });

  // removeUser tests
  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    // pass in incorrect id
    var userId = '13';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  // getUser tests
  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);

    // var user = users.getUser('1');
    // expect(user).toEqual(users[0]);
  });

  it('should not find user', () => {
    // pass in incorrect id
    var user = users.getUser('13');
    
    expect(user).toNotExist();
  })

  // getUserList tests
  it('should return names for Node Course room', () => {
    var userList = users.getUserList('Node Course');

    expect(userList).toEqual(['Mike', 'Julie']);
  })

  it('should return names for React Course room', () => {
    var userList = users.getUserList('React Course');

    expect(userList).toEqual(['Jen']);
  })
});