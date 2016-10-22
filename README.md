# password-manager
NodeJS based web server password manager. You can use it to save and encrypt any text data.

## Creating user data

First of all, you need to an create user and password.

```bash
node create-user.js login password
```

You can create many users.

## Run the server

```bash
node app
```

The server will up on port 3000.

## Crypto

Data are encrypted using aes256 cipher.

You can change it at `./src/encryptor.js` file.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**USE BY YOUR OWN RISK!**
