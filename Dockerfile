FROM node:10.16

# RUN mkdir /root/.ssh/
# COPY .ssh  /root/.ssh

## Add the wait script to the image - This will make sure that NodeJS starts only after MongoDB server is completely
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait


CMD ["npm", "run", "dev"]
