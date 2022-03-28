const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  auctionId: {
    type: String,
    default: 'NA',
  },
  campaignId: {
    type: String,
    default: 'NA',
  },
  creativeId: {
    type: String,
    default: 'NA',
  },
  adgroupId: {
    type: String,
    default: 'NA',
  },
  userAgent: {
    type: String,
    default: 'NA',
  },
  site: {
    type: String,
    default: 'NA',
  },
  geo: {
    type: String,
    default: 'Others',
  },
  exchange: {
    type: String,
    default: 'NA',
  },
  price: {
    type: String,
    default: 0,
  },
  time: {
    type: String,
    default: 0,
  },
});

const MediaData = mongoose.model('individualWins', mediaSchema);
module.exports = MediaData;
