let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const NA = "Information not available.";

let CommercialSchema = new Schema({
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

  datePosted: {
    type: String,
    required: false,
  },

  desiredQualifications: {
    type: String,
    required: false,
  },

  internalId: {
    type: String,
    required: false,
  },

  jobClassification: {
    type: String,
    required: true,
    default: NA,
  },

  jobDescription: {
    type: String,
    required: true,
    default: NA,
  },

  essentialFunctions: {
    type: String,
    required: true,
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
  },
});

let Commercial = mongoose.model("Commercial", CommercialSchema);

module.exports = Commercial;
