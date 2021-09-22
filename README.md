# ChatApp

**Storage used for maintaining messages for inactive users: Cassandra**

Apache Cassandra 3.11 require python and jdk8 installed in your computer.

Ran the following commands to install Cassandra:
pip install --upgrade pip setuptools
brew update
brew install cassandra

To start Cassandra: brew services start cassandra
On success, the following text is displayed "Successfully started `cassandra` (label: homebrew.mxcl.cassandra)"

To be able to connect to Cassandra from the js application: installed Cassandra driver using the command: npm install cassandra-driver

reference: https://medium.com/@manishyadavv/how-to-install-cassandra-on-mac-os-d9338fcfcba4

