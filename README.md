# ChatApp

**Storage used for maintaining messages for inactive users: Cassandra**

Apache Cassandra 3.11 require python and jdk8 installed in your computer. <br />

Ran the following commands to install Cassandra: <br />
pip install --upgrade pip setuptools <br />
brew update <br />
brew install cassandra <br />

To start Cassandra: brew services start cassandra <br />
On success, the following text is displayed "Successfully started `cassandra` (label: homebrew.mxcl.cassandra)" <br />

To be able to connect to Cassandra from the js application: installed Cassandra driver using the command: npm install cassandra-driver <br />

reference: https://medium.com/@manishyadavv/how-to-install-cassandra-on-mac-os-d9338fcfcba4

Getting started with Cassandra schema design: <br/>
schema design guide: https://medium.com/code-zen/cassandra-schemas-for-beginners-like-me-9714cee9236a <br/>
How to use UDT (User Defined Type) for creating schema: https://cassandra.apache.org/doc/latest/cassandra/data_modeling/data_modeling_schema.html

For learning purpose, the schema used for this application is quite simple:<br/>
keyspace: chatapp <br/>
User UDT: create type user(id UUID, username text, mobile text);<br/>
Message UDT: create type message(id UUID, txt text, time timestamp);<br/>
Messages schema: create table messages(receiver frozen<user> Primary Key, sender frozen<user>, messages list<frozen<message>>);<br/>


