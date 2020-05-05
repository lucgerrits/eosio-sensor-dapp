#include <sensordapp.hpp>

ACTION sensordapp::login(name username)
{
  require_auth(username);

  // Init the _users table
  users_table _users(get_self(), get_self().value);

  // Find the record from _users table
  auto msg_itr = _users.find(username.value);
  if (msg_itr == _users.end())
  {
    // Create a user record if it does not exist
    _users.emplace(username, [&](auto &new_user) {
      new_user.username = username;
    });
    print("Hello new user: ", username);
  }
}

ACTION sensordapp::log(name username, uint64_t sensor_uid, string date, string data)
{
  require_auth(username);

  users_table _users(get_self(), get_self().value);
  auto user_itr = _users.find(username.value);
  if (user_itr == _users.end())
  {
    //user not found
    eosio::check(true == false, "User not found. Please login first.");
  }
  else
  {
    //if user found increment his log count, and add log
    uint64_t current_count = user_itr->log_count;
    _users.modify(user_itr, username, [&](auto &user) {
      user.log_count = current_count + 1;
    });

    // Init the _logs table
    logs_table _logs(get_self(), get_self().value);
    // Create a data record
    _logs.emplace(username, [&](auto &log) {
      log.id = _logs.available_primary_key();
      log.username = username;
      log.sensor_uid = sensor_uid;
      log.date = date;
      log.data = data;
    });
  }
}

ACTION sensordapp::clear()
{
  require_auth(get_self());

  users_table _users(get_self(), get_self().value);

  // Delete all records in _users table
  auto user_itr = _users.begin();
  while (user_itr != _users.end())
  {
    user_itr = _users.erase(user_itr);
  }

  logs_table _logs(get_self(), get_self().value);

  // Delete all records in _logs table
  auto log_itr = _logs.begin();
  while (log_itr != _logs.end())
  {
    log_itr = _logs.erase(log_itr);
  }
}

EOSIO_DISPATCH(sensordapp, (login)(log)(clear))

// ACTION sensordapp::hi(name from, string message) {
//   require_auth(from);

//   // Init the _message table
//   messages_table _messages(get_self(), get_self().value);

//   // Find the record from _messages table
//   auto msg_itr = _messages.find(from.value);
//   if (msg_itr == _messages.end()) {
//     // Create a message record if it does not exist
//     _messages.emplace(from, [&](auto& msg) {
//       msg.user = from;
//       msg.text = message;
//     });
//   } else {
//     // Modify a message record if it exists
//     _messages.modify(msg_itr, from, [&](auto& msg) {
//       msg.text = message;
//     });
//   }
// }