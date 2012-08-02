var tweetHandler = require("./handlers/tweet");
var loggingHelper = require("./helpers/logging");
var config = require("./config/config");
var express = require("express");
var passport = require("passport");
var passportTwitterStrategy = require("passport-twitter").Strategy;

/*
 * TODO:  move functions into respective modules
 * TODO: consume tweets from given handle
 * TODO: search twitter by handle
 * TODO: store tweets in Mongo
 * TODO: store searches in Mongo
 * TODO: integrate auth with facebook, google+, linkedin
 * TODO: integrate with OpenStreetMaps
 * TODO: setup chatServer as cluster
 * TODO: use RabbitMQ
 * 
 */

require("./handlers/authentication")(passport, passportTwitterStrategy, config);
var expressServer = require("./config/server")(express, passport, loggingHelper); //Not sure I want to pass in loggingHelper
require("./handlers/routes")(expressServer, passport, tweetHandler);
