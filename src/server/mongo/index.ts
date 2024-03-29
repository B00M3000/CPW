/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from 'mongoose';

import { MONGO_URI } from '$env/static/private';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function() {
  return await mongoose.connect(MONGO_URI)
}