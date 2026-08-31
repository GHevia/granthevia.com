# granthevia.com

Source for the static website at granthevia.com.

## Shared site components

- `partials/header.html` contains the primary navigation.
- `partials/footer.html` contains the shared footer markup.
- `css/styles.css` contains the site-wide layout and component styles.
- `js/include.js` loads the shared header/footer and marks the active section.
- `js/git-info.js` displays the newest site-edit commit while ignoring automated
  commits whose subject starts with `Update daily puzzle for YYYY-MM-DD`.

## Rebuilding the photography pages

The photo index, the 20 collection pages, `photos/galleries.json`, and the
responsive WebP files are generated from the original images:

```powershell
python tools/build_photo_site.py
```

The script keeps every original image unchanged and creates 640 px and 1,440 px
WebP derivatives in `photos/optimized/`. Add a collection to the `GALLERIES`
list in `tools/build_photo_site.py`, then rerun the command.

Use `--skip-images` when only the HTML and metadata need to be refreshed.
