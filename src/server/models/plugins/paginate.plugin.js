/* eslint-disable no-param-reassign */

const mongoose = require("mongoose");
const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {Object} [options.filter] - Filter in each populate
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @param {number} [options.select] - Select fields (default = {})
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 9;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    const select = options.select ?? {};
    const findFilter = {...filter};
    for (const value in filter) {
      if (!mongoose.isValidObjectId(filter[value]) && (!['level', '_id', 'isSample', 'role','isSeen'].includes(value)) && (value !== "$or") && (value !== "$in")) {
        if (value === "queryRange") {
          findFilter["$and"] = filter[value]["start"] && filter[value]["end"] ? [{
              $expr: {
                $gte: [{
                  $convert: {
                    input: "$" + filter[value]["field"],
                    to: "decimal"
                  }
                }, filter[value]["start"]]
              }
            }, {
              $expr: {
                $lte: [{
                  $convert: {
                    input: "$" + filter[value]["field"],
                    to: "decimal"
                  }
                }, filter[value]["end"]]
              }
            }] :
            filter[value]["start"] ? [{
              $gte: [{
                $convert: {
                  input: "$" + filter[value]["field"],
                  to: "decimal"
                }
              }, filter[value]["start"]]
            }] : [{$lte: [{$convert: {input: "$" + filter[value]["field"], to: "decimal"}}, filter[value]["end"]]}];
          delete findFilter["queryRange"];
        } else if (value === "deleted") findFilter[value] = filter[value];
        else findFilter[value] = {$regex: filter[value], $options: 'i'}
      }
    }

    const countPromise = this.countDocuments(findFilter).exec();
    let docsPromise = this.find(findFilter).select(select).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      let populate = options.populate.split(',');
      populate.forEach((populateOption) => {
        let properties = populateOption.split('.');
        if (properties.length > 1) {
          docsPromise = docsPromise.populate(
            properties.reverse().reduce((a, b, i) => {
              let temp = {path: b};
              if (i === 1 && options.filter.hasOwnProperty(a)) {
                temp.populate = {path: a};
                Object.assign(temp.populate, options.filter[a]);
              } else temp.populate = a;
              if (options.filter) {
                Object.assign(temp, {match: options.filter});
              }
              return temp;
            })
          );
        } else {
          let populate = {path: populateOption};
          if (options.filter && typeof options.filter === 'object') {
            if (options.filter.hasOwnProperty(populateOption)) Object.assign(populate, options.filter[populateOption]);
            else Object.assign(populate, options.filter)
          }
          docsPromise = docsPromise.populate(
            populate
          );
        }
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
