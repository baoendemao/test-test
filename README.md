### Pet Smile

#### 环境准备
```
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.6.tgz
sudo tar -zvxf mongodb-osx-ssl-x86_64-4.0.6.tgz 
export PATH=/usr/local/mongodb/bin:$PATH
sudo mkdir -p /data/db
sudo mongod

```

#### 运行
```
npm run dev

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