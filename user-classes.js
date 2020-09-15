class FullName {
  constructor(order, firstName, lastName, middleName) {
    this.order = order;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
  }

  get fullName() {}
}

class Guest {
  constructor(email) {
    this.email = email;
  }
};

class User extends Guest {
  constructor(email, password) {
    super(email);
    this.password = password;
  }
};

class PowerUser extends User {
  constructor(email, password, fullName) {
    super(email, password);
    this.fullName = fullName;
  }
};

class Admin extends PowerUser {
  constructor() {}
};

class SuperAdmin extends Admin {
  constructor() {}
};

class Founder extends SuperAdmin {
  constructor() {}
};

