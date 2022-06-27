import { readFileSync } from 'fs';

const users = JSON.parse(
  // fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
  readFileSync(new URL('./../dev-data/data/users.json', import.meta.url))
);

export const getAllUsers = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
};

export const getUser = (req, res) => {
  console.log(req.params.id);
  const user = users.find((el) => el._id === req.params.id);

  // if (id > users.length) {
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
  console.log(user);
};

export const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  users.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { user: newUser },
      });
    }
  );
};

export const updateUser = (req, res) => {};
export const deleteUser = (req, res) => {};
