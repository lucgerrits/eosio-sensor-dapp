import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

function getEosApiUrl() {
  return localStorage.getItem("REACT_APP_EOS_HTTP_ENDPOINT") || process.env.REACT_APP_EOS_HTTP_ENDPOINT;
}

// Main action call to blockchain
async function takeAction(action, dataValue) {
  const privateKey = localStorage.getItem("helloworld_key");
  const rpc = new JsonRpc(getEosApiUrl());
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // Main call to blockchain after setting action, account_name and data
  try {
    const resultWithConfig = await api.transact({
      actions: [{
        account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        name: action,
        authorization: [{
          actor: localStorage.getItem("helloworld_account"),
          permission: 'active',
        }],
        data: dataValue,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    return resultWithConfig;
  } catch (err) {
    throw (err)
  }
}

class ApiService {

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("helloworld_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("helloworld_account") })
        .then(() => {
          resolve(localStorage.getItem("helloworld_account"));
        })
        .catch(err => {
          localStorage.removeItem("helloworld_account");
          localStorage.removeItem("helloworld_key");
          reject(err);
        });
    });
  }

  static login({ username, key }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("helloworld_account", username);
      localStorage.setItem("helloworld_key", key);
      takeAction("login", { username: username })
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("helloworld_account");
          localStorage.removeItem("helloworld_key");
          reject(err);
        });
    });
  }

  static logout() {
    return new Promise((resolve) => {
      localStorage.removeItem("helloworld_account");
      localStorage.removeItem("helloworld_key");
      resolve();
    })
  }

  static async getUserByName(username) {
    try {
      const rpc = new JsonRpc(getEosApiUrl());
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  static async getAbiInfo(username) {
    try {
      const rpc = new JsonRpc(getEosApiUrl());
      const result = await rpc.get_abi(process.env.REACT_APP_EOS_CONTRACT_NAME);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  static async getUserLogs(username) {
    try {
      const rpc = new JsonRpc(getEosApiUrl());
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,
        "table": "logs",
        "reverse": true,
        // "lower_bound": username,
      });
      return result.rows;
    } catch (err) {
      console.error(err);
    }
  }

  static sendSensorData({ username, key, sensor_uid, date, data }) {
    return new Promise((resolve, reject) => {
      takeAction("log", { username: username, sensor_uid: sensor_uid, date: date, data: data })
        .then((tnx) => {
          resolve(tnx);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static async getTnx(tnx_id) {
    try {
      const rpc = new JsonRpc(getEosApiUrl());
      const result = await rpc.history_get_transaction(tnx_id);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

}

export default ApiService;
