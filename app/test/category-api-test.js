"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Category API tests", function () {
  let categories = fixtures.categories;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;

  const poiService = new PoiService(fixtures.poiService);

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    await poiService.clearAuth();
  });

  setup(async function () {
    await poiService.deleteAllCategories();
  });

  test("create a category", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    assert(_.some([returnedCategory], newCategory), "returnedCategory must be a superset of newCategory");
    assert.isDefined(returnedCategory._id);
  });

  test("get category", async function () {
    const c1 = await poiService.createCategory(newCategory);
    const c2 = await poiService.getCategory(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("get invalid category", async function () {
    const c1 = await poiService.getCategory("1234");
    assert.isNull(c1);
    const c2 = await poiService.getCategory("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a category", async function () {
    let c = await poiService.createCategory(newCategory);
    assert(c._id != null);
    await poiService.deleteOneCategory(c._id);
    c = await poiService.getCategory(c._id);
    assert(c == null);
  });

  test("get all categories", async function () {
    for (let c of categories) {
      await poiService.createCategory(c);
    }

    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, categories.length);
  });

  test("get categories detail", async function () {
    for (let c of categories) {
      await poiService.createCategory(c);
    }

    const allCategories = await poiService.getCategories();
    for (var i = 0; i < categories.length; i++) {
      assert(_.some([allCategories[i]], categories[i]), "returnedCategory must be a superset of newCategory");
    }
  });

  test("get all categories empty", async function () {
    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, 0); //delete all in setup
  });
});
