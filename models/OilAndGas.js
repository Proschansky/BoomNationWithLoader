let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const NA = "Information not available.";

let OilAndGasSchema = new Schema({

  new: {
    type: Boolean,
    required: true,
    default: true
  },

  benefits: {
    type: Array,
    required: false,
  },

  capabilities: {
    type: String,
    required: false,
    default: NA,
  },

  company: {
    type: String,
    required: true,
  },

  dateAdded: {
    type: String,
    required: true,
    default: new Date().toDateString()
  },

  datePosted: {
    type: String,
    required: false,
  },

  dateDeleted: {
    type: String,
    required: false
  },

  desiredQualifications: {
    type: String,
    required: false,
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false
  },

  internalId: {
    type: String,
    required: false,
  },

  jobDescription: {
    type: String,
    required: false,
    default: NA,
  },

  jobClassification: {
    type: String,
    required: true,
    default: NA,
  },

  essentialFunctions: {
    type: String,
    required: false,
    default: NA
  },

  skillsAndExperience: {
    type: Array,
    required: false,
    default: NA,
  },

  salary: {
    type: String,
    required: false,
    default: NA,
  },

  url: {
    type: String,
    required: true,
  },

  workingConditions: {
    type: String,
    required: false,
  },

  workLocations: {
    type: String,
    required: true,
    default: NA,
  }
});

let OilAndGas = mongoose.model("OilAndGas", OilAndGasSchema);

module.exports = OilAndGas;
