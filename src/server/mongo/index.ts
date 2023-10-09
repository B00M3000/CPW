import mongoose from 'mongoose';

import { MONGO_URI } from '$env/static/private';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function() {
  return await mongoose.connect(MONGO_URI)
}