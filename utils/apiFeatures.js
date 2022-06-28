class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; //req.query
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);

    // exmp query : {difficulty:'easy',duration:{$gte:5}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(ne|gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    this.queryString.sort
      ? (this.query = this.query.sort(
          this.queryString.sort.split(',').join(' ')
        ))
      : (this.query = this.query.sort('-createdAt'));
    return this;
  }
  limitFields() {
    this.queryString.fields
      ? (this.query = this.query.select(
          this.queryString.fields.split(',').join(' ')
        ))
      : (this.query = this.query.select('-__v'));

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
