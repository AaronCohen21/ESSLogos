# ESS Logo Generator

This is a fullstack application I created for the UVic ESS to quickly create custom logos for graphics or posters.

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
- [ ] Publish backed to Cyclic
- [ ] Link server stats to shields.io badges
- [ ] Celebrate! 🎉🍾🥳

# Note

All `.svg` assets should only contain fill. If any svg contains a stroke for whatever reason, its color will not update.