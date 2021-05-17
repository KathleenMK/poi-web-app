"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Poi API tests", function () {
  let pois = fixtures.pois;
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
    await poiService.deleteAllPois();
  });

  teardown(async function () {});

  test("add a poi", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.addPoi(returnedCategory._id, pois[0]);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.equal(returnedPois.length, 1);
    assert(_.some([returnedPois[0]], pois[0]), "returned poi must be a superset of poi");
  });

  test("add multiple pois", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategory._id, pois[i]);
    }

    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.equal(returnedPois.length, pois.length);
    for (var i = 0; i < pois.length; i++) {
      assert(_.some([returnedPois[i]], pois[i]), "returned poi must be a superset of poi");
    }
  });

  test("delete all pois", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategory._id, pois[i]);
    }
    const p1 = await poiService.getPois(returnedCategory._id);
    assert.equal(p1.length, pois.length);
    await poiService.deleteAllPois();
    const p2 = await poiService.getPois(returnedCategory._id);
    assert.equal(p2.length, 0);
  });

  test("create a poi and check contributor", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.addPoi(returnedCategory._id, pois[0]);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.isDefined(returnedPois[0].contributor);
  });
});
