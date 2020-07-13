let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const NA = "Information not available.";

let PetroChemicalsSchema = new Schema({
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

  datePosted: {
    type: String,
    required: false,
    default: NA
  },

  desiredQualifications: {
    type: String,
    required: false,
    default: NA
  },

  industry: {
    type: String,
    required: true,
    default: "Petro Chemicals"
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
  },
});

let PetroChemicals = mongoose.model("PetroChemicals", PetroChemicalsSchema);

module.exports = PetroChemicals;
