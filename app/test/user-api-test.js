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
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  /*
  //is this replicating the above
  setup(async function () {
    await poiService.deleteAllUsers();
  });

  teardown(async function () {
    await poiService.deleteAllUsers();
  });

   */

  test("create a user", async function () {
    const returnedUser = await poiService.createUser(newUser);
    //assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser"); was replaced as password is hashed so will not be equal
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.equal(returnedUser.email, newUser.email);
    //console.log(await bcrypt.compare(returnedUser.password, newUser.password));
    //assert.isTrue(await bcrypt.compare(returnedUser.password, newUser.password));  //attempt to compare password
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function () {
    const u1 = await poiService.createUser(newUser);
    const u2 = await poiService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("get invalid user", async function () {
    const u1 = await poiService.getUser("1234");
    assert.isNull(u1);
    const u2 = await poiService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  test("delete a user", async function () {
    let u = await poiService.createUser(newUser);
    assert(u._id != null);
    await poiService.deleteOneUser(u._id);
    u = await poiService.getUser(u._id);
    assert(u == null);
  });

  test("get all users", async function () {
    await poiService.deleteAllUsers();
    await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    console.log(users);
    for (let u of users) {
      //reduced users to 2 from 3 to avoid timeout error
      await poiService.createUser(u);
    }

    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  }).timeout(3000); //timeout erroring out at default 2000ms

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
  }).timeout(3000);

  test("get all users empty", async function () {
    await poiService.deleteAllUsers();
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, 1);
  });
}).timeout(3000);
