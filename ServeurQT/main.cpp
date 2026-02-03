#include <QCoreApplication>
#include <QWebSocketServer>
#include <QWebSocket>
#include <QMap>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>

QMap<QWebSocket*, QString> users; // client → pseudo

void broadcastUserList(QWebSocketServer &server) {
    QJsonObject obj;
    obj["action"] = "userList";

    QJsonArray arr;
    for (auto pseudo : users.values())
        arr.append(pseudo);

    obj["users"] = arr;

    QString json = QJsonDocument(obj).toJson();

    for (auto client : server.findChildren<QWebSocket*>())
        client->sendTextMessage(json);
}

QString nowISO() {
    return QDateTime::currentDateTimeUtc().toString(Qt::ISODate);
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QWebSocketServer server("ChatServer", QWebSocketServer::NonSecureMode);
    server.listen(QHostAddress::Any, 1234);

    QObject::connect(&server, &QWebSocketServer::newConnection, [&]() {
        QWebSocket *client = server.nextPendingConnection();

        QObject::connect(client, &QWebSocket::textMessageReceived,
                         [client, &server](QString msg) {

                             QJsonDocument doc = QJsonDocument::fromJson(msg.toUtf8());
                             QJsonObject obj = doc.object();

                             QString action = obj["action"].toString();

                             if (action == "login") {
                                 users[client] = obj["pseudo"].toString();

                                 // envoyer message status
                                 QJsonObject st;
                                 st["action"] = "status";
                                 st["message"] = users[client] + " s'est connecté";
                                 st["time"] = nowISO();

                                 QString json = QJsonDocument(st).toJson();
                                 for (auto c : users.keys())
                                     c->sendTextMessage(json);

                                 broadcastUserList(server);
                             }

                             if (action == "getUsers") {
                                 broadcastUserList(server);
                             }

                             if (action == "message") {
                                 QString text = obj["content"].toString();

                                 QJsonObject chat;
                                 chat["action"] = "chat";
                                 chat["from"] = users[client];
                                 chat["message"] = text;
                                 chat["time"] = nowISO();

                                 QString json = QJsonDocument(chat).toJson();
                                 for (auto c : users.keys())
                                     c->sendTextMessage(json);
                             }

                         });

        QObject::connect(client, &QWebSocket::disconnected, [&server, client]() {
            QString pseudo = users[client];
            users.remove(client);

            // info départ
            QJsonObject st;
            st["action"] = "status";
            st["message"] = pseudo + " s'est déconnecté";
            st["time"] = nowISO();

            QString json = QJsonDocument(st).toJson();
            for (auto c : server.findChildren<QWebSocket*>())
                c->sendTextMessage(json);

            broadcastUserList(server);
        });
    });

    return a.exec();
}
