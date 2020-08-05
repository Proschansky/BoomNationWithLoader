let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const NA = "Information not available.";

let ManufacturingSchema = new Schema({
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
    default: NA
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
    default: NA
  },

  dateDeleted: {
    type: String,
    required: false
  },

  desiredQualifications: {
    type: String,
    required: false,
    default: NA
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false
  },

  industry: {
    type: String,
    required: true,
    default: "Manufacturing"
  },

  internalId: {
    type: String,
    required: false
  },

  jobDescription: {
    type: String,
    required: true,
    default: NA
  },

  essentialFunctions: {
    type: Array,
    required: true,
  },

  skillsAndExperience: {
    type: Array,
    required: false,
    default: NA
  },

  salary: {
    type: String,
    required: false,
    default: NA
  },

  url: {
    type: String,
    required: true
  },

  workingConditions: {
    type: String,
    required: false,
    default: NA
  },

  workLocations: {
    type: String,
    required: true,
    default: NA,
  }

});

let Manufacturing = mongoose.model("Manufacturing", ManufacturingSchema);

module.exports = Manufacturing;
