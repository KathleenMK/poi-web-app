"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const bcrypt = require("bcrypt"); //added for password security

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const poiService = new PoiService(fixtures.poiService);

  suiteSetup(async function () {
    //await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  test("create a user", async function () {
    const returnedUser = await poiService.createUser(users[0]);
    //assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser"); was replaced as password is hashed so will not be equal
    assert.equal(returnedUser.firstName, users[0].firstName);
    assert.equal(returnedUser.lastName, users[0].lastName);
    assert.equal(returnedUser.email, users[0].email);
    //console.log(await bcrypt.compare(returnedUser.password, newUser.password));
    //assert.isTrue(await bcrypt.compare(returnedUser.password, newUser.password));  //attempt to compare password
    assert.isDefined(returnedUser.id);
  }).timeout(10000);

  test("get user", async function () {
    const u1 = await poiService.createUser(users[1]); //createUser now includes token and success
    const u2 = await poiService.getUser(u1.id);
    console.log(u1);
    console.log(u2);
    assert.equal(u1.firstName, u2.firstName);
    assert.equal(u1.lastName, u2.lastName);
    assert.equal(u1.email, u2.email);
    assert.equal(u1.id, u2._id);
    //assert.deepEqual(u1, u2); //no longer appropriate so replaced with the above
  }).timeout(10000);

  test("get invalid user", async function () {
    const u1 = await poiService.getUser("1234");
    assert.isNull(u1);
    const u2 = await poiService.getUser("012345678901234567890123");
    assert.isNull(u2);
  }).timeout(10000);

  test("delete a user", async function () {
    let u = await poiService.createUser(users[2]);
    console.log(u);
    assert(u.id != null);
    await poiService.deleteOneUser(u.id);
    u = await poiService.getUser(u.id);
    assert(u == null);
  }).timeout(10000);

  test("get all users", async function () {
    await poiService.deleteAllUsers();
    await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    console.log(users);
    for (let u of users) {
      await poiService.createUser(u);
    }

    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  }).timeout(10000); //timeout erroring out at default 2000ms

  test("get users detail", async function () {
    await poiService.deleteAllUsers();
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    for (let u of users) {
      await poiService.createUser(u);
    }
    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };
    users.unshift(testUser);
    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert.equal(allUsers[i].firstName, users[i].firstName);
      assert.equal(allUsers[i].lastName, users[i].lastName);
      // assert.equal(returnedUser.firstName, newUser.firstName);
      //assert.equal(returnedUser.lastName, newUser.lastName);
      assert.equal(allUsers[i].email, users[i].email);
      //console.log(await bcrypt.compare(returnedUser.password, newUser.password));
      //assert.isTrue(await bcrypt.compare(returnedUser.password, newUser.password));
      //assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }
  }).timeout(10000);

  test("get all users empty", async function () {
    await poiService.deleteAllUsers();
    const allUsersBefore = await poiService.getUsers();
    assert(allUsersBefore == null);
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, 1);
  }).timeout(10000);

  test("update user", async function () {
    await poiService.deleteAllUsers();
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    const userDetails = {
      firstName: "testFirstName",
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      _id: user.id,
    };
    console.log(userDetails);
    console.log(user);
    await poiService.updateUser(user.id, userDetails);
    const updatedUser = await poiService.getUser(user.id);
    console.log(updatedUser);
    console.log(user + "is the user after update");
    assert.equal(updatedUser._id, user.id); //is the same user
    assert.notEqual(updatedUser.firstName, newUser.firstName); //firstname does not match
    assert.equal(updatedUser.firstName, "testFirstName"); //firstName has been updated
    assert.equal(updatedUser.lastName, newUser.lastName);
    assert.equal(updatedUser.email, newUser.email);
    assert.equal(updatedUser.password, user.password); //password has been salted and hashed, can't compare
  }).timeout(10000);
});
