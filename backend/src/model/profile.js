'use strict';

import mongoose, { Schema } from 'mongoose';
import httpError from 'http-errors' ;
import { pagerCreate } from '../lib/util';

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const Profile = module.exports = mongoose.model('profile', profileSchema);

Profile.create = function(request) {
  return new Profile({
    account: request.account._id,
    name: request.account.username,
  })
    .save()
    .then(profile => {
      request.account.profile = profile._id;
      return request.account.save()
        .then(() => profile);
    });
};

Profile.fetch = pagerCreate(Profile);

Profile.fetchOne = function(request) {
  return Profile.findById(request.params.id)
    .then(profile => {
      if (!profile) {
        throw new httpError(404, '__ERROR__ Profile not found');
      }
      return profile;
    });
};

Profile.update = function(request) {
  let options = { new: true, runValidators: true };
  return Profile.findByIdAndUpdate(request.params.id, options);
};
