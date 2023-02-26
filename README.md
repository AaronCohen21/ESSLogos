[![Server Status](https://img.shields.io/endpoint?label=Server%20Status&url=https%3A%2F%2Fess-logos.cyclic.app%2Fstatus)](https://aaroncohen21.github.io/ESSLogos/)
[![Images Rendered](https://img.shields.io/endpoint?label=Images%20Rendered&url=https%3A%2F%2Fess-logos.cyclic.app%2Frendered)](https://aaroncohen21.github.io/ESSLogos/)
# ESS Logo Generator

This is a fullstack application I created for the UVic ESS to quickly create custom logos for graphics or posters.

# Note

## SVG Files

Files in `docs/svg/` should be named with all lowercase names or the website will not be able to locate the filepath.
Also, all `.svg` assets should only contain fill. If any svg contains a stroke for whatever reason, its color will not update.

## HTTPS Hosting

Cyclic automatically hosts with HTTPS, so the
deployment does not need to manually host with HTTPS

However if being hosted manually, it may be
neccesarry to set up an HTTPS server. If this is
required, uncomment `line 8` and the code on `lines 91-94` in `server.js`,
and replace `'app'` with `'httpsServer'` on `line 108`

# //TODO:
- [x] Create dynamic front end
- [x] Make svg images auto-update in ~~\<embed>~~ \<iframe>
- [x] Dynamically adjust svg color
- [x] Setup GitHub Pages
- [x] Process svg data into a post request
- [x] Create `node.js` REST API to handle post requests
- [x] Process `.svg` images into `.png` images via `node.js`
- [x] Send `.png` images back to the client and download the file
- [x] Delete files in backend to save space
- [x] Allow for multiple files to be created at once (and then deleted)
- [x] Handle get requests for server info
- [x] Store server stats on backend
- [x] Publish backed to Cyclic
- [ ] Find a way to write serverstats on Cyclic backend (DynamoDB?)
- [x] Link server stats to shields.io badges
- [x] Celebrate! 🎉🍾🥳
- [ ] Add "image size" option for output