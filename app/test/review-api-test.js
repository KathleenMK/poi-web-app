"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Review API tests", function () {
  let pois = fixtures.pois;
  let reviews = fixtures.reviews;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;
  let newPoi = fixtures.newPoi;
  let newReview = fixtures.newReview;

  const poiService = new PoiService(fixtures.poiService);

  suiteSetup(async function () {
    await poiService.deleteAllUsers();
    await poiService.deleteAllReviews();
    await poiService.deleteAllCategories();
    await poiService.deleteAllPois();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await poiService.deleteAllUsers();
    await poiService.deleteAllReviews();
    await poiService.deleteAllCategories();
    await poiService.deleteAllPois();
    await poiService.clearAuth();
  });

  test("add and return a review", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedPoi = await poiService.addPoi(returnedCategory._id, newPoi);
    await poiService.addReview(returnedPoi._id, newReview);
    const returnedReviews = await poiService.getReviewsPoi(returnedPoi._id);
    assert.equal(returnedReviews.length, 1); //check review has been created
    assert(_.some([returnedReviews[0]], newReview), "returned review must be a superset of review");
    assert.isDefined(returnedReviews[0].contributor); //check contributor has been populated
  });

  test("delete all reviews for a POI", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedPoi = await poiService.addPoi(returnedCategory._id, newPoi);
    for (var i = 0; i < reviews.length; i++) {
      await poiService.addReview(returnedPoi._id, reviews[i]);
    }
    const r1 = await poiService.getReviewsPoi(returnedPoi._id);
    assert.equal(r1.length, reviews.length); //check reviews have been created
    await poiService.deleteAllReviews();
    const r2 = await poiService.getReviewsPoi(returnedPoi._id);
    assert.equal(r2.length, 0); //check reviews have been deleted for that POI
  });

  test("delete one review by id", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedPoi = await poiService.addPoi(returnedCategory._id, newPoi);
    const returnedReview = await poiService.addReview(returnedPoi._id, newReview);
    for (var i = 0; i < reviews.length; i++) {
      await poiService.addReview(returnedPoi._id, reviews[i]);
    }
    const r1 = await poiService.getReviewsPoi(returnedPoi._id);
    assert.equal(r1.length, reviews.length + 1);
    await poiService.deleteOneReview(returnedReview._id);
    const r2 = await poiService.getReviewsPoi(returnedPoi._id);
    assert.equal(r2.length, reviews.length); //check on length is one less
    assert.isNotOk(await poiService.getReview(returnedReview._id)); //check that deleted review has not been found
  });

  test("find all and delete all reviews", async function () {
    await poiService.deleteAllReviews();
    const returnedCategoryFirst = await poiService.createCategory(newCategory);
    const returnedPoiFirst = await poiService.addPoi(returnedCategoryFirst._id, newPoi);
    for (var i = 0; i < reviews.length; i++) {
      await poiService.addReview(returnedPoiFirst._id, reviews[i]);
    }
    const returnedCategorySecond = await poiService.createCategory(newCategory);
    const returnedPoiSecond = await poiService.addPoi(returnedCategorySecond._id, newPoi);
    for (var i = 0; i < reviews.length; i++) {
      await poiService.addReview(returnedPoiSecond._id, reviews[i]);
    }
    const countReviews = await poiService.getAllReviews();
    assert.equal(countReviews.length, reviews.length * 2); //check on find all reviews
    await poiService.deleteAllReviews();
    const count = await poiService.getAllReviews(); //check on delete all reviews
    assert.equal(count.length, 0);
  });
});
