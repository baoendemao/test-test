### Pet Smile

#### 环境准备
* 安装MongoDB
```
cd /usr/local
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.6.tgz
sudo tar -zvxf mongodb-osx-ssl-x86_64-4.0.6.tgz 
mv mongodb-osx-ssl-x86_64-4.0.6.tgz mongodb
export PATH=/usr/local/mongodb/bin:$PATH
sudo mkdir -p /data/db
sudo mongod

```

#### 运行
```
npm run dev

http://localhost:8888
http://localhost:8888/articles
http://localhost:8888/articles/1111

```

```
sudo mongod
mongo
> show dbs
> use pet-smile
> show tables
dogs
> db.dogs.find({})

```
