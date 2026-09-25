/*global QUnit*/

sap.ui.define([
	"fiori/y2026/sapfioritraining2026/controller/LandingView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("LandingView Controller");

	QUnit.test("I should test the LandingView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
