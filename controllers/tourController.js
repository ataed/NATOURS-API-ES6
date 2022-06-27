import { readFileSync } from 'fs';

import Tour from './../models/tourModel';




const tours = JSON.parse(
  readFileSync(new URL('./../dev-data/data/tours-simple.json', import.meta.url))
  // fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

export  const checkID = (req, res, next, val) => {
  console.log(val);
  //   if (req.params.id * 1 > tours.length) {
  if (val > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  next();
};

export  const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing price or name' });
  }
  next();
};

export  const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

export  const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === req.params.id * 1);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  //   console.log(tour);
};

export  const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

export  const updateTour = (req, res) => {};
export  const deleteTour = (req, res) => {};
