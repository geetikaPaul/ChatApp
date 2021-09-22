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

