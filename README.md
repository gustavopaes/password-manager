# password-manager
NodeJS based web server password manager. You can use it to save and encrypt any text data.

## Creating user data

First of all, you need to create an create user and password.

```bash
node create-user.js login password
```

You can create many users.

## Run the server

```bash
# To up to dev
DEVELOPMENT=1 node app

# To up in prod
node app
```

The server will up on HTTPS protocol, port 3443.

You can change host and port using environment values:

```bash
HOSTNAME=mydomain.com PORT=443 node app
```
To run in prod mode, you need to put your certificates at `./certs` directory, with `cert.pem` and `cert.key` names.

## Crypto

Data are encrypted using aes256 cipher.

You can change it at `./src/encryptor.js` file.

## Docker

You can run it (just in production mode) with Docker or docker-compose.

    # Just with docker
    docker build -t password-manager .
    docker run -it --rm --name password-manager-instance -v -p 443:3443 "$PWD":/app password-manager

    # With docker-compose
    docker-compose up -d


## To-do

- [x] improve front-end templates
- [x] write logs in files
- [ ] remove passwords from html after logged
- [ ] block ip after wrong password
- [ ] improve log messages

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**USE BY YOUR OWN RISK!**
