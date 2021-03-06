import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import parserFactory from 'emogeez-parser';

import EmojiModifiers from './EmojiModifiers';

const parser = parserFactory();
parser.store.setTheme('apple', apple);

const stories = storiesOf('EmojiModifiers', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    emoji: parser.store.getEmojiByName('apple', 'waving-hand-sign'),
    onClickEmoji: console.log,
  };

  return (
    <EmojiModifiers {...props} />
  );
});
