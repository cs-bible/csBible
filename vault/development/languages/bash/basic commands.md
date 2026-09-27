---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# :DeBashIconSvgrepoCom: find
```sh
find . -type f -name "*.sh" -exec chmod +x {} \;
```
## Modifiers
`-type` search for a specified type of element (as shown below)
- b      block (buffered) special
- c      character (unbuffered) special
- d      directory
- p      named pipe (FIFO)
- f      regular file
- l      symbolic  link;  this  is never true if the -L option or the -follow option is in                    effect, unless the symbolic link is broken.  If you want to search  for  symbolic links when -L is in effect, use -xtype.
- s      socket
- D      door (Solaris)
