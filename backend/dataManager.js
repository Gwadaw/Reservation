const mysql = require("mysql");

class DataManager {
  constructor(host, login, password, databaseName) {
    this.host = host;
    this.login = login;
    this.password = password;
    this.databaseName = databaseName;
    this.port = 3306;
    this.connection = null;
  }

  Connect() {
    try {
      this.connection = mysql.createConnection({
        host: this.host,
        user: this.login,
        password: this.password,
        database: this.databaseName,
        port: this.port,
      });

      this.connection.connect((err) => {
        if (err) {
          console.error("Problème de connexion avec la base MySQL :", err);
          console.error(err.message);
          return;
        }
        console.log("Connecté à la base de données !");
      });
    } catch (err) {
      console.log("Échec de connexion à la base de données.", err);
    }
  }

  Disconnect() {
    this.connection.end((err) => {
      if (err) {
        console.error("Problème de déconnexion avec la base MySQL", err);
        return;
      }
      console.log("Déconnexion de la base !");
    });
  }

  query(sql, params, callback) {
    this.connection.query(sql, params, callback);
  }
}

module.exports = DataManager;
