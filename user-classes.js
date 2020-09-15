class Guest {};

class User {
  constructor(email, password) {
    this.email;
    this.password;
  }
};

class PowerUser extends User {};

class Admin {};

class SuperAdmin extends Admin {};

class Founder {};