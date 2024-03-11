#!/bin/sh
npx prisma generate

exec npm run start:prod