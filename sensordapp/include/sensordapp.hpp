#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT sensordapp : public contract
{
public:
  using contract::contract;

  ACTION login(name username);
  ACTION log(name username, uint64_t sensor_uid, string date, string data);
  ACTION clear();

private:
  //make table of users, each row is user info
  TABLE user_info
  {
    name username;
    uint64_t log_count = 0;
    auto primary_key() const { return username.value; }
  };
  typedef multi_index<name("users"), user_info> users_table;

  TABLE sensor_log
  {
    uint64_t id;
    name username;
    uint64_t sensor_uid;
    string date;
    string data;
    auto primary_key() const { return id; }
    auto secondary_key() const { return username.value; }
  };
  typedef multi_index<name("logs"), sensor_log> logs_table;
};
