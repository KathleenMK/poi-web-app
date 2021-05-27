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
    //await poiService.deleteAllUsers();
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
  }).timeout(10000);

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
  }).timeout(10000);

  test("add multiple pois to multiple categories and delete all", async function () {
    const returnedCategoryFirst = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategoryFirst._id, pois[i]);
    }
    const returnedCategorySecond = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategorySecond._id, pois[i]);
    }
    const returnedPois = await poiService.getAllPois();
    assert.equal(returnedPois.length, pois.length * 2);

    await poiService.deleteAllPois();
    const returnedPoisAfter = await poiService.getAllPois();
    assert.equal(returnedPoisAfter.length, 0);
  }).timeout(10000);

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
  }).timeout(10000);

  test("create a poi and check contributor", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.addPoi(returnedCategory._id, pois[0]);
    const returnedPois = await poiService.getPois(returnedCategory._id);
    assert.isDefined(returnedPois[0].contributor);
  });

  test("update poi and find one", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    const poi = await poiService.addPoi(returnedCategory._id, pois[0]);
    const testDesc = "This is a test short description";
    const poiDetails = {
      name: poi.name,
      descshort: testDesc,
      description: poi.description,
      latitude: poi.latitude,
      longitude: poi.longitude,
      _id: poi._id,
      category: poi.category,
    };
    //console.log(poiDetails);
    //console.log(poi);
    await poiService.updatePoi(poi._id, poiDetails);
    const updatedPoi = await poiService.getOnePoi(poi._id);
    console.log(updatedPoi.poi.descshort);
    assert.equal(updatedPoi._id, poi.id); //is the same poi
    assert.notEqual(updatedPoi.poi.descshort, pois[0].descshort); //firstname does not match
    assert.equal(updatedPoi.poi.descshort, testDesc); //short description has been updated
    assert.equal(updatedPoi.poi.name, pois[0].name);
  }).timeout(10000);

  test("find and delete one poi", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    const poi = await poiService.addPoi(returnedCategory._id, pois[0]);
    const foundPoi = await poiService.getOnePoi(poi._id);
    console.log(poi);
    console.log(foundPoi);
    assert.equal(poi._id, foundPoi.poi._id); //is the same poi
    await poiService.deleteOnePoi(poi._id);
    assert.isNotOk(await poiService.getOnePoi(poi._id)); //firstname does not match
  }).timeout(10000);
});
