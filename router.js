// XXX Maybe split route handlers into separate modules?
// Could do some kind of fs.readdir and then require them all.

var routes = require('routes')
, Router = routes.Router
, Route = routes.Route
, filed = require('filed')
, router = new Router()
, config = require('./config.js')


module.exports = router

// static stuff serves out of the static folder.
var static = require('./routes/static.js')
router.addRoute('/static/*?', static)
router.addRoute('/favicon.ico', static)
router.addRoute('/install.sh', static)
router.addRoute('/stylus/*?', require('./routes/stylus.js'))
// legacy
router.addRoute('/dist/*?', distRedirect)
router.addRoute('/dist', distRedirect)
function distRedirect (req, res) {
  var s = req.splats && req.splats[0] || ''
  return res.redirect('http://nodejs.org/dist/npm/' + s, 301)
}

router.addRoute('/search', require('./routes/search.js'))


// XXX: This is kind of kludgey
router.addRoute('/doc/*?', require('./routes/doc.js'))
router.addRoute('/doc', require('./routes/doc.js'))
router.addRoute('/api/*?', require('./routes/doc.js'))

router.addRoute('/login', require('./routes/login.js'))

router.addRoute('/profile-edit', require('./routes/profile-edit.js'))
router.addRoute('/profile/:name', require('./routes/profile.js'))
router.addRoute('/profile', require('./routes/profile.js'))

router.addRoute('/session', require('./routes/session-dump.js'))
var logout = require('./routes/logout.js')
router.addRoute('/logout', logout)
router.addRoute('/logout/*?', logout)
router.addRoute('/password', require('./routes/password.js'))
router.addRoute('/signup', require('./routes/signup.js'))

var forgot = require('./routes/forgot-password.js')
router.addRoute('/forgot', forgot)
router.addRoute('/forgot/:token', forgot)

router.addRoute('/about', require('./routes/about.js'))

router.addRoute('/', require('./routes/index.js'))

// The package details page
var packagePage = require('./routes/package-page.js')
router.addRoute('/package/:name/:version', packagePage)
router.addRoute('/package/:name', packagePage)

router.addRoute('/keyword/:kw', function (q, s) {
  return s.redirect('/browse/keyword/' + q.params.kw, 301)
})

router.addRoute('/browse/*?', require('./routes/browse.js'))

// npmjs.org/npm -> npmjs.org/package/npm
// if nothing else matches.
router.addRoute('/:name', require('./routes/maybe-package.js'))
