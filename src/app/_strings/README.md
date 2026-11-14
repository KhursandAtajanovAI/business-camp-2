# src/app/_strings

Owner: Dias.

Every word a person can read on the site, in English, one file per screen.
Screens and components take their text from here and never write it inline.
Lesson and game texts are the one exception: they live in `content/lessons`.

`calm-words.test.ts` reads every file in the screen folders and checks the promises: English only,
no alarming words or exclamation marks, no promise of money back, colors only from the design tokens,
no sentences written inside screens, a README in every folder.

The underscore keeps this folder from becoming a page address.
