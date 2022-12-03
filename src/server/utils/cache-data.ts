import CacheRecord from "server/models/cache-record.model";

const defaultExpirationDuration = 3600;

export interface ICacheQuery {
  key: string,
  expirationTime?: string | number,
}

export interface ICacheRecord extends ICacheQuery{
  data: any,
}


export const getCachedData = async (cacheQuery : ICacheQuery, refresh: Promise<any>) => {
  let cachedRecord: ICacheRecord;
  try {
    cachedRecord = await CacheRecord.findOne({
      key: cacheQuery.key,
    });
    const currentTime = new Date().getTime();
    if (!cachedRecord || currentTime > cachedRecord.expirationTime) {
      const newValue = await refresh;
      cachedRecord = {
        key: cacheQuery.key,
        data: newValue,
        expirationTime: cacheQuery.expirationTime || currentTime + defaultExpirationDuration
      };
      await cacheData(cachedRecord);
    }
  } catch (e) {
    throw new Error("Failed to retrieve cache record.");
  }
  return cachedRecord;
}

export const cacheData = async (cacheRecord: ICacheRecord) => {
  try {
    return await CacheRecord.findOneAndUpdate({
      key: cacheRecord.key,
    }, {
      data: cacheRecord.data
    });
  } catch (e) {
    throw new Error("Unexpected error occurred");
  }
}
