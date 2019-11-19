import {configure} from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(
  require.context(
    '../packages',
    true,
    /^((?!build).)*[.]stories[.](js|jsx|ts|tsx)$/,
  ),
  module,
);
