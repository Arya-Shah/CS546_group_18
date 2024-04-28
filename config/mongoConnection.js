import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

<<<<<<< HEAD

=======
>>>>>>> 42798d498ead8de64b1a6c3b380ee6a5d7a6190c
let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
<<<<<<< HEAD
if (!_connection) {
_connection = await MongoClient.connect(mongoConfig.serverUrl);
_db = _connection.db(mongoConfig.database);
}

return _db;
};
const closeConnection = async () => {
await _connection.close();
};

export {dbConnection, closeConnection};
=======
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };
>>>>>>> 42798d498ead8de64b1a6c3b380ee6a5d7a6190c
