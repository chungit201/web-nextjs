
const userModel = require('../socket_model/user.model');

//Event handlers

const addToDB = (userId, socketId) => {
  try {
    return addUser(userId, socketId);
  } catch (error) {
    console.error(error);
  }
};

const welcomeClient = (data) => {
  try {
    const message = messageModel.welcomeMessage;
    return {message: message, sender: 'server'};
  } catch (error) {
    console.error(error);
  }
};

const onClientDisconnect = (id) => {
  const updatedClientList = removeUser(id);
  return updatedClientList;
};

//Helper functions
const addUser = (userId, socketId) => {
  !userModel.main_room.some((user) => user.userId === userId) &&
  userModel.main_room.push({userId, socketId});
  const users = userModel.main_room;
  return users;
}

const getUser = (userId) => {
  return userModel.main_room.find((user) => user.userId === userId);
};

const getUsers = () => {
  const users = userModel.main_room;
  return users;
};

const removeUser = (id) => {
  let index = userModel.main_room.map(el => el.id).indexOf(id);
  userModel.main_room.splice(index, 1);
  // console.log(userModel.main_room)
  return userModel.main_room;
}

module.exports = {
  addToDB,
  welcomeClient,
  onClientDisconnect,
  getUser,
  getUsers
}

