#!/bin/bash

cd /root/api/sunrise && nohup node scripts/spider/laosiji.js > /var/log/api/spider.log 2>&1 &
